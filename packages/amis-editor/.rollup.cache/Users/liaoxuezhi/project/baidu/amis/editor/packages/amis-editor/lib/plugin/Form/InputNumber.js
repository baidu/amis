import { __assign, __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { isObject } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { getSchemaTpl } from 'amis-editor-core';
import { tipedLabel } from '../../component/BaseControl';
import { ValidatorTag } from '../../validator';
import { getEventControlConfig } from '../../util';
var NumberControlPlugin = /** @class */ (function (_super) {
    __extends(NumberControlPlugin, _super);
    function NumberControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'input-number';
        _this.$schema = '/schemas/NumberControlSchema.json';
        _this.order = -410;
        // 组件名称
        _this.name = '数字框';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-sort-numeric-asc';
        _this.description = '支持设定最大值和最小值，以及步长与精度';
        _this.docLink = '/amis/zh-CN/components/form/input-number';
        _this.tags = ['表单项'];
        _this.scaffold = {
            type: 'input-number',
            label: '数字',
            name: 'number-text'
        };
        _this.previewSchema = {
            type: 'form',
            className: 'text-left',
            mode: 'horizontal',
            wrapWithPanel: false,
            body: [
                __assign(__assign({}, _this.scaffold), { value: 88 })
            ]
        };
        _this.notRenderFormZone = true;
        _this.panelTitle = '数字框';
        _this.panelJustify = true;
        // 事件定义
        _this.events = [
            {
                eventName: 'change',
                eventLabel: '值变化',
                description: '数值变化',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data.value': {
                                type: 'string',
                                title: '输入值'
                            }
                        }
                    }
                ]
            },
            {
                eventName: 'focus',
                eventLabel: '获取焦点',
                description: '数字框获取焦点',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data.value': {
                                type: 'string',
                                title: '当前值'
                            }
                        }
                    }
                ]
            },
            {
                eventName: 'blur',
                eventLabel: '失去焦点',
                description: '数字框失去焦点',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data.value': {
                                type: 'string',
                                title: '当前值'
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
                description: '清空数字框内容'
            },
            {
                actionType: 'reset',
                actionLabel: '重置',
                description: '重置为默认值'
            },
            {
                actionType: 'setValue',
                actionLabel: '赋值',
                description: '触发组件数据更新'
            }
        ];
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
                                    label: '输入框样式',
                                    name: 'displayMode',
                                    type: 'select',
                                    value: 'base',
                                    options: [
                                        {
                                            label: '基础版',
                                            value: 'base'
                                        },
                                        {
                                            label: '加强版',
                                            value: 'enhance'
                                        }
                                    ]
                                },
                                getSchemaTpl('numberSwitchKeyboard'),
                                getSchemaTpl('kilobitSeparator'),
                                getSchemaTpl('valueFormula', {
                                    rendererSchema: context === null || context === void 0 ? void 0 : context.schema,
                                    valueType: 'number' // 期望数值类型
                                }),
                                getSchemaTpl('valueFormula', {
                                    name: 'min',
                                    rendererSchema: context === null || context === void 0 ? void 0 : context.schema,
                                    needDeleteValue: true,
                                    label: tipedLabel('最小值', '请输入数字或使用 <code>\\${xxx}</code> 来获取变量，否则该配置不生效'),
                                    valueType: 'number'
                                }),
                                getSchemaTpl('valueFormula', {
                                    name: 'max',
                                    rendererSchema: context === null || context === void 0 ? void 0 : context.schema,
                                    needDeleteValue: true,
                                    label: tipedLabel('最大值', '请输入数字或使用 <code>\\${xxx}</code> 来获取变量，否则该配置不生效'),
                                    valueType: 'number'
                                }),
                                {
                                    type: 'input-number',
                                    name: 'step',
                                    label: '步长'
                                },
                                {
                                    type: 'input-number',
                                    name: 'precision',
                                    label: '小数点精度',
                                    min: 0,
                                    max: 100
                                },
                                getSchemaTpl('combo-container', {
                                    type: 'combo',
                                    label: '单位选项',
                                    mode: 'normal',
                                    name: 'unitOptions',
                                    flat: true,
                                    items: [
                                        {
                                            placeholder: '单位选项',
                                            type: 'input-text',
                                            name: 'text'
                                        }
                                    ],
                                    draggable: false,
                                    multiple: true,
                                    pipeIn: function (value) {
                                        if (!isObject(value)) {
                                            return Array.isArray(value) ? value : [];
                                        }
                                        var res = value.map(function (item) { return item.value; });
                                        return res;
                                    },
                                    pipeOut: function (value) {
                                        if (!value.length) {
                                            return undefined;
                                        }
                                        return value;
                                    }
                                }),
                                getSchemaTpl('labelRemark'),
                                getSchemaTpl('remark'),
                                getSchemaTpl('placeholder'),
                                getSchemaTpl('description')
                            ]
                        },
                        getSchemaTpl('status', { isFormItem: true }),
                        getSchemaTpl('validation', { tag: ValidatorTag.MultiSelect })
                    ], __assign(__assign({}, context === null || context === void 0 ? void 0 : context.schema), { configTitle: 'props' }))
                },
                {
                    title: '外观',
                    body: [
                        getSchemaTpl('collapseGroup', [
                            getSchemaTpl('style:formItem', { renderer: context.info.renderer }),
                            getSchemaTpl('style:classNames')
                        ], __assign(__assign({}, context === null || context === void 0 ? void 0 : context.schema), { configTitle: 'style' }))
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
    return NumberControlPlugin;
}(BasePlugin));
export { NumberControlPlugin };
registerEditorPlugin(NumberControlPlugin);
