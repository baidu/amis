import {parse} from 'amis-formula';
import type {ASTNode} from 'amis-formula';
import VisitedCache from './visitedCache';

// NOTE 缓存前40条表达式
const cache = new VisitedCache<string, ASTNode>(40);

export function memoryParse(
  input: string,
  options: {
    /**
     * 直接是运算表达式？还是从模板开始 ${} 里面才算运算表达式
     */
    evalMode?: boolean;

    /**
     * 只支持取变量。
     */
    variableMode?: boolean;

    /**
     * 是否允许 filter 语法，比如：
     *
     * ${abc | html}
     */
    allowFilter?: boolean;

    variableNamespaces?: Array<string>;
  } = {
    evalMode: false
  }
) {
  // 优化内存缓存释放，比如只缓存最高频的模版
  if (typeof input !== 'string') {
    return;
  }

  const key = input + JSON.stringify(options);

  // get cache result
  if (cache.has(key)) {
    return cache.get(key);
  }

  // run parse function and cache
  const ast = parse(input, options);

  cache.set(key, ast);

  return ast;
}
