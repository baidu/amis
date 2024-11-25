import {
  registerEditorPlugin,
  RendererPluginEvent,
  BaseEventContext,
  BasePlugin,
  getSchemaTpl
} from 'amis-editor-core';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../renderer/event-control';
import {FormulaDateType} from '../renderer/FormulaControl';

export class CalendarPlugin extends BasePlugin {
  static id = 'CalendarPlugin';
  // 关联渲染器名字
  rendererName = 'calendar';
  $schema = '/schemas/Calendar.json';

  // 组件名称
  name = '日历日程';
  isBaseComponent = true;
  icon = 'fa fa-calendar';
  pluginIcon = 'inputDatetime';

  panelTitle = '日历日程';

  description = '展示日历及日程。';
  docLink = '/amis/zh-CN/components/calendar';
  tags = ['展示'];

  scaffold = {
    type: 'calendar'
  };
  previewSchema = {
    ...this.scaffold
  };

  // 事件定义
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
      eventName: 'click',
      eventLabel: '点击',
      description: '点击时触发',
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
      eventName: 'mouseenter',
      eventLabel: '鼠标移入',
      description: '鼠标移入时触发',
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
      eventName: 'mouseleave',
      eventLabel: '鼠标移出',
      description: '鼠标移出时触发',
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

  actions = [
    {
      actionType: 'clear',
      actionLabel: '清空',
      description: '清空',
      ...getActionCommonProps('clear')
    },
    {
      actionType: 'reset',
      actionLabel: '重置',
      description: '将值重置为初始值',
      ...getActionCommonProps('reset')
    },
    {
      actionType: 'setValue',
      actionLabel: '赋值',
      description: '触发组件数据更新',
      ...getActionCommonProps('setValue')
    }
  ];

  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    return [
      getSchemaTpl('tabs', [
        {
          title: '属性',
          body: getSchemaTpl('collapseGroup', [
            {
              title: '基本',
              body: [
                getSchemaTpl('valueFormula', {
                  rendererSchema: {
                    type: 'input-date'
                  },
                  placeholder: '请选择静态值',
                  header: '表达式或相对值',
                  DateTimeType: FormulaDateType.IsDate,
                  label: '默认值'
                })
              ]
            },
            getSchemaTpl('status')
          ])
        },

        {
          title: '外观',
          body: getSchemaTpl('collapseGroup', [
            getSchemaTpl('style:classNames', {
              isFormItem: false
            })
          ])
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
      ])
    ];
  };
}

registerEditorPlugin(CalendarPlugin);
