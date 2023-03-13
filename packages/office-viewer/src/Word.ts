/**
 * 总入口，它将包括所有 word 文档信息，后续渲染的时候依赖它来获取关联信息
 */

import {parse, evaluate} from 'amis-formula';
import PackageParser from './PackageParser';
import {parseRelationships, Relationship} from './parse/parseRelationship';
import {ContentTypes, parseContentType} from './openxml/ContentType';
import {parseStyles, Styles} from './openxml/Style';
import {parseTheme, Theme} from './openxml/Theme';

import renderDocument from './render/renderDocument';
import {blobToDataURL} from './util/blob';
import {Numbering} from './openxml/word/numbering/Numbering';
import {appendChild, appendComment, createElement} from './util/dom';
import {renderStyle} from './render/renderStyle';
import {mergeRun} from './util/mergeRun';
import {WDocument} from './openxml/word/Document';

/**
 * 渲染配置
 */
export interface WordRenderOptions {
  /**
   * css 类前缀
   */
  classPrefix: string;

  /** 图片是否使用 data url */
  imageDataURL: boolean;

  /**
   * 列表使用字体渲染，需要自行引入 Windings 字体
   */
  bulletUseFont: boolean;

  /**
   * 是否包裹出页面效果
   */
  inWrap: boolean;

  /**
   * 是否替换变量
   */
  replaceVar: boolean;

  /**
   * 上下文，用于替换变量的场景
   */
  data?: any;

  /**
   * 是否忽略文档宽度设置
   */
  ignoreWidth?: boolean;

  /**
   * 是否忽略文档高度设置
   */
  ignoreHeight?: boolean;

  /**
   * 最小行高
   */
  minLineHeight?: number;
}

const defaultRenderOptions: WordRenderOptions = {
  imageDataURL: false,
  classPrefix: 'docx-viewer',
  inWrap: true,
  bulletUseFont: true,
  replaceVar: false,
  ignoreHeight: true,
  minLineHeight: 1.0
};

export default class Word {
  /**
   * 全局 id，用于一个页面渲染多个 word 文档
   */
  static globalId = 0;

  /**
   * 当前渲染 id
   */
  id: number;

  /**
   * zip 包
   */
  parser: PackageParser;

  /**
   * 解析 [Content_Types].xml 里的数据
   */
  conentTypes: ContentTypes;

  /**
   * 解析 theme 目录里的数据
   */
  themes: Theme[] = [];

  /**
   * 解析 numbering.xml 里的数据
   */
  numbering: Numbering;

  /**
   * 解析 styles.xml 里的数据
   */
  styles: Styles;

  renderOptions: WordRenderOptions;

  relationships: Record<string, Relationship>;

  /**
   * 样式名映射，因为自定义样式名有可能不符合 css 命名规范，因此实际使用这个名字
   */
  styleIdMap: Record<string, string> = {};

  /**
   * 用于自动生成样式名时的计数，保证每次都是唯一的
   */
  styleIdNum: number = 0;

  /**
   * 渲染根节点
   */
  rootElement: HTMLElement;

  wrapClassName = 'docx-viewer-wrapper';

  constructor(
    parser: PackageParser,
    renderOptions?: Partial<WordRenderOptions>
  ) {
    this.id = Word.globalId++;
    this.parser = parser;
    this.renderOptions = {...defaultRenderOptions, ...renderOptions};
  }

  inited = false;
  /**
   * 初始化一些公共资源，比如
   */
  async init() {
    if (this.inited) {
      return;
    }

    // 先后顺序是有要求的，这个必须在最前面，
    await this.initContentType();
    await this.initTheme();
    await this.initStyle();
    await this.initRelation();
    await this.initNumbering();

    this.inited = true;
  }

  /**
   * 加载文档的主要入口
   */
  static async load(
    docxFile: Blob | any,
    options: Partial<WordRenderOptions> = defaultRenderOptions
  ): Promise<Word> {
    const parser = await PackageParser.load(docxFile);
    return new Word(parser, options);
  }

  /**
   * 解析全局主题配置
   */
  async initTheme() {
    for (const override of this.conentTypes.overrides) {
      if (override.partName.startsWith('/word/theme')) {
        const theme = await this.parser.getXML(override.partName);
        this.themes.push(parseTheme(theme));
      }
    }
  }

  /**
   * 解析全局样式
   */
  async initStyle() {
    for (const override of this.conentTypes.overrides) {
      if (override.partName.startsWith('/word/styles.xml')) {
        this.styles = parseStyles(
          this,
          await this.parser.getXML('/word/styles.xml')
        );
      }
    }
  }

