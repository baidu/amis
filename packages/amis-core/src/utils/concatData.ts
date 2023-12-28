import {getVariable} from './getVariable';
import {setVariable} from './object';

/**
 * 合并两次数据，满足轮训时总合并数据的需求，比如日志接口，每次返回一部分，但是前端组件需要全部展示。
 *
 * @param data
 * @param origin
 * @param keys
 */
export function concatData(data: any, origin: any, keys: string | string[]) {
  keys = Array.isArray(keys)
    ? keys
    : keys
        .split(',')
        .map(item => item.trim())
        .filter(item => item);
  let newData = {...data};
  let modified = false;

  origin &&
    keys.forEach(key => {
      const prev = getVariable(origin, key);
      const next = getVariable(data, key);

      const args: any = [];
      typeof prev !== 'undefined' && args.push(prev);
      typeof next !== 'undefined' && args.push(next);

      modified = true;
      setVariable(newData, key, [].concat.apply([], args));
    });

  return modified ? newData : data;
}
