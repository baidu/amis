import {ST_CellType} from '../../../openxml/ExcelTypes';
import {Attributes} from '../../../openxml/Attributes';

/**
 * 这个内容较多所以自己解析
 */
export interface ICell {
  /**
   * An A1 style reference to the location of this cell
   */
  r?: string;
  /**
   * The index of this cell's style. Style records are stored in the Styles Part.
   */
  s?: number;
  /**
   * cell's data type.
   * b: Boolean
   * d: Date
   * e: Error
   * inlineStr: Inline String
   * n: Number
   * s: Shared String
   * str: String
   */
  t?: ST_CellType;
  /**
   * The zero-based index of the cell metadata record associated with this cell. Metadata information is found in the Metadata Part.
   */
  cm?: number;
  /**
   * The zero-based index of the value metadata record associated with this cell's value. Metadata records are stored in the Metadata Part
   */
  vm?: number;
  /**
   * A Boolean value indicating if the spreadsheet application should show phonetic information
   */
  ph?: boolean;
}

export const CT_Cell_Attributes: Attributes = {
  r: {
    type: 'string'
  },
  s: {
    type: 'int'
  },
  t: {
    type: 'string'
  },
  cm: {
    type: 'int'
  },
  vm: {
    type: 'int'
  },
  ph: {
    type: 'boolean'
  }
};
