import {Evaluator, parse} from 'amis-formula';

export const tokenize = (
  str: string,
  data: object,
  defaultFilter: string = '| html'
) => {
  if (!str || typeof str !== 'string') {
    return str;
  }

  try {
    const ast = parse(str, {
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
