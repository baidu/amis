/**
 * 总入口，它将包括所有 word 文档信息，后续渲染的时候依赖它来获取关联信息
 */

import DocxParser from './DocxParser';
import Theme from './parts/Theme';
import Types from './parts/Types';
import renderDocument from './render/renderDocument';

export default class Word {
  parser: DocxParser;
  types: Types;
  themes: Theme[] = [];

  static async load(docxFile: Blob | any): Promise<Word> {
    const parser = await DocxParser.load(docxFile);
    return new Word(parser);
  }

  constructor(parser: DocxParser) {
    this.parser = parser;
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

    this.inited = true;
  }

  async initContentType() {
    const contentType = await this.parser.getXML('[Content_Types].xml');
    this.types = Types.parse(contentType);
  }

  async initTheme() {
    for (const override of this.types.overrides) {
      if (override.partName.startsWith('/word/theme')) {
        const theme = await this.parser.getXML(override.partName);
        this.themes.push(Theme.parse(theme));
      }
    }
  }

  async getXML(filePath: string): Promise<any> {
    return this.parser.getXML(filePath);
  }

  async render(): Promise<HTMLElement> {
    await this.init();
    console.log(this);
    return renderDocument(this);
  }
}
