import {registerEditorPlugin} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {BasePlugin, BaseEventContext, tipedLabel} from 'amis-editor-core';

import {ValidatorTag} from '../../validator';
import {getEventControlConfig} from '../../renderer/event-control/helper';
import {RendererPluginAction, RendererPluginEvent} from 'amis-editor-core';

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
    formatOptions: Array<{label: string; value: string; timeFormat?: string}>;
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
        value: 'HH:mm',
        timeFormat: 'HH:mm'
      },
      {
        label: 'HH:mm:ss',
        value: 'HH:mm:ss',
        timeFormat: 'HH:mm'
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

const tipedLabelText =
  '支持 <code>now、+1day、-2weeks、+1hours、+2years</code>这种相对值用法，同时支持变量如<code>\\${start_date}</code>';

export class DateControlPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'input-date';
  $schema = '/schemas/DateControlSchema.json';

  order = -450;

  // 组件名称
  icon = 'fa fa-calendar';
  pluginIcon = 'input-date-plugin';
  name = '日期';
  isBaseComponent = true;
  // 添加源对应组件中文名称 & type字段
  searchKeywords =
    '日期框、input-datetime、日期时间框、input-time、时间框、input-month、月份框、input-quarter、季度框、input-year、年框';
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
                      inputFormat: DateType[type]?.format,
                      placeholder: DateType[type]?.placeholder,
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
                  label: tipedLabel(
                    '值格式',
                    '提交数据前将根据设定格式化数据，请参考 <a href="https://momentjs.com/" target="_blank">moment</a> 中的格式用法。'
                  ),
                  pipeIn: defaultValue('X')
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
                    const type = form.data.type.split('-')[1];
                    model.setOptions(DateType[type].formatOptions);
                    // 时间日期类组件 input-time 需要更加关注 timeFormat 和 inputFormat 属性区别
                    // inputFormat 表示输入框内的显示格式； timeFormat表示选择下拉弹窗中展示"HH、mm、ss"的组合
                    if (type === 'time') {
                      const timeFormatObj = DateType[type].formatOptions.find(
                        item => item.value === value
                      );
                      const timeFormat = timeFormatObj
                        ? (timeFormatObj as any).timeFormat
                        : 'HH:mm:ss';
                      form.setValues({
                        timeFormat: timeFormat
                      });
                    }
                  },
                  options:
                    DateType[this.scaffold.type.split('-')[1]].formatOptions
                },
                getSchemaTpl('utc'),
                getSchemaTpl('clearable', {
                  pipeIn: defaultValue(true)
                }),
                getSchemaTpl('valueFormula', {
                  rendererSchema: context?.schema,
                  label: tipedLabel(
                    '默认值',
                    '支持 <code>now、+1day、-2weeks、+1hours、+2years</code>等这种相对值用法'
                  )
                }),
                getSchemaTpl('valueFormula', {
                  name: 'minDate',
                  rendererSchema: {
                    ...context?.schema,
                    value: context?.schema.minDate
                  },
                  needDeleteProps: ['minDate'], // 避免自我限制
                  label: tipedLabel('最小值', tipedLabelText)
                }),
                getSchemaTpl('valueFormula', {
                  name: 'maxDate',
                  rendererSchema: {
                    ...context?.schema,
                    value: context?.schema.maxDate
                  },
                  needDeleteProps: ['maxDate'], // 避免自我限制
                  label: tipedLabel('最大值', tipedLabelText)
                }),
                getSchemaTpl('placeholder', {
                  pipeIn: defaultValue('请选择日期')
                }),
                // getSchemaTpl('remark'),
                // getSchemaTpl('labelRemark'),
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
