import {FontTable} from './openxml/word/FontTable';
/**
 * 总入口，它将包括所有 word 文档信息，后续渲染的时候依赖它来获取关联信息
 */

import {parseRelationships, Relationship} from './word/parse/parseRelationship';
import {ContentTypes, parseContentType} from './openxml/ContentType';
import {parseStyles, Styles} from './openxml/Style';
import {parseTheme, Theme} from './openxml/Theme';

import renderDocument from './word/render/renderDocument';
import {blobToDataURL, downloadBlob} from './util/blob';
import {Numbering} from './openxml/word/numbering/Numbering';
import {appendChild, createElement} from './util/dom';
import {renderStyle} from './word/render/renderStyle';
import {mergeRun} from './util/mergeRun';
import {WDocument} from './openxml/word/WDocument';
import {PackageParser} from './package/PackageParser';
import {updateVariableText} from './word/render/renderRun';
import ZipPackageParser from './package/ZipPackageParser';
import {buildXML} from './util/xml';
import {Paragraph} from './openxml/word/Paragraph';
import {deobfuscate} from './openxml/word/Font';
import {renderFont} from './word/render/renderFont';
import {replaceT, replaceVar} from './util/replaceVar';
import {Note} from './openxml/word/Note';
import {parseFootnotes} from './word/parse/Footnotes';
import {parseEndnotes} from './word/parse/parseEndnotes';
import {renderNotes} from './word/render/renderNotes';
import {Section} from './openxml/word/Section';
import {printIframe} from './util/print';
import {Settings} from './openxml/Settings';
import {get} from './util/get';
import {fileTypeFromBuffer} from './util/fileType';
import {OfficeViewer} from './OfficeViewer';
import {RenderOptions} from './RenderOptions';
import {parse} from 'zrender/lib/tool/color';
import {stylesXML} from './word/parse/defaultXML/stylesXML';
import {themeXML} from './word/parse/defaultXML/themeXML';
import {settingsXML} from './word/parse/defaultXML/settingsXML';

/**
 * 渲染配置
 */
export interface WordRenderOptions extends RenderOptions {
  /**
   * css 类前缀
   */
  classPrefix: string;

  /**
   * 列表使用字体渲染，需要自行引入 Windings 字体
   */
  bulletUseFont: boolean;

  /**
   * 是否忽略文档宽度设置
   */
  ignoreWidth?: boolean;

  /**
   * 是否忽略文档高度设置
   */
  ignoreHeight?: boolean;

  /**
   * 强制文档内边距设置
   */
  padding?: string;

  /**
   * 最小行高
   */
  minLineHeight?: number;

  /**
   * 强制行高，设置之后所有文本都使用这个行高，可以优化排版效果
   */
  forceLineHeight?: string;

  /**
   * 打印等待时间，单位毫秒，可能有的文档有很多图片，如果等待时间太短图片还没加载完，所以加这个配置项可控
   */
  printWaitTime?: number;

  /**
   * 是否使用分页的方式来渲染内容，使用这种方式还原度更高，但不支持打印功能
   * 设置后会自动将 ignoreHeight 和 ignoreWidth 设置为 false
   */
  page?: boolean;

  /**
   * 每页之间的间距
   */
  pageMarginBottom?: number;

  /**
   * 页面背景色
   */
  pageBackground?: string;

  /**
   * 是否显示页面阴影，只有在 page 为 true 的时候才生效
   */
  pageShadow?: boolean;

  /**
   * 显示页面包裹效果，只有在 page 为 true 的时候才生效
   */
  pageWrap?: boolean;

  /**
   * 页面包裹宽度
   */
  pageWrapPadding?: number;

  /**
   * 页面包裹背景色
   */
  pageWrapBackground?: string;

  /**
   * 缩放比例，取值 0-1 之间
   */
  zoom?: number;

  /**
   * 自适应宽度，如果设置了 zoom，那么 zoom 优先级更高，这个设置只在 ignoreWidth 为 false 的时候生效
   */
  zoomFitWidth?: boolean;

  /**
   * 打印可以覆盖其它配置
   */
  printOptions?: WordRenderOptions;

  /**
   * 是否渲染 header
   */
  renderHeader?: boolean;

  /**
   * 是否渲染 footer
   */
  renderFooter?: boolean;
}

const defaultRenderOptions: WordRenderOptions = {
  classPrefix: 'docx-viewer',
  page: false,
  pageWrap: true,
  bulletUseFont: true,
  ignoreHeight: true,
  ignoreWidth: false,
  minLineHeight: 1.0,
  enableVar: false,
  debug: false,
  pageWrapPadding: 20,
  pageMarginBottom: 20,
  pageShadow: true,
  pageBackground: '#FFFFFF',
  pageWrapBackground: '#ECECEC',
  printWaitTime: 100,
  zoomFitWidth: false,
  renderHeader: true,
  renderFooter: true,
  data: {},
  evalVar: (path: string, data: any) => {
    return get(data, path);
  }
};

