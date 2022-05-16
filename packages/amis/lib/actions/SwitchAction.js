"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitchAction = void 0;
var tslib_1 = require("tslib");
var tpl_1 = require("../utils/tpl");
var Action_1 = require("./Action");
/**
 * 排他动作
 */
var SwitchAction = /** @class */ (function () {
    function SwitchAction() {
    }
    SwitchAction.prototype.run = function (action, renderer, event, mergeData) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _i, _a, branch;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = action.children || [];
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        branch = _a[_i];
                        if (!branch.expression) {
                            return [3 /*break*/, 3];
                        }
                        if (!(0, tpl_1.evalExpression)(branch.expression, mergeData)) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, Action_1.runActions)(branch, renderer, event)];
                    case 2:
                        _b.sent();
                        // 去掉runAllMatch，这里只做排他，多个可以直接通过expression
                        return [3 /*break*/, 4];
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return SwitchAction;
}());
exports.SwitchAction = SwitchAction;
(0, Action_1.registerAction)('switch', new SwitchAction());
//# sourceMappingURL=./actions/SwitchAction.js.map
