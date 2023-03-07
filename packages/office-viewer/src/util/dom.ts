/**
 * dom 相关的操作
 */

import {CSSStyle} from '../openxml/Style';

export function setStyle(el: HTMLElement, style: CSSStyle): void {
  for (const key in style) {
    const value = style[key];
    if (value != null && value !== '') {
      el.style.setProperty(key, style[key]);
    }
  }
}

export function createElement(tagName: string): HTMLElement {
  return document.createElement(tagName);
}

export function createDocumentFragment() {
  return document.createDocumentFragment();
}

export function appendChild(
  parent: HTMLElement,
  child: HTMLElement | null
): void {
  if (child) {
    parent.appendChild(child);
  }
}
