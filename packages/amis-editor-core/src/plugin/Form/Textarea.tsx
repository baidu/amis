import {defaultValue, getSchemaTpl} from '../../component/schemaTpl';
import {registerEditorPlugin} from '../../manager';
import {BasePlugin} from '../../plugin';
import {tipedLabel} from '../../component/control/BaseControl';

import type {BaseEventContext} from '../../plugin';
import {ValidatorTag} from '../../component/validator';
import {getEventControlConfig} from '../../util';
import {
  RendererAction,
  RendererEvent
} from 'amis-editor-comp/dist/renderers/event-action';

export class TextareaControlPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'textarea';
  $schema = '/schemas/TextareaControlSchema.json';
  order = -490;

  // 组件名称
  name = '多行文本框';
  isBaseComponent = true;
  icon = 'fa fa-paragraph';
  description = `支持换行输入`;
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

  events: RendererEvent[] = [
    {
      eventName: 'change',
      eventLabel: '值变化',
      description: '输入框值变化时触发',
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
      description: '输入框获取焦点时触发',
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
      eventName: 'blur',
      eventLabel: '失去焦点',
      description: '输入框失去焦点时触发',
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
    }
  ];

  actions: RendererAction[] = [
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
              getSchemaTpl('valueFormula', {
                rendererSchema: context?.schema,
                mode: 'vertical', // 改成上下展示模式
              }),
              getSchemaTpl('switch', {
                name: 'trimContents',
                pipeIn: defaultValue(true),
                label: tipedLabel(
                  '去除首尾空白',
                  '开启后，将不允许用户输入前后空格'
                )
              }),
              getSchemaTpl('showCounter'),
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('placeholder'),
              getSchemaTpl('description')
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
            getSchemaTpl('style:formItem', {
              renderer: context.info.renderer,
              schema: [
                {
                  type: 'input-number',
                  name: 'minRows',
                  value: 3,
                  label: '最小展示行数'
                },
                {
                  type: 'input-number',
                  name: 'maxRows',
                  value: 20,
                  label: '最大展示行数'
                }
              ]
            }),
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
