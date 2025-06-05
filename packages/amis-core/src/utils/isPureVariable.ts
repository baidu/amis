import {memoryParse} from './memoryParse';

export function isPureVariable(path?: any): path is string {
  if (typeof path === 'string' && path.includes('$')) {
    try {
      const ast = memoryParse(path);
      // 只有一个成员说明是纯表达式模式
      return ast?.body.length === 1 && ast.body[0].type === 'script';
    } catch (err) {
      return false;
    }
  }

  return false;
}
