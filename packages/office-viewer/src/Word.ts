/**
 * 总入口，它将包括所有 word 文档信息，后续渲染的时候依赖它来获取关联信息
 */

import {parseRelationships, Relationship} from './parse/parseRelationship';
import {ContentTypes, parseContentType} from './openxml/ContentType';
import {parseStyles, Styles} from './openxml/Style';
import {parseTheme, Theme} from './openxml/Theme';

import renderDocument from './render/renderDocument';
import {blobToDataURL, downloadBlob} from './util/blob';
import {Numbering} from './openxml/word/numbering/Numbering';
import {appendChild} from './util/dom';
import {renderStyle} from './render/renderStyle';
import {mergeRun} from './util/mergeRun';
import {WDocument} from './openxml/word/Document';
import {PackageParser} from './package/PackageParser';
import {updateVariableText} from './render/renderRun';
import ZipPackageParser from './package/ZipPackageParser';
import {buildXML} from './util/xml';

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

  /**
   * 进行模板替换的函数
   */
  replaceText?: (text: string) => string;

  /**
   * 是否开启调试模式
   */
  debug?: boolean;
}

const defaultRenderOptions: WordRenderOptions = {
  imageDataURL: false,
  classPrefix: 'docx-viewer',
  inWrap: true,
  bulletUseFont: true,
  ignoreHeight: true,
  minLineHeight: 1.0,
  debug: false
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
   * openxml 包
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

  /**
   * 构建 word
   *
   * @param docxFile docx 文件
   * @param options 渲染配置
   * @param packaParser 包解析器
   */
  constructor(
    docFile: ArrayBuffer | string,
    renderOptions?: Partial<WordRenderOptions>,
    parser: PackageParser = new ZipPackageParser()
  ) {
    parser.load(docFile);
    this.id = Word.globalId++;
    this.parser = parser;
    this.renderOptions = {...defaultRenderOptions, ...renderOptions};
  }

  inited = false;
  /**
   * 初始化一些公共资源，比如
   */
  init() {
    if (this.inited) {
      return;
    }

    // 这个必须在最前面，因为后面很多依赖它来查找文件的
    this.initContentType();

    this.initTheme();
    this.initStyle();
    this.initRelation();
    this.initNumbering();

    this.inited = true;
  }

  /**
   * 解析全局主题配置
   */
  initTheme() {
    for (const override of this.conentTypes.overrides) {
      if (override.partName.startsWith('/word/theme')) {
        const theme = this.parser.getXML(override.partName);
        this.themes.push(parseTheme(theme));
      }
    }
  }

  /**
   * 解析全局样式
   */
  initStyle() {
    for (const override of this.conentTypes.overrides) {
      if (override.partName.startsWith('/word/styles.xml')) {
        this.styles = parseStyles(this, this.parser.getXML('/word/styles.xml'));
      }
    }
  }

  /**
   * 解析关系
   */
  initRelation() {
    let rels = {};
    if (this.parser.fileExists('/_rels/.rels')) {
      rels = parseRelationships(this.parser.getXML('/_rels/.rels'), 'root');
    }

    let documentRels = {};
    if (this.parser.fileExists('/word/_rels/document.xml.rels')) {
      documentRels = parseRelationships(
        this.parser.getXML('/word/_rels/document.xml.rels'),
        'word'
      );
    }
    this.relationships = {...rels, ...documentRels};
  }

  /**
   * 解析全局配置
   */
  initContentType() {
    const contentType = this.parser.getXML('[Content_Types].xml');
    this.conentTypes = parseContentType(contentType);
  }

  /**
   * 解析 numbering
   */
  initNumbering() {
    for (const override of this.conentTypes.overrides) {
      if (override.partName.startsWith('/word/numbering')) {
        const numberingData = this.parser.getXML(override.partName);
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
    if (!this.renderOptions.replaceText) {
      return text;
    }
    return this.renderOptions.replaceText(text);
  }

  /**
   * 加载图片
   */
  loadImage(relation: Relationship): Promise<string> | null {
    let path = relation.target;
    if (relation.part === 'word') {
      path = 'word/' + path;
    }

    const data = this.parser.getFileByType(path, 'blob');
    if (data) {
      if (this.renderOptions.imageDataURL) {
        return blobToDataURL(data as Blob);
      } else {
        return new Promise<string>((resolve, reject) => {
          resolve(URL.createObjectURL(data as Blob));
        });
      }
    }

    return null;
  }

  /**
   * 解析 html
   */
  getXML(filePath: string): Document {
    return this.parser.getXML(filePath);
  }

  /**
   * 获取 styleId 的显示名称，因为这里可以自定义，理论上会出现 css 不支持的语法
   */
  getStyleIdDisplayName(styleId: string) {
    /**
     * 简单判断一下，如果是合法的 css 名称，就直接返回
     * In CSS, identifiers (including element names, classes, and IDs in selectors) can contain only the characters [a-zA-Z0-9] and ISO 10646 characters U+00A0 and higher, plus the hyphen (-) and the underscore (_); they cannot start with a digit, two hyphens, or a hyphen followed by a digit. Identifiers can also contain escaped characters and any ISO 10646 character as a numeric code (see next item). For instance, the identifier "B&W?" may be written as "B\&W\?" or "B\26 W\3F".
     */
    if (styleId.match(/^[a-zA-Z]+[a-zA-Z0-9\-\_]$/)) {
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

  /**
   * 渲染时的 css 类前缀
   */
  getClassPrefix() {
    return `${this.renderOptions.classPrefix}-${this.id}`;
  }

  /**
   * 获取主题色，目前基于 css 变量实现，方便动态修改
   */
  getThemeColor(name: string) {
    return `var(--docx-${this.id}-theme-${name}-color)`;
  }

  /**
   * 更新页面中的变量，这个要在 render 后运行
   */
  updateVariable() {
    if (!this.rootElement || !this.renderOptions.replaceText) {
      return;
    }
    updateVariableText(this);
  }

  /**
   * 下载生成的文档，会对 word/document.xml 进行处理，替换文本
   */
  download(fileName: string = 'document.docx') {
    const documentData = this.getXML('word/document.xml');

    if (this.renderOptions.replaceText) {
      mergeRun(this, documentData);
      // 对文本进行替换
      const ts = documentData.getElementsByTagName('w:t');
      for (let i = 0; i < ts.length; i++) {
        ts[i].textContent = this.replaceText(ts[i].textContent || '');
      }
    }

    const blob = this.parser.generateZip(buildXML(documentData));
    downloadBlob(blob, fileName);
  }

  /**
   * 渲染文档入口
   *
   * @param root 渲染的根节点
   */
  async render(root: HTMLElement) {
    this.init();
    const isDebug = this.renderOptions.debug;
    isDebug && console.log('init', this);
    this.rootElement = root;
    root.innerHTML = '';
    const documentData = this.getXML('word/document.xml');

    if (this.renderOptions.replaceText) {
      mergeRun(this, documentData);
      // 这里不进行变量替换，方便后续进行局部替换来更新变量
    }

    const document = WDocument.fromXML(this, documentData);

    isDebug && console.log('document', document);
    const documentElement = renderDocument(this, document);
    root.classList.add(this.getClassPrefix());
    if (this.renderOptions.inWrap) {
      root.classList.add(this.wrapClassName);
    }

    appendChild(root, renderStyle(this));
    appendChild(root, documentElement);
  }
}
