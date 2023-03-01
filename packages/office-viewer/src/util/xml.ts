/**
 * xml 对象相关的辅助方法
 */

/**
 * xml 有时候子节点是数组，从上层获取时需要遍历
 * @param data
 * @param callback
 */

export function loopChildren(
  data: any,
  callback: (key: string, value: any) => void
) {
  for (const key in data) {
    if (key.startsWith('@_')) {
      continue;
    }
    const value = data[key];
    if (Array.isArray(value)) {
      for (const item of value) {
        callback(key, item);
      }
    } else {
      callback(key, value);
    }
  }
}
