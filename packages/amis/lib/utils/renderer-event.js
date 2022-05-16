"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRendererEventListeners = exports.dispatchEvent = exports.bindEvent = exports.createRendererEvent = void 0;
var tslib_1 = require("tslib");
var Action_1 = require("../actions/Action");
var rendererEventListeners = [];
// 创建渲染器事件对象
function createRendererEvent(type, context) {
    var rendererEvent = {
        context: context,
        type: type,
        prevented: false,
        stoped: false,
        preventDefault: function () {
            rendererEvent.prevented = true;
        },
        stopPropagation: function () {
            rendererEvent.stoped = true;
        },
        get data() {
            return rendererEvent.context.data;
        },
        setData: function (data) {
            rendererEvent.context.data = data;
        }
    };
    return rendererEvent;
}
exports.createRendererEvent = createRendererEvent;
// 绑定事件
var bindEvent = function (renderer) {
    if (!renderer) {
        return undefined;
    }
    var listeners = renderer.props.$schema.onEvent;
    if (listeners) {
        var _loop_1 = function (key) {
            var listener = rendererEventListeners.some(function (item) {
                return item.renderer === renderer && item.type === key;
            });
            if (!listener) {
                rendererEventListeners.push({
                    renderer: renderer,
                    type: key,
                    weight: listeners[key].weight || 0,
                    actions: listeners[key].actions
                });
            }
        };
        // 暂存
        for (var _i = 0, _a = Object.keys(listeners); _i < _a.length; _i++) {
            var key = _a[_i];
            _loop_1(key);
        }
        return function () {
            rendererEventListeners = rendererEventListeners.filter(function (item) { return item.renderer !== renderer; });
        };
    }
    return undefined;
};
exports.bindEvent = bindEvent;
// 触发事件
function dispatchEvent(e, renderer, scoped, data, broadcast) {
    var _a, _b, _c, _d, _e, _f;
    return (0, tslib_1.__awaiter)(this, void 0, Promise, function () {
        var unbindEvent, eventName, eventConfig, rendererEvent, listeners, _i, listeners_1, listener;
        return (0, tslib_1.__generator)(this, function (_g) {
            switch (_g.label) {
                case 0:
                    unbindEvent = null;
                    eventName = typeof e === 'string' ? e : e.type;
                    (_c = (_b = (_a = renderer === null || renderer === void 0 ? void 0 : renderer.props) === null || _a === void 0 ? void 0 : _a.env) === null || _b === void 0 ? void 0 : _b.beforeDispatchEvent) === null || _c === void 0 ? void 0 : _c.call(_b, e, renderer, scoped, data, broadcast);
                    if (!broadcast) {
                        eventConfig = (_e = (_d = renderer === null || renderer === void 0 ? void 0 : renderer.props) === null || _d === void 0 ? void 0 : _d.onEvent) === null || _e === void 0 ? void 0 : _e[eventName];
                        if (!eventConfig) {
                            // 没命中也没关系
                            return [2 /*return*/, Promise.resolve()];
                        }
                        unbindEvent = (0, exports.bindEvent)(renderer);
                    }
                    // 没有可处理的监听
                    if (!rendererEventListeners.length) {
                        return [2 /*return*/, Promise.resolve()];
                    }
                    rendererEvent = broadcast ||
                        createRendererEvent(eventName, {
                            env: (_f = renderer === null || renderer === void 0 ? void 0 : renderer.props) === null || _f === void 0 ? void 0 : _f.env,
                            nativeEvent: e,
                            data: data,
                            scoped: scoped
                        });
                    listeners = rendererEventListeners
                        .filter(function (item) {
                        return item.type === eventName &&
                            (broadcast ? true : item.renderer === renderer);
                    })
                        .sort(function (prev, next) {
                        return next.weight - prev.weight;
                    });
                    _i = 0, listeners_1 = listeners;
                    _g.label = 1;
                case 1:
                    if (!(_i < listeners_1.length)) return [3 /*break*/, 4];
                    listener = listeners_1[_i];
                    return [4 /*yield*/, (0, Action_1.runActions)(listener.actions, listener.renderer, rendererEvent)];
                case 2:
                    _g.sent();
                    // 停止后续监听器执行
                    if (rendererEvent.stoped) {
                        return [3 /*break*/, 4];
                    }
                    _g.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    unbindEvent === null || unbindEvent === void 0 ? void 0 : unbindEvent();
                    return [2 /*return*/, Promise.resolve(rendererEvent)];
            }
        });
    });
}
exports.dispatchEvent = dispatchEvent;
var getRendererEventListeners = function () {
    return rendererEventListeners;
};
exports.getRendererEventListeners = getRendererEventListeners;
exports.default = {};
//# sourceMappingURL=./utils/renderer-event.js.map
