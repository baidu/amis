import {StringItem} from '../StringItem';

/**
 * 错误的数据
 */
export type ErrorData = {
  type: 'error';
  value: string;
  s?: number;
};

/**
 * 公式数据
 */
export type FormulaData = {
  type: 'formula';
  formula: string;
  value: string;
  s?: number;
};

/**
 * 可能是老的数据格式
 */
export type DateData = {
  type: 'date';
  value: string;
  s?: number;
};

/**
 * 带样式的数据
 */
export type StyleData = {
  type: 'style';
  s?: number;
  /**
   * 值
   */
  value: string;
};

/**
 * 空数据，这种主要都是有个单元格，但是没有值
 */
export type BlankData = {
  type: 'blank';
  s?: number;
};

/**
 * 单元格里存的值
 */
export type CellData =
  | StringItem
  | ErrorData
  | FormulaData
  | StyleData
  | DateData
  | BlankData;

export function hasValue(cellData: CellData): boolean {
  if (typeof cellData === 'string') {
    return true;
  }
  // 其实就是除了 blank 之外的
  if (
    typeof cellData === 'object' &&
    (cellData.type === 'date' ||
      cellData.type === 'error' ||
      cellData.type === 'rich' ||
      cellData.type === 'style' ||
      cellData.type === 'formula')
  ) {
    return true;
  }
  return false;
}

/**
 * 更新数据，目前还不支持富文本
 * @param value
 * @param cellData
 * @returns
 */
export function updateValue(value: string = '', cellData?: CellData): CellData {
  if (!cellData) {
    return value || '';
  }

  if (typeof cellData === 'string') {
    return value;
  }

  if ('type' in cellData && cellData.type === 'blank') {
    if (cellData.s !== undefined) {
      return {
        type: 'style',
        value,
        s: cellData.s
      };
    }
    return value;
  }

  if ('value' in cellData) {
    return {
      ...cellData,
      value
    };
  }

  return cellData;
}
