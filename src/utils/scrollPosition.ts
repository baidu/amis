import position from './position';

export function getScrollParent(node: HTMLElement | null): HTMLElement {
  if (node == null) {
    return document.body;
  }

  if (node.scrollHeight > node.clientHeight) {
    return node;
  } else {
    return getScrollParent(node.parentElement);
  }
}

export function scrollPosition(dom: HTMLElement) {
  return position(dom, getScrollParent(dom));
}
