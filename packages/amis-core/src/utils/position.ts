/**
 * 删减自 https://github.com/react-bootstrap/dom-helpers/blob/master/src/position.ts
 */

import getOffset from './offset';
import getOffsetParent from './offsetParent';

const nodeName = (node: Element) =>
  node.nodeName && node.nodeName.toLowerCase();

/**
 * Returns the relative position of a given element.
 *
 * @param node the element
 * @param offsetParent the offset parent
 */
export function position(node: HTMLElement, offsetParent?: HTMLElement) {
  let parentOffset = {top: 0, left: 0};
  let offset;
  // Fixed elements are offset from window (parentOffset = {top:0, left: 0},
  // because it is its only offset parent
  if (getComputedStyle(node).getPropertyValue('position') === 'fixed') {
    offset = node.getBoundingClientRect();
  } else {
    const parent: HTMLElement = offsetParent || getOffsetParent(node);
    offset = getOffset(node);

    if (nodeName(parent) !== 'html') parentOffset = getOffset(parent);
    const borderTop = String(
      getComputedStyle(parent).getPropertyValue('border-top-width') || 0
    );
    parentOffset.top += parseInt(borderTop, 10) - parent.scrollTop || 0;

    const borderLeft = String(
      getComputedStyle(parent).getPropertyValue('border-left-width') || 0
    );
    parentOffset.left += parseInt(borderLeft, 10) - parent.scrollLeft || 0;
  }

  const marginTop = String(
    getComputedStyle(node).getPropertyValue('margin-top') || 0
  );
  const marginLeft = String(
    getComputedStyle(node).getPropertyValue('margin-left') || 0
  );
  // Subtract parent offsets and node margins
  return {
    ...offset,
    top: offset.top - parentOffset.top - (parseInt(marginTop, 10) || 0),
    left: offset.left - parentOffset.left - (parseInt(marginLeft, 10) || 0)
  };
}

export default position;
