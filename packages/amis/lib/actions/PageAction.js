"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageRefreshAction = exports.PageGoAction = exports.PageGoBackAction = void 0;
var tslib_1 = require("tslib");
var Action_1 = require("./Action");
/**
 * 返回上个页面
 *
 * @export
 * @class PageGoBackAction
 * @implements {Action}
 */
var PageGoBackAction = /** @class */ (function () {
    function PageGoBackAction() {
    }
    PageGoBackAction.prototype.run = function (action, renderer, event) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                window.history.back();
                return [2 /*return*/];
            });
        });
    };
    return PageGoBackAction;
}());
exports.PageGoBackAction = PageGoBackAction;
/**
 * 到指定页面
 *
 * @export
 * @class PageGoAction
 * @implements {Action}
 */
var PageGoAction = /** @class */ (function () {
    function PageGoAction() {
    }
    PageGoAction.prototype.run = function (action, renderer, event) {
        var _a;
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_b) {
                window.history.go(((_a = action.args) === null || _a === void 0 ? void 0 : _a.delta) || 0);
                return [2 /*return*/];
            });
        });
    };
    return PageGoAction;
}());
exports.PageGoAction = PageGoAction;
/**
 * 浏览器刷新
 *
 * @export
 * @class PageRefreshAction
 * @implements {Action}
 */
var PageRefreshAction = /** @class */ (function () {
    function PageRefreshAction() {
    }
    PageRefreshAction.prototype.run = function (action, renderer, event) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                window.location.reload();
                return [2 /*return*/];
            });
        });
    };
    return PageRefreshAction;
}());
exports.PageRefreshAction = PageRefreshAction;
(0, Action_1.registerAction)('goBack', new PageGoBackAction());
(0, Action_1.registerAction)('refresh', new PageRefreshAction());
(0, Action_1.registerAction)('goPage', new PageGoAction());
//# sourceMappingURL=./actions/PageAction.js.map
