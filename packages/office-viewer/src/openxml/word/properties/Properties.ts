/**
 * 属性通用设置项
 */

import {CSSStyle} from '../../Style';

export interface Properties {
  /**
   * 解析后的 css 样式
   */
  readonly cssStyle?: CSSStyle;

  readonly pStyle?: string;
}
