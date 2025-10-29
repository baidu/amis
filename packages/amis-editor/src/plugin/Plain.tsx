import {
  registerEditorPlugin,
  RendererPluginAction,
  RendererPluginEvent
} from 'amis-editor-core';
import {BaseEventContext, BasePlugin} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {getEventControlConfig} from '../renderer/event-control/helper';

export class PlainPlugin extends BasePlugin {
  static id = 'PlainPlugin';
  // 关联渲染器名字
  rendererName = 'plain';
  $schema = '/schemas/AMISPlainSchema.json';
  disabledRendererPlugin = true; // 组件面板不显示

  // 组件名称
  name = '纯文本';
  isBaseComponent = true;
  icon = 'fa fa-file-text-o';
  pluginIcon = 'plain-plugin';
  description = '用来展示纯文字，html 标签会被转义。';
  docLink = '/amis/zh-CN/components/plain';
  tags = ['展示'];
  previewSchema = {
    type: 'plain',
    text: '这是纯文本',
    className: 'text-center',
    inline: false
  };
  scaffold: any = {
    type: 'plain',
    tpl: '内容',
    inline: false
  };

  panelTitle = '纯文本';
  panelJustify = true;

  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'click',
      eventLabel: '点击',
      description: '点击时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            context: {
              type: 'object',
              title: '上下文',
              properties: {
                nativeEvent: {
                  type: 'object',
                  title: '鼠标事件对象'
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
            context: {
              type: 'object',
              title: '上下文',
              properties: {
                nativeEvent: {
                  type: 'object',
                  title: '鼠标事件对象'
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
            context: {
              type: 'object',
              title: '上下文',
              properties: {
                nativeEvent: {
                  type: 'object',
                  title: '鼠标事件对象'
                }
              }
            }
          }
        }
      ]
    }
  ];

  // 动作定义
  actions: RendererPluginAction[] = [];

  panelBodyCreator = (context: BaseEventContext) => {
    const isTableCell = context.info.renderer.name === 'table-cell';
    return [
      getSchemaTpl('tabs', [
        {
          title: '属性',
          body: getSchemaTpl('collapseGroup', [
            {
              title: '基本',
              body: [
                getSchemaTpl('textareaFormulaControl', {
                  name: 'tpl',
                  label: '内容',
                  mode: 'normal',
                  pipeIn: (value: any, data: any) =>
                    value || (data && data.text),
                  description:
                    '如果当前字段有值，请不要设置，否则覆盖。支持使用 <code>\\${xxx}</code> 来获取变量，或者用 lodash.template 语法来写模板逻辑。<a target="_blank" href="/amis/zh-CN/docs/concepts/template">详情</a>'
                }),
                getSchemaTpl('placeholder', {
                  pipeIn: defaultValue('-'),
                  label: '占位符'
                })
              ]
            },
            isTableCell ? null : getSchemaTpl('status')
          ])
        },
        isTableCell
          ? null
          : {
              title: '外观',
              body: getSchemaTpl('collapseGroup', [
                {
                  title: '基本',
                  body: [
                    getSchemaTpl('switch', {
                      name: 'inline',
                      label: '内联模式',
                      value: true
                    })
                  ]
                },
                getSchemaTpl('style:classNames', {isFormItem: false})
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

registerEditorPlugin(PlainPlugin);
