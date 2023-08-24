/**
 * 使用字符串语法来切片数组，参考了 python 中的语法
 * 支持的语法有：
 *   * 取单个值 1,2,3
 *   * 取范围 3:10
 *   * 组合 1,2,3:10
 *   * 范围是负数 :-1，代表除了最后一个元素的所有元素
 */
import {toJS, isObservableArray} from 'mobx';

export function arraySlice(array: any[], slice: string) {
  if (typeof slice !== 'string') {
    return array;
  }
  if (isObservableArray(array)) {
    array = toJS(array);
  }

  slice = slice.trim();
  if (!slice || !Array.isArray(array)) {
    return array;
  }
  const parts = slice.split(',');
  const ret: any[] = [];
  const arrayLength = array.length;
  if (!arrayLength) {
    return array;
  }
  for (const part of parts) {
    // 普通的场景
    if (part.indexOf(':') === -1) {
      const index = parseInt(part, 10);
      if (!isNaN(index) && index < arrayLength) {
        ret.push(array[index]);
      }
    } else {
      const [start, end] = part.split(':');
      let startIndex = parseInt(start || '0', 10);
      if (isNaN(startIndex) || startIndex < 0) {
        startIndex = 0;
      }
      // 大于就没意义了
      if (startIndex >= arrayLength) {
        continue;
      }
      let endIndex = parseInt(end, 10);
      if (isNaN(endIndex)) {
        endIndex = arrayLength;
      }
      // 负数就从后面开始取
      if (endIndex < 0) {
        endIndex = arrayLength + endIndex;
      }
      // 小于没有意义
      if (endIndex < startIndex) {
        continue;
      }
      if (endIndex > arrayLength) {
        endIndex = arrayLength;
      }

      ret.push(...array.slice(startIndex, endIndex));
    }
  }

  return ret;
}
