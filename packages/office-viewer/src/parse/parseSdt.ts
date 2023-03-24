/**
 * 17.5.2 Structured Document Tags
 * 目前 sdt 的做法就是直接忽略，将它的 stdContent 子节点融入上级节点
 */

export function parseSdt(element: Element, arr: Element[]) {
  const sdtContent = element.getElementsByTagName('w:sdtContent').item(0);
  if (sdtContent) {
    arr.push(...[].slice.call(sdtContent.children));
  }
}
