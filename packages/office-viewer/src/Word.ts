/**
 * 总入口，它将包括所有 word 文档信息，后续渲染的时候依赖它来获取关联信息
 */

import OOXML, {RenderOptions} from './OOXML';
import PackageParser, {PackageOptions} from './PackageParser';
import {parseStyles} from './parts/Style';
import {parseTheme} from './parts/Theme';

import renderDocument from './render/renderDocument';

export interface WordRenderOptions extends PackageOptions, RenderOptions {}

const defaultRenderOptions: WordRenderOptions = {
  classPrefix: '',
  replaceVar: false
};

export default class Word extends OOXML {
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

  getClassName(styleName: string) {
    return this.renderOptions.classPrefix + styleName;
  }

  async render(): Promise<HTMLElement> {
    await this.init();
    console.log(this);
    const documentData = await this.getXML('word/document.xml');
    console.log(documentData);
    return renderDocument(this, documentData);
  }
}
