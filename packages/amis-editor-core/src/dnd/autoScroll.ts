/**
 * @file 拖拽过程中自动滚动容器
 */
import {getScrollParent} from 'amis-core';

export interface AutoScrollOptions {
  /** 滚动容器，默认为 document.documentElement */
  container?: HTMLElement;
}

export function getScrollableParent(
  element: HTMLElement,
  iframe?: HTMLElement
): HTMLElement {
  if (iframe) {
    // 如果是移动端编辑，它的滚动是在 iframe 外面的。
    return getScrollParent(iframe) as HTMLElement;
  }

  const scrollableParent = getScrollParent(element);
  return scrollableParent as HTMLElement;
}

export class AutoScroll {
  options: AutoScrollOptions;

  time: number;

  constructor(options: AutoScrollOptions = {}) {
    this.options = {
      container: document.documentElement,
      ...options
    };
    this.time = Date.now();
  }

  checkScroll(e: MouseEvent | DragEvent) {
    const {container} = this.options;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const thresholdX = Math.max(30, rect.width * 0.1);
    const thresholdY = Math.max(30, rect.height * 0.1);
    let mouseX = e.pageX;
    let mouseY = e.pageY;

    // 如果拖拽发生在 iframe 中，则需要计算 iframe 的偏移
    if ((e.target as HTMLElement).ownerDocument !== container.ownerDocument) {
      const iframe = (e.target as HTMLElement).ownerDocument.defaultView
        ?.frameElement;
      const iframeRect = iframe?.getBoundingClientRect();
      mouseX += iframeRect?.left ?? 0;
      mouseY += iframeRect?.top ?? 0;
    }

    if (mouseX < rect.left + thresholdX && container.scrollLeft > 0) {
      // 计算距离边界的比例，越近比例越大
      const distanceRatio = 1 - (mouseX - rect.left) / thresholdX;
      // 根据比例计算滚动距离，最小5，最大30
      const scrollAmount = Math.max(5, Math.round(30 * distanceRatio));
      container.scrollLeft -= scrollAmount;
    } else if (
      mouseX > rect.right - thresholdX &&
      container.scrollLeft < container.scrollWidth - container.clientWidth
    ) {
      // 计算距离边界的比例，越近比例越大
      const distanceRatio = 1 - (rect.right - mouseX) / thresholdX;
      // 根据比例计算滚动距离，最小5，最大30
      const scrollAmount = Math.max(5, Math.round(30 * distanceRatio));
      container.scrollLeft += scrollAmount;
    }

    if (mouseY < rect.top + thresholdY && container.scrollTop > 0) {
      // 计算距离边界的比例，越近比例越大
      const distanceRatio = 1 - (mouseY - rect.top) / thresholdY;
      // 根据比例计算滚动距离，最小5，最大30
      const scrollAmount = Math.max(5, Math.round(30 * distanceRatio));
      container.scrollTop -= scrollAmount;
    } else if (
      mouseY > rect.bottom - thresholdY &&
      container.scrollTop < container.scrollHeight - container.clientHeight
    ) {
      // 计算距离边界的比例，越近比例越大
      const distanceRatio = 1 - (rect.bottom - mouseY) / thresholdY;
      // 根据比例计算滚动距离，最小5，最大30
      const scrollAmount = Math.max(5, Math.round(30 * distanceRatio));
      container.scrollTop += scrollAmount;
    }
  }
}
