import {parseRange} from '../../io/excel/util/Range';
import {Parser} from '../Parser';
import {ASTNode} from '../ast/ASTNode';
import {Reference} from '../ast/Reference';
import {Token} from '../tokenizer';
import {PrefixParse} from './PrefixParse';
import {removeQuote} from './remoteQuote';
import {tokenIsRef} from './tokenIsRef';

function nextIsRef(parser: Parser) {
  const nextToken = parser.peakNext();
  return tokenIsRef(nextToken);
}

export class RefParse implements PrefixParse {
  parse(parser: Parser, token: Token): ASTNode {
    let sheetName;

    if (token.name === 'OPEN_BRACKET') {
      token = parser.next();
      // 这种是外部引用，目前不支持，所以一直跳到闭合括号
      while (token && token.name !== 'CLOSE_BRACKET') {
        token = parser.next();
      }
      token = parser.next();
    }

    if (token.name === 'SHEET') {
      sheetName = token.value.replace(/!$/, '');
      token = parser.next();
    }

    if (token.name === 'SHEET_QUOTE') {
      sheetName = removeQuote(token.value.replace(/!$/, ''));
      token = parser.next();
    }

    let ref: Reference | null = null;

    if (token.name === 'NAME') {
      // 比如类似 A 这种，当成整列引用了
      if (token.value.match(/^[A-Z]{1,3}$/)) {
        const nextToken = parser.peakNext();
        if (nextToken && nextToken.name === 'COLON') {
          const start = token.value;
          parser.next();
          const end = parser.next('NAME').value;
          const rangeRef = parseRange((start + ':' + end).replace('/$/g', ''));
          token.value = start + ':' + end;
          ref = {
            sheetName,
            start,
            end,
            range: rangeRef
          };
        } else {
          const col = token.value;
          const rangeRef = parseRange(col.replace('/$/g', ''));
          ref = {
            sheetName,
            start: col,
            end: col,
            range: rangeRef
          };
        }
      } else {
        ref = {
          sheetName,
          name: token.value
        };
      }
    }

    if (token.name === 'CELL') {
      // 范围引用
      const nextToken = parser.peakNext();
      if (nextToken && nextToken.name === 'COLON') {
        const start = token.value;
        parser.next();
        let end = parser.next().value;
        // 这里有可能是字符串？比如 A1:'Sheet1'!A2
        if (end.startsWith("'")) {
          // 直接跳到下一个，因为我不大可能两个不同 sheet 的引用连在一起
          end = parser.next().value;
        }
        const rangeRef = parseRange((start + ':' + end).replace('/$/g', ''));
        token.value = start + ':' + end;
        ref = {
          sheetName,
          start,
          end,
          range: rangeRef
        };
      } else if (!nextIsRef(parser)) {
        const start = token.value;
        try {
          const rangeRef = parseRange(start.replace('/$/g', ''));
          ref = {
            sheetName,
            start,
            end: start,
            range: rangeRef
          };
        } catch (error) {
          // 解析出错就当成普通引用
          ref = {
            sheetName,
            name: token.value
          };
        }
      }
    }

    if (!ref) {
      // 这种一般是错了
      return {
        type: 'Constant',
        token,
        children: []
      };
    }

    // 变成了 SUM(A1:A2, A3:A4) 这种情况，取交集
    if (nextIsRef(parser)) {
      const refs = [ref];
      do {
        const next = parser.parseFormula();
        token.value += ' ' + next.token.value;
        refs.push(next.ref!);
      } while (parser.match('SHEET', 'SHEET_QUOTE', 'CELL', 'NAME'));
      return {
        type: 'Intersection',
        token,
        children: [],
        refs
      };
    }

    return {
      type: 'Reference',
      token,
      children: [],
      ref
    };
  }
}
