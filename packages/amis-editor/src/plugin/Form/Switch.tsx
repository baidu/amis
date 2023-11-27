import {getSchemaTpl, valuePipeOut} from 'amis-editor-core';
import {registerEditorPlugin, tipedLabel} from 'amis-editor-core';
import {BasePlugin, BaseEventContext} from 'amis-editor-core';
import {ValidatorTag} from '../../validator';
import {getEventControlConfig} from '../../renderer/event-control/helper';
import type {
  EditorNodeType,
  RendererPluginAction,
  RendererPluginEvent
} from 'amis-editor-core';

export class SwitchControlPlugin extends BasePlugin {
  static id = 'SwitchControlPlugin';
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'switch';
  $schema = '/schemas/SwitchControlSchema.json';

  // 组件名称
  name = '开关';
  isBaseComponent = true;
  icon = 'fa fa-toggle-on';
  pluginIcon = 'switch-plugin';
  description = '开关控件';
  docLink = '/amis/zh-CN/components/form/switch';
  tags = ['表单项'];
  scaffold = {
    type: 'switch',
    label: '开关',
    option: '说明',
    name: 'switch',
    falseValue: false,
    trueValue: true
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold,
        label: '开关表单'
      }
    ]
  };

  notRenderFormZone = true;

  panelTitle = '开关';

  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: '值变化',
      description: '开关值变化时触发',
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
                  title: '开关值'
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
      actionType: 'setValue',
      actionLabel: '赋值',
      description: '触发组件数据更新'
    }
  ];

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) =>
    getSchemaTpl('tabs', [
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

              getSchemaTpl('switchOption'),

              {
                type: 'ae-switch-more',
                bulk: true,
                mode: 'normal',
                label: '填充文本',
                formType: 'extend',
                form: {
                  body: [getSchemaTpl('onText'), getSchemaTpl('offText')]
                }
              },

              {
                type: 'ae-switch-more',
                bulk: true,
                mode: 'normal',
                label: tipedLabel(
                  '值格式',
                  '默认勾选后的值 true，未勾选的值 false'
                ),
                formType: 'extend',
                form: {
                  body: [
                    {
                      type: 'input-text',
                      label: '勾选后的值',
                      name: 'trueValue',
                      value: true,
                      pipeOut: valuePipeOut,
                      onChange: (
                        value: string,
                        oldValue: string,
                        model: any,
                        form: any
                      ) => {
                        if (oldValue === form.getValueByName('value')) {
                          form.setValueByName('value', value);
                        }
                      }
                    },
                    {
                      type: 'input-text',
                      label: '未勾选的值',
                      name: 'falseValue',
                      value: false,
                      pipeOut: valuePipeOut,
                      onChange: (
                        value: string,
                        oldValue: string,
                        model: any,
                        form: any
                      ) => {
                        if (oldValue === form.getValueByName('value')) {
                          form.setValueByName('value', value);
                        }
                      }
                    }
                  ]
                }
              },

              /* 旧版设置默认值
              getSchemaTpl('switch', {
                name: 'value',
                label: '默认开启',
                pipeIn: (value: any, data: any) => {
                  const {trueValue = true} = data.data || {};
                  return value === trueValue ? true : false;
                },
                pipeOut: (value: any, origin: any, data: any) => {
                  return value
                    ? data.trueValue || true
                    : data.falseValue || false;
                }
              }),
              */
              getSchemaTpl('valueFormula', {
                rendererSchema: context?.schema,
                needDeleteProps: ['option'],
                rendererWrapper: true, // 浅色线框包裹一下，增加边界感
                // valueType: 'boolean',
                pipeIn: (value: any, data: any) => {
                  const {trueValue = true, falseValue = false} =
                    data.data || {};
                  return value === trueValue
                    ? true
                    : value === falseValue
                    ? false
                    : value;
                },
                pipeOut: (value: any, origin: any, data: any) => {
                  return value && value === (data.trueValue || true)
                    ? data.trueValue || true
                    : value && value !== (data.falseValue || false)
                    ? value
                    : data.falseValue || false;
                }
              }),
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('description'),
              getSchemaTpl('autoFillApi')
            ]
          },
          getSchemaTpl('status', {isFormItem: true}),
          getSchemaTpl('validation', {tag: ValidatorTag.Check})
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          getSchemaTpl('style:formItem', {renderer: context.info.renderer}),
          {
            title: '说明',
            body: [
              getSchemaTpl('horizontal-align', {
                name: 'optionAtLeft',
                pipeIn: (v: boolean) => (v ? 'left' : 'right'),
                pipeOut: (v: string) => (v === 'left' ? true : undefined)
              })
            ]
          },
          getSchemaTpl('style:classNames')
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
    ]);

  buildDataSchemas(node: EditorNodeType, region: EditorNodeType) {
    // 默认trueValue和falseValue是同类型
    return {
      type: node.schema?.trueValue ? typeof node.schema?.trueValue : 'boolean',
      title: node.schema?.label || node.schema?.name,
      originalValue: node.schema?.value // 记录原始值，循环引用检测需要
    };
  }
}

registerEditorPlugin(SwitchControlPlugin);
