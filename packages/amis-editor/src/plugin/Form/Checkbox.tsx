import {
  defaultValue,
  setSchemaTpl,
  getSchemaTpl,
  undefinedPipeOut,
  EditorNodeType,
  EditorManager,
  registerEditorPlugin,
  BasePlugin,
  BaseEventContext,
  tipedLabel,
  RendererPluginAction,
  RendererPluginEvent
} from 'amis-editor-core';
import {isPureVariable} from 'amis';
import omit from 'lodash/omit';
import {inputStateTpl} from '../../renderer/style-control/helper';
import {ValidatorTag} from '../../validator';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';

setSchemaTpl('option', {
  name: 'option',
  type: 'input-text',
  label: tipedLabel('说明', '选项说明')
});
export class CheckboxControlPlugin extends BasePlugin {
  static id = 'CheckboxControlPlugin';
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'checkbox';
  $schema = '/schemas/CheckboxControlSchema.json';

  // 组件名称
  name = '勾选框';
  isBaseComponent = true;
  icon = 'fa fa-check-square-o';
  pluginIcon = 'checkbox-plugin';
  description = '勾选框';
  docLink = '/amis/zh-CN/components/form/checkbox';
  tags = ['表单项'];
  scaffold = {
    type: 'checkbox',
    option: '勾选框',
    name: 'checkbox',
    label: '勾选框'
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    wrapWithPanel: false,
    mode: 'horizontal',
    body: [
      {
        value: true,
        ...this.scaffold,
        label: '勾选表单'
      }
    ]
  };
  notRenderFormZone = true;
  panelTitle = '勾选框';
  panelJustify = true;
  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: '值变化',
      description: '选中状态变化时触发',
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
                    title: '状态值'
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
              getSchemaTpl('option'),
              {
                type: 'ae-switch-more',
                hiddenOnDefault: false,
                mode: 'normal',
                label: '值格式',
                formType: 'extend',
                form: {
                  body: [
                    {
                      type: 'ae-valueFormat',
                      name: 'trueValue',
                      label: '勾选值',
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
                      label: '未勾选值',
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
              getSchemaTpl('valueFormula', {
                rendererSchema: {
                  ...omit(context?.schema, ['trueValue', 'falseValue']),
                  type: 'switch'
                },
                needDeleteProps: ['option'],
                label: '默认勾选',
                rendererWrapper: true, // 浅色线框包裹一下，增加边界感
                valueType: 'boolean',
                pipeIn: (value: any, data: any) => {
                  if (isPureVariable(value)) {
                    return value;
                  }
                  return value === (data?.data?.trueValue ?? true);
                },
                pipeOut: (value: any, origin: any, data: any) => {
                  if (isPureVariable(value)) {
                    return value;
                  }
                  const {trueValue = true, falseValue = false} = data;
                  return value ? trueValue : falseValue;
                }
              }),
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('description'),
              getSchemaTpl('autoFillApi', {
                trigger: 'change'
              })
            ]
          },
          getSchemaTpl('status', {isFormItem: true}),
          getSchemaTpl('validation', {tag: ValidatorTag.MultiSelect})
        ])
      },
      {
        title: '外观',
        body: [
          getSchemaTpl('collapseGroup', [
            getSchemaTpl('theme:formItem', {
              schema: [
                {
                  type: 'select',
                  label: '模式',
                  name: 'optionType',
                  value: 'default',
                  options: [
                    {
                      label: '默认',
                      value: 'default'
                    },
                    {
                      label: '按钮',
                      value: 'button'
                    }
                  ]
                }
              ]
            }),
            getSchemaTpl('theme:form-label'),
            getSchemaTpl('theme:form-description'),
            {
              title: '选项样式',
              body: [
                ...inputStateTpl('themeCss.checkboxControlClassName', '', {
                  fontToken(state) {
                    const s = state.split('-');
                    if (s[0] === 'checked') {
                      return {
                        'color': `--checkbox-\${optionType}-checked-${s[1]}-text-color`,
                        '*': '--checkbox-${optionType}-default'
                      };
                    }
                    return {
                      'color': `--checkbox-\${optionType}-${s[1]}-text-color`,
                      '*': '--checkbox-${optionType}-default'
                    };
                  },
                  backgroundToken(state) {
                    const s = state.split('-');
                    if (s[0] === 'checked') {
                      return `\${optionType === "button" ? "--checkbox-" + optionType + "-checked-${s[1]}-bg-color" : ""}`;
                    }
                    return `\${optionType === "button" ? "--checkbox-" + optionType + "-${s[1]}-bg-color" : ""}`;
                  },
                  borderToken(state) {
                    const s = state.split('-');
                    const fn = (type: string, checked?: boolean) => {
                      return `\${optionType === "button" ? "--checkbox-" + optionType + "${
                        checked ? '-checked' : ''
                      }-${s[1]}-${type}" : ""}`;
                    };
                    if (s[0] === 'checked') {
                      return {
                        'topBorderColor': fn('top-border-color', true),
                        'rightBorderColor': fn('right-border-color', true),
                        'bottomBorderColor': fn('bottom-border-color', true),
                        'leftBorderColor': fn('left-border-color', true),
                        '*': '--checkbox-${optionType}-default'
                      };
                    }
                    return {
                      'topBorderColor': fn('top-border-color'),
                      'rightBorderColor': fn('right-border-color'),
                      'bottomBorderColor': fn('bottom-border-color'),
                      'leftBorderColor': fn('left-border-color'),
                      '*': '--checkbox-${optionType}-default'
                    };
                  },
                  radiusToken(state) {
                    return '${optionType === "button" ? "--checkbox-" + optionType + "-default": "-"}';
                  },
                  state: [
                    {
                      label: '常规',
                      value: 'checkbox-default'
                    },
                    {
                      label: '悬浮',
                      value: 'checkbox-hover'
                    },
                    {
                      label: '禁用',
                      value: 'checkbox-disabled'
                    },
                    {
                      label: '选中',
                      value: 'checked-default'
                    },
                    {
                      label: '选中态悬浮',
                      value: 'checked-hover'
                    },
                    {
                      label: '选中禁用',
                      value: 'checked-disabled'
                    }
                  ]
                })
              ]
            },
            {
              title: '勾选框样式',
              body: [
                {
                  label: '隐藏勾选框',
                  type: 'switch',
                  name: 'themeCss.checkboxShowClassName.display',
                  trueValue: 'none'
                },
                ...inputStateTpl('themeCss.checkboxClassName', '', {
                  hideFont: true,
                  hideMargin: true,
                  hidePadding: true,
                  hiddenOn: 'themeCss.checkboxShowClassName.display === "none"',
                  backgroundToken(state) {
                    const s = state.split('-');
                    if (s[0] === 'checked') {
                      return `--checkbox-\${optionType}-checked-${s[1]}-\${optionType ==='button' ? 'icon-' : ''}bg-color`;
                    }
                    return `--checkbox-\${optionType}-${s[1]}-\${optionType ==='button' ? 'icon-' : ''}bg-color`;
                  },
                  borderToken(state) {
                    const s = state.split('-');
                    if (s[0] === 'checked') {
                      return `--checkbox-\${optionType}-checked-${s[1]}\${optionType ==='button' ? '-icon' : ''}`;
                    }
                    return `--checkbox-\${optionType}-${s[1]}\${optionType ==='button' ? '-icon' : ''}`;
                  },
                  radiusToken(state) {
                    const s = state.split('-');
                    if (s[0] === 'checked') {
                      return `--checkbox-\${optionType}-checked-${s[1]}`;
                    }
                    return `--checkbox-\${optionType}-${s[1]}\${optionType ==='button' ? '-icon' : ''}`;
                  },
                  state: [
                    {
                      label: '常规',
                      value: 'checkbox-default'
                    },
                    {
                      label: '悬浮',
                      value: 'checkbox-hover'
                    },
                    {
                      label: '禁用',
                      value: 'checkbox-disabled'
                    },
                    {
                      label: '选中',
                      value: 'checked-default'
                    },
                    {
                      label: '选中态悬浮',
                      value: 'checked-hover'
                    },
                    {
                      label: '选中禁用',
                      value: 'checked-disabled'
                    }
                  ],
                  schema: [
                    {
                      name: 'themeCss.checkboxShowClassName.--checkbox-default-checked-default-icon',
                      visibleOn:
                        '${__editorStatethemeCss.checkboxClassName == "checked-default" || __editorStatethemeCss.checkboxClassName == "checked-hover" || __editorStatethemeCss.checkboxClassName == "checked-disabled"}',
                      label: '图标',
                      type: 'icon-select',
                      returnSvg: true,
                      noSize: true
                    },
                    getSchemaTpl('theme:colorPicker', {
                      name: 'themeCss.checkboxInnerClassName.color:default',
                      visibleOn:
                        '${__editorStatethemeCss.checkboxClassName == "checked-default"}',
                      label: '图标颜色',
                      labelMode: 'input',
                      editorValueToken:
                        '--checkbox-${optionType}-checked-default-icon-color'
                    }),
                    getSchemaTpl('theme:colorPicker', {
                      name: 'themeCss.checkboxInnerClassName.color:hover',
                      visibleOn:
                        '${__editorStatethemeCss.checkboxClassName == "checked-hover"}',
                      label: '图标颜色',
                      labelMode: 'input',
                      editorValueToken:
                        '--checkbox-${optionType}-checked-default-icon-color'
                    }),
                    getSchemaTpl('theme:colorPicker', {
                      name: 'themeCss.checkboxInnerClassName.color:disabled',
                      visibleOn:
                        '${__editorStatethemeCss.checkboxClassName == "checked-disabled"}',
                      label: '图标颜色',
                      labelMode: 'input',
                      editorValueToken:
                        '--checkbox-${optionType}-checked-disabled-icon-color'
                    })
                  ]
                })
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

  buildDataSchemas(node: EditorNodeType, region: EditorNodeType) {
    // 默认trueValue和falseValue是同类型
    return {
      type: node.schema?.trueValue ? typeof node.schema?.trueValue : 'boolean',
      title: node.schema?.label || node.schema?.name,
      originalValue: node.schema?.value // 记录原始值，循环引用检测需要
    };
  }
}

registerEditorPlugin(CheckboxControlPlugin);
