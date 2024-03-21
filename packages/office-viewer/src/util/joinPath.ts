/**
 * 合并多个路径，来自
 * https://stackoverflow.com/questions/29855098/is-there-a-built-in-javascript-function-similar-to-os-path-join
 * 目前都是当成目录，所以如果是文件需要加上 ..
 */

export function joinPath(...input: string[]) {
  let paths = input
    .filter(path => !!path) // Remove undefined | null | empty
    .join('/') //Join to string
    .replaceAll('\\', '/') // Replace from \ to /
    .split('/')
    .filter(path => !!path && path !== '.') // Remove empty in case a//b///c or ./a ./b
    .reduce((items: string[], item) => {
      item === '..' ? items.pop() : items.push(item);
      return items;
    }, []);
  if (input[0] && input[0].startsWith('/')) {
    paths.unshift('');
  }

  return paths.join('/') || (paths.length ? '/' : '.');
}
