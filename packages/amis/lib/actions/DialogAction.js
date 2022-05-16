"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmAction = exports.AlertAction = exports.CloseDialogAction = exports.DialogAction = void 0;
var tslib_1 = require("tslib");
var Action_1 = require("./Action");
/**
 * 打开弹窗动作
 *
 * @export
 * @class DialogAction
 * @implements {Action}
 */
var DialogAction = /** @class */ (function () {
    function DialogAction() {
    }
    DialogAction.prototype.run = function (action, renderer, event) {
        var _a, _b;
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_c) {
                (_b = (_a = renderer.props).onAction) === null || _b === void 0 ? void 0 : _b.call(_a, event, action, action.args);
                return [2 /*return*/];
            });
        });
    };
    return DialogAction;
}());
exports.DialogAction = DialogAction;
/**
 * 关闭弹窗动作
 *
 * @export
 * @class CloseDialogAction
 * @implements {Action}
 */
var CloseDialogAction = /** @class */ (function () {
    function CloseDialogAction() {
    }
    CloseDialogAction.prototype.run = function (action, renderer, event) {
        var _a, _b;
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_c) {
                if (action.componentId) {
                    // 关闭指定弹窗
                    event.context.scoped.closeById(action.componentId);
                }
                else {
                    // 关闭当前弹窗
                    (_b = (_a = renderer.props).onAction) === null || _b === void 0 ? void 0 : _b.call(_a, event, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, action), { actionType: 'close' }), action.args);
                }
                return [2 /*return*/];
            });
        });
    };
    return CloseDialogAction;
}());
exports.CloseDialogAction = CloseDialogAction;
/**
 * alert提示动作
 */
var AlertAction = /** @class */ (function () {
    function AlertAction() {
    }
    AlertAction.prototype.run = function (action, renderer, event) {
        var _a, _b, _c;
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_d) {
                (_b = (_a = event.context.env).alert) === null || _b === void 0 ? void 0 : _b.call(_a, (_c = action.args) === null || _c === void 0 ? void 0 : _c.msg);
                return [2 /*return*/];
            });
        });
    };
    return AlertAction;
}());
exports.AlertAction = AlertAction;
/**
 * confirm确认提示动作
 */
var ConfirmAction = /** @class */ (function () {
    function ConfirmAction() {
    }
    ConfirmAction.prototype.run = function (action, renderer, event) {
        var _a, _b, _c, _d;
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_e) {
                (_b = (_a = event.context.env).confirm) === null || _b === void 0 ? void 0 : _b.call(_a, (_c = action.args) === null || _c === void 0 ? void 0 : _c.msg, (_d = action.args) === null || _d === void 0 ? void 0 : _d.title);
                return [2 /*return*/];
            });
        });
    };
    return ConfirmAction;
}());
exports.ConfirmAction = ConfirmAction;
(0, Action_1.registerAction)('dialog', new DialogAction());
(0, Action_1.registerAction)('closeDialog', new CloseDialogAction());
(0, Action_1.registerAction)('alert', new AlertAction());
(0, Action_1.registerAction)('confirmDialog', new ConfirmAction());
//# sourceMappingURL=./actions/DialogAction.js.map
