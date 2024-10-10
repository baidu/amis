import {Parser} from '../Parser';
import {ASTNode} from '../ast/ASTNode';
import {Token} from '../tokenizer';
import {PrefixParse} from './PrefixParse';

export class FunctionParse implements PrefixParse {
  parse(parser: Parser, token: Token): ASTNode {
    const params: ASTNode[] = [];

    if (!parser.match('CLOSE_PAREN')) {
      do {
        const nextToken = parser.peakNext();
        // 出现类似 SUM(1,) 的情况
        if (nextToken && nextToken.name === 'CLOSE_PAREN') {
          break;
        }
        if (nextToken && nextToken.name === 'COMMA') {
          continue;
        }
        params.push(parser.parseFormula());
      } while (parser.match('COMMA'));
      parser.next('CLOSE_PAREN');
    }

    return {
      type: 'Function',
      token,
      children: params
    };
  }
}
