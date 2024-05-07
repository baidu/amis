import {Parser} from '../Parser';
import {ASTNode} from '../ast/ASTNode';

import {Token} from '../tokenizer';
import {PrefixParse} from './PrefixParse';

export class ConstantParse implements PrefixParse {
  parse(parser: Parser, token: Token): ASTNode {
    return {
      type: 'Constant',
      token,
      children: []
    };
  }
}
