import {ASTNode} from '../ast/ASTNode';
import {EvalResult} from './EvalResult';
import {FormulaVisitor} from './FormulaVisitor';

export function visitArray(
  visitor: FormulaVisitor,
  node: ASTNode
): EvalResult[] {
  const arr = node.children.map(child => visitor.visit(child));
  return arr;
}
