/**
 * 将 sdt 内容合并到上层节点，返回合并后的数组
 */

function flattenSdtArray(arr: Element[]): Element[] {
  const returnArray = arr.slice();
  let index = 0;
  // 如果 sdt 里还有 sdt 就需要递归
  let needRecursion = false;
  for (const child of arr) {
    const tagName = child.tagName;
    switch (tagName) {
      case 'w:smartTag':
      case 'w:customXml':
        const customXMLChildren = [].slice.call(child.children);
        returnArray.splice(index, 1, ...customXMLChildren);
        index = index + customXMLChildren.length;
        continue;

      case 'w:sdt':
        const sdtContent = child.getElementsByTagName('w:sdtContent').item(0);
        const childSdt = child.getElementsByTagName('w:sdt').item(0);
        if (childSdt) {
          needRecursion = true;
        }
        if (sdtContent) {
          const sdtContentChildren = [].slice.call(sdtContent.children);
          returnArray.splice(index, 1, ...sdtContentChildren);
          index = index + sdtContentChildren.length;
          continue;
        }

        break;
    }
    index = index + 1;
  }
  if (needRecursion) {
    return flattenSdtArray(returnArray);
  }

  return returnArray;
}

export function mergeSdt(element: Element | Document) {
  const arr = [].slice.call(element.children);
  return flattenSdtArray(arr);
}
