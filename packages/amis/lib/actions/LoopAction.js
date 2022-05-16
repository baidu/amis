"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoopAction = void 0;
var tslib_1 = require("tslib");
var helper_1 = require("../utils/helper");
var Action_1 = require("./Action");
var tpl_builtin_1 = require("../utils/tpl-builtin");
/**
 * 循环动作
 *
 * @export
 * @class LoopAction
 * @implements {Action}
 */
var LoopAction = /** @class */ (function () {
    function LoopAction() {
    }
    LoopAction.prototype.run = function (action, renderer, event, mergeData) {
        var _a, _b;
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var loopName, loopData, protoData, _i, loopData_1, data, _c, _d, subAction;
            return (0, tslib_1.__generator)(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        loopName = (_a = action.args) === null || _a === void 0 ? void 0 : _a.loopName;
                        if (typeof loopName !== 'string') {
                            console.error('loopName 必须是字符串类型');
                            return [2 /*return*/];
                        }
                        loopData = (0, tpl_builtin_1.resolveVariable)(loopName, mergeData) || [];
                        if (!!loopData) return [3 /*break*/, 1];
                        console.error("\u6CA1\u6709\u627E\u5230\u6570\u636E ".concat(loopName));
                        return [3 /*break*/, 10];
                    case 1:
                        if (!!Array.isArray(loopData)) return [3 /*break*/, 2];
                        console.error("".concat(loopName, " \u6570\u636E\u4E0D\u662F\u6570\u7EC4"));
                        return [3 /*break*/, 10];
                    case 2:
                        if (!((_b = action.children) === null || _b === void 0 ? void 0 : _b.length)) return [3 /*break*/, 10];
                        protoData = event.data;
                        _i = 0, loopData_1 = loopData;
                        _e.label = 3;
                    case 3:
                        if (!(_i < loopData_1.length)) return [3 /*break*/, 9];
                        data = loopData_1[_i];
                        renderer.loopStatus = Action_1.LoopStatus.NORMAL;
                        // 追加逻辑处理中的数据，事件数据优先，用完还要还原
                        event.setData((0, helper_1.createObject)(event.data, data));
                        _c = 0, _d = action.children;
                        _e.label = 4;
                    case 4:
                        if (!(_c < _d.length)) return [3 /*break*/, 7];
                        subAction = _d[_c];
                        // @ts-ignore
                        if (renderer.loopStatus === Action_1.LoopStatus.CONTINUE) {
                            return [3 /*break*/, 6];
                        }
                        return [4 /*yield*/, (0, Action_1.runActions)(subAction, renderer, event)];
                    case 5:
                        _e.sent();
                        // @ts-ignore
                        if (renderer.loopStatus === Action_1.LoopStatus.BREAK || event.stoped) {
                            // 还原事件数据
                            event.setData(protoData);
                            event.stopPropagation();
                            return [3 /*break*/, 7];
                        }
                        _e.label = 6;
                    case 6:
                        _c++;
                        return [3 /*break*/, 4];
                    case 7:
                        if (event.stoped) {
                            // 还原事件数据
                            event.setData(protoData);
                            return [3 /*break*/, 9];
                        }
                        _e.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 3];
                    case 9:
                        renderer.loopStatus = Action_1.LoopStatus.NORMAL;
                        event.setData(protoData);
                        _e.label = 10;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    return LoopAction;
}());
exports.LoopAction = LoopAction;
(0, Action_1.registerAction)('loop', new LoopAction());
//# sourceMappingURL=./actions/LoopAction.js.map
