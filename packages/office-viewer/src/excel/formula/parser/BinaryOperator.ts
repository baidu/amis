import {Parser} from '../Parser';
import {ASTNode} from '../ast/ASTNode';
import {Token} from '../tokenizer';
import {InfixParse} from './InfixParse';

export class BinaryOperator implements InfixParse {
  precedence: number;
  constructor(precedence: number) {
    this.precedence = precedence;
  }

  parse(parser: Parser, left: ASTNode, token: Token): ASTNode {
    const right = parser.parseFormula(this.precedence);
    return {
      type: 'BinaryExpr',
      token,
      children: [left, right]
    };
  }

  getPrecedence() {
    return this.precedence;
  }
}
