/**
 * 将 excel 公式解析成 token
 */

import FormulaError from './FormulaError';

// 参考了 fast-formula-parser 里的正则，这个顺序很关键
export const tokenDefines = {
  SPACE: {
    pattern: /\s+/
  },
  STRING: {
    pattern: /"(""|[^"])*"/
  },
  SHEET_QUOTE: {
    pattern: /'((?![\\\/*?]).)+?'!/
  },
  SINGLE_QUOTE_STRING: {
    pattern: /'(''|[^'])*'/
  },
  FUNCTION: {
    pattern: /[A-Za-z_]+[A-Za-z_0-9.]*\(/
  },
  ERROR: {
    pattern: /#NULL!|#DIV\/0!|#VALUE!|#NAME\?|#NUM!|#N\/A/
  },
  ERROR_REF: {
    pattern: /#REF!/
  },

  SHEET: {
    pattern: /[\[\]A-Za-z_.\d\u007F-\uFFFF]+!/
  },

  BOOLEAN: {
    pattern: /TRUE|FALSE/
  },

  CELL: {
    pattern: /[$]?[A-Za-z]{1,3}[$]?[0-9]*/
  },

  NAME: {
    pattern: /[a-zA-Z_][a-zA-Z0-9_.?]*/
  },

  NUMBER: {
    pattern: /[0-9]+[.]?[0-9]*([eE][+\-][0-9]+)?/
  },

  AT: {
    pattern: /@/
  },

  COMMA: {
    pattern: /,/
  },

  COLON: {
    pattern: /:/
  },

  SEMICOLON: {
    pattern: /;/
  },

  OPEN_PAREN: {
    pattern: /\(/
  },

  CLOSE_PAREN: {
    pattern: /\)/
  },

  OPEN_BRACKET: {
    pattern: /\[/
  },

  CLOSE_BRACKET: {
    pattern: /\]/
  },

  OPEN_CURLY: {
    pattern: /\{/
  },

  CLOSE_CURLY: {
    pattern: /\}/
  },

  MUL: {
    pattern: /\*/
  },

  DIV: {
    pattern: /\//
  },

  PLUS: {
    pattern: /\+/
  },

  MINUS: {
    pattern: /-/
  },

  CONCAT: {
    pattern: /&/
  },

  CARET: {
    pattern: /\^/
  },

  PERCENT: {
    pattern: /%/
  },

  NE: {
    pattern: /<>/
  },

  GE: {
    pattern: />=/
  },

  LE: {
    pattern: /<=/
  },

  GT: {
    pattern: />/
  },

  LT: {
    pattern: /</
  },

  EQ: {
    pattern: /=/
  }
};

export type TokenName = keyof typeof tokenDefines;

export type Token = {
  name: TokenName;
  value: string;
  start: number;
  end: number;
};

export function tokenize(formula: string): Token[] {
  // 去掉一开始的等号
  formula = formula.replace(/^=/, ', ');
  const tokens = new Array<Token>();
  let currentIndex = 0;
  while (currentIndex < formula.length) {
    let found = false;
    for (let tokenName in tokenDefines) {
      const tokenDefine = tokenDefines[tokenName as TokenName];
      const subStr = formula.slice(currentIndex);
      let match = tokenDefine.pattern.exec(subStr);
      if (match && match.index === 0) {
        if (tokenName === 'SPACE') {
          currentIndex += match[0].length;
          found = true;
          break;
        }
        // 这里做了特殊支持，如果是 CELL，且后面是 NAME，那么就认为是一个 NAME
        if (tokenName === 'CELL') {
          const nameMatch = tokenDefines.NAME.pattern.exec(subStr);
          if (nameMatch) {
            if (nameMatch[0].length > match[0].length) {
              match = nameMatch;
              tokenName = 'NAME';
            }
          }
        }
        tokens.push({
          name: tokenName as TokenName,
          value: match[0],
          start: currentIndex,
          end: currentIndex + match[0].length
        });
        currentIndex += match[0].length;
        found = true;
        break;
      }
    }
    if (!found) {
      throw FormulaError.ERROR('Error at ' + formula.slice(currentIndex));
    }
  }

  return tokens;
}
