/**
 * @file resize-sensor.js.
 * @author fex
 */

type EventType = 'both' | 'width' | 'height';
class EventQueue {
  q: Array<{
    fn: Function;
    type: EventType;
  }> = [];

  add(cb: Function, type: EventType = 'both') {
    this.q.push({
      fn: cb,
      type
    });
  }

  call(type: EventType, ...args: any[]) {
    this.q.forEach(item => {
      if (item.type === type || item.type === 'both' || type === 'both') {
        item.fn.apply(null, args);
      }
    });
  }
}

export function getComputedStyle(element: HTMLElement, prop: string) {
  if ((element as any).currentStyle) {
    return (element as any).currentStyle[prop];
  } else if (window.getComputedStyle) {
    const style = window.getComputedStyle(element, undefined);
    return style ? style.getPropertyValue(prop) : undefined;
  } else {
    return element.style[prop as any];
  }
}

function attachResizeEvent(
  element: HTMLElement,
  resized: () => void,
  type: EventType = 'both'
) {
  if (!element) {
    return;
  }
  if (!(element as any).resizedAttached) {
    (element as any).resizedAttached = new EventQueue();
    (element as any).resizedAttached.add(resized, type);
  } else if ((element as any).resizedAttached) {
    (element as any).resizedAttached.add(resized, type);
    return;
  }

  const resizeSensor = ((element as any).resizeSensor =
    document.createElement('div'));
  resizeSensor.className = 'resize-sensor';
  let style =
    'position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: scroll; z-index: -1; visibility: hidden;';
  let styleChild = 'position: absolute; left: 0; top: 0;';

  resizeSensor.style.cssText = style;
  resizeSensor.innerHTML = `
  <div class="resize-sensor-expand" style="${style}">
    <div style="${styleChild}"></div>
  </div>
  <div class="resize-sensor-shrink" style="${style}">
    <div style="${styleChild} width: 200%; height: 200%"></div>
  </div>
  <div class="resize-sensor-appear" style="${style}animation-name: apearSensor; animation-duration: 0.2s;"></div>`;
  // 要定义 resizeSensor 这个动画，靠这个监听出现。
  element.appendChild(resizeSensor);
  (element as any).hasInlineStyle = element.hasAttribute('style');
  const position = ((element as any).originPosition = getComputedStyle(
    element,
    'position'
  ));
  if (!~['fixed', 'absolute'].indexOf(position)) {
    element.style.position = 'relative';
  }

  const expand = resizeSensor.children[0] as HTMLElement;
  const expandChild = expand.children[0] as HTMLElement;
  const shrink = resizeSensor.children[1] as HTMLElement;
  // let shrinkChild = shrink.children[0] as HTMLElement;
  const appear = resizeSensor.children[2] as HTMLElement;

  let lastWidth: number, lastHeight: number;

  const reset = function () {
    expandChild.style.width = expand.offsetWidth + 10 + 'px';
    expandChild.style.height = expand.offsetHeight + 10 + 'px';
    expand.scrollLeft = expand.scrollWidth;
    expand.scrollTop = expand.scrollHeight;
    shrink.scrollLeft = shrink.scrollWidth;
    shrink.scrollTop = shrink.scrollHeight;
    lastWidth = element.offsetWidth;
    lastHeight = element.offsetHeight;
  };

  const appeared = function () {
    reset();

    // 如果初始是隐藏状态，首次显示也触发resize事件。
    if (isHidden) {
      changed();
      isHidden = false;
    }
  };

  reset();

  let changed = function (type: EventType = 'both') {
    if ((element as any).resizedAttached) {
      (element as any).resizedAttached.call(type);
    }
  };

  let addEvent = function (el: HTMLElement, name: string, cb: Function) {
    if ((el as any).attachEvent) {
      (el as any).attachEvent('on' + name, cb);
    } else {
      el.addEventListener(name, cb as any);
    }
  };

  let removeEvent = function (el: HTMLElement, name: string, cb: Function) {
    if ((el as any).detachEvent) {
      (el as any).detachEvent('on' + name, cb);
    } else {
      el.removeEventListener(name, cb as any);
    }
  };

  let onScroll = function (e: Event) {
    const widthChanged = element.offsetWidth != lastWidth;
    const heightChanged = element.offsetHeight != lastHeight;
    if (widthChanged || heightChanged) {
      changed(
        widthChanged && heightChanged
          ? 'both'
          : widthChanged
          ? 'width'
          : 'height'
      );
    }
    reset();
  };

  addEvent(expand, 'scroll', onScroll);
  addEvent(shrink, 'scroll', onScroll);
  addEvent(appear, 'animationstart', appeared);
  let isHidden = !expand.offsetWidth;

  return () => {
    removeEvent(expand, 'scroll', onScroll);
    removeEvent(shrink, 'scroll', onScroll);
    removeEvent(appear, 'animationstart', appeared);
  };
}

