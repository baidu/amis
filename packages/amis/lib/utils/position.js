"use strict";
/**
 * 删减自 https://github.com/react-bootstrap/dom-helpers/blob/master/src/position.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var offset_1 = (0, tslib_1.__importDefault)(require("./offset"));
var offsetParent_1 = (0, tslib_1.__importDefault)(require("./offsetParent"));
var nodeName = function (node) {
    return node.nodeName && node.nodeName.toLowerCase();
};
/**
 * Returns the relative position of a given element.
 *
 * @param node the element
 * @param offsetParent the offset parent
 */
function position(node, offsetParent) {
    var parentOffset = { top: 0, left: 0 };
    var offset;
    // Fixed elements are offset from window (parentOffset = {top:0, left: 0},
    // because it is its only offset parent
    if (getComputedStyle(node).getPropertyValue('position') === 'fixed') {
        offset = node.getBoundingClientRect();
    }
    else {
        var parent = offsetParent || (0, offsetParent_1.default)(node);
        offset = (0, offset_1.default)(node);
        if (nodeName(parent) !== 'html')
            parentOffset = (0, offset_1.default)(parent);
        var borderTop = String(getComputedStyle(parent).getPropertyValue('border-top-width') || 0);
        parentOffset.top += parseInt(borderTop, 10) - parent.scrollTop || 0;
        var borderLeft = String(getComputedStyle(parent).getPropertyValue('border-left-width') || 0);
        parentOffset.left += parseInt(borderLeft, 10) - parent.scrollLeft || 0;
    }
    var marginTop = String(getComputedStyle(node).getPropertyValue('margin-top') || 0);
    var marginLeft = String(getComputedStyle(node).getPropertyValue('margin-left') || 0);
    // Subtract parent offsets and node margins
    return (0, tslib_1.__assign)((0, tslib_1.__assign)({}, offset), { top: offset.top - parentOffset.top - (parseInt(marginTop, 10) || 0), left: offset.left - parentOffset.left - (parseInt(marginLeft, 10) || 0) });
}
exports.default = position;
//# sourceMappingURL=./utils/position.js.map
