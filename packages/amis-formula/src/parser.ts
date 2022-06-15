import {lexer as createLexer, TokenEnum, TokenName} from './lexer';
import {ParserOptions, ASTNode, Token, ASTNodeOrNull, Position} from './types';

const argListStates = {
  START: 0,
  COMMA: 1,
  SET: 2
};

const tempalteStates = {
  START: 0,
  SCRIPTING: 1
};

const objectStates = {
  START: 0,
  KEY: 1,
  COLON: 2,
  VALUE: 3,
  COMMA: 4
};

export function parse(input: string, options?: ParserOptions): ASTNode {
  let token: Token;
  const lexer = createLexer(input, options);
  const tokens: Array<Token> = [];
  const tokenChunk: Array<Token> = [];

  // 允许的变量名字空间
  let variableNamespaces: Array<string> = options?.variableNamespaces ?? [
    'window',
    'cookie',
    'ls',
    'ss'
  ];
  if (!Array.isArray(variableNamespaces)) {
    variableNamespaces = [];
  }

  function next() {
    token = tokenChunk.length ? tokenChunk.shift()! : lexer.next();

    if (!token) {
      throw new TypeError('next token is undefined');
    }
    tokens.push(token);
  }

  function back() {
    tokenChunk.unshift(tokens.pop()!);
    token = tokens[tokens.length - 1];
  }

  function matchPunctuator(operator: string | Array<string>) {
    return (
      token.type === TokenName[TokenEnum.Punctuator] &&
      (Array.isArray(operator)
        ? ~operator.indexOf(token.value!)
        : token.value === operator)
    );
  }

  function fatal() {
    throw TypeError(
      `Unexpected token ${token!.value} in ${token!.start.line}:${
        token!.start.column
      }`
    );
  }

  function assert(result: any) {
    if (!result) {
      fatal();
    }
    return result;
  }

  function expression(): ASTNodeOrNull {
    return assignmentExpression();
  }

  function skipWhiteSpaceChar() {
    while (
      token.type === TokenName[TokenEnum.Char] &&
      /^\s+$/m.test(token.value)
    ) {
      next();
    }
  }

  function collectFilterArg() {
    const arg: Array<any> = [];
    while (
      !matchPunctuator(':') &&
      token.type !== TokenName[TokenEnum.OpenFilter] &&
      token.type !== TokenName[TokenEnum.CloseScript]
    ) {
      const item =
        literal() ||
        numberLiteral() ||
        stringLiteral() ||
        template() ||
        arrayLiteral() ||
        rawScript() ||
        objectLiteral();

      if (item) {
        arg.push(item);
      } else {
        assert(
          ~[
            TokenName[TokenEnum.Identifier],
            TokenName[TokenEnum.Punctuator],
            TokenName[TokenEnum.Char]
          ].indexOf(token.type)
        );

        // 其他的都当字符处理
        if (arg.length && typeof arg[arg.length - 1] === 'string') {
          arg[arg.length - 1] += token.raw || token.value;
        } else {
          arg.push(token.raw || token.value);
        }
        next();
      }
    }
    if (arg.length && typeof arg[arg.length - 1] === 'string') {
      arg[arg.length - 1] = arg[arg.length - 1].replace(/\s+$/, '');
      if (!arg[arg.length - 1]) {
        arg.pop();
      }
    }
    return arg;
  }

  function complexExpression(): ASTNodeOrNull {
    let ast = expression();

    const filters: Array<any> = [];
    while (token.type === TokenName[TokenEnum.OpenFilter]) {
      next();

      skipWhiteSpaceChar();
      const name = assert(identifier());
      const fnName = name.name;
      const args = [];

      skipWhiteSpaceChar();
      while (matchPunctuator(':')) {
        next();
        skipWhiteSpaceChar();

        let argContents: any = collectFilterArg();
        if (argContents.length === 1) {
          argContents = argContents[0];
        } else if (!argContents.length) {
          argContents = '';
        }

        args.push(
          Array.isArray(argContents)
            ? {
                type: 'mixed',
                body: argContents
              }
            : argContents
        );
      }
      filters.push({
        name: fnName,
        args
      });
    }

    if (filters.length) {
      ast = {
        type: 'filter',
        input: ast,
        filters,
        start: ast!.start,
        end: filters[filters.length - 1].end
      };
    }

    return ast;
  }

  function arrowFunction(): ASTNodeOrNull {
    let ast: any = argList() || variable();
    let args: Array<any> = [];
    let start: Position;

    if (ast?.type === 'variable') {
      args = [ast];
      start = ast.start;
    } else if (ast?.type === 'arg-list') {
      start = ast.start;
      args = ast.body;
    }

    if (Array.isArray(args) && matchPunctuator('=')) {
      next();
      if (matchPunctuator('>')) {
        next();
        const body = assert(expression());
        return {
          type: 'anonymous_function',
          args: args,
          return: body,
          start: start!,
          end: body.end
        };
      } else {
        back();
      }
    }

    return ast;
  }

  function conditionalExpression(): ASTNodeOrNull {
    const ast = logicalOrExpression();

    if (!ast) {
      return null;
    }

    if (matchPunctuator('?')) {
      next();
      let consequent = assignmentExpression();
      assert(consequent);
      assert(matchPunctuator(':'));

      next();
      let alternate = assignmentExpression();
      assert(alternate);

      return {
        type: 'conditional',
        test: ast,
        consequent: consequent,
        alternate: alternate,
        start: ast.start,
        end: alternate!.end
      };
    }

    return ast;
  }

  function binaryExpressionParser(
    type: string,
    operator: string,
    parseFunction: () => any,
    rightParseFunction = parseFunction,
    leftKey = 'left',
    rightKey = 'right'
  ) {
    let ast = parseFunction();
    if (!ast) {
      return null;
    }

    if (matchPunctuator(operator)) {
      while (matchPunctuator(operator)) {
        next();
        const right = assert(rightParseFunction());

        ast = {
          type: type,
          op: operator,
          [leftKey]: ast,
          [rightKey]: right,
          start: ast.start,
          end: right.end
        };
      }
    }

    return ast;
  }

  function logicalOrExpression(): ASTNodeOrNull {
    return binaryExpressionParser('or', '||', logicalAndExpression);
  }

  function logicalAndExpression(): ASTNodeOrNull {
    return binaryExpressionParser('and', '&&', bitwiseOrExpression);
  }

  function bitwiseOrExpression(): ASTNodeOrNull {
    return binaryExpressionParser('binary', '|', bitwiseXOrExpression);
  }

  function bitwiseXOrExpression(): ASTNodeOrNull {
    return binaryExpressionParser('binary', '^', bitwiseAndExpression);
  }

  function bitwiseAndExpression(): ASTNodeOrNull {
    return binaryExpressionParser('binary', '&', equalityExpression);
  }

  function equalityExpression(): ASTNodeOrNull {
    return binaryExpressionParser('eq', '==', () =>
      binaryExpressionParser('ne', '!=', () =>
        binaryExpressionParser('streq', '===', () =>
          binaryExpressionParser('strneq', '!==', relationalExpression)
        )
      )
    );
  }

  function relationalExpression(): ASTNodeOrNull {
    return binaryExpressionParser('lt', '<', () =>
      binaryExpressionParser('gt', '>', () =>
        binaryExpressionParser('le', '<=', () =>
          binaryExpressionParser('ge', '>=', shiftExpression)
        )
      )
    );
  }

  function shiftExpression(): ASTNodeOrNull {
    return binaryExpressionParser('shift', '<<', () =>
      binaryExpressionParser('shift', '>>', () =>
        binaryExpressionParser('shift', '>>>', additiveExpression)
      )
    );
  }

  function additiveExpression(): ASTNodeOrNull {
    return binaryExpressionParser('add', '+', () =>
      binaryExpressionParser('minus', '-', multiplicativeExpression)
    );
  }

  function multiplicativeExpression(): ASTNodeOrNull {
    return binaryExpressionParser('multiply', '*', () =>
      binaryExpressionParser('divide', '/', () =>
        binaryExpressionParser('remainder', '%', powerExpression)
      )
    );
  }

  function powerExpression(): ASTNodeOrNull {
    return binaryExpressionParser('power', '**', unaryExpression);
  }

  function unaryExpression(): ASTNodeOrNull {
    const unaryOperators = ['+', '-', '~', '!'];
    const stack: Array<any> = [];
    while (matchPunctuator(unaryOperators)) {
      stack.push(token);
      next();
    }
    let ast: any = postfixExpression();
    assert(!stack.length || ast);
    while (stack.length) {
      const op = stack.pop();

      ast = {
        type: 'unary',
        op: op.value,
        value: ast,
        start: op.start,
        end: op.end
      };
    }
    return ast;
  }

  function postfixExpression(
    parseFunction: () => any = leftHandSideExpression
  ): ASTNodeOrNull {
    let ast = parseFunction();
    if (!ast) {
      return null;
    }

    while (matchPunctuator('[') || matchPunctuator('.')) {
      const isDot = matchPunctuator('.');
      next();
      const right = assert(
        isDot ? identifier() || numberLiteral() || rawScript() : expression()
      );

      if (!isDot) {
        assert(matchPunctuator(']'));
        next();
      }

      ast = {
        type: 'getter',
        host: ast,
        key: right,
        start: ast.start,
        end: right.end
      };
    }

    return ast;
  }

  function leftHandSideExpression(): ASTNodeOrNull {
    return functionCall() || arrowFunction() || primaryExpression();
  }

  function varibleKey(allowVariable = false, inObject = false): ASTNodeOrNull {
    return (
      (allowVariable ? variable() : identifier()) ||
      stringLiteral() ||
      numberLiteral() ||
      (inObject ? objectTemplateKey() : template())
    );
  }

  function objectTemplateKey(): ASTNodeOrNull {
    if (matchPunctuator('[')) {
      next();
      const key = assert(template());
      assert(matchPunctuator(']'));
      next();
      return key;
    }
    return null;
  }

  function stringLiteral(): ASTNodeOrNull {
    if (token.type === TokenName[TokenEnum.StringLiteral]) {
      const cToken = token;
      next();
      return {
        type: 'string',
        value: cToken.value,
        start: cToken.start,
        end: cToken.end
      };
    }
    return null;
  }

  function numberLiteral(): ASTNodeOrNull {
    if (token.type === TokenName[TokenEnum.NumericLiteral]) {
      const value = token.value;
      const cToken = token;
      next();
      return {
        type: 'literal',
        value: value,
        start: cToken.start,
        end: cToken.end
      };
    }

    return null;
  }

  function template(): ASTNodeOrNull {
    if (matchPunctuator('`')) {
      const start = token;
      let end = start;
      next();
      let state = tempalteStates.START;
      const ast: ASTNode = {
        type: 'template',
        body: [],
        start: start.start,
        end: start.end
      };
      while (true) {
        if (state === tempalteStates.SCRIPTING) {
          const exp = assert(expression());
          ast.body.push(exp);
          assert(token.type === TokenName[TokenEnum.TemplateRightBrace]);
          next();
          state = tempalteStates.START;
        } else {
          if (matchPunctuator('`')) {
            end = token;
            next();
            break;
          } else if (token.type === TokenName[TokenEnum.TemplateLeftBrace]) {
            next();
            state = tempalteStates.SCRIPTING;
          } else if (token.type === TokenName[TokenEnum.TemplateRaw]) {
            ast.body.push({
              type: 'template_raw',
              value: token.value,
              start: token.start,
              end: token.end
            });
            next();
          } else {
            fatal();
          }
        }
      }

      ast.end = end.end;
      return ast;
    }
    return null;
  }

  function identifier(): ASTNodeOrNull {
    if (token.type === TokenName[TokenEnum.Identifier]) {
      const cToken = token;
      next();
      return {
        type: 'identifier',
        name: cToken.value,
        start: cToken.start,
        end: cToken.end
      };
    }
    return null;
  }

  function primaryExpression(): ASTNodeOrNull {
    return (
      variable() ||
      literal() ||
      numberLiteral() ||
      stringLiteral() ||
      template() ||
      arrayLiteral() ||
      objectLiteral() ||
      (() => {
        const ast = expressionList();

        if (ast?.body.length === 1) {
          return ast.body[0];
        }

        return ast;
      })() ||
      rawScript()
    );
  }

  function literal(): ASTNodeOrNull {
    if (
      token.type === TokenName[TokenEnum.Literal] ||
      token.type === TokenName[TokenEnum.BooleanLiteral]
    ) {
      const value = token.value;
      const cToken = token;
      next();
      return {
        type: 'literal',
        value: value,
        start: cToken.start,
        end: cToken.end
      };
    }

    return null;
  }

  function functionCall(): ASTNodeOrNull {
    if (token.type === TokenName[TokenEnum.Identifier]) {
      const id = token;
      next();
      if (matchPunctuator('(')) {
        const argList = expressionList();
        assert(argList);
        return {
          type: 'func_call',
          identifier: id.value,
          args: argList?.body,
          start: id.start,
          end: argList!.end
        };
      } else {
        back();
      }
    }
    return null;
  }

  function arrayLiteral(): ASTNodeOrNull {
    if (matchPunctuator('[')) {
      const argList = expressionList('[', ']');
      assert(argList);
      return {
        type: 'array',
        members: argList?.body,
        start: argList!.start,
        end: argList!.end
      };
    }
    return null;
  }

  function expressionList(startOP = '(', endOp = ')'): ASTNodeOrNull {
    if (matchPunctuator(startOP)) {
      const start = token;
      let end: Token;
      next();
      const args: Array<any> = [];
      let state = argListStates.START;

      while (true) {
        if (state === argListStates.COMMA || !matchPunctuator(endOp)) {
          const arg = assert(expression());
          args.push(arg);
          state = argListStates.START;

          if (matchPunctuator(',')) {
            next();
            state = argListStates.COMMA;
          }
        } else if (matchPunctuator(endOp)) {
          end = token;
          next();
          break;
        }
      }
      return {
        type: 'expression-list',
        body: args,
        start: start.start,
        end: end!.end
      };
    }
    return null;
  }

  function argList(startOP = '(', endOp = ')'): ASTNodeOrNull {
    let count = 0;
    let rollback = () => {
      while (count-- > 0) {
        back();
      }
      return null;
    };
    if (matchPunctuator(startOP)) {
      const start = token;
      let end: Token = start;
      next();
      count++;
      const args: Array<any> = [];
      let state = argListStates.START;

      while (!matchPunctuator(endOp)) {
        if (state === argListStates.COMMA || state === argListStates.START) {
          const arg = variable(false);

          if (!arg) {
            return rollback();
          }

          count++;
          args.push(arg);
          state = argListStates.SET;
        } else if (state === argListStates.SET && matchPunctuator(',')) {
          next();
          count++;
          state = argListStates.COMMA;
        } else {
          return rollback();
        }
      }

      if (matchPunctuator(endOp)) {
        end = token;
        next();
        return {
          type: 'arg-list',
          body: args,
          start: start.start,
          end: end.end
        };
      } else {
        return rollback();
      }
    }
    return null;
  }

  function objectLiteral(): ASTNodeOrNull {
    if (matchPunctuator('{')) {
      const start = token;
      let end = start;
      next();
      let ast: ASTNode = {
        type: 'object',
        members: [],
        start: start.start,
        end: start.end
      };
      let state = objectStates.START;
      let key: any, value: any;
      while (true) {
        if (state === objectStates.KEY) {
          assert(matchPunctuator(':'));
          next();
          state = objectStates.COLON;
        } else if (state === objectStates.COLON) {
          value = assert(expression());
          ast.members.push({
            key,
            value
          });
          state = objectStates.VALUE;
        } else if (state === objectStates.VALUE) {
          if (matchPunctuator(',')) {
            next();
            state = objectStates.COMMA;
          } else if (matchPunctuator('}')) {
            end = token;
            next();
            break;
          } else {
            fatal();
          }
        } else {
          if (state != objectStates.COMMA && matchPunctuator('}')) {
            end = token;
            next();
            break;
          }

          key = assert(varibleKey(false, true));
          state = objectStates.KEY;
        }
      }

      ast.end = end.end;
      return ast;
    }
    return null;
  }

  function assignmentExpression(): ASTNodeOrNull {
    return conditionalExpression();
  }

  function contents(): ASTNodeOrNull {
    const node: ASTNode = {
      type: 'document',
      body: [],
      start: token.start,
      end: token.end
    };
    while (token.type !== TokenName[TokenEnum.EOF]) {
      const ast = raw() || rawScript() || oldVariable();

      if (!ast) {
        break;
      }
      node.body.push(ast);
    }
    if (node.body.length) {
      node.end = node.body[node.body.length - 1].end;
    }
    return node;
  }

  function raw(): ASTNodeOrNull {
    if (token.type !== TokenName[TokenEnum.RAW]) {
      return null;
    }

    const cToken = token;
    next();
    return {
      type: 'raw',
      value: cToken.value,
      start: cToken.start,
      end: cToken.end
    };
  }

  function rawScript(): ASTNodeOrNull {
    if (token.type !== TokenName[TokenEnum.OpenScript]) {
      return null;
    }

    const start = token;
    let end = start;
    next();
    const exp = assert(complexExpression());
    assert(token.type === TokenName[TokenEnum.CloseScript]);
    end = token;
    next();

    return {
      type: 'script',
      body: exp,
      start: start.start,
      end: end.end
    };
  }

  function variable(allowNameSpace = true): ASTNodeOrNull {
    if (token.type === TokenName[TokenEnum.Identifier]) {
      const cToken = token;
      next();

      if (
        allowNameSpace &&
        matchPunctuator(':') &&
        ~variableNamespaces.indexOf(cToken.value)
      ) {
        next();
        const body = assert(postfixExpression());
        return {
          type: 'ns-variable',
          namespace: cToken.value,
          body,
          start: cToken.start,
          end: body.end
        };
      }

      return {
        type: 'variable',
        name: cToken.value,
        start: cToken.start,
        end: cToken.end
      };
    } else if (matchPunctuator('&')) {
      const v = token;
      next();
      return {
        type: 'variable',
        name: '&',
        start: v.start,
        end: v.end
      };
    }
    return null;
  }

  function oldVariable(): ASTNodeOrNull {
    if (token.type !== TokenName[TokenEnum.Variable]) {
      return null;
    }
    const prevToken = token;
    next();
    return {
      type: 'script',
      body: prevToken.value.split('.').reduce((prev: any, key: string) => {
        return prev
          ? {
              type: 'getter',
              host: prev,
              key,
              start: prevToken.start,
              end: prevToken.end
            }
          : {
              type: 'variable',
              name: key,
              start: prevToken.start,
              end: prevToken.end
            };
      }, null),
      start: prevToken.start,
      end: prevToken.end
    };
  }

  next();
  const ast = options?.variableMode
    ? postfixExpression(variable)
    : options?.evalMode
    ? expression()
    : contents();

  assert(token!?.type === TokenName[TokenEnum.EOF]);

  return ast!;
}