  /**
   * 解析关系
   */
  async initRelation() {
    let rels = {};
    if (this.parser.fileExists('/_rels/.rels')) {
      rels = parseRelationships(
        await this.parser.getXML('/_rels/.rels'),
        'root'
      );
    }

    let documentRels = {};
    if (this.parser.fileExists('/word/_rels/document.xml.rels')) {
      documentRels = parseRelationships(
        await this.parser.getXML('/word/_rels/document.xml.rels'),
        'word'
      );
    }
    this.relationships = {...rels, ...documentRels};
  }

  /**
   * 解析全局配置
   */
  async initContentType() {
    const contentType = await this.parser.getXML('[Content_Types].xml');
    this.conentTypes = parseContentType(contentType);
  }

  /**
   * 解析 numbering
   */
  async initNumbering() {
    for (const override of this.conentTypes.overrides) {
      if (override.partName.startsWith('/word/numbering')) {
        const numberingData = await this.parser.getXML(override.partName);
        this.numbering = Numbering.fromXML(this, numberingData);
      }
    }
  }

  /**
   * 根据 id 获取关系
   */
  getRelationship(id: string) {
    return this.relationships[id];
  }

  /**
   * 进行文本替换
   */
  replaceText(text: string) {
    if (!this.renderOptions.replaceVar) {
      return text;
    }
    // 将 {{xxx}} 替换成 ${xxx}，为啥要这样呢，因为输入 $ 可能会变成两段文本
    text = text.replace(/{{/g, '${').replace(/}}/g, '}');

    return evaluate(text, this.renderOptions.data, {
      defaultFilter: 'raw'
    });
  }

  /**
   * 加载图片
   */
  async loadImage(relation: Relationship) {
    let path = relation.target;
    if (relation.part === 'word') {
      path = 'word/' + path;
    }

    const data = await this.parser.getFileByType(path, 'blob');
    if (data) {
      if (this.renderOptions.imageDataURL) {
        return await blobToDataURL(data as Blob);
      } else {
        return URL.createObjectURL(data as Blob);
      }
    }

    return null;
  }

  /**
   * 解析 html
   */
  async getXML(filePath: string): Promise<Document> {
    return this.parser.getXML(filePath);
  }

  /**
   * 获取 styleId 的显示名称，因为这里可以自定义，理论上会出现 css 不支持的语法
   */
  getStyleIdDisplayName(styleId: string) {
    // 如果只有数字和字母且字母开头，就直接使用
    if (styleId.match(/^[a-zA-Z]+[a-zA-Z0-9]$/)) {
      return styleId;
    }
    if (styleId in this.styleIdMap) {
      return this.styleIdMap[styleId];
    } else {
      this.styleIdMap[styleId] = this.genClassName();
      return this.styleIdMap[styleId];
    }
  }

  /**
   * 生成个新的唯一的 class 名称
   */
  genClassName() {
    return 'docx-classname-' + this.styleIdNum++;
  }

  /**
   * 添加新样式，主要用于表格的单元格样式
   */
  appendStyle(style: string) {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = style;
    this.rootElement.appendChild(styleElement);
  }

  /**
   * 返回样式表名及它的父级样式表名
   * @param styleId 样式表里的 style 名称
   * @returns 返回 className 数组
   */
  getStyleClassName(stylId: string) {
    const style = this.styles.styleMap[stylId];

    if (!style) {
      return [];
    }

    const classNames = [this.getStyleIdDisplayName(stylId)];
    if (style.basedOn) {
      classNames.unshift(this.getStyleIdDisplayName(style.basedOn));
    }
    return classNames;
  }

  getClassPrefix() {
    return `${this.renderOptions.classPrefix}-${this.id}`;
  }

  getThemeColor(name: string) {
    return `var(--docx-${this.id}-theme-${name}-color)`;
  }

  async render(root: HTMLElement) {
    await this.init();
    console.log(this);
    this.rootElement = root;
    root.innerHTML = '';
    const documentData = await this.getXML('word/document.xml');

    if (this.renderOptions.replaceVar) {
      // mergeRun(this, documentData);
    }

    const document = WDocument.fromXML(this, documentData);

    console.log(document);
    const documentElement = await renderDocument(this, document);
    root.classList.add(this.getClassPrefix());
    if (this.renderOptions.inWrap) {
      root.classList.add(this.wrapClassName);
    }

    appendChild(root, renderStyle(this));
    appendChild(root, documentElement);
  }
}
