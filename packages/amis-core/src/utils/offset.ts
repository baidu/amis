/**
 * 修改自 https://github.com/react-bootstrap/dom-helpers/blob/master/src/offset.ts
 */

/**
 * Returns the offset of a given element, including top and left positions, width and height.
 *
 * @param node the element
 */
export function offset(node: HTMLElement) {
  const doc = node?.ownerDocument;

  let box = {top: 0, left: 0, height: 0, width: 0};
  const docElem = doc && doc.documentElement;

  // Make sure it's not a disconnected DOM node
  if (!docElem || !docElem.contains(node)) return box;

  if (node.getBoundingClientRect !== undefined)
    box = node.getBoundingClientRect();

  box = {
    top: box.top + docElem.scrollTop - (docElem.clientTop || 0),
    left: box.left + docElem.scrollLeft - (docElem.clientLeft || 0),
    width: box.width,
    height: box.height
  };

  return box;
}

export default offset;