export default class Word implements OfficeViewer {
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
  contentTypes: ContentTypes;

  /**
   * 解析 theme 目录里的数据
   */
  themes: Theme[] = [];

  /**
   * 解析 numbering.xml 里的数据
   */
  numbering: Numbering;

  settings: Settings;

  /**
   * 解析 styles.xml 里的数据
   */
  styles: Styles;

  renderOptions: WordRenderOptions;

  /**
   * 全局关系表
   */
  relationships: Record<string, Relationship>;

  /**
   * 文档关系表
   */
  documentRels: Record<string, Relationship>;

  /**
   * 当前文档使用的关系表，比如 headers.xml 里的图片是
   */
  currentDocumentRels: Record<string, Relationship>;

  /**
   * 字体关系表
   */
  fontTableRels: Record<string, Relationship>;

  /**
   * 样式名映射，因为自定义样式名有可能不符合 css 命名规范，因此实际使用这个名字
   */
  styleIdMap: Record<string, string> = {};

  /**
   * 用于自动生成样式名时的计数，保证每次都是唯一的
   */
  styleIdNum: number = 0;

  /**
   * 内置字体标
   */
  fontTable?: FontTable;

  /**
   * 渲染根节点
   */
  rootElement: HTMLElement;

  wrapClassName = 'docx-viewer-wrapper';

  /**
   * 当前渲染的段落，主要用于获取 fldSimple
   */
  currentParagraph: Paragraph;

  footNotes: Record<string, Note> = {};

  endNotes: Record<string, Note> = {};

