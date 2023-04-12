import {AsyncEvaluator, parse} from 'amis-formula';

export const resolveVariableAndFilterForAsync = async (
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

    const ret = await new AsyncEvaluator(data, {
      defaultFilter
    }).evalute(ast);

    return ret == null && !~path.indexOf('default') && !~path.indexOf('now')
      ? fallbackValue(ret)
      : ret;
  } catch (e) {
    console.warn(e);
    if (e.name === 'FormulaEvalError') {
      if (!skipFormulaEvalHandler) {
        // 无法解析时，执行handler自定义解析逻辑
        return AsyncEvaluator.formulaEvalHandler?.(
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
