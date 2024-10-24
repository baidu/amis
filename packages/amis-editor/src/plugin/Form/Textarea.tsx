import {
  defaultValue,
  getSchemaTpl,
  registerEditorPlugin,
  BasePlugin,
  tipedLabel,
  RendererPluginAction,
  RendererPluginEvent
} from 'amis-editor-core';
import type {BaseEventContext} from 'amis-editor-core';
import {ValidatorTag} from '../../validator';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';
import {inputStateTpl} from '../../renderer/style-control/helper';

export class TextareaControlPlugin extends BasePlugin {
  static id = 'TextareaControlPlugin';
  // 关联渲染器名字
  rendererName = 'textarea';
  $schema = '/schemas/TextareaControlSchema.json';

  // 组件名称
  name = '多行文本框';
  isBaseComponent = true;
  icon = 'fa fa-paragraph';
  pluginIcon = 'textarea-plugin';
  description = '支持换行输入';
  searchKeywords = '多行文本输入框';
  docLink = '/amis/zh-CN/components/form/textarea';
  tags = ['表单项'];
  scaffold = {
    type: 'textarea',
    label: '多行文本',
    name: 'textarea'
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    wrapWithPanel: false,
    mode: 'horizontal',
    body: {
      ...this.scaffold
    }
  };

  notRenderFormZone = true;

  panelTitle = '多行文本';

  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: '值变化',
      description: '输入框值变化时触发',
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
                  title: '当前文本内容'
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
      description: '输入框获取焦点时触发',
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
                  title: '当前文本内容'
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
      description: '输入框失去焦点时触发',
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
                  title: '当前的文本内容'
                }
              }
            }
          }
        }
      ]
    }
  ];

  actions: RendererPluginAction[] = [
    {
      actionType: 'clear',
      actionLabel: '清空',
      description: '清空输入框内容',
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
    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              getSchemaTpl('formItemName', {
                required: true
              }),
              getSchemaTpl('label'),
              // getSchemaTpl('valueFormula', {
              //   rendererSchema: context?.schema,
              //   mode: 'vertical' // 改成上下展示模式
              // }),
              getSchemaTpl('textareaDefaultValue'),
              getSchemaTpl('switch', {
                name: 'trimContents',
                pipeIn: defaultValue(true),
                label: tipedLabel(
                  '去除首尾空白',
                  '开启后，将不允许用户输入前后空格'
                )
              }),
              getSchemaTpl('showCounter'),
              {
                name: 'maxLength',
                label: tipedLabel('最大字数', '限制输入最多文字数量'),
                type: 'input-number',
                min: 0,
                step: 1
              },
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('placeholder'),
              getSchemaTpl('description'),
              getSchemaTpl('autoFillApi')
            ]
          },
          getSchemaTpl('status', {
            isFormItem: true,
            readonly: true
          }),
          getSchemaTpl('validation', {
            tag: ValidatorTag.Text
          })
        ])
      },
      {
        title: '外观',
        body: [
          getSchemaTpl('collapseGroup', [
            getSchemaTpl('theme:formItem', {
              schema: [
                {
                  type: 'input-number',
                  name: 'minRows',
                  value: 3,
                  label: '最小展示行数',
                  min: 1
                },
                {
                  type: 'input-number',
                  name: 'maxRows',
                  value: 20,
                  label: '最大展示行数',
                  min: 1
                }
              ]
            }),
            getSchemaTpl('theme:form-label'),
            getSchemaTpl('theme:form-description'),
            {
              title: '多行文本样式',
              body: [
                ...inputStateTpl(
                  'themeCss.inputControlClassName',
                  '--input-textarea'
                )
              ]
            },
            getSchemaTpl('theme:cssCode'),
            getSchemaTpl('style:classNames')
          ])
        ]
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

registerEditorPlugin(TextareaControlPlugin);
