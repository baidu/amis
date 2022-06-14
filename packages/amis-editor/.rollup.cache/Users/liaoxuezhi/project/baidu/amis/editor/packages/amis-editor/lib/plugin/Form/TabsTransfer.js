import { __assign, __extends } from "tslib";
import React from 'react';
import { getSchemaTpl } from 'amis-editor-core';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { getEventControlConfig } from '../../util';
var TabsTransferPlugin = /** @class */ (function (_super) {
    __extends(TabsTransferPlugin, _super);
    function TabsTransferPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'tabs-transfer';
        _this.$schema = '/schemas/TransferControlSchema.json';
        // 组件名称
        _this.name = '组合穿梭器';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-th-list';
        _this.description = "\u7EC4\u5408\u7A7F\u68AD\u5668\u7EC4\u4EF6";
        _this.docLink = '/amis/zh-CN/components/form/transfer';
        _this.tags = ['表单项'];
        _this.scaffold = {
            label: '组合穿梭器',
            type: 'tabs-transfer',
            name: 'a',
            sortable: true,
            searchable: true,
            options: [
                {
                    label: '成员',
                    selectMode: 'tree',
                    children: [
                        {
                            label: '法师',
                            children: [
                                {
                                    label: '诸葛亮',
                                    value: 'zhugeliang'
                                }
                            ]
                        },
                        {
                            label: '战士',
                            children: [
                                {
                                    label: '曹操',
                                    value: 'caocao'
                                },
                                {
                                    label: '钟无艳',
                                    value: 'zhongwuyan'
                                }
                            ]
                        },
                        {
                            label: '打野',
                            children: [
                                {
                                    label: '李白',
                                    value: 'libai'
                                },
                                {
                                    label: '韩信',
                                    value: 'hanxin'
                                },
                                {
                                    label: '云中君',
                                    value: 'yunzhongjun'
                                }
                            ]
                        }
                    ]
                },
                {
                    label: '用户',
                    selectMode: 'chained',
                    children: [
                        {
                            label: '法师',
                            children: [
                                {
                                    label: '诸葛亮',
                                    value: 'zhugeliang2'
                                }
                            ]
                        },
                        {
                            label: '战士',
                            children: [
                                {
                                    label: '曹操',
                                    value: 'caocao2'
                                },
                                {
                                    label: '钟无艳',
                                    value: 'zhongwuyan2'
                                }
                            ]
                        },
                        {
                            label: '打野',
                            children: [
                                {
                                    label: '李白',
                                    value: 'libai2'
                                },
                                {
                                    label: '韩信',
                                    value: 'hanxin2'
                                },
                                {
                                    label: '云中君',
                                    value: 'yunzhongjun2'
                                }
                            ]
                        }
                    ]
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
        _this.panelTitle = '组合穿梭器';
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
                                title: '选中值'
                            }
                        }
                    }
                ]
            },
            {
                eventName: 'selectAll',
                eventLabel: '全选',
                description: '选中所有选项',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data.value': {
                                type: 'string',
                                title: '选中值'
                            }
                        }
                    }
                ]
            },
            {
                eventName: 'tab-change',
                eventLabel: '选项卡切换',
                description: '选项卡切换时触发',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data.key': {
                                type: 'string',
                                title: '当前激活的选项卡索引'
                            }
                        }
                    }
                ]
            }
        ];
        // 动作定义
        _this.actions = [
            {
                actionType: 'clear',
                actionLabel: '清空',
                description: '清空选中内容'
            },
            {
                actionType: 'reset',
                actionLabel: '重置',
                description: '重置选择的内容'
            },
            {
                actionType: 'changeTabKey',
                actionLabel: '修改选中tab',
                description: '修改当前选中tab，来选择其他选项',
                desc: function (info) {
                    return (React.createElement("div", null,
                        React.createElement("span", { className: "variable-right" }, info === null || info === void 0 ? void 0 : info.__rendererLabel),
                        "\u4FEE\u6539\u9009\u4E2Dtab"));
                }
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
        // notRenderFormZone = true;
        _this.panelBodyCreator = function (context) {
            var renderer = context.info.renderer;
            return getSchemaTpl('tabs', [
                {
                    title: '属性',
                    body: getSchemaTpl('collapseGroup', [
                        getSchemaTpl('switchDefaultValue'),
                        {
                            type: 'select',
                            name: 'value',
                            label: '默认值',
                            source: '${options}',
                            multiple: true,
                            visibleOn: 'typeof this.value !== "undefined"'
                        },
                        getSchemaTpl('searchable'),
                        getSchemaTpl('api', {
                            label: '检索接口',
                            name: 'searchApi'
                        }),
                        {
                            label: '查询时勾选展示模式',
                            name: 'searchResultMode',
                            type: 'select',
                            mode: 'inline',
                            className: 'w-full',
                            options: [
                                {
                                    label: '列表形式',
                                    value: 'list'
                                },
                                {
                                    label: '表格形式',
                                    value: 'table'
                                },
                                {
                                    label: '树形选择形式',
                                    value: 'tree'
                                },
                                {
                                    label: '级联选择形式',
                                    value: 'chained'
                                }
                            ]
                        },
                        getSchemaTpl('sortable'),
                        {
                            label: '左侧的标题文字',
                            name: 'selectTitle',
                            type: 'input-text'
                        },
                        {
                            label: '右侧结果的标题文字',
                            name: 'resultTitle',
                            type: 'input-text'
                        },
                        getSchemaTpl('fieldSet', {
                            title: '选项',
                            body: [
                                {
                                    $ref: 'options',
                                    name: 'options'
                                },
                                getSchemaTpl('source'),
                                getSchemaTpl('joinValues'),
                                getSchemaTpl('delimiter'),
                                getSchemaTpl('extractValue'),
                                getSchemaTpl('autoFill')
                            ]
                        })
                    ])
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
    return TabsTransferPlugin;
}(BasePlugin));
export { TabsTransferPlugin };
registerEditorPlugin(TabsTransferPlugin);
