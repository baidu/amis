"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrollPosition = void 0;
var tslib_1 = require("tslib");
var position_1 = (0, tslib_1.__importDefault)(require("./position"));
function getScrollParent(element, includeHidden) {
    if (!element) {
        return document.body;
    }
    var style = getComputedStyle(element);
    var excludeStaticParent = style.position === 'absolute';
    var overflowRegex = includeHidden
        ? /(auto|scroll|hidden)/
        : /(auto|scroll)/;
    if (style.position === 'fixed')
        return document.body;
    for (var parent = element; (parent = parent.parentElement);) {
        style = getComputedStyle(parent);
        if (excludeStaticParent && style.position === 'static') {
            continue;
        }
        if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX))
            return parent;
    }
    return document.body;
}
function scrollPosition(dom) {
    return (0, position_1.default)(dom, getScrollParent(dom));
}
exports.scrollPosition = scrollPosition;
//# sourceMappingURL=./utils/scrollPosition.js.map
