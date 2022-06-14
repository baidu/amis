import { __assign, __extends, __spreadArray } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { tipedLabel } from '../../component/BaseControl';
import { ValidatorTag } from '../../validator';
import { getEventControlConfig } from '../../util';
var formatX = [
    {
        label: 'X(时间戳)',
        value: 'X'
    },
    {
        label: 'x(毫秒时间戳)',
        value: 'x'
    }
];
var DateType = {
    date: {
        format: 'YYYY-MM-DD',
        placeholder: '请选择日期',
        formatOptions: __spreadArray(__spreadArray([], formatX, true), [
            {
                label: 'YYYY-MM-DD',
                value: 'YYYY-MM-DD'
            },
            {
                label: 'YYYY/MM/DD',
                value: 'YYYY/MM/DD'
            },
            {
                label: 'YYYY年MM月DD日',
                value: 'YYYY年MM月DD日'
            }
        ], false)
    },
    datetime: {
        format: 'YYYY-MM-DD HH:mm:ss',
        placeholder: '请选择日期以及时间',
        formatOptions: __spreadArray(__spreadArray([], formatX, true), [
            {
                label: 'YYYY-MM-DD HH:mm:ss',
                value: 'YYYY-MM-DD HH:mm:ss'
            },
            {
                label: 'YYYY/MM/DD HH:mm:ss',
                value: 'YYYY/MM/DD HH:mm:ss'
            },
            {
                label: 'YYYY年MM月DD日 HH时mm分ss秒',
                value: 'YYYY年MM月DD日 HH时mm分ss秒'
            }
        ], false)
    },
    time: {
        format: 'HH:mm',
        placeholder: '请选择时间',
        formatOptions: [
            {
                label: 'HH:mm',
                value: 'HH:mm'
            },
            {
                label: 'HH:mm:ss',
                value: 'HH:mm:ss'
            },
            {
                label: 'HH时mm分',
                value: 'HH时mm分'
            },
            {
                label: 'HH时mm分ss秒',
                value: 'HH时mm分ss秒'
            }
        ]
    },
    month: {
        format: 'YYYY-MM',
        placeholder: '请选择月份',
        formatOptions: __spreadArray(__spreadArray([], formatX, true), [
            {
                label: 'YYYY-MM',
                value: 'YYYY-MM'
            },
            {
                label: 'MM',
                value: 'MM'
            },
            {
                label: 'M',
                value: 'M'
            }
        ], false)
    },
    quarter: {
        format: 'YYYY [Q]Q',
        placeholder: '请选择季度',
        formatOptions: __spreadArray(__spreadArray([], formatX, true), [
            {
                label: 'YYYY-[Q]Q',
                value: 'YYYY-[Q]Q'
            },
            {
                label: 'Q',
                value: 'Q'
            }
        ], false)
    },
    year: {
        format: 'YYYY',
        placeholder: '请选择年',
        formatOptions: __spreadArray(__spreadArray([], formatX, true), [
            {
                label: 'YYYY',
                value: 'YYYY'
            }
        ], false)
    }
};
var tipedLabelText = '支持 <code>now、+1day、-2weeks、+1hours、+2years</code>这种相对值用法，同时支持变量如<code>\\${start_date}</code>';
var DateControlPlugin = /** @class */ (function (_super) {
    __extends(DateControlPlugin, _super);
    function DateControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'input-date';
        _this.$schema = '/schemas/DateControlSchema.json';
        _this.order = -450;
        // 组件名称
        _this.icon = 'fa fa-calendar';
        _this.name = '日期';
        _this.isBaseComponent = true;
        // 添加源对应组件中文名称 & type字段
        _this.searchKeywords = '日期框、input-datetime、日期时间框、input-time、时间框、input-month、月份框、input-quarter、季度框、input-year、年框';
        _this.description = '年月日选择，支持相对值设定，如<code>+2days</code>两天后';
        _this.docLink = '/amis/zh-CN/components/form/input-date';
        _this.tags = ['表单项'];
        _this.scaffold = {
            type: 'input-date',
            label: '日期',
            name: 'date'
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
        _this.panelTitle = '日期配置';
        _this.events = [
            {
                eventName: 'change',
                eventLabel: '值变化',
                description: '时间值变化时触发',
                dataSchema: [
                    {
                        type: 'object',
                        properties: {
                            'event.data.value': {
                                type: 'string',
                                title: '时间值'
                            }
                        }
                    }
                ]
            },
            {
                eventName: 'focus',
                eventLabel: '获取焦点',
                description: '输入框获取焦点(非内嵌模式)时触发'
            },
            {
                eventName: 'blur',
                eventLabel: '失去焦点',
                description: '输入框失去焦点(非内嵌模式)时触发'
            }
        ];
        // 动作定义
        _this.actions = [
            {
                actionType: 'clear',
                actionLabel: '清空',
                description: '清空输入框内容'
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
                                getSchemaTpl('selectDateType', {
                                    value: _this.scaffold.type,
                                    onChange: function (value, oldValue, model, form) {
                                        var _a, _b;
                                        var type = value.split('-')[1];
                                        form.setValues({
                                            inputFormat: (_a = DateType[type]) === null || _a === void 0 ? void 0 : _a.format,
                                            placeholder: (_b = DateType[type]) === null || _b === void 0 ? void 0 : _b.placeholder,
                                            format: type === 'time' ? 'HH:mm' : 'X',
                                            minDate: '',
                                            maxDate: '',
                                            value: ''
                                        });
                                    }
                                }),
                                {
                                    type: 'input-text',
                                    name: 'format',
                                    label: tipedLabel('值格式', '提交数据前将根据设定格式化数据，请参考 <a href="https://momentjs.com/" target="_blank">moment</a> 中的格式用法。'),
                                    pipeIn: defaultValue('X')
                                },
                                {
                                    type: 'input-text',
                                    name: 'inputFormat',
                                    label: tipedLabel('显示格式', '请参考 <a href="https://momentjs.com/" target="_blank">moment</a> 中的格式用法。'),
                                    pipeIn: defaultValue('YYYY-MM-DD'),
                                    clearable: true,
                                    onChange: function (value, oldValue, model, form) {
                                        model.setOptions(DateType[form.data.type.split('-')[1]].formatOptions);
                                    },
                                    options: DateType[_this.scaffold.type.split('-')[1]].formatOptions
                                },
                                getSchemaTpl('utc'),
                                getSchemaTpl('clearable', {
                                    pipeIn: defaultValue(true)
                                }),
                                getSchemaTpl('valueFormula', {
                                    rendererSchema: context === null || context === void 0 ? void 0 : context.schema,
                                    label: tipedLabel('默认值', '支持 <code>now、+1day、-2weeks、+1hours、+2years</code>等这种相对值用法')
                                }),
                                getSchemaTpl('valueFormula', {
                                    name: 'minDate',
                                    rendererSchema: context === null || context === void 0 ? void 0 : context.schema,
                                    needDeleteValue: true,
                                    label: tipedLabel('最小值', tipedLabelText)
                                }),
                                getSchemaTpl('valueFormula', {
                                    name: 'maxDate',
                                    rendererSchema: context === null || context === void 0 ? void 0 : context.schema,
                                    needDeleteValue: true,
                                    label: tipedLabel('最大值', tipedLabelText)
                                }),
                                getSchemaTpl('placeholder', {
                                    pipeIn: defaultValue('请选择日期')
                                }),
                                // getSchemaTpl('remark'),
                                // getSchemaTpl('labelRemark'),
                                getSchemaTpl('description')
                            ]
                        },
                        getSchemaTpl('status', { isFormItem: true }),
                        getSchemaTpl('validation', {
                            tag: ValidatorTag.Date
                        })
                    ])
                },
                {
                    title: '外观',
                    body: getSchemaTpl('collapseGroup', [
                        getSchemaTpl('style:formItem', renderer),
                        getSchemaTpl('style:classNames', [
                            getSchemaTpl('className', {
                                label: '描述',
                                name: 'descriptionClassName',
                                visibleOn: 'this.description'
                            }),
                            getSchemaTpl('className', {
                                name: 'addOn.className',
                                label: 'AddOn',
                                visibleOn: 'this.addOn && this.addOn.type === "text"'
                            })
                        ]),
                        getSchemaTpl('style:others', [
                            {
                                name: 'embed',
                                type: 'button-group-select',
                                size: 'md',
                                label: '模式',
                                mode: 'row',
                                value: false,
                                options: [
                                    {
                                        label: '浮层',
                                        value: false
                                    },
                                    {
                                        label: '内嵌',
                                        value: true
                                    }
                                ]
                            }
                        ])
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
    return DateControlPlugin;
}(BasePlugin));
export { DateControlPlugin };
registerEditorPlugin(DateControlPlugin);
