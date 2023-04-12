import {Evaluator, parse} from 'amis-formula';
import {getVariable} from './getVariable';

export function resolveVariable(
  path?: string,
  data: any = {},
  canAccessSuper?: boolean,
  skipFormulaEvalHandler: boolean = false
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
    // 如果是表达式函数未定义，则抛出错误
    if (e.name === 'FormulaEvalError') {
      if (!skipFormulaEvalHandler) {
        // 无法解析时，执行handler自定义解析逻辑
        return Evaluator.formulaEvalHandler?.(path, data);
      }
      // 跳过自定义解析逻辑，则直接抛异常
      throw e;
    }
    return undefined;
  }
}
