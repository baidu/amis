import {ST_UnderlineValues} from '../../openxml/ExcelTypes';

/**
 * 解析后的各种字体信息，为了方便渲染做了简化，而且保证值是有效的，内部通常用这个而不是 CT_Font
 */

export interface FontStyle {
  family: string;
  size: number;
  color: string;
  b: boolean;
  i: boolean;
  strike: boolean;
  outline: boolean;
  shadow: boolean;
  u: ST_UnderlineValues;
  condense: boolean;
}
