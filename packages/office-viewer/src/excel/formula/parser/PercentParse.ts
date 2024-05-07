import {Parser} from '../Parser';
import {ASTNode} from '../ast/ASTNode';
import {Token} from '../tokenizer';
import {InfixParse} from './InfixParse';

export class PercentParse implements InfixParse {
  precedence: number;
  constructor(precedence: number) {
    this.precedence = precedence;
  }

  parse(parser: Parser, left: ASTNode, token: Token): ASTNode {
    return {
      type: 'Percent',
      token,
      children: [left]
    };
  }

  getPrecedence() {
    return this.precedence;
  }
}
