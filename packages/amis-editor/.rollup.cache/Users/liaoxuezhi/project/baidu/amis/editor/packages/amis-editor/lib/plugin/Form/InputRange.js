import { __assign, __extends } from "tslib";
import { getSchemaTpl } from 'amis-editor-core';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { ValidatorTag } from '../../validator';
import { getEventControlConfig } from '../../util';
var RangeControlPlugin = /** @class */ (function (_super) {
    __extends(RangeControlPlugin, _super);
    function RangeControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'input-range';
        _this.$schema = '/schemas/RangeControlSchema.json';
        // 组件名称
        _this.name = '滑块';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-sliders';
        _this.description = "\u9009\u62E9\u67D0\u4E2A\u503C\u6216\u8005\u67D0\u4E2A\u8303\u56F4";
        _this.docLink = '/amis/zh-CN/components/form/input-range';
        _this.tags = ['表单项'];
        _this.scaffold = {
            type: 'input-range',
            label: '滑块',
            name: 'range'
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
        // 事件定义
        _this.events = [
            {
                eventName: 'change',
                eventLabel: '值变化',
                description: '滑块值变化时触发',
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
                eventName: 'focus',
                eventLabel: '获取焦点',
                description: '当设置 showInput 为 true 时，输入框获取焦点时触发',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data.value': {
                                type: 'string',
                                title: '滑块当前值'
                            }
                        }
                    }
                ]
            },
            {
                eventName: 'blur',
                eventLabel: '失去焦点',
                description: '当设置 showInput 为 true 时，输入框失去焦点时触发',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data.value': {
                                type: 'string',
                                title: '滑块当前值'
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
                description: '清除输入框'
            },
            {
                actionType: 'reset',
                actionLabel: '重置',
                description: '将值重置为resetValue，若没有配置resetValue，则清空'
            },
            {
                actionType: 'setValue',
                actionLabel: '赋值',
                description: '触发组件数据更新'
            }
        ];
        _this.panelTitle = '滑块';
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
                                {
                                    label: 'Label',
                                    name: 'label',
                                    type: 'input-text'
                                },
                                {
                                    label: '方式',
                                    name: 'multiple',
                                    type: 'select',
                                    value: false,
                                    options: [
                                        {
                                            label: '单滑块',
                                            value: false
                                        },
                                        {
                                            label: '双滑块',
                                            value: true
                                        }
                                    ]
                                },
                                {
                                    label: '最小值',
                                    name: 'min',
                                    type: 'input-number',
                                    value: 0
                                },
                                {
                                    label: '最大值',
                                    name: 'max',
                                    type: 'input-number',
                                    value: 100
                                },
                                {
                                    label: '默认值',
                                    name: 'value',
                                    type: 'input-number',
                                    value: 100,
                                    validations: 'isNumeric',
                                    visibleOn: 'typeof data.value !== undefined && !data.multiple',
                                    pipeIn: function (value) {
                                        return typeof value === 'number' ? value : 0;
                                    },
                                    pipeOut: function (value, origin, data) {
                                        return ((value < data.min && data.min) ||
                                            (value > data.max && data.max) ||
                                            value);
                                    }
                                },
                                {
                                    label: '默认值',
                                    type: 'input-group',
                                    name: 'value',
                                    visibleOn: 'typeof data.value !== undefined && data.multiple',
                                    className: 'inputGroup-addOn-no-border',
                                    body: [
                                        {
                                            type: 'input-number',
                                            validations: 'isNumeric',
                                            name: 'min',
                                            value: 0
                                        },
                                        {
                                            type: 'tpl',
                                            tpl: '-'
                                        },
                                        {
                                            type: 'input-number',
                                            validations: 'isNumeric',
                                            name: 'max',
                                            value: 100
                                        }
                                    ]
                                },
                                {
                                    label: '步长',
                                    name: 'step',
                                    type: 'input-number',
                                    value: 1
                                },
                                {
                                    type: 'input-text',
                                    name: 'unit',
                                    label: '单位',
                                    value: ''
                                },
                                // tooltipVisible 为true时，会一直显示，为undefined时，才会鼠标移入显示
                                getSchemaTpl('switch', {
                                    name: 'tooltipVisible',
                                    label: '值标签',
                                    value: undefined,
                                    pipeOut: function (value) {
                                        return !!value ? undefined : false;
                                    },
                                    pipeIn: function (value) {
                                        return value === undefined || value === true ? true : false;
                                    }
                                }),
                                {
                                    type: 'container',
                                    className: 'ae-ExtendMore mb-2',
                                    visibleOn: 'data.tooltipVisible === undefined',
                                    body: [
                                        {
                                            type: 'select',
                                            name: 'tooltipPlacement',
                                            label: '方向',
                                            value: 'auto',
                                            options: [
                                                { label: '自动', value: 'auto' },
                                                { label: '上', value: 'top' },
                                                { label: '下', value: 'bottom' },
                                                { label: '左', value: 'left' },
                                                { label: '右', value: 'right' }
                                            ]
                                        }
                                    ]
                                },
                                getSchemaTpl('switch', {
                                    name: 'showInput',
                                    label: '可输入',
                                    value: false
                                }),
                                getSchemaTpl('switch', {
                                    name: 'clearable',
                                    label: '可重置',
                                    value: false,
                                    visibleOn: '!!data.showInput'
                                })
                            ]
                        },
                        {
                            title: '轨道',
                            body: [
                                {
                                    type: 'ae-partsControl',
                                    mode: 'normal',
                                    name: 'partsSource'
                                },
                                {
                                    type: 'ae-marksControl',
                                    mode: 'normal',
                                    name: 'markSource'
                                }
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
    return RangeControlPlugin;
}(BasePlugin));
export { RangeControlPlugin };
registerEditorPlugin(RangeControlPlugin);
