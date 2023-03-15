import {AsyncEvaluator, parse} from 'amis-formula';

export const resolveVariableAndFilterForAsync = async (
  path?: string,
  data: object = {},
  defaultFilter: string = '| html',
  fallbackValue = (value: any) => value
) => {
  if (!path || typeof path !== 'string') {
    return undefined;
  }

  try {
    const ast = parse(path, {
      evalMode: false,
      allowFilter: true
    });

    const ret = new AsyncEvaluator(data, {
      defaultFilter
    }).evalute(ast);

    return ret == null && !~path.indexOf('default') && !~path.indexOf('now')
      ? fallbackValue(ret)
      : ret;
  } catch (e) {
    console.warn(e);
    return undefined;
  }
};
