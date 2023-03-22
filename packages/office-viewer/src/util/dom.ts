/**
 * dom 相关的操作
 */

import {CSSStyle} from '../openxml/Style';

/**
 * 样式对象转成 css 文本
 */
export function styleToText(style: CSSStyle = {}): string {
  let text = '';
  for (const key in style) {
    const value = style[key];
    if (value != null && value !== '') {
      text += `${key}: ${value};\n`;
    }
  }
  return text;
}

/**
 * 设置元素样式
 */
export function applyStyle(el: HTMLElement, style?: CSSStyle): void {
  if (!style) {
    return;
  }
  for (const key in style) {
    const value = style[key];
    if (value != null && value !== '') {
      el.style.setProperty(key, style[key]);
    }
  }
}

/**
 * 创建元素
 */
export function createElement(tagName: string): HTMLElement {
  return document.createElement(tagName);
}

/**
 * 创建片段
 */
export function createDocumentFragment() {
  return document.createDocumentFragment();
}

/**
 * 添加子节点，会做一些判断避免报错
 */
export function appendChild(
  parent: HTMLElement,
  child?: HTMLElement | null
): void {
  if (parent && child) {
    parent.appendChild(child);
  }
}

/**
 * 添加注释节点
 */
export function appendComment(parent: HTMLElement, comment: string): void {
  parent.appendChild(document.createComment(comment));
}

/**
 * 添加 css 类
 */
export function addClassName(el: HTMLElement, className: string): void {
  if (el && className) {
    el.classList.add(className);
  }
}

/**
 * 批量添加 css 类
 */
export function addClassNames(el: HTMLElement, classNames: string[]): void {
  if (el && classNames) {
    el.classList.add(...classNames);
  }
}
