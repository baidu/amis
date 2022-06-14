import { __assign, __extends } from "tslib";
import { Button } from 'amis';
import React from 'react';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
import { diff, JSONPipeOut } from 'amis-editor-core';
var EachPlugin = /** @class */ (function (_super) {
    __extends(EachPlugin, _super);
    function EachPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'each';
        _this.$schema = '/schemas/EachSchema.json';
        // 组件名称
        _this.name = '循环 Each';
        _this.isBaseComponent = true;
        _this.description = '功能渲染器，可以基于现有变量循环输出渲染器。';
        _this.tags = ['功能'];
        _this.icon = 'fa fa-repeat';
        _this.scaffold = {
            type: 'each',
            name: 'arr',
            items: {
                type: 'tpl',
                tpl: '<%= data.index + 1 %>. 内容：<%= data.item %>',
                inline: false
            }
        };
        _this.previewSchema = __assign(__assign({}, _this.scaffold), { value: ['a', 'b', 'c'] });
        _this.panelTitle = '循环';
        _this.panelBodyCreator = function (context) {
            return [
                {
                    type: 'input-text',
                    name: 'name',
                    label: '关联字段',
                    placeholder: 'varname',
                    description: '如果所在容器有下发 value 则不需要配置，如果没有请配置变量名，支持多层级如：a.b，表示关联a对象下的b属性。目标变量可以是数组，也可以是对象。'
                },
                {
                    children: (React.createElement(Button, { size: "sm", level: "danger", className: "m-b", block: true, onClick: _this.editDetail.bind(_this, context.id) }, "\u914D\u7F6E\u6210\u5458\u6E32\u67D3\u5668"))
                },
                {
                    name: 'placeholder',
                    type: 'input-text',
                    label: '占位符',
                    pipeIn: defaultValue('暂无内容'),
                    description: '当没有关联变量，或者目标变量不是数组或者对象时显示此占位信息'
                },
                getSchemaTpl('className')
            ];
        };
        return _this;
    }
    EachPlugin.prototype.filterProps = function (props) {
        props = JSONPipeOut(props);
        // 至少显示一个成员，否则啥都不显示。
        if (!props.value) {
            props.value = [
                {
                    item: 'mocked data'
                }
            ];
        }
        return props;
    };
    EachPlugin.prototype.buildEditorToolbar = function (_a, toolbars) {
        var id = _a.id, info = _a.info;
        if (info.renderer.name === 'each') {
            toolbars.push({
                icon: 'fa fa-expand',
                order: 100,
                tooltip: '配置成员渲染器',
                onClick: this.editDetail.bind(this, id)
            });
        }
    };
    EachPlugin.prototype.buildEditorContextMenu = function (_a, menus) {
        var id = _a.id, schema = _a.schema, region = _a.region, info = _a.info, selections = _a.selections;
        if (selections.length || (info === null || info === void 0 ? void 0 : info.plugin) !== this) {
            return;
        }
        if (info.renderer.name === 'each') {
            menus.push('|', {
                label: '配置成员渲染器',
                onSelect: this.editDetail.bind(this, id)
            });
        }
    };
    EachPlugin.prototype.editDetail = function (id) {
        var manager = this.manager;
        var store = manager.store;
        var node = store.getNodeById(id);
        var value = store.getValueOf(id);
        node &&
            value &&
            this.manager.openSubEditor({
                title: '配置成员渲染器',
                value: value.items,
                slot: {
                    type: 'container',
                    body: '$$'
                },
                typeMutable: true,
                onChange: function (newValue) {
                    newValue = __assign(__assign({}, value), { items: newValue });
                    manager.panelChangeValue(newValue, diff(value, newValue));
                },
                data: {
                    item: 'mocked data',
                    index: 0
                }
            });
    };
    return EachPlugin;
}(BasePlugin));
export { EachPlugin };
registerEditorPlugin(EachPlugin);
