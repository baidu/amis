"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStyleNumber = exports.calculatePosition = exports.ownerDocument = exports.getContainer = void 0;
var tslib_1 = require("tslib");
var react_dom_1 = (0, tslib_1.__importDefault)(require("react-dom"));
var offset_1 = (0, tslib_1.__importDefault)(require("./offset"));
var position_1 = (0, tslib_1.__importDefault)(require("./position"));
function getContainer(container, defaultContainer) {
    container = typeof container === 'function' ? container() : container;
    return react_dom_1.default.findDOMNode(container) || defaultContainer;
}
exports.getContainer = getContainer;
function ownerDocument(componentOrElement) {
    var _a;
    return (((_a = react_dom_1.default.findDOMNode(componentOrElement)) === null || _a === void 0 ? void 0 : _a.ownerDocument) ||
        document);
}
exports.ownerDocument = ownerDocument;
function getContainerDimensions(containerNode) {
    var _a;
    var width, height, scroll;
    if (containerNode.tagName === 'BODY') {
        width = window.innerWidth;
        height = window.innerHeight;
        scroll =
            ownerDocument(containerNode).documentElement.scrollTop ||
                (containerNode === null || containerNode === void 0 ? void 0 : containerNode.scrollTop);
    }
    else {
        (_a = (0, offset_1.default)(containerNode), width = _a.width, height = _a.height);
        scroll = containerNode.scrollTop;
    }
    return { width: width, height: height, scroll: scroll };
}
function getTopDelta(top, overlayHeight, container, padding) {
    var containerDimensions = getContainerDimensions(container);
    var containerScroll = containerDimensions.scroll;
    var containerHeight = containerDimensions.height;
    var topEdgeOffset = top - padding - containerScroll;
    var bottomEdgeOffset = top + padding - containerScroll + overlayHeight;
    if (topEdgeOffset < 0) {
        return -topEdgeOffset;
    }
    else if (bottomEdgeOffset > containerHeight) {
        return containerHeight - bottomEdgeOffset;
    }
    else {
        return 0;
    }
}
function getLeftDelta(left, overlayWidth, container, padding) {
    var containerDimensions = getContainerDimensions(container);
    var containerWidth = containerDimensions.width;
    var leftEdgeOffset = left - padding;
    var rightEdgeOffset = left + padding + overlayWidth;
    if (leftEdgeOffset < 0) {
        return -leftEdgeOffset;
    }
    else if (rightEdgeOffset > containerWidth) {
        return containerWidth - rightEdgeOffset;
    }
    return 0;
}
function calculatePosition(placement, overlayNode, target, container, padding, customOffset) {
    if (padding === void 0) { padding = 0; }
    if (customOffset === void 0) { customOffset = [0, 0]; }
    var childOffset = container.tagName === 'BODY'
        ? (0, offset_1.default)(target)
        : (0, position_1.default)(target, container);
    var _a = (0, offset_1.default)(overlayNode), overlayHeight = _a.height, overlayWidth = _a.width;
    var clip = container.getBoundingClientRect();
    var clip2 = overlayNode.getBoundingClientRect();
    var scaleX = overlayNode.offsetWidth
        ? clip2.width / overlayNode.offsetWidth
        : 1;
    var scaleY = overlayNode.offsetHeight
        ? clip2.height / overlayNode.offsetHeight
        : 1;
    // auto 尝试四个方向对齐。
    placement =
        placement === 'auto'
            ? 'left-bottom-left-top right-bottom-right-top left-top-left-bottom right-top-right-bottom left-bottom-left-top'
            : placement;
    var positionLeft = 0, positionTop = 0, arrowOffsetLeft = '', arrowOffsetTop = '', activePlacement = placement;
    if (~placement.indexOf('-')) {
        var tests = placement.split(/\s+/);
        while (tests.length) {
            var current = (activePlacement = tests.shift());
            var _b = current.split('-'), atX = _b[0], atY = _b[1], myX = _b[2], myY = _b[3];
            myX = myX || atX;
            myY = myY || atY;
            positionLeft =
                atX === 'left'
                    ? childOffset.left
                    : atX === 'right'
                        ? childOffset.left + childOffset.width
                        : childOffset.left + childOffset.width / 2;
            positionTop =
                atY === 'top'
                    ? childOffset.top
                    : atY === 'bottom'
                        ? childOffset.top + childOffset.height
                        : childOffset.top + childOffset.height / 2;
            positionLeft -=
                myX === 'left' ? 0 : myX === 'right' ? overlayWidth : overlayWidth / 2;
            positionTop -=
                myY === 'top'
                    ? 0
                    : myY === 'bottom'
                        ? overlayHeight
                        : overlayHeight / 2;
            // 如果还有其他可选项，则做位置判断，是否在可视区域，不完全在则继续看其他定位情况。
            if (tests.length) {
                var transformed = {
                    x: clip.x + positionLeft / scaleX,
                    y: clip.y + positionTop / scaleY,
                    width: overlayWidth,
                    height: overlayHeight
                };
                if (transformed.x > 0 &&
                    transformed.x + transformed.width < window.innerWidth &&
                    transformed.y > 0 &&
                    transformed.y + transformed.height < window.innerHeight) {
                    break;
                }
            }
        }
        // todo arrow 位置支持
    }
    else if (placement === 'left' || placement === 'right') {
        // atX = placement;
        // atY = myY = 'center';
        // myX = placement === 'left' ? 'right' : 'left';
        if (placement === 'left') {
            positionLeft = childOffset.left - overlayWidth;
        }
        else {
            positionLeft = childOffset.left + childOffset.width;
        }
        positionTop = childOffset.top + (childOffset.height - overlayHeight) / 2;
        var topDelta = getTopDelta(positionTop, overlayHeight, container, padding);
        positionTop += topDelta;
        arrowOffsetTop = 50 * (1 - (2 * topDelta) / overlayHeight) + '%';
    }
    else if (placement === 'top' || placement === 'bottom') {
        // atY = placement;
        // atX = myX = 'center';
        // myY = placement === 'top' ? 'bottom': 'top';
        if (placement === 'top') {
            positionTop = childOffset.top - overlayHeight;
        }
        else {
            positionTop = childOffset.top + childOffset.height;
        }
        positionLeft = childOffset.left + (childOffset.width - overlayWidth) / 2;
        var leftDelta = getLeftDelta(positionLeft, overlayWidth, container, padding);
        positionLeft += leftDelta;
        arrowOffsetLeft = 50 * (1 - (2 * leftDelta) / overlayHeight) + '%';
    }
    else if (placement === 'center') {
        // atX = atY = myX = myY = 'center';
        positionLeft = childOffset.left + (childOffset.width - overlayWidth) / 2;
        positionTop = childOffset.top + (childOffset.height - overlayHeight) / 2;
        arrowOffsetLeft = arrowOffsetTop = void 0;
    }
    else {
        throw new Error("calcOverlayPosition(): No such placement of \"".concat(placement, "\" found."));
    }
    var _c = customOffset[0], offSetX = _c === void 0 ? 0 : _c, _d = customOffset[1], offSetY = _d === void 0 ? 0 : _d;
    return {
        positionLeft: (positionLeft + offSetX) / scaleX,
        positionTop: (positionTop + offSetY) / scaleY,
        arrowOffsetLeft: (arrowOffsetLeft + offSetX) / scaleX,
        arrowOffsetTop: (arrowOffsetTop + offSetY) / scaleY,
        activePlacement: activePlacement
    };
}
exports.calculatePosition = calculatePosition;
/**
 * 专门用来获取样式的像素值，默认返回 0
 */
function getStyleNumber(element, styleName) {
    if (!element) {
        return 0;
    }
    return (parseInt(getComputedStyle(element).getPropertyValue(styleName), 10) || 0);
}
exports.getStyleNumber = getStyleNumber;
//# sourceMappingURL=./utils/dom.js.map
