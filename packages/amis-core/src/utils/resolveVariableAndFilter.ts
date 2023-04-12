import {Evaluator, parse} from 'amis-formula';

export const resolveVariableAndFilter = (
  path?: string,
  data: object = {},
  defaultFilter: string = '| html',
  fallbackValue = (value: any) => value,
  skipFormulaEvalHandler: boolean = false
) => {
  if (!path || typeof path !== 'string') {
    return undefined;
  }

  try {
    const ast = parse(path, {
      evalMode: false,
      allowFilter: true
    });

    const ret = new Evaluator(data, {
      defaultFilter
    }).evalute(ast);

    return ret == null && !~path.indexOf('default') && !~path.indexOf('now')
      ? fallbackValue(ret)
      : ret;
  } catch (e) {
    console.warn(e);
    if (e.name === 'FormulaEvalError') {
      // 无法解析时，执行handler自定义解析逻辑
      if (!skipFormulaEvalHandler) {
        return Evaluator.formulaEvalHandler?.(
          path,
          data,
          defaultFilter,
          fallbackValue
        );
      }
      // 跳过自定义解析逻辑，则直接抛异常
      throw e;
    }
    return undefined;
  }
};
