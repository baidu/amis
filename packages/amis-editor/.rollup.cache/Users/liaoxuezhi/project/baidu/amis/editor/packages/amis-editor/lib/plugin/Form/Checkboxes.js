import { __assign, __extends } from "tslib";
import { getSchemaTpl } from 'amis-editor-core';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { ValidatorTag } from '../../validator';
import { getEventControlConfig } from '../../util';
var CheckboxesControlPlugin = /** @class */ (function (_super) {
    __extends(CheckboxesControlPlugin, _super);
    function CheckboxesControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'checkboxes';
        _this.$schema = '/schemas/CheckboxesControlSchema.json';
        _this.order = -470;
        // 组件名称
        _this.name = '复选框';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-check-square';
        _this.description = '通过<code>options</code>配置多个勾选框，也可以通过<code>source</code>拉取选项';
        _this.docLink = '/amis/zh-CN/components/form/checkboxes';
        _this.tags = ['表单项'];
        _this.scaffold = {
            type: 'checkboxes',
            label: '复选框',
            name: 'checkboxes',
            multiple: true,
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
                __assign({ value: 'A' }, _this.scaffold)
            ]
        };
        _this.notRenderFormZone = true;
        _this.panelTitle = '复选框';
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
                                [
                                    getSchemaTpl('switch', {
                                        label: '可全选',
                                        name: 'checkAll',
                                        value: false,
                                        visibleOn: 'data.multiple',
                                        onChange: function (value, origin, item, form) {
                                            if (!value) {
                                                // 可全选关闭时，默认全选也需联动关闭
                                                form.setValueByName('defaultCheckAll', false);
                                            }
                                        }
                                    }),
                                    {
                                        type: 'container',
                                        className: 'ae-ExtendMore mb-2',
                                        visibleOn: 'data.checkAll',
                                        body: [
                                            getSchemaTpl('switch', {
                                                label: '默认全选',
                                                name: 'defaultCheckAll',
                                                value: false
                                            })
                                        ]
                                    }
                                ],
                                getSchemaTpl('valueFormula', {
                                    rendererSchema: context === null || context === void 0 ? void 0 : context.schema,
                                    useSelectMode: true,
                                    visibleOn: 'this.options && this.options.length > 0'
                                }),
                                getSchemaTpl('joinValues', {
                                    visibleOn: true
                                }),
                                getSchemaTpl('delimiter', {
                                    visibleOn: 'data.joinValues === true'
                                }),
                                getSchemaTpl('extractValue'),
                                getSchemaTpl('labelRemark'),
                                getSchemaTpl('remark'),
                                getSchemaTpl('description')
                            ]
                        },
                        {
                            title: '选项',
                            body: [
                                getSchemaTpl('optionControlV2', {
                                    multiple: true
                                }),
                                getSchemaTpl('creatable', {
                                    formType: 'extend',
                                    hiddenOnDefault: true,
                                    form: {
                                        body: [getSchemaTpl('createBtnLabel'), getSchemaTpl('addApi')]
                                    }
                                }),
                                getSchemaTpl('editable', {
                                    formType: 'extend',
                                    hiddenOnDefault: true,
                                    form: {
                                        body: [getSchemaTpl('editApi')]
                                    }
                                }),
                                getSchemaTpl('removable', {
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
                            getSchemaTpl('style:formItem', { renderer: renderer }),
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
    return CheckboxesControlPlugin;
}(BasePlugin));
export { CheckboxesControlPlugin };
registerEditorPlugin(CheckboxesControlPlugin);
