/**
 * word 及以后其它的基类，用于处理 Open XML 里一些通用逻辑
 */

import PackageParser from './PackageParser';
import {Styles} from './parts/Style';
import {Theme} from './parts/Theme';
import {ContentTypes, parseContentType} from './parts/ContentType';

export interface RenderOptions {
  /**
   * css 类前缀
   */
  classPrefix: string;
}

export default class OOXML {
  parser: PackageParser;
  conentTypes: ContentTypes;
  themes: Theme[] = [];
  styles: Styles;

  renderOptions: RenderOptions;

  constructor(parser: PackageParser, renderOptions: RenderOptions) {
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

    this.inited = true;
  }

  getClassName(styleName: string) {
    return styleName;
  }

  async initContentType() {
    const contentType = await this.parser.getXML('[Content_Types].xml');
    this.conentTypes = parseContentType(contentType);
  }

  async initStyle() {}

  async initTheme() {}

  async getXML(filePath: string): Promise<any> {
    return this.parser.getXML(filePath);
  }
}
