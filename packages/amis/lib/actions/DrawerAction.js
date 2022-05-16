"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloseDrawerAction = exports.DrawerAction = void 0;
var tslib_1 = require("tslib");
var Action_1 = require("./Action");
/**
 * 打开抽屉动作
 *
 * @export
 * @class DrawerAction
 * @implements {Action}
 */
var DrawerAction = /** @class */ (function () {
    function DrawerAction() {
    }
    DrawerAction.prototype.run = function (action, renderer, event) {
        var _a, _b;
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_c) {
                (_b = (_a = renderer.props).onAction) === null || _b === void 0 ? void 0 : _b.call(_a, event, action, action.args);
                return [2 /*return*/];
            });
        });
    };
    return DrawerAction;
}());
exports.DrawerAction = DrawerAction;
/**
 * 关闭抽屉动作
 *
 * @export
 * @class CloseDrawerAction
 * @implements {Action}
 */
var CloseDrawerAction = /** @class */ (function () {
    function CloseDrawerAction() {
    }
    CloseDrawerAction.prototype.run = function (action, renderer, event) {
        var _a, _b;
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_c) {
                if (action.componentId) {
                    // 关闭指定抽屉
                    event.context.scoped.closeById(action.componentId);
                }
                else {
                    // 关闭当前抽屉
                    (_b = (_a = renderer.props).onAction) === null || _b === void 0 ? void 0 : _b.call(_a, event, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, action), { actionType: 'close' }), action.args);
                }
                return [2 /*return*/];
            });
        });
    };
    return CloseDrawerAction;
}());
exports.CloseDrawerAction = CloseDrawerAction;
(0, Action_1.registerAction)('drawer', new DrawerAction());
(0, Action_1.registerAction)('closeDrawer', new CloseDrawerAction());
//# sourceMappingURL=./actions/DrawerAction.js.map
