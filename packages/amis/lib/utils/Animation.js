"use strict";
// 基本上都是从 sortable 那抄的，让拖拽切换有个动画，看起来更流畅。
// 用法是移动前先 animat.capture(container) 把移动前的位置信息记住
// 然后移动节点
// 然后 animate.animateAll(); 计算移动后的位置，然后马上通过 css transform 到原来的位置
// 然后开始动画到移动后的位置。
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimationManager = void 0;
var tslib_1 = require("tslib");
function userAgent(pattern) {
    if (typeof window !== 'undefined' && window.navigator) {
        return !!( /*@__PURE__*/navigator.userAgent.match(pattern));
    }
}
var IE11OrLess = userAgent(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i);
// const Edge = userAgent(/Edge/i);
// const FireFox = userAgent(/firefox/i);
// const Safari =
//   userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);
// const IOS = userAgent(/iP(ad|od|hone)/i);
// const ChromeForAndroid = userAgent(/chrome/i) && userAgent(/android/i);
var AnimationDurtation = 150;
var AnimationEasing = 'cubic-bezier(1, 0, 0, 1)';
var AnimationManager = /** @class */ (function () {
    function AnimationManager() {
        this.animating = false;
        this.states = [];
    }
    AnimationManager.prototype.capture = function (el) {
        var _this = this;
        // 清空，重复调用，旧的不管了
        this.states = [];
        var children = [].slice.call(el.children);
        children.forEach(function (child) {
            // 如果是 ghost
            if (child.classList.contains('is-ghost')) {
                return;
            }
            var rect = getRect(child);
            // 通常是隐藏节点
            if (!rect.width) {
                return;
            }
            var fromRect = (0, tslib_1.__assign)({}, rect);
            var state = {
                target: child,
                rect: rect
            };
            // 还在动画中
            if (child.thisAnimationDuration) {
                var childMatrix = matrix(child);
                if (childMatrix) {
                    fromRect.top -= childMatrix.f;
                    fromRect.left -= childMatrix.e;
                }
            }
            child.fromRect = fromRect;
            _this.states.push(state);
        });
    };
    AnimationManager.prototype.animateAll = function (callback) {
        var _this = this;
        this.animating = false;
        var animationTime = 0;
        this.states.forEach(function (state) {
            var time = 0, target = state.target, fromRect = target.fromRect, toRect = (0, tslib_1.__assign)({}, getRect(target)), prevFromRect = target.prevFromRect, prevToRect = target.prevToRect, animatingRect = state.rect, targetMatrix = matrix(target);
            if (targetMatrix) {
                // Compensate for current animation
                toRect.top -= targetMatrix.f;
                toRect.left -= targetMatrix.e;
            }
            target.toRect = toRect;
            if (target.thisAnimationDuration) {
                // Could also check if animatingRect is between fromRect and toRect
                if (isRectEqual(prevFromRect, toRect) &&
                    !isRectEqual(fromRect, toRect) &&
                    // Make sure animatingRect is on line between toRect & fromRect
                    (animatingRect.top - toRect.top) /
                        (animatingRect.left - toRect.left) ===
                        (fromRect.top - toRect.top) / (fromRect.left - toRect.left)) {
                    // If returning to same place as started from animation and on same axis
                    time = calculateRealTime(animatingRect, prevFromRect, prevToRect);
                }
            }
            // if fromRect != toRect: animate
            if (!isRectEqual(toRect, fromRect)) {
                target.prevFromRect = fromRect;
                target.prevToRect = toRect;
                if (!time) {
                    time = AnimationDurtation;
                }
                _this.animate(target, animatingRect, toRect, time);
            }
            if (time) {
                _this.animating = true;
                animationTime = Math.max(animationTime, time);
                clearTimeout(target.animationResetTimer);
                target.animationResetTimer = setTimeout(function () {
                    target.animationTime = 0;
                    target.prevFromRect = null;
                    target.fromRect = null;
                    target.prevToRect = null;
                    target.thisAnimationDuration = null;
                }, time);
                target.thisAnimationDuration = time;
            }
        });
        clearTimeout(this.animationCallbackId);
        if (!this.animating) {
            if (typeof callback === 'function')
                callback();
        }
        else {
            this.animationCallbackId = setTimeout(function () {
                _this.animating = false;
                if (typeof callback === 'function')
                    callback();
            }, animationTime);
        }
        this.states = [];
    };
    AnimationManager.prototype.animate = function (target, currentRect, toRect, duration) {
        if (duration) {
            var affectDisplay_1 = false;
            css(target, 'transition', '');
            css(target, 'transform', '');
            var translateX = currentRect.left - toRect.left, translateY = currentRect.top - toRect.top;
            target.animatingX = !!translateX;
            target.animatingY = !!translateY;
            css(target, 'transform', 'translate3d(' + translateX + 'px,' + translateY + 'px,0)');
            if (css(target, 'display') === 'inline') {
                affectDisplay_1 = true;
                css(target, 'display', 'inline-block');
            }
            target.offsetWidth; // repaint
            css(target, 'transition', 'transform ' +
                duration +
                'ms' +
                (AnimationEasing ? ' ' + AnimationEasing : ''));
            css(target, 'transform', 'translate3d(0,0,0)');
            typeof target.animated === 'number' &&
                clearTimeout(target.animated);
            target.animated = setTimeout(function () {
                css(target, 'transition', '');
                css(target, 'transform', '');
                affectDisplay_1 && css(target, 'display', '');
                target.animated = false;
                target.animatingX = false;
                target.animatingY = false;
            }, duration);
        }
    };
    return AnimationManager;
}());
exports.AnimationManager = AnimationManager;
function matrix(el) {
    var appliedTransforms = '';
    if (typeof el === 'string') {
        appliedTransforms = el;
    }
    else {
        var transform = css(el, 'transform');
        if (transform && transform !== 'none') {
            appliedTransforms = transform + ' ' + appliedTransforms;
        }
    }
    var matrixFn = window.DOMMatrix ||
        window.WebKitCSSMatrix ||
        window.CSSMatrix ||
        window.MSCSSMatrix;
    /*jshint -W056 */
    return matrixFn && new matrixFn(appliedTransforms);
}
function css(el, prop, val) {
    var style = el && el.style;
    if (style) {
        if (val === void 0) {
            if (document.defaultView && document.defaultView.getComputedStyle) {
                val = document.defaultView.getComputedStyle(el, '');
            }
            else if (el.currentStyle) {
                val = el.currentStyle;
            }
            return prop === void 0 ? val : val[prop];
        }
        else {
            if (!(prop in style) && prop.indexOf('webkit') === -1) {
                prop = '-webkit-' + prop;
            }
            style[prop] = val + (typeof val === 'string' ? '' : 'px');
        }
    }
}
function isRectEqual(rect1, rect2) {
    return (Math.round(rect1.top) === Math.round(rect2.top) &&
        Math.round(rect1.left) === Math.round(rect2.left) &&
        Math.round(rect1.height) === Math.round(rect2.height) &&
        Math.round(rect1.width) === Math.round(rect2.width));
}
function calculateRealTime(animatingRect, fromRect, toRect) {
    return ((Math.sqrt(Math.pow(fromRect.top - animatingRect.top, 2) +
        Math.pow(fromRect.left - animatingRect.left, 2)) /
        Math.sqrt(Math.pow(fromRect.top - toRect.top, 2) +
            Math.pow(fromRect.left - toRect.left, 2))) *
        AnimationDurtation);
}
function getWindowScrollingElement() {
    var scrollingElement = document.scrollingElement;
    if (scrollingElement) {
        return scrollingElement;
    }
    else {
        return document.documentElement;
    }
}
function getRect(el, relativeToContainingBlock, relativeToNonStaticParent, undoScale, container) {
    if (!el.getBoundingClientRect && el !== window)
        return;
    var elRect, top, left, bottom, right, height, width;
    if (el !== window && el !== getWindowScrollingElement()) {
        elRect = el.getBoundingClientRect();
        top = elRect.top;
        left = elRect.left;
        bottom = elRect.bottom;
        right = elRect.right;
        height = elRect.height;
        width = elRect.width;
    }
    else {
        top = 0;
        left = 0;
        bottom = window.innerHeight;
        right = window.innerWidth;
        height = window.innerHeight;
        width = window.innerWidth;
    }
    if ((relativeToContainingBlock || relativeToNonStaticParent) &&
        el !== window) {
        // Adjust for translate()
        container = container || el.parentNode;
        // solves #1123 (see: https://stackoverflow.com/a/37953806/6088312)
        // Not needed on <= IE11
        if (!IE11OrLess) {
            do {
                if (container &&
                    container.getBoundingClientRect &&
                    (css(container, 'transform') !== 'none' ||
                        (relativeToNonStaticParent &&
                            css(container, 'position') !== 'static'))) {
                    var containerRect = container.getBoundingClientRect();
                    // Set relative to edges of padding box of container
                    top -=
                        containerRect.top + parseInt(css(container, 'border-top-width'));
                    left -=
                        containerRect.left + parseInt(css(container, 'border-left-width'));
                    bottom = top + elRect.height;
                    right = left + elRect.width;
                    break;
                }
                /* jshint boss:true */
            } while ((container = container.parentNode));
        }
    }
    if (undoScale && el !== window) {
        // Adjust for scale()
        var elMatrix = matrix(container || el), scaleX = elMatrix && elMatrix.a, scaleY = elMatrix && elMatrix.d;
        if (elMatrix) {
            top /= scaleY;
            left /= scaleX;
            width /= scaleX;
            height /= scaleY;
            bottom = top + height;
            right = left + width;
        }
    }
    return {
        top: top,
        left: left,
        bottom: bottom,
        right: right,
        width: width,
        height: height
    };
}
exports.default = new AnimationManager();
//# sourceMappingURL=./utils/Animation.js.map
