import { __assign, __extends } from "tslib";
import { getSchemaTpl, valuePipeOut } from 'amis-editor-core';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { tipedLabel } from '../../component/BaseControl';
import { ValidatorTag } from '../../validator';
import { getEventControlConfig } from '../../util';
var SwitchControlPlugin = /** @class */ (function (_super) {
    __extends(SwitchControlPlugin, _super);
    function SwitchControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'switch';
        _this.$schema = '/schemas/SwitchControlSchema.json';
        _this.order = -400;
        // 组件名称
        _this.name = '开关';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-toggle-on';
        _this.description = "\u5F00\u5173\u63A7\u4EF6";
        _this.docLink = '/amis/zh-CN/components/form/switch';
        _this.tags = ['表单项'];
        _this.scaffold = {
            type: 'switch',
            option: '开关',
            name: 'switch',
            falseValue: false,
            trueValue: true
        };
        _this.previewSchema = {
            type: 'form',
            className: 'text-left',
            mode: 'horizontal',
            wrapWithPanel: false,
            body: [
                __assign(__assign({}, _this.scaffold), { label: '开关表单' })
            ]
        };
        _this.notRenderFormZone = true;
        _this.panelTitle = '开关';
        _this.events = [
            {
                eventName: 'change',
                eventLabel: '值变化',
                description: '开关值变化时触发',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data.value': {
                                type: 'string',
                                title: '开关值'
                            }
                        }
                    }
                ]
            }
        ];
        // 动作定义
        _this.actions = [
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
                                {
                                    name: 'option',
                                    type: 'input-text',
                                    label: '说明'
                                },
                                {
                                    type: 'ae-Switch-More',
                                    bulk: true,
                                    mode: 'normal',
                                    label: '填充文本',
                                    formType: 'extend',
                                    form: {
                                        body: [
                                            {
                                                name: 'onText',
                                                type: 'input-text',
                                                label: '开启时'
                                            },
                                            {
                                                name: 'offText',
                                                type: 'input-text',
                                                label: '关闭时'
                                            }
                                        ]
                                    }
                                },
                                {
                                    type: 'ae-Switch-More',
                                    bulk: true,
                                    mode: 'normal',
                                    label: tipedLabel('值格式', '默认勾选后的值 true，未勾选的值 false'),
                                    formType: 'extend',
                                    form: {
                                        body: [
                                            {
                                                type: 'input-text',
                                                label: '勾选后的值',
                                                name: 'trueValue',
                                                value: true,
                                                pipeOut: valuePipeOut,
                                                onChange: function (value, oldValue, model, form) {
                                                    if (oldValue === form.getValueByName('value')) {
                                                        form.setValueByName('value', value);
                                                    }
                                                }
                                            },
                                            {
                                                type: 'input-text',
                                                label: '未勾选的值',
                                                name: 'falseValue',
                                                value: false,
                                                pipeOut: valuePipeOut,
                                                onChange: function (value, oldValue, model, form) {
                                                    if (oldValue === form.getValueByName('value')) {
                                                        form.setValueByName('value', value);
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                },
                                /* 旧版设置默认值
                                getSchemaTpl('switch', {
                                  name: 'value',
                                  label: '默认开启',
                                  pipeIn: (value: any, data: any) => {
                                    const {trueValue = true} = data.data || {};
                                    return value === trueValue ? true : false;
                                  },
                                  pipeOut: (value: any, origin: any, data: any) => {
                                    return value
                                      ? data.trueValue || true
                                      : data.falseValue || false;
                                  }
                                }),
                                */
                                getSchemaTpl('valueFormula', {
                                    rendererSchema: context === null || context === void 0 ? void 0 : context.schema,
                                    rendererWrapper: true,
                                    valueType: 'boolean',
                                    pipeIn: function (value, data) {
                                        var _a = (data.data || {}).trueValue, trueValue = _a === void 0 ? true : _a;
                                        return value === trueValue ? true : false;
                                    },
                                    pipeOut: function (value, origin, data) {
                                        return value
                                            ? data.trueValue || true
                                            : data.falseValue || false;
                                    }
                                }),
                                getSchemaTpl('labelRemark'),
                                getSchemaTpl('remark'),
                                getSchemaTpl('description')
                            ]
                        },
                        getSchemaTpl('status', { isFormItem: true }),
                        getSchemaTpl('validation', { tag: ValidatorTag.Check })
                    ])
                },
                {
                    title: '外观',
                    body: getSchemaTpl('collapseGroup', [
                        getSchemaTpl('style:formItem', { renderer: context.info.renderer }),
                        {
                            title: '说明',
                            body: [
                                getSchemaTpl('horizontal-align', {
                                    name: 'optionAtLeft',
                                    pipeIn: function (v) { return (v ? 'left' : 'right'); },
                                    pipeOut: function (v) { return (v === 'left' ? true : undefined); }
                                })
                            ]
                        },
                        getSchemaTpl('style:classNames')
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
    return SwitchControlPlugin;
}(BasePlugin));
export { SwitchControlPlugin };
registerEditorPlugin(SwitchControlPlugin);
