import {parse} from 'amis-formula';

export function isPureVariable(path?: any): path is string {
  if (typeof path === 'string') {
    try {
      const ast = parse(path);
      // 只有一个成员说明是纯表达式模式
      return ast.body.length === 1;
    } catch (err) {
      return false;
    }
  }

  return false;
}
