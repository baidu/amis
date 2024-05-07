import {RangeRef} from '../../types/RangeRef';

export type Reference = NameReference | CellReference;

export type NameReference = {
  sheetName?: string;
  name: string;
};

export type CellReference = {
  sheetName?: string;
  // 类似 A1 或 A$1
  start: string;
  end: string;
  range: RangeRef;
};
