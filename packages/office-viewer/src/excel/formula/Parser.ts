import {ASTNode} from './ast/ASTNode';
import {Token, TokenName} from './tokenizer';
import {Precedence} from './parser/tokenPriorityMap';
import {InfixParse} from './parser/InfixParse';
import {BinaryOperator} from './parser/BinaryOperator';
import {PrefixOpParse} from './parser/PrefixOpParse';
import {ConstantParse} from './parser/ConstantParse';
import {RefParse} from './parser/RefParse';
import {GroupParse} from './parser/GroupParse';
import {ArrayParse} from './parser/ArrayParse';
import {FunctionParse} from './parser/FunctionParse';
import {PrefixParse} from './parser/PrefixParse';
import {PercentParse} from './parser/PercentParse';

// 优先级参考 https://support.microsoft.com/en-us/office/calculation-operators-and-precedence-in-excel-48be406d-4975-4d31-b2b8-7af9e0e2878a

export const prefixParserMap: Map<TokenName, PrefixParse> = new Map([
  ['PLUS', new PrefixOpParse(Precedence.PREFIX)],
  ['MINUS', new PrefixOpParse(Precedence.PREFIX)],
  ['STRING', new ConstantParse()],
  ['SINGLE_QUOTE_STRING', new ConstantParse()],
  ['NUMBER', new ConstantParse()],
  ['BOOLEAN', new ConstantParse()],
  ['ERROR', new ConstantParse()],
  ['ERROR_REF', new ConstantParse()],
  ['SHEET', new RefParse()],
  ['SHEET_QUOTE', new RefParse()],
  ['CELL', new RefParse()],
  ['NAME', new RefParse()],
  ['OPEN_BRACKET', new RefParse()],
  ['OPEN_PAREN', new GroupParse()],
  ['OPEN_CURLY', new ArrayParse()],
  ['FUNCTION', new FunctionParse()]
]);

export const infixParserMap: Map<TokenName, InfixParse> = new Map([
  ['PLUS', new BinaryOperator(Precedence.PLUS)],
  ['MINUS', new BinaryOperator(Precedence.PLUS)],
  ['MUL', new BinaryOperator(Precedence.MUL)],
  ['DIV', new BinaryOperator(Precedence.MUL)],
  ['CONCAT', new BinaryOperator(Precedence.MUL)],
  ['CARET', new BinaryOperator(Precedence.CARET)],
  ['EQ', new BinaryOperator(Precedence.COMPARE)],
  ['GT', new BinaryOperator(Precedence.COMPARE)],
  ['LT', new BinaryOperator(Precedence.COMPARE)],
  ['GE', new BinaryOperator(Precedence.COMPARE)],
  ['LE', new BinaryOperator(Precedence.COMPARE)],
  ['NE', new BinaryOperator(Precedence.COMPARE)],
  ['PERCENT', new PercentParse(Precedence.POSTFIX)]
]);

export class Parser {
  tokens: Token[];

  currentIndex: number = -1;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse() {
    this.currentIndex = -1;
    const rootNode = this.parseFormula();
    return rootNode;
  }

  parseFormula(precedence: number = 0): ASTNode {
    const token = this.next();

    const prefixParser = prefixParserMap.get(token.name);

    if (!prefixParser) {
      throw new Error(`No prefix parser found for ${token.name}`);
    }

    let left = prefixParser.parse(this, token);

    while (precedence < this.getPrecedence()) {
      const nexToken = this.next();
      const infixParserConfig = infixParserMap.get(nexToken.name);
      if (!infixParserConfig) {
        throw new Error(`No infix parser found for ${nexToken.name}`);
      }
      left = infixParserConfig.parse(this, left, nexToken);
    }

    return left;
  }

  getPrecedence() {
    const nextToken = this.peakNext();
    if (!nextToken) {
      return 0;
    }
    const infixParserConfig = infixParserMap.get(nextToken.name);

    if (!infixParserConfig) {
      return 0;
    }

    return infixParserConfig.getPrecedence();
  }

  /**
   * 如果匹配就前进到下一个 token
   */
  match(...tokenNames: TokenName[]) {
    const currentToken = this.peakNext();
    if (!currentToken) {
      return false;
    }

    if (tokenNames.length > 0) {
      if (tokenNames.every(name => name !== currentToken.name)) {
        return false;
      }
    }

    this.next();
    return true;
  }

  /**
   * 前进到下一个 token
   */
  next(expectTokenName?: TokenName) {
    if (expectTokenName) {
      const nextToken = this.peakNext();
      if (nextToken && nextToken.name !== expectTokenName) {
        throw new Error(
          `Expect token name ${expectTokenName}, but got ${nextToken.name}`
        );
      }
    }
    this.currentIndex++;
    return this.tokens[this.currentIndex];
  }

  peak(): Token | undefined {
    return this.tokens[this.currentIndex];
  }

  /**
   * 参考下一个 token 是什么
   */
  peakNext(): Token | undefined {
    return this.tokens[this.currentIndex + 1];
  }
}
