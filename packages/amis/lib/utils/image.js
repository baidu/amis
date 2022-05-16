"use strict";
/**
 * @file image 相关的工具
 * @param url
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImageDimensions = exports.toDataURL = void 0;
var tslib_1 = require("tslib");
var memoize_1 = (0, tslib_1.__importDefault)(require("lodash/memoize"));
/**
 * 将 url 转成 dataurl
 * @param url
 */
exports.toDataURL = (0, memoize_1.default)(function (url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                resolve(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.onerror = reject;
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    });
});
/**
 * 根据 url 获取图片尺寸
 * @param url
 */
exports.getImageDimensions = (0, memoize_1.default)(function (url) {
    return new Promise(function (resolved, rejected) {
        var i = new Image();
        i.onerror = rejected;
        i.onload = function () {
            resolved({ width: i.width, height: i.height });
        };
        i.src = url;
    });
});
//# sourceMappingURL=./utils/image.js.map
