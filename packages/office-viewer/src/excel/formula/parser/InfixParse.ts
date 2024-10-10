import type {Parser} from '../Parser';
import {ASTNode} from '../ast/ASTNode';
import {Token} from '../tokenizer';

export interface InfixParse {
  parse(parser: Parser, left: ASTNode, token: Token): ASTNode;
  getPrecedence(): number;
}
