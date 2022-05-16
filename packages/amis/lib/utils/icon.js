"use strict";
/**
 * @file 图标支持的公共方法，主要是支持自动识别地址和 icon-font
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateIcon = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
/**
 * 判断字符串来生成 i 或 img
 * @param icon icon 设置
 * @param className 内部用的 className
 * @param classNameProp amis 配置里设置的 className
 */
var generateIcon = function (cx, icon, className, classNameProp) {
    if (react_1.default.isValidElement(icon)) {
        return icon;
    }
    var isURLIcon = (icon === null || icon === void 0 ? void 0 : icon.indexOf('.')) !== -1;
    return icon ? (isURLIcon ? (react_1.default.createElement("img", { className: cx(className, classNameProp), src: icon, key: icon })) : (react_1.default.createElement("i", { className: cx(className, icon, classNameProp), key: icon }))) : null;
};
exports.generateIcon = generateIcon;
//# sourceMappingURL=./utils/icon.js.map
