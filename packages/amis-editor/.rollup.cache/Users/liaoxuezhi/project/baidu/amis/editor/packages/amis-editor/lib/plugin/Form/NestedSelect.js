import { __assign, __extends } from "tslib";
import { getSchemaTpl } from 'amis-editor-core';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { tipedLabel } from '../../component/BaseControl';
import { ValidatorTag } from '../../validator';
import { getEventControlConfig } from '../../util';
var NestedSelectControlPlugin = /** @class */ (function (_super) {
    __extends(NestedSelectControlPlugin, _super);
    function NestedSelectControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'nested-select';
        _this.$schema = '/schemas/NestedSelectControlSchema.json';
        // 组件名称
        _this.name = '级联选择';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-indent';
        _this.description = "\u9002\u7528\u4E8E\u9009\u9879\u4E2D\u542B\u6709\u5B50\u9879\uFF0C\u53EF\u901A\u8FC7<code>source</code>\u62C9\u53D6\u9009\u9879\uFF0C\u652F\u6301\u591A\u9009";
        _this.docLink = '/amis/zh-CN/components/form/nestedselect';
        _this.tags = ['表单项'];
        _this.scaffold = {
            type: 'nested-select',
            label: '级联选择',
            name: 'nestedSelect',
            onlyChildren: true,
            options: [
                {
                    label: '选项A',
                    value: 'A'
                },
                {
                    label: '选项B',
                    value: 'B',
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
        _this.panelTitle = '级联选择';
        _this.notRenderFormZone = true;
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
        _this.panelJustify = true;
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
        _this.panelBodyCreator = function (context) {
            var renderer = context.info.renderer;
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
                                {
                                    type: 'ae-Switch-More',
                                    name: 'searchable',
                                    label: '可检索',
                                    mode: 'normal',
                                    value: false,
                                    hiddenOnDefault: true,
                                    formType: 'extend',
                                    form: {
                                        body: [
                                            {
                                                type: 'input-text',
                                                name: 'noResultsText',
                                                label: tipedLabel('空提示', '检索无结果时的文本')
                                            }
                                        ]
                                    }
                                },
                                getSchemaTpl('onlyLeaf'),
                                [
                                    {
                                        type: 'switch',
                                        label: '可多选',
                                        name: 'multiple',
                                        value: false,
                                        inputClassName: 'is-inline'
                                    },
                                    {
                                        type: 'container',
                                        className: 'ae-ExtendMore',
                                        visibleOn: 'this.multiple',
                                        body: [
                                            {
                                                type: 'switch',
                                                label: tipedLabel('父级作为返回值', '开启后选中父级，不会全选子级选项，并且父级作为值返回'),
                                                horizontal: {
                                                    left: 6,
                                                    justify: true
                                                },
                                                name: 'onlyChildren',
                                                inputClassName: 'is-inline',
                                                visibleOn: '!this.onlyLeaf',
                                                pipeIn: function (value) { return !value; },
                                                pipeOut: function (value) { return !value; },
                                                onChange: function (value, origin, item, form) {
                                                    if (!value) {
                                                        // 父级作为返回值
                                                        form.setValues({
                                                            cascade: true,
                                                            withChildren: false,
                                                            onlyChildren: true
                                                        });
                                                    }
                                                    else {
                                                        form.setValues({
                                                            withChildren: false,
                                                            cascade: false,
                                                            onlyChildren: false
                                                        });
                                                    }
                                                }
                                            },
                                            getSchemaTpl('joinValues'),
                                            getSchemaTpl('delimiter', {
                                                visibleOn: 'this.joinValues'
                                            }),
                                            getSchemaTpl('extractValue', {
                                                visibleOn: '!this.joinValues'
                                            })
                                        ]
                                    }
                                ],
                                getSchemaTpl('hideNodePathLabel'),
                                getSchemaTpl('labelRemark'),
                                getSchemaTpl('remark'),
                                getSchemaTpl('placeholder'),
                                getSchemaTpl('description')
                            ]
                        },
                        {
                            title: '选项',
                            body: [
                                // getSchemaTpl('optionControl'), // 备注：级联选择 不适合用这种方式添加选项
                                getSchemaTpl('valueFormula', {
                                    rendererSchema: context === null || context === void 0 ? void 0 : context.schema,
                                    mode: 'vertical' // 改成上下展示模式
                                })
                            ]
                        },
                        getSchemaTpl('status', { isFormItem: true }),
                        getSchemaTpl('validation', {
                            tag: function (data) {
                                return ValidatorTag.MultiSelect;
                            }
                        })
                    ])
                },
                {
                    title: '外观',
                    body: getSchemaTpl('collapseGroup', [
                        getSchemaTpl('style:formItem', { renderer: renderer }),
                        {
                            title: '边框',
                            key: 'borderMode',
                            body: [getSchemaTpl('borderMode')]
                        },
                        getSchemaTpl('style:classNames', {
                            schema: [
                                getSchemaTpl('className', {
                                    label: '描述',
                                    name: 'descriptionClassName',
                                    visibleOn: 'this.description'
                                })
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
    return NestedSelectControlPlugin;
}(BasePlugin));
export { NestedSelectControlPlugin };
registerEditorPlugin(NestedSelectControlPlugin);
