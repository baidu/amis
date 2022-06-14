import { __assign, __extends } from "tslib";
import { getSchemaTpl } from 'amis-editor-core';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { ValidatorTag } from '../../validator';
import { getEventControlConfig } from '../../util';
var SelectControlPlugin = /** @class */ (function (_super) {
    __extends(SelectControlPlugin, _super);
    function SelectControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'select';
        _this.$schema = '/schemas/SelectControlSchema.json';
        _this.order = -480;
        // 组件名称
        _this.name = '下拉框';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-th-list';
        _this.description = "\u652F\u6301\u591A\u9009\uFF0C\u8F93\u5165\u63D0\u793A\uFF0C\u53EF\u4F7F\u7528<code>source</code>\u83B7\u53D6\u9009\u9879";
        _this.docLink = '/amis/zh-CN/components/form/select';
        _this.tags = ['表单项'];
        _this.scaffold = {
            type: 'select',
            label: '选项',
            name: 'select',
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
        _this.notRenderFormZone = true;
        _this.panelTitle = '下拉框';
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
                                title: '选中值'
                            }
                        }
                    }
                ]
            },
            {
                eventName: 'focus',
                eventLabel: '获取焦点',
                description: '输入框获取焦点时触发',
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
                eventName: 'blur',
                eventLabel: '失去焦点',
                description: '输入框失去焦点时触发',
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
                eventName: 'add',
                eventLabel: '新增选项',
                description: '新增选项',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data.value': {
                                type: 'object',
                                title: '新增的选项'
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
                                title: '编辑的选项'
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
                                title: '删除的选项'
                            },
                            'event.data.options': {
                                type: 'array',
                                title: '选项集合'
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
                description: '清除选中值'
            },
            {
                actionType: 'reset',
                actionLabel: '重置',
                description: '将值重置为resetValue，若没有配置resetValue，则清空'
            },
            {
                actionType: 'reload',
                actionLabel: '重新加载',
                description: '触发组件数据刷新并重新渲染'
            },
            {
                actionType: 'setValue',
                actionLabel: '赋值',
                description: '触发组件数据更新'
            }
        ];
        _this.panelJustify = true;
        _this.panelBodyCreator = function (context) {
            return getSchemaTpl('tabs', [
                {
                    title: '属性',
                    body: getSchemaTpl('collapseGroup', [
                        {
                            title: '基本',
                            body: [
                                getSchemaTpl('formItemName', {
                                    required: true
                                }),
                                getSchemaTpl('label'),
                                getSchemaTpl('clearable'),
                                getSchemaTpl('searchable'),
                                getSchemaTpl('multiple', {
                                    popMore: [
                                        getSchemaTpl('switch', {
                                            label: '单行显示选中值',
                                            name: 'valuesNoWrap'
                                        })
                                    ]
                                }),
                                getSchemaTpl('checkAll'),
                                getSchemaTpl('valueFormula', {
                                    rendererSchema: context === null || context === void 0 ? void 0 : context.schema,
                                    visibleOn: 'this.options && this.options.length > 0'
                                }),
                                getSchemaTpl('labelRemark'),
                                getSchemaTpl('remark'),
                                getSchemaTpl('placeholder'),
                                getSchemaTpl('description')
                            ]
                        },
                        {
                            title: '选项',
                            body: [
                                getSchemaTpl('optionControlV2'),
                                getSchemaTpl('menuTpl'),
                                getSchemaTpl('creatable', {
                                    formType: 'extend',
                                    hiddenOnDefault: true,
                                    form: {
                                        body: [
                                            getSchemaTpl('createBtnLabel'),
                                            getSchemaTpl('addApi')
                                            // {
                                            //   label: '按钮位置',
                                            //   name: 'valueType',
                                            //   type: 'button-group-select',
                                            //   size: 'sm',
                                            //   tiled: true,
                                            //   value: 'asUpload',
                                            //   mode: 'row',
                                            //   options: [
                                            //     {
                                            //       label: '顶部',
                                            //       value: ''
                                            //     },
                                            //     {
                                            //       label: '底部',
                                            //       value: ''
                                            //     },
                                            //   ],
                                            // },
                                        ]
                                    }
                                }),
                                getSchemaTpl('editable', {
                                    type: 'ae-Switch-More',
                                    formType: 'extend',
                                    hiddenOnDefault: true,
                                    form: {
                                        body: [getSchemaTpl('editApi')]
                                    }
                                }),
                                getSchemaTpl('removable', {
                                    type: 'ae-Switch-More',
                                    formType: 'extend',
                                    hiddenOnDefault: true,
                                    form: {
                                        body: [getSchemaTpl('deleteApi')]
                                    }
                                })
                            ]
                        },
                        getSchemaTpl('status', { isFormItem: true }),
                        getSchemaTpl('validation', { tag: ValidatorTag.MultiSelect })
                    ])
                },
                {
                    title: '外观',
                    body: [
                        getSchemaTpl('collapseGroup', [
                            getSchemaTpl('style:formItem', { renderer: context.info.renderer }),
                            getSchemaTpl('style:classNames')
                        ])
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
    return SelectControlPlugin;
}(BasePlugin));
export { SelectControlPlugin };
registerEditorPlugin(SelectControlPlugin);
