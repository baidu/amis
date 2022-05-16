"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAction = exports.runActions = exports.getActionByType = exports.registerAction = exports.LoopStatus = void 0;
var tslib_1 = require("tslib");
var helper_1 = require("../utils/helper");
var tpl_1 = require("../utils/tpl");
var tpl_builtin_1 = require("../utils/tpl-builtin");
// 循环动作执行状态
var LoopStatus;
(function (LoopStatus) {
    LoopStatus[LoopStatus["NORMAL"] = 0] = "NORMAL";
    LoopStatus[LoopStatus["BREAK"] = 1] = "BREAK";
    LoopStatus[LoopStatus["CONTINUE"] = 2] = "CONTINUE";
})(LoopStatus = exports.LoopStatus || (exports.LoopStatus = {}));
// 存储 Action 和类型的映射关系，用于后续查找
var ActionTypeMap = {};
// 注册 Action
var registerAction = function (type, action) {
    ActionTypeMap[type] = action;
};
exports.registerAction = registerAction;
// 通过类型获取 Action 实例
var getActionByType = function (type) {
    return ActionTypeMap[type];
};
exports.getActionByType = getActionByType;
var runActions = function (actions, renderer, event) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var _i, actions_1, actionConfig, actionInstrance;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!Array.isArray(actions)) {
                    actions = [actions];
                }
                _i = 0, actions_1 = actions;
                _a.label = 1;
            case 1:
                if (!(_i < actions_1.length)) return [3 /*break*/, 4];
                actionConfig = actions_1[_i];
                actionInstrance = (0, exports.getActionByType)(actionConfig.actionType);
                // 如果存在指定组件ID，说明是组件专有动作
                if (!actionInstrance && actionConfig.componentId) {
                    actionInstrance = (0, exports.getActionByType)('component');
                }
                else if (actionConfig.actionType === 'url' ||
                    actionConfig.actionType === 'link' ||
                    actionConfig.actionType === 'jump') {
                    // 打开页面动作
                    actionInstrance = (0, exports.getActionByType)('openlink');
                }
                // 找不到就通过组件专有动作完成
                if (!actionInstrance) {
                    actionInstrance = (0, exports.getActionByType)('component');
                }
                // 这些节点的子节点运行逻辑由节点内部实现
                return [4 /*yield*/, (0, exports.runAction)(actionInstrance, actionConfig, renderer, event)];
            case 2:
                // 这些节点的子节点运行逻辑由节点内部实现
                _a.sent();
                if (event.stoped) {
                    return [3 /*break*/, 4];
                }
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.runActions = runActions;
// 执行动作，与原有动作处理打通
var runAction = function (actionInstrance, actionConfig, renderer, event) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var mergeData, expression, preventDefault, stopPropagation, args;
    var _a;
    return (0, tslib_1.__generator)(this, function (_b) {
        switch (_b.label) {
            case 0:
                mergeData = (0, helper_1.extendObject)(renderer.props.data, {
                    event: event
                });
                expression = (_a = actionConfig.expression) !== null && _a !== void 0 ? _a : actionConfig.execOn;
                if (expression && !(0, tpl_1.evalExpression)(expression, mergeData)) {
                    return [2 /*return*/];
                }
                preventDefault = actionConfig.preventDefault &&
                    (0, tpl_1.evalExpression)(String(actionConfig.preventDefault), mergeData);
                stopPropagation = actionConfig.stopPropagation &&
                    (0, tpl_1.evalExpression)(String(actionConfig.stopPropagation), mergeData);
                args = event.data;
                if (actionConfig.args) {
                    args = (0, tpl_builtin_1.dataMapping)(actionConfig.args, mergeData, function (key) {
                        return ['adaptor', 'responseAdaptor', 'requestAdaptor'].includes(key);
                    });
                }
                return [4 /*yield*/, actionInstrance.run((0, tslib_1.__assign)((0, tslib_1.__assign)({}, actionConfig), { args: args }), renderer, event, mergeData)];
            case 1:
                _b.sent();
                // 阻止原有动作执行
                preventDefault && event.preventDefault();
                // 阻止后续动作执行
                stopPropagation && event.stopPropagation();
                return [2 /*return*/];
        }
    });
}); };
exports.runAction = runAction;
//# sourceMappingURL=./actions/Action.js.map
