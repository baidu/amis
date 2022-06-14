import { __assign, __extends } from "tslib";
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { tipedLabel } from '../../component/BaseControl';
import { ValidatorTag } from '../../validator';
import { getEventControlConfig } from '../../util';
var DateType = {
    date: {
        format: 'YYYY-MM-DD',
        placeholder: '请选择日期范围',
        ranges: [
            'yesterday',
            '7daysago',
            'prevweek',
            'thismonth',
            'prevmonth',
            'prevquarter'
        ]
    },
    datetime: {
        format: 'YYYY-MM-DD HH:mm:ss',
        placeholder: '请选择日期时间范围',
        ranges: [
            'yesterday',
            '7daysago',
            'prevweek',
            'thismonth',
            'prevmonth',
            'prevquarter'
        ]
    },
    time: {
        format: 'HH:mm',
        placeholder: '请选择时间范围',
        ranges: []
    },
    month: {
        format: 'YYYY-MM',
        placeholder: '请选择月份范围',
        ranges: []
    },
    quarter: {
        format: 'YYYY [Q]Q',
        placeholder: '请选择季度范围',
        ranges: ['thisquarter', 'prevquarter']
    },
    year: {
        format: 'YYYY',
        placeholder: '请选择年范围',
        ranges: ['thisyear', 'lastYear']
    }
};
var tipedLabelText = '支持 <code>now、+1day、-2weeks、+1hours、+2years</code>这种相对值用法，同时支持变量如<code>\\${start_date}</code>';
var DateRangeControlPlugin = /** @class */ (function (_super) {
    __extends(DateRangeControlPlugin, _super);
    function DateRangeControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'input-date-range';
        _this.$schema = '/schemas/DateRangeControlSchema.json';
        _this.order = -440;
        // 组件名称
        _this.icon = 'fa fa-calendar';
        _this.name = '日期范围';
        _this.isBaseComponent = true;
        // 添加源对应组件中文名称 & type字段
        _this.searchKeywords = '日期范围框、input-datetime-range、日期时间范围、input-time-range、时间范围、input-month-range、月份范围、input-quarter-range、季度范围、input-year-range、年范围';
        _this.description = '日期范围选择，可通过<code>minDate</code>、<code>maxDate</code>设定最小、最大日期';
        _this.docLink = '/amis/zh-CN/components/form/input-date-range';
        _this.tags = ['表单项'];
        _this.scaffold = {
            type: 'input-date-range',
            label: '日期范围',
            name: 'date-range'
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
        _this.panelTitle = '日期范围';
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
                description: '输入框获取焦点(非内嵌模式)时触发',
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
                eventName: 'blur',
                eventLabel: '失去焦点',
                description: '输入框失去焦点(非内嵌模式)时触发',
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
                                getSchemaTpl('selectDateRangeType', {
                                    value: _this.scaffold.type,
                                    onChange: function (value, oldValue, model, form) {
                                        var _a, _b, _c;
                                        var type = value.split('-')[1];
                                        form.setValues({
                                            inputFormat: (_a = DateType[type]) === null || _a === void 0 ? void 0 : _a.format,
                                            placeholder: (_b = DateType[type]) === null || _b === void 0 ? void 0 : _b.placeholder,
                                            format: type === 'time' ? 'HH:mm' : 'X',
                                            minDate: '',
                                            maxDate: '',
                                            value: '',
                                            ranges: (_c = DateType[type]) === null || _c === void 0 ? void 0 : _c.ranges
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
                                    clearable: true
                                    // onChange: (
                                    //   value: string,
                                    //   oldValue: any,
                                    //   model: any,
                                    //   form: any
                                    // ) => {
                                    //   model.setOptions(
                                    //     DateType[form.data.type.split('-')[1]].formatOptions
                                    //   );
                                    // },
                                    // options:
                                    //   DateType[this.scaffold.type.split('-')[1]].formatOptions
                                },
                                getSchemaTpl('utc'),
                                getSchemaTpl('clearable', {
                                    pipeIn: defaultValue(true)
                                }),
                                getSchemaTpl('valueFormula', {
                                    /* 备注: 待 amis 日期组件优化
                                    rendererSchema: {
                                      ...context?.schema,
                                      size: 'full', // 备注：目前样式还有问题，需要在amis端进行优化
                                      mode: "inline"
                                    },
                                    mode: 'vertical',
                                    */
                                    rendererSchema: {
                                        type: 'input-date'
                                    },
                                    label: tipedLabel('默认值', '支持 <code>now、+1day、-2weeks、+1hours、+2years</code>等这种相对值用法')
                                }),
                                getSchemaTpl('valueFormula', {
                                    name: 'minDate',
                                    rendererSchema: {
                                        type: 'input-date'
                                    },
                                    needDeleteValue: true,
                                    label: tipedLabel('最小值', tipedLabelText)
                                }),
                                getSchemaTpl('valueFormula', {
                                    name: 'maxDate',
                                    rendererSchema: {
                                        type: 'input-date'
                                    },
                                    needDeleteValue: true,
                                    label: tipedLabel('最大值', tipedLabelText)
                                }),
                                getSchemaTpl('formulaControl', {
                                    name: 'minDuration',
                                    label: tipedLabel('最小跨度', '例如 2days'),
                                    placeholder: '请输入最小跨度',
                                    inputClassName: 'is-inline'
                                }),
                                getSchemaTpl('formulaControl', {
                                    name: 'maxDuration',
                                    label: tipedLabel('最大跨度', '例如 1year'),
                                    placeholder: '请输入最大跨度',
                                    inputClassName: 'is-inline'
                                }),
                                getSchemaTpl('dateShortCutControl', {
                                    mode: 'normal',
                                    dropDownOption: {
                                        'yesterday': '昨天',
                                        'thisweek': '本周',
                                        'prevweek': '上周',
                                        '7daysago': '最近7天',
                                        'thismonth': '本月',
                                        'prevmonth': '上月',
                                        'thisquarter': '本季度',
                                        'prevquarter': '上季度',
                                        'thisyear': '本年'
                                    }
                                }),
                                // getSchemaTpl('remark'),
                                // getSchemaTpl('labelRemark'),
                                {
                                    type: 'input-text',
                                    name: 'startPlaceholder',
                                    label: '前占位提示',
                                    pipeIn: defaultValue('选择开始时间')
                                },
                                {
                                    type: 'input-text',
                                    name: 'endPlaceholder',
                                    label: '后占位提示',
                                    pipeIn: defaultValue('选择结束时间')
                                }
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
    return DateRangeControlPlugin;
}(BasePlugin));
export { DateRangeControlPlugin };
registerEditorPlugin(DateRangeControlPlugin);
