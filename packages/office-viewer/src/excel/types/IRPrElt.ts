import {
  CT_Color,
  ST_FontScheme,
  ST_VerticalAlignRun
} from '../../openxml/ExcelTypes';

/**
 * 对应 CT_RPrElt，很多属性在文档里没有，怀疑是不用了
 */
export interface IRPrElt {
  /**
   * This element is a string representing the name of the font assigned to display this run.
   */
  rFont?: string;
  charset?: number;
  family?: number;
  b?: boolean;
  i?: boolean;
  /**
   *
This element draws a strikethrough line through the horizontal middle of the text.
   */
  strike?: boolean;
  outline?: boolean;
  shadow?: boolean;
  condense?: boolean;
  extend?: boolean;
  color?: CT_Color;
  sz?: number;
  u?: boolean;
  vertAlign?: ST_VerticalAlignRun;
  scheme?: ST_FontScheme;
}
