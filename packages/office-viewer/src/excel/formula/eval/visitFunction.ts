import {FormulaEnv} from '../FormulaEnv';
import FormulaError from '../FormulaError';
import {ASTNode} from '../ast/ASTNode';
import {FunctionName} from '../builtinFunctions';
import {functions} from '../functions/functions';
import {
  AREAS,
  COLUMN,
  COLUMNS,
  ISREF,
  ROW,
  ROWS,
  SUBTOTAL,
  specialFunctions
} from '../functions/special';
import {EvalResult} from './EvalResult';
import {FormulaVisitor} from './FormulaVisitor';

export function visitFunction(
  visitor: FormulaVisitor,
  env: FormulaEnv,
  node: ASTNode
): EvalResult {
  const funcName = node.token.value.replace(/\($/, '');

  if (specialFunctions.has(funcName)) {
    return specialFunctions.get(funcName)!(env, node);
  }

  const args = node.children.map(child => visitor.visit(child));

  const func = functions.get(funcName as FunctionName);
  if (!func) {
    console.error(`Function ${funcName} not found`);
    throw FormulaError.NAME;
  }

  return func(...args);
}
