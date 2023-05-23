import {defaultValue, getSchemaTpl, tipedLabel} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin, BaseEventContext} from 'amis-editor-core';

import {ValidatorTag} from '../../validator';
import {getEventControlConfig} from '../../renderer/event-control/helper';
import {FormulaDateType} from '../../renderer/FormulaControl';
import {RendererPluginAction, RendererPluginEvent} from 'amis-editor-core';
import {getRendererByName} from 'amis-core';

const formatX = [
  {
    label: 'X(时间戳)',
    value: 'X'
  },
  {
    label: 'x(毫秒时间戳)',
    value: 'x'
  }
];
const DateType: {
  [key: string]: {
    format: string;
    placeholder: string;
    shortcuts: string[];
    /** shortcuts的兼容配置, 不需要配置了 */
    ranges?: string[];
    sizeMutable?: boolean;
    type?: string;
    timeFormat?: string;
    formatOptions: Array<{label: string; value: string; timeFormat?: string}>;
  };
} = {
  date: {
    ...getRendererByName('input-date-range'),
    format: 'YYYY-MM-DD',
    placeholder: '请选择日期范围',
    shortcuts: [
      'yesterday',
      '7daysago',
      'prevweek',
      'thismonth',
      'prevmonth',
      'prevquarter'
    ],
    formatOptions: [
      ...formatX,
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
    ]
  },
  datetime: {
    ...getRendererByName('input-datetime-range'),
    format: 'YYYY-MM-DD HH:mm:ss',
    timeFormat: 'HH:mm:ss',
    placeholder: '请选择日期时间范围',
    shortcuts: [
      'yesterday',
      '7daysago',
      'prevweek',
      'thismonth',
      'prevmonth',
      'prevquarter'
    ],
    formatOptions: [
      ...formatX,
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
    ]
  },
  time: {
    ...getRendererByName('input-time-range'),
    format: 'HH:mm',
    timeFormat: 'HH:mm:ss',
    placeholder: '请选择时间范围',
    shortcuts: [],
    formatOptions: [
      {
        label: 'HH:mm',
        value: 'HH:mm',
        timeFormat: 'HH:mm'
      },
      {
        label: 'HH:mm:ss',
        value: 'HH:mm:ss',
        timeFormat: 'HH:mm:ss'
      },
      {
        label: 'HH时mm分',
        value: 'HH时mm分',
        timeFormat: 'HH:mm'
      },
      {
        label: 'HH时mm分ss秒',
        value: 'HH时mm分ss秒',
        timeFormat: 'HH:mm:ss'
      }
    ]
  },
  month: {
    ...getRendererByName('input-month-range'),
    format: 'YYYY-MM',
    placeholder: '请选择月份范围',
    shortcuts: [],
    formatOptions: [
      ...formatX,
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
    ]
  },
  quarter: {
    ...getRendererByName('input-quarter-range'),
    format: 'YYYY [Q]Q',
    placeholder: '请选择季度范围',
    shortcuts: ['thisquarter', 'prevquarter'],
    formatOptions: [
      ...formatX,
      {
        label: 'YYYY-[Q]Q',
        value: 'YYYY-[Q]Q'
      },
      {
        label: 'Q',
        value: 'Q'
      }
    ]
  },
  year: {
    ...getRendererByName('input-year-range'),
    format: 'YYYY',
    placeholder: '请选择年范围',
    shortcuts: ['thisyear', 'lastYear'],
    formatOptions: [
      ...formatX,
      {
        label: 'YYYY',
        value: 'YYYY'
      }
    ]
  }
};

const dateTooltip =
  '支持例如: <code>now、+3days、-2weeks、+1hour、+2years</code> 等（minute|hour|day|week|month|year|weekday|second|millisecond）这种相对值用法';
const rangTooltip =
  '支持例如: <code>3days、2weeks、1hour、2years</code> 等（minute|hour|day|week|month|year|weekday|second|millisecond）这种相对值用法';

const sizeImmutableComponents = Object.values(DateType)
  .map(item => (item?.sizeMutable === false ? item.type : null))
  .filter(a => a);

