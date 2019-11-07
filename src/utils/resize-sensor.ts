/**
 * @file resize-sensor.js.
 * @author fex
 */
/* eslint-disable */

class EventQueue {
  q: Array<Function> = [];

  add(cb: Function) {
    this.q.push(cb);
  }

  call(...args: Array<any>) {
    this.q.forEach(fn => {
      fn(...args);
    });
  }
}

function getComputedStyle(element: HTMLElement, prop: string) {
  if ((element as any).currentStyle) {
    return (element as any).currentStyle[prop];
  } else if (window.getComputedStyle) {
    return window.getComputedStyle(element, undefined).getPropertyValue(prop);
  } else {
    return element.style[prop as any];
  }
}

function attachResizeEvent(element: HTMLElement, resized: Function) {
  if (!(element as any).resizedAttached) {
    (element as any).resizedAttached = new EventQueue();
    (element as any).resizedAttached.add(resized);
  } else if ((element as any).resizedAttached) {
    (element as any).resizedAttached.add(resized);
    return;
  }

  (element as any).resizeSensor = document.createElement('div');
  (element as any).resizeSensor.className = 'resize-sensor';
  let style =
    'position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: scroll; z-index: -1; visibility: hidden;';
  let styleChild = 'position: absolute; left: 0; top: 0;';

  (element as any).resizeSensor.style.cssText = style;
  (element as any).resizeSensor.innerHTML =
    '<div class="resize-sensor-expand" style="' +
    style +
    '">' +
    '<div style="' +
    styleChild +
    '"></div>' +
    '</div>' +
    '<div class="resize-sensor-shrink" style="' +
    style +
    '">' +
    '<div style="' +
    styleChild +
    ' width: 200%; height: 200%"></div>' +
    '</div>';
  element.appendChild((element as any).resizeSensor);

  if (!~['fixed', 'absolute'].indexOf(getComputedStyle(element, 'position'))) {
    element.style.position = 'relative';
  }

  let expand = (element as any).resizeSensor.childNodes[0];
  let expandChild = expand.childNodes[0];
  let shrink = (element as any).resizeSensor.childNodes[1];
  let shrinkChild = shrink.childNodes[0];

  let lastWidth: number, lastHeight: number;

  let reset = function() {
    expandChild.style.width = expand.offsetWidth + 10 + 'px';
    expandChild.style.height = expand.offsetHeight + 10 + 'px';
    expand.scrollLeft = expand.scrollWidth;
    expand.scrollTop = expand.scrollHeight;
    shrink.scrollLeft = shrink.scrollWidth;
    shrink.scrollTop = shrink.scrollHeight;
    lastWidth = element.offsetWidth;
    lastHeight = element.offsetHeight;
  };

  reset();

  let changed = function() {
    if ((element as any).resizedAttached) {
      (element as any).resizedAttached.call();
    }
  };

  let addEvent = function(el: HTMLElement, name: string, cb: Function) {
    if ((el as any).attachEvent) {
      (el as any).attachEvent('on' + name, cb);
    } else {
      el.addEventListener(name, cb as any);
    }
  };

  let onScroll = function() {
    if (
      element.offsetWidth != lastWidth ||
      element.offsetHeight != lastHeight
    ) {
      changed();
    }
    reset();
  };

  addEvent(expand, 'scroll', onScroll);
  addEvent(shrink, 'scroll', onScroll);
}

function detach(element: HTMLElement) {
  if ((element as any).resizeSensor) {
    try {
      element.removeChild((element as any).resizeSensor);
    } catch (e) {}
    delete (element as any).resizeSensor;
    delete (element as any).resizedAttached;
  }
}

export function resizeSensor(element: HTMLElement, callback: Function) {
  attachResizeEvent(element, callback);
  let detached = false;

  return function() {
    if (detached) return;
    detached = true;
    detach(element);
  };
}
