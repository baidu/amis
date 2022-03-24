import position from './position';

export function getScrollParent(element: HTMLElement | null): HTMLElement {
  if (!element) {
    return document.body;
  }

  const position = getComputedStyle(element).getPropertyValue('position');
  const excludeStatic = position === 'absolute';
  const ownerDoc = element.ownerDocument;

  if (position === 'fixed') return document.body;

  // @ts-ignore
  while ((element = element.parentNode) && element !== document.body) {
    const currentStyle = getComputedStyle(element);
    const isStatic =
      excludeStatic && currentStyle.getPropertyValue('position') === 'static';
    const style =
      (currentStyle.getPropertyValue('overflow') || '') +
      (currentStyle.getPropertyValue('overflow-y') || '') +
      currentStyle.getPropertyValue('overflow-x');

    if (isStatic) continue;

    if (/(auto|scroll)/.test(style)) {
      return element;
    }
  }

  return document.body;
}

export function scrollPosition(dom: HTMLElement) {
  return position(dom, getScrollParent(dom));
}
