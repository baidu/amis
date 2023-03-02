/**
 * dom 相关的操作
 */

import {CSSStyle} from '../parts/Style';

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

export function appendChild(parent: HTMLElement, child: HTMLElement): void {
  if (child) {
    parent.appendChild(child);
  }
}
