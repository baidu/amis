"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParallelAction = void 0;
var tslib_1 = require("tslib");
var Action_1 = require("./Action");
var ParallelAction = /** @class */ (function () {
    function ParallelAction() {
    }
    ParallelAction.prototype.run = function (action, renderer, event) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var childActions;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(action.children && action.children.length)) return [3 /*break*/, 2];
                        childActions = action.children.map(function (child) {
                            // 并行动作互不干扰，但不管哪个存在干预都对后续动作生效
                            return (0, Action_1.runActions)(child, renderer, event);
                        });
                        return [4 /*yield*/, Promise.all(childActions)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    return ParallelAction;
}());
exports.ParallelAction = ParallelAction;
(0, Action_1.registerAction)('parallel', new ParallelAction());
//# sourceMappingURL=./actions/ParallelAction.js.map
