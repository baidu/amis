/**
 * 获取 rels 文件的相对路径，比如将 xl/worksheets/sheet1.xml 转换为 xl/worksheets/_rels/sheet1.xml.rels
 */

export function getRelPath(path: string) {
  const arr = path.split('/');
  arr[arr.length - 1] = '_rels/' + arr[arr.length - 1] + '.rels';
  return arr.join('/');
}
