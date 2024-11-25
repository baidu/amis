import isPlainObject from 'lodash/isPlainObject';

/**
 * 深度 splice 数组，同时返回新的对象，按需拷贝，没有副作用
 *
 * 第二个参数可以是一个函数，函数的返回值不为 false 时，表示找到了目标，函数的返回值为 number 时，表示偏移量
 *
 * @param target
 * @param path
 * @param numberToDelete
 * @param items
 * @returns
 */
export function deepSplice(
  target: any,
  path:
    | string
    | ((value: any, index: number | string, stack: Array<any>) => any),
  numberToDelete: number,
  provider?: ((origin: any) => any) | any,
  ...items: any[]
) {
  if (typeof path === 'function') {
    path = getPathByFunction(target, path);
  }

  if (!path) {
    return target;
  }

  const paths = (path as string).split('.');
  const last = paths.pop()!;
  let host = target;
  const stack: Array<{
    host: any;
    key: string | number | undefined;
  }> = [];
  for (let i = 0; i < paths.length; i++) {
    stack.unshift({
      key: paths[i]!,
      host: host
    });
    host = host[paths[i]];
  }

  if (!Array.isArray(host)) {
    throw new Error('deepSplice: target is not an array');
  }
  host = host.concat();

  if (provider && typeof provider === 'function') {
    host.splice.apply(
      host,
      [last, numberToDelete].concat(provider(host[last]))
    );
  } else {
    host.splice.apply(host, [last, numberToDelete, provider].concat(items));
  }

  return stack.reduce((prefix, {host, key}) => {
    host = Array.isArray(host) ? host.concat() : {...host};
    host[key!] = prefix;

    return host;
  }, host);
}

function getPathByFunction(
  target: any,
  fn: (value: any, index: number | string, stack: Array<any>) => any
): string {
  let paths: Array<string> = [];
  let resolved: boolean = false;
  let stack: Array<any> = [
    {
      path: '',
      key: '',
      stack: [],
      data: target
    }
  ];

  while (stack.length) {
    let cur = stack.shift()!;
    let data = cur.data;
    let path = cur.path;
    let nodeStack = cur.stack;
    let key = cur.key;

    const result = fn(data, key, nodeStack);

    if (result) {
      resolved = true;
      paths = path.split('.').filter((item: any) => item);

      // apply offset
      if (typeof result === 'number') {
        paths[paths.length - 1] = (
          parseInt(paths[paths.length - 1], 10) + result
        ).toString();
      }

      break;
    }

    if (Array.isArray(data)) {
      // 注意 Object.keys 返回的 key 是字符串，所以这里要转换一下
      data.forEach((prop, key) => {
        stack.push({
          path: `${path}.${key}`,
          key: key,
          stack: [data].concat(nodeStack),
          data: prop
        });
      });
    } else if (isPlainObject(data)) {
      Object.keys(data).forEach(key => {
        let prop = data[key];
        stack.push({
          path: `${path}.${key}`,
          key: key,
          stack: [data].concat(nodeStack),
          data: prop
        });
      });
    }
  }

  return resolved ? paths.join('.') : '';
}
