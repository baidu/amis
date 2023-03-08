/**
 * 总入口，它将包括所有 word 文档信息，后续渲染的时候依赖它来获取关联信息
 */

import {parse, evaluate} from 'amis-formula';
import PackageParser, {PackageOptions} from './PackageParser';
import {XMLData} from './OpenXML';
import {parseRelationships, Relationship} from './parse/parseRelationship';
import {ContentTypes, parseContentType} from './openxml/ContentType';
import {parseStyles, Styles} from './openxml/Style';
import {parseTheme, Theme} from './openxml/Theme';
import {Document} from './openxml/word/Document';
import renderDocument from './render/renderDocument';
import {blobToDataURL} from './util/blob';
import {Numbering} from './openxml/word/numbering/Numbering';

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
   * 是否替换变量
   */
  replaceVar: boolean;

  /**
   * 上下文，用于替换变量的场景
   */
  data?: any;
}

const defaultRenderOptions: WordRenderOptions = {
  imageDataURL: false,
  classPrefix: 'docx-viewer-',
  replaceVar: false
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

  constructor(parser: PackageParser, renderOptions: WordRenderOptions) {
    this.id = Word.globalId++;
    this.parser = parser;
    this.renderOptions = renderOptions;
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

  static async load(
    docxFile: Blob | any,
    options: Partial<WordRenderOptions> = defaultRenderOptions
  ): Promise<Word> {
    const renderOptions = {
      ...defaultRenderOptions,
      ...options
    };
    const parser = await PackageParser.load(docxFile, renderOptions);
    return new Word(parser, renderOptions);
  }

  async initTheme() {
    for (const override of this.conentTypes.overrides) {
      if (override.partName.startsWith('/word/theme')) {
        const theme = await this.parser.getXML(override.partName);
        this.themes.push(parseTheme(theme));
      }
    }
  }

  async initStyle() {
    this.styles = parseStyles(await this.parser.getXML('/word/styles.xml'));
  }

  async initRelation() {
    const rels = parseRelationships(
      (await this.parser.getXML('/_rels/.rels'))['Relationships'],
      'root'
    );
    const documentRels = parseRelationships(
      (await this.parser.getXML('/word/_rels/document.xml.rels'))[
        'Relationships'
      ],
      'word'
    );
    this.relationships = {...rels, ...documentRels};
  }

  async initContentType() {
    const contentType = await this.parser.getXML('[Content_Types].xml');
    this.conentTypes = parseContentType(contentType);
  }

  async initNumbering() {
    const numberingData = await this.parser.getXML('word/numbering.xml');
    this.numbering = Numbering.fromXML(this, numberingData);
  }

  getRelationship(id: string) {
    return this.relationships[id];
  }

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

  async getXML(filePath: string): Promise<XMLData> {
    return this.parser.getXML(filePath);
  }

  getClassName(styleName: string) {
    if (styleName) {
      return `${this.renderOptions.classPrefix}-${this.id}-${styleName}`;
    } else {
      return '';
    }
  }

  getThemeColor(name: string) {
    return `var(--docx-${this.id}-theme-${name}-color)`;
  }

  async render(): Promise<HTMLElement> {
    await this.init();
    console.log(this);
    const documentData = await this.getXML('word/document.xml');
    console.log(documentData);
    const document = Document.fromXML(this, documentData);
    console.log(document);
    return renderDocument(this, document);
  }
}
