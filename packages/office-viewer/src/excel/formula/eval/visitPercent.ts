import {ASTNode} from '../ast/ASTNode';
import {EvalResult} from './EvalResult';
import {FormulaVisitor} from './FormulaVisitor';

export function visitPercent(
  visitor: FormulaVisitor,
  node: ASTNode
): EvalResult {
  const child = visitor.visit(node.children[0]);
  if (typeof child === 'number') {
    return child / 100;
  } else {
    throw new Error('Not a number');
  }
}
