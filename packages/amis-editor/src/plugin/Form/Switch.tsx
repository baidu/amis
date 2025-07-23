import {
  defaultValue,
  getSchemaTpl,
  undefinedPipeOut,
  registerEditorPlugin,
  BasePlugin,
  BaseEventContext,
  EditorManager,
  EditorNodeType,
  RendererPluginAction,
  RendererPluginEvent
} from 'amis-editor-core';
import {isExpression, isPureVariable} from 'amis-core';
import omit from 'lodash/omit';
import {ValidatorTag} from '../../validator';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';

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
      dataSchema: (manager: EditorManager) => {
        const node = manager.store.getNodeById(manager.store.activeId);
        const schemas = manager.dataSchema.current.schemas;
        const dataSchema = schemas.find(
          item => item.properties?.[node!.schema.name]
        );

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: '数据',
                properties: {
                  value: {
                    type: 'string',
                    ...((dataSchema?.properties?.[node!.schema.name] as any) ??
                      {}),
                    title: '开关值'
                  }
                }
              }
            }
          }
        ];
      }
    }
  ];

  // 动作定义
  actions: RendererPluginAction[] = [
    {
      actionType: 'clear',
      actionLabel: '清空',
      description: '清除选中值',
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
                mode: 'normal',
                label: '值格式',
                formType: 'extend',
                form: {
                  body: [
                    {
                      type: 'ae-valueFormat',
                      name: 'trueValue',
                      label: '开启时',
                      pipeIn: defaultValue(true),
                      pipeOut: undefinedPipeOut,
                      onChange: (
                        value: any,
                        oldValue: any,
                        model: any,
                        form: any
                      ) => {
                        const {value: defaultValue, trueValue} =
                          form?.data || {};
                        if (isPureVariable(defaultValue)) {
                          return;
                        }
                        if (trueValue === defaultValue && trueValue !== value) {
                          form.setValues({value});
                        }
                      }
                    },
                    {
                      type: 'ae-valueFormat',
                      name: 'falseValue',
                      label: '关闭时',
                      pipeIn: defaultValue(false),
                      pipeOut: undefinedPipeOut,
                      onChange: (
                        value: any,
                        oldValue: any,
                        model: any,
                        form: any
                      ) => {
                        const {value: defaultValue, falseValue} =
                          form?.data || {};
                        if (isPureVariable(defaultValue)) {
                          return;
                        }
                        if (
                          falseValue === defaultValue &&
                          falseValue !== value
                        ) {
                          form.setValues({value});
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
                rendererSchema: {
                  ...omit(context?.schema, ['trueValue', 'falseValue']),
                  type: 'switch'
                },
                needDeleteProps: ['option'],
                rendererWrapper: true, // 浅色线框包裹一下，增加边界感
                valueType: 'boolean',
                pipeIn: (value: any, data: any) => {
                  if (isPureVariable(value)) {
                    return value;
                  }
                  return value === (data?.data?.trueValue ?? true);
                },
                pipeOut: (value: any, origin: any, data: any) => {
                  // 如果是表达式，直接返回
                  if (isExpression(value)) return value;
                  const {trueValue = true, falseValue = false} = data || {};
                  return value ? trueValue : falseValue;
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
          getSchemaTpl('theme:formItem'),
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
