import {getIntersectRanges} from '../../io/excel/util/Range';
import {FormulaEnv} from '../FormulaEnv';
import FormulaError from '../FormulaError';
import {ASTNode} from '../ast/ASTNode';
import {EvalResult} from './EvalResult';
import {FormulaVisitor} from './FormulaVisitor';

/**
 * 多个引用取交集的情况
 * @param visitor
 * @param env
 * @param node
 * @returns
 */
export function visitIntersection(
  visitor: FormulaVisitor,
  env: FormulaEnv,
  node: ASTNode
): EvalResult {
  const refs = node.refs;
  if (!refs) {
    throw new Error("Intersection node doesn't have refs");
  }

  const ranges = refs.map(ref => {
    if ('name' in ref) {
      throw 'only range ref is supported in intersection';
    }
    return ref.range;
  });

  const range = getIntersectRanges(ranges);
  if (range === null) {
    throw FormulaError.VALUE;
  }

  const cellData = env.getByRange(range, refs[0].sheetName);
  if (cellData.length === 1) {
    return cellData[0].value;
  }

  const arrayResult: EvalResult[] = [];
  cellData.forEach(cellValue => {
    arrayResult.push(cellValue.value);
  });

  return arrayResult;
}
