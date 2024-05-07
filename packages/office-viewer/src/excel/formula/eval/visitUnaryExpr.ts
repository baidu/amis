import {ASTNode} from '../ast/ASTNode';
import {EvalResult} from './EvalResult';
import {FormulaVisitor} from './FormulaVisitor';

export function visitUnaryExpr(
  visitor: FormulaVisitor,
  node: ASTNode
): EvalResult {
  if (node.token.value === '-') {
    const child = visitor.visit(node.children[0]);
    if (typeof child === 'number') {
      return -child;
    } else {
      throw new Error('UnaryExpr child is not a number');
    }
  } else {
    if (node.token.value === '+') {
      return visitor.visit(node.children[0]);
    }
  }

  throw new Error('Not implemented ' + node.token.value);
}
