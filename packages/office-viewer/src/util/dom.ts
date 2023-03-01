/**
 * dom 相关的操作
 */

export function setStyle(el: HTMLElement, style: Record<string, string>): void {
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
