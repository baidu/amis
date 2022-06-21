/**
 * @file 公式语法解析
 */

import {parse} from 'amis-formula';

function traverseAst(ast: any, iterator: (ast: any) => void) {
  if (!ast || !ast.type) {
    return;
  }

  iterator(ast);

  Object.keys(ast).forEach(key => {
    const value = ast[key];

    if (Array.isArray(value)) {
      value.forEach(child => traverseAst(child, iterator));
    } else {
      traverseAst(value, iterator);
    }
  });
}

// 缓存，用于提升性能
const COLLECT_EXPRESSION_CACHE: {[key: string]: Array<string>} = {};

// 提取表达式中有哪些变量
export function collectVariables(strOrAst: string | Object, execMode?: boolean): Array<string> {
  const variables: Array<string> = [];

  if (typeof strOrAst === 'string' && COLLECT_EXPRESSION_CACHE[strOrAst]) {
    return COLLECT_EXPRESSION_CACHE[strOrAst];
  }
  const ast =
    typeof strOrAst === 'string'
      ? parse(strOrAst, {
          evalMode: execMode ?? false
        })
      : strOrAst;

  traverseAst(ast, (item: any) => {
    if (item.type === 'variable') {
      variables.push(item.name);
    }
  });

  if (typeof strOrAst === 'string') {
    COLLECT_EXPRESSION_CACHE[strOrAst] = variables;
  }

  return variables;
}
