"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContinueAction = void 0;
var tslib_1 = require("tslib");
var Action_1 = require("./Action");
/**
 * continue
 *
 * @export
 * @class ContinueAction
 * @implements {Action}
 */
var ContinueAction = /** @class */ (function () {
    function ContinueAction() {
    }
    ContinueAction.prototype.run = function (action, renderer, event) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                renderer.loopStatus = Action_1.LoopStatus.CONTINUE;
                return [2 /*return*/];
            });
        });
    };
    return ContinueAction;
}());
exports.ContinueAction = ContinueAction;
(0, Action_1.registerAction)('continue', new ContinueAction());
//# sourceMappingURL=./actions/ContinueAction.js.map
