import { __assign, __extends } from "tslib";
import React from 'react';
import { Button } from 'amis';
import { getSchemaTpl } from 'amis-editor-core';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { diff } from 'amis-editor-core';
var PickerControlPlugin = /** @class */ (function (_super) {
    __extends(PickerControlPlugin, _super);
    function PickerControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'picker';
        _this.$schema = '/schemas/PickerControlSchema.json';
        // 组件名称
        _this.name = '列表选取';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-window-restore';
        _this.description = "\u901A\u8FC7<code>pickerSchema</code>\u914D\u7F6E\u53EF\u4F9B\u9009\u53D6\u7684\u6570\u636E\u6E90\u8FDB\u884C\u9009\u62E9\u9700\u8981\u7684\u6570\u636E\uFF0C\u652F\u6301\u591A\u9009";
        _this.docLink = '/amis/zh-CN/components/form/picker';
        _this.tags = ['表单项'];
        _this.scaffold = {
            type: 'picker',
            label: '列表选取',
            name: 'picker',
            options: [
                {
                    label: '选项A',
                    value: 'A'
                },
                {
                    label: '选项B',
                    value: 'B'
                }
            ]
        };
        _this.previewSchema = {
            type: 'form',
            className: 'text-left',
            mode: 'horizontal',
            wrapWithPanel: false,
            body: [
                __assign({}, _this.scaffold)
            ]
        };
        _this.panelTitle = '列表选取';
        _this.panelBodyCreator = function (context) {
            return [
                getSchemaTpl('switch', {
                    name: 'embed',
                    label: '开启内嵌模式'
                }),
                getSchemaTpl('switchDefaultValue'),
                {
                    type: 'input-text',
                    name: 'value',
                    label: '默认值',
                    visibleOn: 'typeof this.value !== "undefined"'
                },
                getSchemaTpl('fieldSet', {
                    title: '选项',
                    body: [
                        getSchemaTpl('options'),
                        getSchemaTpl('api', {
                            name: 'source',
                            label: '获取选项接口'
                        }),
                        {
                            children: (React.createElement(Button, { size: "sm", level: "danger", className: "m-b", onClick: _this.editDetail.bind(_this, context.id), block: true }, "\u914D\u7F6E\u9009\u6846\u8BE6\u60C5"))
                        },
                        {
                            label: 'labelTpl',
                            type: 'textarea',
                            name: 'labelTpl',
                            labelRemark: '已选定数据的展示样式',
                            description: '支持使用 <code>\\${xxx}</code> 来获取变量，或者用 lodash.template 语法来写模板逻辑。<a target="_blank" href="/amis/zh-CN/docs/concepts/template">详情</a>'
                        },
                        {
                            type: 'button-group-select',
                            name: 'modalMode',
                            label: '选框类型',
                            value: 'dialog',
                            size: 'xs',
                            options: [
                                {
                                    label: '弹框',
                                    value: 'dialog'
                                },
                                {
                                    label: '抽出式弹框',
                                    value: 'drawer'
                                }
                            ]
                        },
                        getSchemaTpl('multiple'),
                        getSchemaTpl('joinValues'),
                        getSchemaTpl('delimiter'),
                        getSchemaTpl('extractValue'),
                        getSchemaTpl('autoFill')
                    ]
                })
            ];
        };
        return _this;
    }
    PickerControlPlugin.prototype.buildEditorToolbar = function (_a, toolbars) {
        var id = _a.id, info = _a.info;
        if (info.renderer.name === this.rendererName) {
            toolbars.push({
                icon: 'fa fa-expand',
                order: 100,
                tooltip: '配置选框详情',
                onClick: this.editDetail.bind(this, id)
            });
        }
    };
    PickerControlPlugin.prototype.buildEditorContextMenu = function (_a, menus) {
        var id = _a.id, schema = _a.schema, region = _a.region, info = _a.info;
        if (info.renderer.name === this.rendererName) {
            menus.push('|', {
                label: '配置选框详情',
                onSelect: this.editDetail.bind(this, id)
            });
        }
    };
    PickerControlPlugin.prototype.editDetail = function (id) {
        var manager = this.manager;
        var store = manager.store;
        var node = store.getNodeById(id);
        var value = store.getValueOf(id);
        if (!node || !value) {
            return;
        }
        var component = node.getComponent();
        var schema = __assign(__assign({ type: 'crud', mode: 'list' }, (value.pickerSchema || {
            listItem: {
                title: '${label}'
            }
        })), { api: value.source, pickerMode: true, multiple: value.multiple });
        this.manager.openSubEditor({
            title: '配置选框详情',
            value: schema,
            data: { options: component.props.options },
            onChange: function (newValue) {
                newValue = __assign(__assign({}, value), { pickerSchema: __assign({}, newValue), source: newValue.api });
                delete newValue.pickerSchema.api;
                delete newValue.pickerSchema.type;
                delete newValue.pickerSchema.pickerMode;
                delete newValue.pickerSchema.multiple;
                manager.panelChangeValue(newValue, diff(value, newValue));
            }
        });
    };
    return PickerControlPlugin;
}(BasePlugin));
export { PickerControlPlugin };
registerEditorPlugin(PickerControlPlugin);