function detach(element: HTMLElement) {
  if ((element as any).resizeSensor) {
    if ((element as any).hasInlineStyle) {
      element.style.position = (element as any).originPosition;
    } else {
      element.removeAttribute('style');
    }
    try {
      element.removeChild((element as any).resizeSensor);
    } catch (e) {}
    delete (element as any).resizeSensor;
    delete (element as any).resizedAttached;
    delete (element as any).hasInlineStyle;
    delete (element as any).originPosition;
  }
}

export function appearSensor(
  element: HTMLElement,
  callback: () => void,
  once: boolean = false
) {
  if (once) {
    callback = ((original: () => void) => {
      return () => {
        original();
        dispose();
      };
    })(callback);
  }

  element.addEventListener('animationstart', callback);
  let originalAnimationName = element.style.animationName;
  let originalAnimationDuration = element.style.animationDuration;
  element.style.cssText =
    'animation-name: apearSensor; animation-duration: 0.2s;';
  let dispose = () => {
    element.style.animationName = originalAnimationName;
    element.style.animationDuration = originalAnimationDuration;
    element.removeEventListener('animationstart', callback);
  };

  return dispose;
}

export function resizeSensorV2(
  element: HTMLElement,
  callback: () => void,
  once: boolean = false,
  type: EventType = 'both'
) {
  const rect = element.getBoundingClientRect();
  let originWidth = rect.width;
  let originHeight = rect.height;

  const observer = new ResizeObserver(function (entries) {
    if (once) {
      observer.disconnect();
    }
    const entry = entries[0];
    const cr = entry.contentRect;
    // 变化大于0.5px时才触发回调,允许一定的误差
    const widthChanged = Math.abs(cr.width - originWidth) > 0.5;
    const heightChanged = Math.abs(cr.height - originHeight) > 0.5;

    if (widthChanged || heightChanged) {
      if (type === 'both') {
        callback();
      } else if (
        (type === 'width' && widthChanged) ||
        (type === 'height' && heightChanged)
      ) {
        callback();
      }
      originWidth = cr.width;
      originHeight = cr.height;
    }
  });
  observer.observe(element);
  return () => {
    observer.disconnect();
  };
}

export function resizeSensor(
  element: HTMLElement,
  callback: () => void,
  once: boolean = false,
  type: EventType = 'both',
  triggerOnAppear: boolean = false
): () => void {
  if (!element) {
    return () => {};
  }

  // 优先用 ResizeObserver
  if (typeof ResizeObserver !== 'undefined') {
    const disposes = [
      resizeSensorV2(element, callback, once, type),
      triggerOnAppear ? appearSensor(element, callback, true) : undefined
    ];
    return () => {
      disposes.forEach(dispose => dispose?.());
    };
  }

  // 不支持 ResizeObserver 的话，用 polyfill
  let disposeEvent: (() => void) | undefined = undefined;

  if (once) {
    disposeEvent = attachResizeEvent(
      element,
      function (this: any) {
        callback.apply(this, arguments);
        disposeEvent?.();
        detach(element);
      },
      type
    );
    return () => {};
  }

  disposeEvent = attachResizeEvent(element, callback, type);
  let detached = false;

  return function () {
    if (detached) return;
    detached = true;
    disposeEvent?.();
    detach(element);
  };
}
