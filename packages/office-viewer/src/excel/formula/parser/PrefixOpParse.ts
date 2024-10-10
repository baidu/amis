import {Parser} from '../Parser';
import {ASTNode} from '../ast/ASTNode';
import {Token} from '../tokenizer';
import {PrefixParse} from './PrefixParse';

export class PrefixOpParse implements PrefixParse {
  precedence: number;

  constructor(precedence: number) {
    this.precedence = precedence;
  }

  parse(parser: Parser, token: Token): ASTNode {
    const child = parser.parseFormula(this.precedence);
    return {
      type: 'UnaryExpr',
      token,
      children: [child]
    };
  }
}
