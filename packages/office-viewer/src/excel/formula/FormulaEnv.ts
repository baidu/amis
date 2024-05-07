import {CellValue} from '../types/CellValue';
import {RangeRef} from '../types/RangeRef';
import {CellData} from '../types/worksheet/CellData';
import {CellReference, NameReference, Reference} from './ast/Reference';
import {EvalResult} from './eval/EvalResult';

/**
 * 公式环境，用于获取公式所需的数据
 */
export interface FormulaEnv {
  /**
   * 获取变量的内容，这个可能是范围也可能是公式
   * @param name 变量名
   */
  getDefinedName(name: string): string;

  /**
   * 获取范围引用的单元格值
   * @param range 范围引用
   * @param sheetName 工作表名
   */
  getByRange(range: RangeRef, sheetName?: string): CellValue[];

  /**
   * 获取范围引用的单元格值，忽略隐藏单元格
   * @param range
   * @param sheetName
   */
  getByRangeIgnoreHidden(range: RangeRef, sheetName?: string): CellValue[];

  /**
   * 公式所在的单元格
   */
  formulaCell(): RangeRef;
}

export function getRange(env: FormulaEnv, ref: Reference): RangeRef {
  // name 的情况没法确定
  if ('name' in ref) {
    return {
      startRow: 0,
      startCol: 0,
      endRow: 0,
      endCol: 0
    };
  }
  return ref.range;
}
