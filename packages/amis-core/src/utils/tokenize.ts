import {Evaluator, parse, evaluateForAsync} from 'amis-formula';

const AST_CACHE: {[key: string]: any} = {};
export function memoParse(str: string, options?: any) {
  let key = `${str}${options?.evalMode ? '-eval' : ''}${
    options?.allowFilter ? '-filter' : ''
  }${options?.variableMode ? '-variable' : ''}`;

  const ast = AST_CACHE[key] || parse(str, options);
  AST_CACHE[key] = ast;
  return ast;
}

export const tokenize = (
  str: string,
  data: object,
  defaultFilter: string = '| html'
) => {
  if (!str || typeof str !== 'string') {
    return str;
  }

  try {
    const ast = memoParse(str, {
      evalMode: false,
      allowFilter: true
    });

    const result = new Evaluator(data, {
      defaultFilter
    }).evalute(ast);

    return `${result == null ? '' : result}`;
  } catch (e) {
    console.warn(e);
    return str;
  }
};