  /**
   * 当前页码
   */
  currentPage: 0;

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
    this.updateOptions(renderOptions);
  }

  inited = false;

  /**
   * 分页标记，如果为 true，那么在渲染的时候会强制分页
   */
  breakPage = false;

  /**
   * 当前渲染的段，因为很多渲染需要，所以为了避免大量传参，这里直接挂在这里
   */
  currentSection: Section;

  DOCUMENT_RELS = '/word/_rels/document.xml.rels';

  /**
   * 初始化一些公共资源，比如
   */
  init() {
    if (this.inited) {
      return;
    }

    // 这个必须在最前面，因为后面很多依赖它来查找文件的
    this.initContentType();
    // relation 需要排第二
    this.initRelation();

    this.initSettings();

    this.initTheme();
    this.initFontTable();
    this.initStyle();
    this.initNumbering();

    this.initNotes();

    this.inited = true;
  }

  updateOptions(options: any) {
    this.renderOptions = {...defaultRenderOptions, ...options};
    if (this.renderOptions.page) {
      this.renderOptions.ignoreHeight = false;
      this.renderOptions.ignoreWidth = false;
    }
  }

  /**
   * 解析全局主题配置
   */
  initTheme() {
    for (const override of this.contentTypes.overrides) {
      if (override.partName.startsWith('/word/theme')) {
        const theme = this.parser.getXML(override.partName);
        this.themes.push(parseTheme(theme));
      }
    }
    if (this.themes.length === 0) {
      this.themes.push(parseTheme(themeXML));
    }
  }

  /**
   * 解析全局样式
   */
  initStyle() {
    for (const override of this.contentTypes.overrides) {
      if (override.partName.startsWith('/word/styles.xml')) {
        this.styles = parseStyles(this, this.parser.getXML('/word/styles.xml'));
      }
    }
    // 没有样式表的情况
    if (!this.styles) {
      this.styles = parseStyles(this, stylesXML);
    }
  }

  /**
   * 解析全局配置
   */
  initSettings() {
    for (const override of this.contentTypes.overrides) {
      if (override.partName.startsWith('/word/settings.xml')) {
        this.settings = Settings.parse(
          this,
          this.parser.getXML('/word/settings.xml')
        );
      }
    }
    if (!this.settings) {
      this.settings = Settings.parse(this, settingsXML);
    }
  }

  /**
   * 解析字体表
   */
  initFontTable() {
    for (const override of this.contentTypes.overrides) {
      if (override.partName.startsWith('/word/fontTable.xml')) {
        this.fontTable = FontTable.fromXML(
          this,
          this.parser.getXML('/word/fontTable.xml')
        );
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

    this.relationships = rels;

    let documentRels = {};
    if (this.parser.fileExists(this.DOCUMENT_RELS)) {
      documentRels = parseRelationships(
        this.parser.getXML(this.DOCUMENT_RELS),
        'word'
      );
    }
    this.documentRels = documentRels;

    let fontTableRels = {};
    if (this.parser.fileExists('/word/_rels/fontTable.xml.rels')) {
      fontTableRels = parseRelationships(
        this.parser.getXML('/word/_rels/fontTable.xml.rels'),
        'word'
      );
    }
    this.fontTableRels = fontTableRels;
  }

  /**
   * 解析全局配置
   */
  initContentType() {
    const contentType = this.parser.getXML('[Content_Types].xml');
    this.contentTypes = parseContentType(contentType);
  }

  /**
   * 解析 numbering
   */
  initNumbering() {
    for (const override of this.contentTypes.overrides) {
      if (override.partName.startsWith('/word/numbering')) {
        const numberingData = this.parser.getXML(override.partName);
        this.numbering = Numbering.fromXML(this, numberingData);
      }
    }
  }

  initNotes() {
    for (const override of this.contentTypes.overrides) {
      if (override.partName.startsWith('/word/footnotes.xml')) {
        const notesData = this.parser.getXML(override.partName);
        this.footNotes = parseFootnotes(this, notesData);
      }
      if (override.partName.startsWith('/word/endnotes.xml')) {
        const notesData = this.parser.getXML(override.partName);
        this.endNotes = parseEndnotes(this, notesData);
      }
    }
  }

  /**
   * 获取全局关系
   */
  getRelationship(id?: string) {
    if (id && this.relationships) {
      return this.relationships[id];
    }
    return null;
  }

  /**
   * 获取文档对应的关系
   */
  getDocumentRels(id?: string) {
    if (id && this.documentRels) {
      return this.documentRels[id];
    }
    return null;
  }

  /**
   * 获取字体对应的关系
   */
  getFontTableRels(id?: string) {
    if (id && this.fontTableRels) {
      return this.fontTableRels[id];
    }
    return null;
  }

  /**
   * 进行单个文本替换
   */
  replaceText(text: string) {
    if (this.renderOptions.enableVar === false) {
      return text;
    }
    const data = this.renderOptions.data;
    if (text.indexOf('{{') !== -1) {
      text = text.replace(/{{([^{}]+)}}/g, (all: string, group: string) => {
        const result = this.renderOptions.evalVar(group, data);
        if (typeof result === 'undefined') {
          return '';
        }
        return String(result);
      });
    }
    return text;
  }

  loadWordRelXML(relation: Relationship): Document {
    let path = relation.target;
    if (relation.part === 'word') {
      path = 'word/' + path;
    }
    return this.getXML(path);
  }

  /**
   * 加载图片
   */
  loadImage(relation: Relationship): string | null {
    let path = relation.target;
    if (relation.part === 'word') {
      path = 'word/' + path;
    }

    const data = this.parser.getFileByType(path, 'blob');
    if (data) {
      return URL.createObjectURL(data as Blob);
    }

    return null;
  }

  /**
   * 保存新图片，这个方法主要用于图片变量，需要生成新的 relation
   * @param newRelId 关系 id
   * @param blob 文件数据
   * @param ext 扩展名
   */
  saveNewImage(newRelId: string, data: Uint8Array) {
    if (this.parser.fileExists(this.DOCUMENT_RELS)) {
      const documentRels = this.parser.getXML(this.DOCUMENT_RELS);
      // 基于一个克隆更稳妥
      const newRelation = documentRels
        .getElementsByTagName('Relationship')
        .item(0)!
        .cloneNode(true) as Element;
      newRelation.setAttributeNS(null, 'Id', newRelId);
      newRelation.setAttributeNS(
        null,
        'Type',
        'http://schemas.openxmlformats.org/officeDocument/2006/relationships/image'
      );
      let ext = '';
      const fileType = fileTypeFromBuffer(data);
      if (fileType) {
        ext = '.' + fileType.ext;
      }

      const imagePath = 'media/image' + newRelId + ext;
      newRelation.setAttributeNS(null, 'Target', imagePath);
      documentRels
        .getElementsByTagName('Relationships')[0]
        .appendChild(newRelation);

      // 需要使用相对路径
      this.parser.saveFile(
        this.DOCUMENT_RELS.replace(/^\//, ''),
        buildXML(documentRels)
      );

      this.parser.saveFile('word/' + imagePath, data);
    }
  }

  loadFont(rId: string, key: string) {
    const relation = this.getFontTableRels(rId);
    if (!relation) {
      return null;
    }

    let path = relation.target;
    if (relation.part === 'word') {
      path = 'word/' + path;
    }

    const data = this.parser.getFileByType(path, 'uint8array') as Uint8Array;
    if (data) {
      return URL.createObjectURL(new Blob([deobfuscate(data, key) as any]));
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
    if (styleId.match(/^[a-zA-Z]+[a-zA-Z0-9\-\_]*$/)) {
      return this.getClassPrefix() + '-' + styleId;
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
  appendStyle(style: string = '') {
    const styleElement = createElement('style');
    styleElement.textContent = style;
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
   * 根据 id 获取样式
   * @param styleId
   */
  getStyle(styleId: string) {
    return this.styles.styleMap[styleId];
  }

  /**
   * 渲染时的 css 类前缀
   */
  getClassPrefix() {
    return `${this.renderOptions.classPrefix}-${this.id}`;
  }

  /**
   * 获取主题色
   */
  getThemeColor(name: string) {
    if (this.settings.clrSchemeMapping) {
      name = this.settings.clrSchemeMapping[name] || name;
    }

    if (this.themes && this.themes.length > 0) {
      const theme = this.themes[0];
      const colors = theme.themeElements?.clrScheme?.colors;
      const color = colors?.[name];
      if (color) {
        return color;
      } else {
        // 找不到可能是从其它地方拷贝过来的，这时取 accent1
        console.warn('unknown theme color: ' + name);
        return colors?.['accent1'] || '';
      }
    }

    return '';
  }

  /**
   * 添加类，自动加上前缀
   */
  addClass(element: HTMLElement, className: string) {
    element.classList.add(`${this.getClassPrefix()}-${className}`);
  }

  /**
   * 更新页面中的变量，这个要在 render 后运行
   */
  updateVariable() {
    if (!this.rootElement || this.renderOptions.enableVar === false) {
      return;
    }
    updateVariableText(this);
  }

  /**
   * 下载生成的文档，会对 word/document.xml 进行处理，替换文本
   */
  async download(fileName: string = 'document.docx') {
    const documentData = this.getXML('word/document.xml');

    if (this.renderOptions.enableVar) {
      mergeRun(this, documentData);
      await replaceVar(this, documentData, true);
      // 对文本进行替换
      const ts = documentData.getElementsByTagName('w:t');
      for (let i = 0; i < ts.length; i++) {
        replaceT(this, ts[i], this.renderOptions.data);
      }
    }

    const blob = this.parser.generateZipBlob(buildXML(documentData));
    downloadBlob(blob, fileName);
  }

  /**
   * 打印功能
   */
  async print(): Promise<any> {
    const iframe = document.createElement('iframe') as HTMLIFrameElement;
    iframe.style.position = 'absolute';
    iframe.style.top = '-10000px';
    document.body.appendChild(iframe);
    const printDocument = iframe.contentDocument;
    if (!printDocument) {
      console.warn('printDocument is null');
      return null;
    }
    printDocument.write(
      `<style>
      html, body { margin:0; padding:0 }
      @page { size: auto; margin: 0mm; }
      </style>
      <div id="print"></div>`
    );
    await this.render(
      printDocument.getElementById('print') as HTMLElement,
      // 这些配置可以让打印还原度更高
      {
        pageWrap: false,
        pageShadow: false,
        pageMarginBottom: 0,
        pageWrapPadding: undefined,
        zoom: 1,
        ...this.renderOptions.printOptions
      }
    );
    setTimeout(function () {
      iframe.focus();
      printIframe(iframe);
    }, this.renderOptions.printWaitTime || 100); // 需要等一下图片渲染
    window.focus();
  }

  /**
   * 渲染文档入口
   *
   * @param root 渲染的根节点
   * @param renderOptionsOverride 临时覆盖某些渲选项
   */
  async render(
    root: HTMLElement,
    renderOptionsOverride: Partial<WordRenderOptions> = {}
  ) {
    this.init();
    this.currentPage = 0;
    const renderOptions = {...this.renderOptions, ...renderOptionsOverride};

    const isDebug = renderOptions.debug;
    isDebug && console.log('init', this);
    this.rootElement = root;
    root.innerHTML = '';
    const documentData = this.getXML('word/document.xml');

    isDebug && console.log('documentData', documentData);

    if (renderOptions.enableVar) {
      mergeRun(this, documentData);
      await replaceVar(this, documentData);
      // 这里不进行变量替换，方便后续进行局部替换来更新变量
    }

    const document = WDocument.fromXML(this, documentData);

    isDebug && console.log('document', document);

    const documentElement = renderDocument(root, this, document, renderOptions);
    root.classList.add(this.getClassPrefix());
    if (renderOptions.page && renderOptions.pageWrap) {
      root.classList.add(this.wrapClassName);
      root.style.padding = `${renderOptions.pageWrapPadding || 0}pt`;
      root.style.background = renderOptions.pageWrapBackground || '#ECECEC';
    }

    appendChild(root, renderStyle(this));
    appendChild(root, renderFont(this.fontTable));
    appendChild(root, documentElement);

    appendChild(root, renderNotes(this));
  }

  destroy(): void {}
}
