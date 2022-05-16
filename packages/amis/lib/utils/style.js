"use strict";
/**
 * 处理样式相关的工具方法，不放 helper 里是为了避免循环依赖
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildStyle = void 0;
var tslib_1 = require("tslib");
var tpl_builtin_1 = require("./tpl-builtin");
var mapValues_1 = (0, tslib_1.__importDefault)(require("lodash/mapValues"));
var camelCase_1 = (0, tslib_1.__importDefault)(require("lodash/camelCase"));
function autoAddImageURL(image) {
    // 只支持单个的情况，并简单滤掉 linear-gradient 等情况
    if (typeof image === 'string' &&
        image.indexOf(',') === -1 &&
        image.indexOf('(') === -1) {
        return "url(\"".concat(image, "\")");
    }
    return image;
}
/**
 * 处理配置中的 style，主要做三件事：
 * 1. 变量解析
 * 2. 将 font-size 之类的错误写法转成 fontSize
 * 3. 针对 image 自动加 url
 */
function buildStyle(style, data) {
    if (!style) {
        return style;
    }
    var styleVar = typeof style === 'string'
        ? (0, tpl_builtin_1.resolveVariableAndFilter)(style, data, '| raw') || {}
        : (0, mapValues_1.default)(style, function (s) { return (0, tpl_builtin_1.resolveVariableAndFilter)(s, data, '| raw') || s; });
    Object.keys(styleVar).forEach(function (key) {
        if (key.indexOf('-') !== -1) {
            styleVar[(0, camelCase_1.default)(key)] = styleVar[key];
            delete styleVar[key];
        }
    });
    if (styleVar.backgroundImage) {
        styleVar.backgroundImage = autoAddImageURL(styleVar.backgroundImage);
    }
    if (styleVar.borderImage) {
        styleVar.borderImage = autoAddImageURL(styleVar.borderImage);
    }
    if (styleVar.listStyleImage) {
        styleVar.listStyleImage = autoAddImageURL(styleVar.listStyleImage);
    }
    return styleVar;
}
exports.buildStyle = buildStyle;
//# sourceMappingURL=./utils/style.js.map
