"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BreakAction = void 0;
var tslib_1 = require("tslib");
var Action_1 = require("./Action");
/**
 * breach
 *
 * @export
 * @class BreakAction
 * @implements {Action}
 */
var BreakAction = /** @class */ (function () {
    function BreakAction() {
    }
    BreakAction.prototype.run = function (action, renderer, event) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                renderer.loopStatus = Action_1.LoopStatus.BREAK;
                return [2 /*return*/];
            });
        });
    };
    return BreakAction;
}());
exports.BreakAction = BreakAction;
(0, Action_1.registerAction)('break', new BreakAction());
//# sourceMappingURL=./actions/BreakAction.js.map
