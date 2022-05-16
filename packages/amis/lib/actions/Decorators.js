"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindRendererEvent = exports.rendererEventDispatcher = void 0;
var tslib_1 = require("tslib");
var helper_1 = require("../utils/helper");
/**
 * 渲染器事件派发
 *
 * @param props 组件props
 * @param e 事件类型
 * @param ctx 上下文数据
 */
function rendererEventDispatcher(props, e, ctx) {
    if (ctx === void 0) { ctx = {}; }
    return (0, tslib_1.__awaiter)(this, void 0, Promise, function () {
        var dispatchEvent, data;
        return (0, tslib_1.__generator)(this, function (_a) {
            dispatchEvent = props.dispatchEvent, data = props.data;
            return [2 /*return*/, dispatchEvent(e, (0, helper_1.createObject)(data, ctx))];
        });
    });
}
exports.rendererEventDispatcher = rendererEventDispatcher;
/**
 * 渲染器事件方法装饰器
 *
 * @param event 事件类型
 * @param ctx 上下文数据
 * @returns {Function}
 */
function bindRendererEvent(event, ctx) {
    if (ctx === void 0) { ctx = {}; }
    return function (target, propertyKey, descriptor) {
        var fn = descriptor.value && typeof descriptor.value === 'function'
            ? descriptor.value
            : typeof (descriptor === null || descriptor === void 0 ? void 0 : descriptor.get) === 'function'
                ? descriptor.get()
                : null;
        if (!fn || typeof fn !== 'function') {
            throw new Error("decorator can only be applied to methods not: ".concat(typeof fn));
        }
        return (0, tslib_1.__assign)((0, tslib_1.__assign)({}, descriptor), { value: function boundFn() {
                var _a;
                var params = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    params[_i] = arguments[_i];
                }
                return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
                    var triggerProps, value, dispatcher;
                    return (0, tslib_1.__generator)(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                triggerProps = (_a = this) === null || _a === void 0 ? void 0 : _a.props;
                                value = triggerProps === null || triggerProps === void 0 ? void 0 : triggerProps.value;
                                // clear清除内容事件
                                if (typeof event === 'string' && event === 'clear') {
                                    value = triggerProps === null || triggerProps === void 0 ? void 0 : triggerProps.resetValue;
                                }
                                return [4 /*yield*/, rendererEventDispatcher(triggerProps, event, {
                                        value: value
                                    })];
                            case 1:
                                dispatcher = _b.sent();
                                if (dispatcher === null || dispatcher === void 0 ? void 0 : dispatcher.prevented) {
                                    return [2 /*return*/];
                                }
                                return [2 /*return*/, fn.apply(this, (0, tslib_1.__spreadArray)([], params, true))];
                        }
                    });
                });
            } });
    };
}
exports.bindRendererEvent = bindRendererEvent;
//# sourceMappingURL=./actions/Decorators.js.map
