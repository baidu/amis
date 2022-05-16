"use strict";
/**
 * @file resize-sensor.js.
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.resizeSensor = exports.getComputedStyle = void 0;
var EventQueue = /** @class */ (function () {
    function EventQueue() {
        this.q = [];
    }
    EventQueue.prototype.add = function (cb) {
        this.q.push(cb);
    };
    EventQueue.prototype.call = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.q.forEach(function (fn) {
            fn.apply(void 0, args);
        });
    };
    return EventQueue;
}());
function getComputedStyle(element, prop) {
    if (element.currentStyle) {
        return element.currentStyle[prop];
    }
    else if (window.getComputedStyle) {
        var style = window.getComputedStyle(element, undefined);
        return style ? style.getPropertyValue(prop) : undefined;
    }
    else {
        return element.style[prop];
    }
}
exports.getComputedStyle = getComputedStyle;
function attachResizeEvent(element, resized) {
    if (!element) {
        return;
    }
    if (!element.resizedAttached) {
        element.resizedAttached = new EventQueue();
        element.resizedAttached.add(resized);
    }
    else if (element.resizedAttached) {
        element.resizedAttached.add(resized);
        return;
    }
    var resizeSensor = (element.resizeSensor =
        document.createElement('div'));
    resizeSensor.className = 'resize-sensor';
    var style = 'position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: scroll; z-index: -1; visibility: hidden;';
    var styleChild = 'position: absolute; left: 0; top: 0;';
    resizeSensor.style.cssText = style;
    resizeSensor.innerHTML = "\n  <div class=\"resize-sensor-expand\" style=\"".concat(style, "\">\n    <div style=\"").concat(styleChild, "\"></div>\n  </div>\n  <div class=\"resize-sensor-shrink\" style=\"").concat(style, "\">\n    <div style=\"").concat(styleChild, " width: 200%; height: 200%\"></div>\n  </div>\n  <div class=\"resize-sensor-appear\" style=\"").concat(style, "animation-name: apearSensor; animation-duration: 0.2s;\"></div>");
    // 要定义 resizeSensor 这个动画，靠这个监听出现。
    element.appendChild(resizeSensor);
    element.hasInlineStyle = element.hasAttribute('style');
    var position = (element.originPosition = getComputedStyle(element, 'position'));
    if (!~['fixed', 'absolute'].indexOf(position)) {
        element.style.position = 'relative';
    }
    var expand = resizeSensor.children[0];
    var expandChild = expand.children[0];
    var shrink = resizeSensor.children[1];
    // let shrinkChild = shrink.children[0] as HTMLElement;
    var appear = resizeSensor.children[2];
    var lastWidth, lastHeight;
    var reset = function () {
        expandChild.style.width = expand.offsetWidth + 10 + 'px';
        expandChild.style.height = expand.offsetHeight + 10 + 'px';
        expand.scrollLeft = expand.scrollWidth;
        expand.scrollTop = expand.scrollHeight;
        shrink.scrollLeft = shrink.scrollWidth;
        shrink.scrollTop = shrink.scrollHeight;
        lastWidth = element.offsetWidth;
        lastHeight = element.offsetHeight;
    };
    var appeared = function () {
        reset();
        // 如果初始是隐藏状态，首次显示也触发resize事件。
        if (isHidden) {
            changed();
            isHidden = false;
        }
    };
    reset();
    var changed = function () {
        if (element.resizedAttached) {
            element.resizedAttached.call();
        }
    };
    var addEvent = function (el, name, cb) {
        if (el.attachEvent) {
            el.attachEvent('on' + name, cb);
        }
        else {
            el.addEventListener(name, cb);
        }
    };
    var removeEvent = function (el, name, cb) {
        if (el.detachEvent) {
            el.detachEvent('on' + name, cb);
        }
        else {
            el.removeEventListener(name, cb);
        }
    };
    var onScroll = function (e) {
        if (element.offsetWidth != lastWidth ||
            element.offsetHeight != lastHeight) {
            changed();
        }
        reset();
    };
    addEvent(expand, 'scroll', onScroll);
    addEvent(shrink, 'scroll', onScroll);
    addEvent(appear, 'animationstart', appeared);
    var isHidden = !expand.offsetWidth;
    return function () {
        removeEvent(expand, 'scroll', onScroll);
        removeEvent(shrink, 'scroll', onScroll);
        removeEvent(appear, 'animationstart', appeared);
    };
}
function detach(element) {
    if (element.resizeSensor) {
        if (element.hasInlineStyle) {
            element.style.position = element.originPosition;
        }
        else {
            element.removeAttribute('style');
        }
        try {
            element.removeChild(element.resizeSensor);
        }
        catch (e) { }
        delete element.resizeSensor;
        delete element.resizedAttached;
        delete element.hasInlineStyle;
        delete element.originPosition;
    }
}
function resizeSensor(element, callback, once) {
    if (once === void 0) { once = false; }
    if (!element) {
        return function () { };
    }
    var disposeEvent = undefined;
    if (once) {
        disposeEvent = attachResizeEvent(element, function () {
            callback.apply(this, arguments);
            disposeEvent === null || disposeEvent === void 0 ? void 0 : disposeEvent();
            detach(element);
        });
        return;
    }
    disposeEvent = attachResizeEvent(element, callback);
    var detached = false;
    return function () {
        if (detached)
            return;
        detached = true;
        disposeEvent === null || disposeEvent === void 0 ? void 0 : disposeEvent();
        detach(element);
    };
}
exports.resizeSensor = resizeSensor;
//# sourceMappingURL=./utils/resize-sensor.js.map
