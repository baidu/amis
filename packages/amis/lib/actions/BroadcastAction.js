"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BroadcastAction = void 0;
var tslib_1 = require("tslib");
var helper_1 = require("../utils/helper");
var renderer_event_1 = require("../utils/renderer-event");
var Action_1 = require("./Action");
/**
 * broadcast
 *
 * @export
 * @class BroadcastAction
 * @implements {Action}
 */
var BroadcastAction = /** @class */ (function () {
    function BroadcastAction() {
    }
    BroadcastAction.prototype.run = function (action, renderer, event) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!action.eventName) {
                            console.error('eventName 未定义，请定义事件名称');
                            return [2 /*return*/];
                        }
                        // 作为一个新的事件，需要把广播动作的args参数追加到事件数据中
                        event.setData((0, helper_1.createObject)(event.data, action.args));
                        return [4 /*yield*/, (0, renderer_event_1.dispatchEvent)(action.eventName, renderer, event.context.scoped, action.args, event)];
                    case 1: 
                    // 直接触发对应的动作
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return BroadcastAction;
}());
exports.BroadcastAction = BroadcastAction;
(0, Action_1.registerAction)('broadcast', new BroadcastAction());
//# sourceMappingURL=./actions/BroadcastAction.js.map
