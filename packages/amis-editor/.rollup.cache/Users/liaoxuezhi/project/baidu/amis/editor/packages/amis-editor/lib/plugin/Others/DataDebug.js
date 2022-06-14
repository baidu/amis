import { __assign, __awaiter, __extends, __generator } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import React from 'react';
import JsonView from 'react-json-view';
/**
 * 添加调试功能
 */
var DataDebugPlugin = /** @class */ (function (_super) {
    __extends(DataDebugPlugin, _super);
    function DataDebugPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.dataViewer = {
            type: 'json',
            name: 'ctx',
            asFormItem: true,
            className: 'm-b-none',
            component: function (_a) {
                var value = _a.value, onChange = _a.onChange, readOnly = _a.readOnly;
                var _b = React.useState(0), index = _b[0], setIndex = _b[1];
                var start = value || {};
                var stacks = [start];
                while (Object.getPrototypeOf(start) !== Object.prototype) {
                    var superData = Object.getPrototypeOf(start);
                    if (Object.prototype.toString.call(superData) !== '[object Object]') {
                        break;
                    }
                    stacks.push(superData);
                    start = superData;
                }
                function emitChange(e) {
                    var obj = Object.create(stacks[1] || Object.prototype);
                    Object.keys(e.updated_src).forEach(function (key) { return (obj[key] = e.updated_src[key]); });
                    onChange(obj);
                }
                return (React.createElement("div", { className: "aeDataChain" },
                    React.createElement("div", { className: "aeDataChain-aside" },
                        React.createElement("ul", null, stacks.map(function (_, i) { return (React.createElement("li", { className: i === index ? 'is-active' : '', key: i, onClick: function () { return setIndex(i); } }, i === 0 ? '当前' : i === 1 ? '上层' : "\u4E0A".concat(i, "\u5C42"))); }))),
                    React.createElement("div", { className: "aeDataChain-main" },
                        React.createElement(JsonView, { name: false, src: stacks[index], enableClipboard: false, iconStyle: "square", onAdd: index === 0 && !readOnly ? emitChange : false, onEdit: index === 0 && !readOnly ? emitChange : false, onDelete: index === 0 && !readOnly ? emitChange : false, collapsed: 2 }))));
            }
        };
        return _this;
    }
    DataDebugPlugin.prototype.buildEditorToolbar = function (_a, toolbars) {
        var _this = this;
        var id = _a.id, schema = _a.schema, node = _a.node;
        var comp = node.getComponent();
        if (!comp || !comp.props.data || !comp.props.store) {
            return;
        }
        // const renderers = getRenderers();
        // const renderInfo = find(
        //   renderers,
        //   renderer => renderer.Renderer && comp instanceof renderer.Renderer
        // ) as RendererConfig;
        // if (!renderInfo || !renderInfo.storeType) {
        //   return;
        // }
        var store = comp.props.store;
        toolbars.push({
            icon: 'fa fa-bug',
            order: -1000,
            placement: 'bottom',
            tooltip: '上下文数据',
            onClick: function () {
                return _this.openDebugForm(comp.props.data, store.updateData && store.data === comp.props.data
                    ? function (values) { return store.updateData(values); }
                    : undefined);
            }
        });
    };
    DataDebugPlugin.prototype.openDebugForm = function (data, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.manager.scaffold({
                            title: '上下文数据',
                            body: [
                                __assign(__assign({}, this.dataViewer), { readOnly: callback ? false : true })
                            ]
                        }, {
                            ctx: data
                        })];
                    case 1:
                        result = _a.sent();
                        callback === null || callback === void 0 ? void 0 : callback(result.ctx);
                        return [2 /*return*/];
                }
            });
        });
    };
    return DataDebugPlugin;
}(BasePlugin));
export { DataDebugPlugin };
registerEditorPlugin(DataDebugPlugin);
