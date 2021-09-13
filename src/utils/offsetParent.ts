/**
 * 删减自 https://github.com/react-bootstrap/dom-helpers/blob/master/src/offsetParent.ts
 */

const isHTMLElement = (e: Element | null): e is HTMLElement =>
  !!e && 'offsetParent' in e;

export default function offsetParent(node: HTMLElement): HTMLElement {
  const doc = node?.ownerDocument;
  let parent = node && node.offsetParent;

  while (
    isHTMLElement(parent) &&
    parent.nodeName !== 'HTML' &&
    getComputedStyle(parent).getPropertyValue('position') === 'static'
  ) {
    parent = parent.offsetParent;
  }

  return (parent || doc.documentElement) as HTMLElement;
}
