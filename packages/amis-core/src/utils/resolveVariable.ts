import {Evaluator, parse} from 'amis-formula';
import {getVariable} from './getVariable';

export function resolveVariable(
  path?: string,
  data: any = {},
  canAccessSuper?: boolean
): any {
  if (path === '&' || path == '$$') {
    return data;
  } else if (!path || typeof path !== 'string') {
    return undefined;
  } else if (!~path.indexOf(':')) {
    // 简单用法直接用 getVariable
    return getVariable(
      data,
      path[0] === '$' ? path.substring(1) : path,
      canAccessSuper
    );
  }

  // window:xxx  ls:xxx.xxx
  // 带 namespace 的用公式
  // 主要是用公式会严格点，不能出现奇怪的变量名
  try {
    return new Evaluator(data).evalute(
      parse(path, {
        variableMode: true,
        allowFilter: false
      })
    );
  } catch (e) {
    return undefined;
  }
}
