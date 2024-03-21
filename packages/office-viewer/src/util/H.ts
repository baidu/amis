/**
 * 创建 DOM 的小工具
 * @param tagName 标签名
 * @param attrs 属性
 * @returns 创建的 dom
 */

import {isObject} from './isObject';

function isNode(el: any) {
  return el && el.nodeName && el.nodeType;
}

export function H(
  tagName: string,
  attrs: Record<string, any>,
  ...children: any[]
) {
  const element = document.createElement(tagName);
  for (const key in attrs) {
    if (Object.prototype.hasOwnProperty.call(attrs, key)) {
      const value = attrs[key];
      if (key === 'className') {
        element.setAttribute('class', value);
      } else if (key === 'style') {
        if (isObject(value)) {
          for (const styleName in value) {
            const styleValue = value[styleName];
            element.style.setProperty(styleName, styleValue);
          }
        }
      } else if (key === 'innerText') {
        element.innerText = value;
      } else if (key === 'innerHTML') {
        element.innerHTML = value;
      } else if (key === 'parent') {
        value.appendChild(element);
      } else if (key.startsWith('on') && typeof value === 'function') {
        element.addEventListener(key.slice(2), value);
      } else {
        element.setAttribute(key, value);
      }
    }
  }

  for (const child of children) {
    if (isNode(child)) {
      element.appendChild(child);
    }
  }

  return element;
}