export class DateRangeControlPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'input-date-range';
  $schema = '/schemas/DateRangeControlSchema.json';

  // 组件名称
  icon = 'fa fa-calendar';
  pluginIcon = 'input-date-range-plugin';
  name = '日期范围';
  isBaseComponent = true;
  // 添加源对应组件中文名称 & type字段
  searchKeywords =
    '日期范围框、input-datetime-range、日期时间范围、input-time-range、时间范围、input-month-range、月份范围、input-quarter-range、季度范围、input-year-range、年范围';
  description =
    '日期范围选择，可通过<code>minDate</code>、<code>maxDate</code>设定最小、最大日期';
  docLink = '/amis/zh-CN/components/form/input-date-range';
  tags = ['表单项'];
  scaffold = {
    type: 'input-date-range',
    label: '日期范围',
    name: 'date-range'
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold
      }
    ]
  };

  notRenderFormZone = true;

  panelTitle = '日期范围';

  events: RendererPluginEvent[] = [
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
  actions: RendererPluginAction[] = [
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

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    const renderer: any = context.info.renderer;

    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl(
          'collapseGroup',
          [
            {
              title: '基本',
              body: [
                getSchemaTpl('layout:originPosition', {value: 'left-top'}),
                getSchemaTpl('formItemName', {
                  required: true
                }),
                getSchemaTpl('label'),
                getSchemaTpl('selectDateRangeType', {
                  value: this.scaffold.type,
                  onChange: (
                    value: string,
                    oldValue: any,
                    model: any,
                    form: any
                  ) => {
                    const type: string = value.split('-')[1];
                    form.setValues({
                      inputFormat: DateType[type]?.format,
                      timeFormat: DateType[type]?.timeFormat,
                      placeholder: DateType[type]?.placeholder,
                      format: type === 'time' ? 'HH:mm' : 'X',
                      minDate: '',
                      maxDate: '',
                      value: '',
                      shortcuts: DateType[type]?.shortcuts,
                      /** amis 3.1.0之后ranges属性废弃 */
                      ranges: undefined,
                      // size immutable 组件去除 size 字段
                      size: sizeImmutableComponents.includes(value)
                        ? undefined
                        : form.data?.size
                    });
                  }
                }),
                {
                  type: 'input-text',
                  name: 'format',
                  label: tipedLabel(
                    '值格式',
                    '提交数据前将根据设定格式化数据，请参考 <a href="https://momentjs.com/" target="_blank">moment</a> 中的格式用法。'
                  ),
                  pipeIn: defaultValue('X'),
                  clearable: true,
                  onChange: (
                    value: string,
                    oldValue: any,
                    model: any,
                    form: any
                  ) => {
                    model.setOptions(
                      DateType[form.data.type.split('-')[1]].formatOptions
                    );
                  },
                  options:
                    DateType[this.scaffold.type.split('-')[1]].formatOptions
                },
                {
                  type: 'input-text',
                  name: 'inputFormat',
                  label: tipedLabel(
                    '显示格式',
                    '请参考 <a href="https://momentjs.com/" target="_blank">moment</a> 中的格式用法。'
                  ),
                  pipeIn: defaultValue('YYYY-MM-DD'),
                  clearable: true,
                  onChange: (
                    value: string,
                    oldValue: any,
                    model: any,
                    form: any
                  ) => {
                    model.setOptions(
                      DateType[form.data.type.split('-')[1]].formatOptions
                    );
                  },
                  options:
                    DateType[this.scaffold.type.split('-')[1]].formatOptions
                },
                getSchemaTpl('utc'),
                getSchemaTpl('clearable', {
                  pipeIn: defaultValue(true)
                }),

                getSchemaTpl('valueFormula', {
                  rendererSchema: {
                    ...context?.schema,
                    size: 'full',
                    mode: 'inline'
                  },
                  mode: 'vertical',
                  header: '表达式或相对值',
                  DateTimeType: FormulaDateType.IsRange,
                  label: tipedLabel('默认值', dateTooltip)
                }),
                getSchemaTpl('valueFormula', {
                  name: 'minDate',
                  header: '表达式或相对值',
                  DateTimeType: FormulaDateType.IsDate,
                  rendererSchema: {
                    ...context?.schema,
                    value: context?.schema.minDate,
                    type: 'input-date'
                  },
                  placeholder: '请选择静态值',
                  needDeleteProps: ['minDate'], // 避免自我限制
                  label: tipedLabel('最小值', dateTooltip)
                }),
                getSchemaTpl('valueFormula', {
                  name: 'maxDate',
                  header: '表达式或相对值',
                  DateTimeType: FormulaDateType.IsDate,
                  rendererSchema: {
                    ...context?.schema,
                    value: context?.schema.maxDate,
                    type: 'input-date'
                  },
                  placeholder: '请选择静态值',
                  needDeleteProps: ['maxDate'], // 避免自我限制
                  label: tipedLabel('最大值', dateTooltip)
                }),

                getSchemaTpl('valueFormula', {
                  name: 'minDuration',
                  header: '表达式',
                  DateTimeType: FormulaDateType.NotDate,
                  rendererSchema: {
                    ...context?.schema,
                    value: context?.schema.minDuration,
                    type: 'input-text'
                  },
                  placeholder: '请输入相对值',
                  needDeleteProps: ['minDuration'], // 避免自我限制
                  label: tipedLabel('最小跨度', rangTooltip)
                }),

                getSchemaTpl('valueFormula', {
                  name: 'maxDuration',
                  header: '表达式',
                  DateTimeType: FormulaDateType.NotDate,
                  rendererSchema: {
                    ...context?.schema,
                    value: context?.schema.maxDuration,
                    type: 'input-text'
                  },
                  placeholder: '请输入相对值',
                  needDeleteProps: ['maxDuration'], // 避免自我限制
                  label: tipedLabel('最大跨度', rangTooltip)
                }),
                getSchemaTpl('dateShortCutControl', {
                  name: 'shortcuts',
                  mode: 'normal',
                  normalDropDownOption: {
                    yesterday: '昨天',
                    thisweek: '这个周',
                    prevweek: '上周',
                    thismonth: '这个月',
                    prevmonth: '上个月',
                    thisquarter: '这个季度',
                    prevquarter: '上个季度',
                    thisyear: '今年'
                  },
                  customDropDownOption: {
                    daysago: '最近n天',
                    dayslater: 'n天以内',
                    weeksago: '最近n周',
                    weekslater: 'n周以内',
                    monthsago: '最近n月',
                    monthslater: 'n月以内',
                    quartersago: '最近n季度',
                    quarterslater: 'n季度以内',
                    yearsago: '最近n年',
                    yearslater: 'n年以内'
                  }
                }),
                getSchemaTpl('remark'),
                getSchemaTpl('labelRemark'),
                getSchemaTpl('startPlaceholder'),
                getSchemaTpl('endPlaceholder'),
                getSchemaTpl('autoFillApi')
              ]
            },
            getSchemaTpl('status', {isFormItem: true}),
            getSchemaTpl('validation', {
              tag: ValidatorTag.Date
            })
          ],
          {...context?.schema, configTitle: 'props'}
        )
      },
      {
        title: '外观',
        body: getSchemaTpl(
          'collapseGroup',
          [
            getSchemaTpl('style:formItem', {
              renderer: {...renderer, sizeMutable: false},
              schema: [
                // 需要作为一个字符串表达式传入，因为切换 type 后 panelBodyCreator 不会重新执行
                getSchemaTpl('formItemSize', {
                  hiddenOn: `["${sizeImmutableComponents.join(
                    '","'
                  )}"].includes(this.type)`
                })
              ]
            }),
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
                pipeIn: defaultValue(false),
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
          ],
          {...context?.schema, configTitle: 'style'}
        )
      },
      {
        title: '事件',
        className: 'p-none',
        body: [
          getSchemaTpl('eventControl', {
            name: 'onEvent',
            ...getEventControlConfig(this.manager, context)
          })
        ]
      }
    ]);
  };
}

registerEditorPlugin(DateRangeControlPlugin);
