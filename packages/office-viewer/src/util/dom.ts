/**
 * dom 相关的操作
 */

import {CSSStyle} from '../openxml/Style';

export function styleToText(style: CSSStyle = {}) {
  let text = '';
  for (const key in style) {
    const value = style[key];
    if (value != null && value !== '') {
      text += `${key}: ${value};\n`;
    }
  }
  return text;
}

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

export function appendComment(parent: HTMLElement, comment: string): void {
  parent.appendChild(document.createComment(comment));
}

export function addClassName(el: HTMLElement, className: string): void {
  if (el && className) {
    el.classList.add(className);
  }
}

export function addClassNames(el: HTMLElement, classNames: string[]): void {
  if (el && classNames) {
    el.classList.add(...classNames);
  }
}
