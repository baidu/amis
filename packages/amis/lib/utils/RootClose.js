"use strict";
/**
 * 兼容之前的 RootCloseWrapper 写法
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootClose = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var useRootClose_1 = (0, tslib_1.__importDefault)(require("react-overlays/useRootClose"));
var react_dom_1 = require("react-dom");
var RootClose = function (_a) {
    var children = _a.children, onRootClose = _a.onRootClose, props = (0, tslib_1.__rest)(_a, ["children", "onRootClose"]);
    var _b = (0, react_1.useState)(null), rootComponent = _b[0], attachRef = _b[1];
    var rootElement = (0, react_dom_1.findDOMNode)(rootComponent);
    (0, useRootClose_1.default)(rootElement, onRootClose, props);
    return typeof children === 'function' ? children(attachRef) : children;
};
exports.RootClose = RootClose;
//# sourceMappingURL=./utils/RootClose.js.map
