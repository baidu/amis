import {Parser} from '../Parser';
import {ASTNode} from '../ast/ASTNode';
import {Token} from '../tokenizer';

export interface PrefixParse {
  parse(parser: Parser, token: Token): ASTNode;
}
