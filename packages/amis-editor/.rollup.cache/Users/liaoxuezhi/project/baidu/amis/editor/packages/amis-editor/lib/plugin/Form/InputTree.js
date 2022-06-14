import { __assign, __extends } from "tslib";
import React from 'react';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { getComboWrapper } from '../../event-action/schema';
import { getEventControlConfig } from '../../util';
var TreeControlPlugin = /** @class */ (function (_super) {
    __extends(TreeControlPlugin, _super);
    function TreeControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'input-tree';
        _this.$schema = '/schemas/TreeControlSchema.json';
        // 组件名称
        _this.name = '树选择框';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-list-alt';
        _this.description = "\u6811\u578B\u7ED3\u6784\u6765\u9009\u62E9\uFF0C\u53EF\u901A\u8FC7<code>options</code>\u6765\u914D\u7F6E\u9009\u9879\uFF0C\u4E5F\u53EF\u901A\u8FC7<code>source</code>\u62C9\u53D6\u9009\u9879";
        _this.docLink = '/amis/zh-CN/components/form/input-tree';
        _this.tags = ['表单项'];
        _this.scaffold = {
            type: 'input-tree',
            label: '树选择框',
            name: 'tree',
            options: [
                {
                    label: '选项A',
                    value: 'A',
                    children: [
                        {
                            label: '选项C',
                            value: 'C'
                        },
                        {
                            label: '选项D',
                            value: 'D'
                        }
                    ]
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
            body: __assign({}, _this.scaffold)
        };
        _this.notRenderFormZone = true;
        _this.panelTitle = '树选择';
        // 事件定义
        _this.events = [
            {
                eventName: 'change',
                eventLabel: '值变化',
                description: '选中值变化时触发',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data.value': {
                                type: 'string',
                                title: '选中节点的值'
                            }
                        }
                    }
                ]
            },
            {
                eventName: 'add',
                eventLabel: '新增选项',
                description: '新增节点提交时触发',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data.value': {
                                type: 'object',
                                title: '新增的节点信息'
                            },
                            'event.data.options': {
                                type: 'array',
                                title: '选项集合'
                            }
                        }
                    }
                ]
            },
            {
                eventName: 'edit',
                eventLabel: '编辑选项',
                description: '编辑选项',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data.value': {
                                type: 'object',
                                title: '编辑的节点信息'
                            },
                            'event.data.options': {
                                type: 'array',
                                title: '选项集合'
                            }
                        }
                    }
                ]
            },
            {
                eventName: 'delete',
                eventLabel: '删除选项',
                description: '删除选项',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data.value': {
                                type: 'object',
                                title: '删除的节点信息'
                            },
                            'event.data.options': {
                                type: 'array',
                                title: '选项集合'
                            }
                        }
                    }
                ]
            },
            {
                eventName: 'loadFinished',
                eventLabel: '懒加载完成',
                description: '懒加载接口远程请求成功时触发',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data.value': {
                                type: 'object',
                                title: 'deferApi 懒加载远程请求成功后返回的数据'
                            }
                        }
                    }
                ]
            }
        ];
        // 动作定义
        _this.actions = [
            {
                actionType: 'expand',
                actionLabel: '展开',
                description: '展开指定层级',
                config: ['openLevel'],
                desc: function (info) {
                    var _a;
                    return (React.createElement("div", null,
                        React.createElement("span", { className: "variable-right" }, info === null || info === void 0 ? void 0 : info.__rendererLabel),
                        "\u5C55\u5F00\u5230\u7B2C",
                        React.createElement("span", { className: "variable-left variable-right" }, (_a = info === null || info === void 0 ? void 0 : info.args) === null || _a === void 0 ? void 0 : _a.openLevel),
                        "\u5C42"));
                },
                schema: getComboWrapper({
                    type: 'input-formula',
                    variables: '${variables}',
                    evalMode: false,
                    variableMode: 'tabs',
                    label: '展开层级',
                    size: 'lg',
                    name: 'openLevel',
                    mode: 'horizontal'
                })
            },
            {
                actionType: 'collapse',
                actionLabel: '收起',
                description: '收起树节点'
            },
            {
                actionType: 'clear',
                actionLabel: '清空',
                description: '清除数据'
            },
            {
                actionType: 'reset',
                actionLabel: '重置',
                description: '重置数据'
            },
            {
                actionType: 'setValue',
                actionLabel: '赋值',
                description: '触发组件数据更新'
            }
        ];
        _this.panelDefinitions = {
            options: {
                label: '选项 Options',
                name: 'options',
                type: 'combo',
                multiple: true,
                multiLine: true,
                draggable: true,
                addButtonText: '新增选项',
                scaffold: {
                    label: '',
                    value: ''
                },
                items: [
                    {
                        type: 'group',
                        body: [
                            {
                                type: 'input-text',
                                name: 'label',
                                placeholder: '名称',
                                required: true
                            },
                            {
                                type: 'input-text',
                                name: 'value',
                                placeholder: '值',
                                unique: true
                            }
                        ]
                    },
                    {
                        $ref: 'options',
                        label: '子选项',
                        name: 'children',
                        addButtonText: '新增子选项'
                    }
                ]
            }
        };
        _this.panelBodyCreator = function (context) {
            return getSchemaTpl('tabs', [
                {
                    title: '常规',
                    body: [
                        /*
                        getSchemaTpl('switchDefaultValue'),
                        {
                          type: 'input-text',
                          name: 'value',
                          label: '默认值',
                          visibleOn: 'typeof this.value !== "undefined"'
                        },
                        */
                        getSchemaTpl('valueFormula', {
                            rendererSchema: __assign(__assign({}, context === null || context === void 0 ? void 0 : context.schema), { type: 'tree-select' // 改用树形输入框，避免占用太多空间
                             }),
                            mode: 'vertical' // 改成上下展示模式
                        }),
                        getSchemaTpl('fieldSet', {
                            title: '选项',
                            body: [
                                {
                                    $ref: 'options',
                                    name: 'options'
                                },
                                getSchemaTpl('source', {
                                    sampleBuilder: function (schema) {
                                        return JSON.stringify({
                                            status: 0,
                                            msg: '',
                                            data: {
                                                options: [
                                                    {
                                                        label: '选项A',
                                                        value: 'a',
                                                        children: [
                                                            {
                                                                label: '子选项',
                                                                value: 'c'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        label: '选项B',
                                                        value: 'b'
                                                    }
                                                ]
                                            }
                                        }, null, 2);
                                    }
                                }),
                                getSchemaTpl('switch', {
                                    label: '隐藏顶级',
                                    name: 'hideRoot'
                                }),
                                getSchemaTpl('switch', {
                                    name: 'showIcon',
                                    label: '是否显示图标',
                                    pipeIn: defaultValue(true)
                                }),
                                getSchemaTpl('multiple'),
                                getSchemaTpl('switch', {
                                    name: 'cascade',
                                    label: '不自动选中子节点',
                                    visibleOn: 'data.multiple',
                                    description: '选中父级时，孩子节点是否自动选中'
                                }),
                                getSchemaTpl('switch', {
                                    name: 'withChildren',
                                    label: '数值是否携带子节点',
                                    visibleOn: 'data.cascade !== true && data.multiple',
                                    disabledOn: 'data.onlyChildren'
                                }),
                                getSchemaTpl('switch', {
                                    name: 'onlyChildren',
                                    label: '数值是否只包含子节点',
                                    visibleOn: 'data.cascade !== true && data.multiple',
                                    disabledOn: 'data.withChildren'
                                }),
                                getSchemaTpl('joinValues'),
                                getSchemaTpl('delimiter'),
                                getSchemaTpl('extractValue'),
                                getSchemaTpl('autoFill')
                            ]
                        })
                    ]
                },
                {
                    title: '外观',
                    body: [
                        {
                            label: '顶级文字',
                            name: 'rootLabel',
                            type: 'input-text',
                            pipeIn: defaultValue('顶级'),
                            visibleOn: 'data.hideRoot !== true'
                        },
                        getSchemaTpl('switch', {
                            name: 'showIcon',
                            label: '是否显示图标',
                            pipeIn: defaultValue(true)
                        }),
                        getSchemaTpl('switch', {
                            label: '是否显示单选按钮',
                            name: 'showRadio',
                            visibleOn: '!data.multiple'
                        })
                    ]
                },
                {
                    title: '事件',
                    className: 'p-none',
                    body: [
                        getSchemaTpl('eventControl', __assign({ name: 'onEvent' }, getEventControlConfig(_this.manager, context)))
                    ]
                }
            ]);
        };
        return _this;
    }
    return TreeControlPlugin;
}(BasePlugin));
export { TreeControlPlugin };
registerEditorPlugin(TreeControlPlugin);
