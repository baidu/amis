"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmptAction = void 0;
var tslib_1 = require("tslib");
var Action_1 = require("./Action");
/**
 * 组件动作
 *
 * @export
 * @class CmptAction
 * @implements {Action}
 */
var CmptAction = /** @class */ (function () {
    function CmptAction() {
    }
    CmptAction.prototype.run = function (action, renderer, event) {
        var _a, _b, _c, _d, _e, _f, _g;
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var component;
            return (0, tslib_1.__generator)(this, function (_h) {
                component = action.componentId && renderer.props.$schema.id !== action.componentId
                    ? (_a = event.context.scoped) === null || _a === void 0 ? void 0 : _a.getComponentById(action.componentId)
                    : renderer;
                // 显隐&状态控制
                if (['show', 'hidden'].includes(action.actionType)) {
                    return [2 /*return*/, renderer.props.rootStore.setVisible(action.componentId, action.actionType === 'show')];
                }
                else if (['enabled', 'disabled'].includes(action.actionType)) {
                    return [2 /*return*/, renderer.props.rootStore.setDisable(action.componentId, action.actionType === 'disabled')];
                }
                // 数据更新
                if (action.actionType === 'setValue') {
                    if (component === null || component === void 0 ? void 0 : component.setData) {
                        return [2 /*return*/, component === null || component === void 0 ? void 0 : component.setData((_b = action.args) === null || _b === void 0 ? void 0 : _b.value)];
                    }
                    else {
                        return [2 /*return*/, (_d = component === null || component === void 0 ? void 0 : (_c = component.props).onChange) === null || _d === void 0 ? void 0 : _d.call(_c, (_e = action.args) === null || _e === void 0 ? void 0 : _e.value)];
                    }
                }
                // 刷新
                if (action.actionType === 'reload') {
                    return [2 /*return*/, (_f = component === null || component === void 0 ? void 0 : component.reload) === null || _f === void 0 ? void 0 : _f.call(component, undefined, action.args)];
                }
                // 执行组件动作
                return [2 /*return*/, (_g = component === null || component === void 0 ? void 0 : component.doAction) === null || _g === void 0 ? void 0 : _g.call(component, action, action.args)];
            });
        });
    };
    return CmptAction;
}());
exports.CmptAction = CmptAction;
(0, Action_1.registerAction)('component', new CmptAction());
//# sourceMappingURL=./actions/CmptAction.js.map
