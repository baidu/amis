/**
 * 判断元素是否可见
 */
export function isVisible(elem: HTMLElement) {
  return (
    !!elem &&
    !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length)
  );
}
