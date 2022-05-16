"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomAction = void 0;
var tslib_1 = require("tslib");
var Action_1 = require("./Action");
/**
 * 自定义动作，JS脚本
 *
 * @export
 * @class CustomAction
 * @implements {Action}
 */
var CustomAction = /** @class */ (function () {
    function CustomAction() {
    }
    CustomAction.prototype.run = function (action, renderer, event) {
        var _a, _b, _c;
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var scriptFunc;
            return (0, tslib_1.__generator)(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        scriptFunc = action.script;
                        if (typeof scriptFunc === 'string') {
                            scriptFunc = new Function('context', 'doAction', 'event', scriptFunc);
                        }
                        // 外部可以直接调用doAction来完成动作调用
                        // 可以通过上下文直接编排动作调用，通过event来进行动作干预
                        return [4 /*yield*/, ((_a = scriptFunc) === null || _a === void 0 ? void 0 : _a.call(null, renderer, ((_b = renderer.props.onAction) === null || _b === void 0 ? void 0 : _b.bind(renderer, event.context.nativeEvent)) ||
                                ((_c = renderer.doAction) === null || _c === void 0 ? void 0 : _c.bind(renderer)), event, action))];
                    case 1:
                        // 外部可以直接调用doAction来完成动作调用
                        // 可以通过上下文直接编排动作调用，通过event来进行动作干预
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return CustomAction;
}());
exports.CustomAction = CustomAction;
(0, Action_1.registerAction)('custom', new CustomAction());
//# sourceMappingURL=./actions/CustomAction.js.map
