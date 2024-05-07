import {Parser} from '../Parser';
import {ASTNode} from '../ast/ASTNode';
import {Token} from '../tokenizer';
import {PrefixParse} from './PrefixParse';

export class ArrayParse implements PrefixParse {
  parse(parser: Parser, token: Token): ASTNode {
    const array: ASTNode[] = [];

    if (!parser.match('CLOSE_CURLY')) {
      do {
        const token = parser.peakNext();
        // 出现类似 {1,} 的情况
        if (token && token.name === 'CLOSE_CURLY') {
          break;
        }
        array.push(parser.parseFormula());
      } while (parser.match('COMMA'));

      const nextToken = parser.peakNext();
      // 二维数组
      if (nextToken && nextToken.name === 'SEMICOLON') {
        const matrix: ASTNode[][] = [array];
        parser.next('SEMICOLON');
        do {
          const row: ASTNode[] = [];
          do {
            row.push(parser.parseFormula());
          } while (parser.match('COMMA'));
          matrix.push(row);
        } while (parser.match('SEMICOLON'));
        parser.next('CLOSE_CURLY');
        return {
          type: 'Array',
          token,
          children: matrix
        };
      }
      parser.next('CLOSE_CURLY');
    }

    return {
      type: 'Array',
      token,
      children: array
    };
  }
}
