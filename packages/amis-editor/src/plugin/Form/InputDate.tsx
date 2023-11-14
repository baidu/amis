import {registerEditorPlugin} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {BasePlugin, BaseEventContext, tipedLabel} from 'amis-editor-core';

import {ValidatorTag} from '../../validator';
import {getEventControlConfig} from '../../renderer/event-control/helper';
import {FormulaDateType} from '../../renderer/FormulaControl';
import {RendererPluginAction, RendererPluginEvent} from 'amis-editor-core';
import type {Schema} from 'amis';

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
    format: string; // 各类型时间的默认格式
    placeholder: string;
    formatOptions: Array<{label: string; value: string; timeFormat?: string}>; // 各类型时间支持展示格式
  };
} = {
  date: {
    format: 'YYYY-MM-DD',
    placeholder: '请选择日期',
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
    format: 'YYYY-MM-DD HH:mm:ss',
    placeholder: '请选择日期以及时间',
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
    format: 'YYYY [Q]Q',
    placeholder: '请选择季度',
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
    format: 'YYYY',
    placeholder: '请选择年',
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
  '支持例如: <code>now、+3days、-2weeks、+1hour、+2years</code> 等（minute|min|hour|day|week|month|year|weekday|second|millisecond）这种相对值用法';

export class DateControlPlugin extends BasePlugin {
  static id = 'DateControlPlugin';
  // 关联渲染器名字
  rendererName = 'input-date';
  $schema = '/schemas/DateControlSchema.json';

  // 组件名称
  icon = 'fa fa-calendar';
  pluginIcon = 'input-date-plugin';
  name = '日期';
  isBaseComponent = true;
  // 添加源对应组件中文名称 & type字段
  searchKeywords =
    '日期框、input-datetime、日期时间框、input-time、时间框、input-month、月份框、input-quarter、季度框、input-year、年框、年份框、年份选择';
  description = '年月日选择，支持相对值设定，如<code>+2days</code>两天后';
  docLink = '/amis/zh-CN/components/form/input-date';
  tags = ['表单项'];
  scaffold = {
    type: 'input-date',
    label: '日期',
    name: 'date'
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

  panelTitle = '日期配置';

  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: '值变化',
      description: '时间值变化时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                value: {
                  type: 'string',
                  title: '当前日期'
                }
              }
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
            data: {
              type: 'object',
              title: '数据',
              properties: {
                value: {
                  type: 'string',
                  title: '当前日期'
                }
              }
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
            data: {
              type: 'object',
              title: '数据',
              properties: {
                value: {
                  type: 'string',
                  title: '当前日期'
                }
              }
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
                getSchemaTpl('selectDateType', {
                  value: this.scaffold.type,
                  onChange: (
                    value: string,
                    oldValue: any,
                    model: any,
                    form: any
                  ) => {
                    let type: string = value.split('-')[1];

                    form.setValues({
                      placeholder: DateType[type]?.placeholder,
                      valueFormat: 'X',
                      displayFormat: DateType[type]?.format,
                      minDate: '',
                      maxDate: '',
                      value: ''
                    });
                  }
                }),
                {
                  type: 'input-text',
                  name: 'valueFormat',
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
                    const type = form.data.type.split('-')[1];
                    model.setOptions(DateType[type].formatOptions);
                  },
                  options:
                    DateType[this.scaffold.type.split('-')[1]].formatOptions
                },
                {
                  type: 'input-text',
                  name: 'displayFormat',
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
                    const type = form.data.type.split('-')[1];
                    model.setOptions(DateType[type].formatOptions);
                  },
                  options:
                    DateType[this.scaffold.type.split('-')[1]].formatOptions
                },
                getSchemaTpl('utc'),
                getSchemaTpl('clearable', {
                  pipeIn: defaultValue(true)
                }),
                getSchemaTpl('valueFormula', {
                  rendererSchema: (schema: Schema) => schema,
                  placeholder: '请选择静态值',
                  header: '表达式或相对值',
                  DateTimeType: FormulaDateType.IsDate,
                  label: tipedLabel('默认值', dateTooltip)
                }),
                getSchemaTpl('valueFormula', {
                  name: 'minDate',
                  header: '表达式或相对值',
                  DateTimeType: FormulaDateType.IsDate,
                  rendererSchema: () => {
                    const schema = this.manager.store.getSchema(
                      context.schema?.id,
                      'id'
                    );
                    return {
                      ...schema,
                      value: context?.schema.minDate
                    };
                  },
                  placeholder: '请选择静态值',
                  needDeleteProps: ['minDate'], // 避免自我限制
                  label: tipedLabel('最小值', dateTooltip)
                }),
                getSchemaTpl('valueFormula', {
                  name: 'maxDate',
                  header: '表达式或相对值',
                  DateTimeType: FormulaDateType.IsDate,
                  rendererSchema: () => {
                    const schema = this.manager.store.getSchema(
                      context.schema?.id,
                      'id'
                    );
                    return {
                      ...schema,
                      value: context?.schema.maxDate
                    };
                  },
                  needDeleteProps: ['maxDate'], // 避免自我限制
                  label: tipedLabel('最大值', dateTooltip)
                }),
                getSchemaTpl('placeholder', {
                  pipeIn: defaultValue('请选择日期')
                }),
                getSchemaTpl('remark'),
                getSchemaTpl('labelRemark'),
                getSchemaTpl('description'),
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

registerEditorPlugin(DateControlPlugin);
