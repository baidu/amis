import {
  EditorManager,
  EditorNodeType,
  RAW_TYPE_MAP,
  defaultValue,
  getSchemaTpl,
  registerEditorPlugin,
  BasePlugin,
  BaseEventContext,
  RendererPluginAction,
  RendererPluginEvent
} from 'amis-editor-core';
import type {Schema, SchemaType} from 'amis';
import {ValidatorTag} from '../../validator';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';
import {resolveOptionEventDataSchame, resolveOptionType} from '../../util';
import {inputStateTpl} from '../../renderer/style-control/helper';

export class RadiosControlPlugin extends BasePlugin {
  static id = 'RadiosControlPlugin';
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'radios';
  $schema = '/schemas/RadiosControlSchema.json';

  // 组件名称
  name = '单选框';
  isBaseComponent = true;
  icon = 'fa fa-dot-circle-o';
  pluginIcon = 'radios-plugin';
  description = '通过 options 配置选项，可通过 source 拉取选项';
  docLink = '/amis/zh-CN/components/form/radios';
  tags = ['表单项'];
  scaffold = {
    type: 'radios',
    label: '单选框',
    name: 'radios',
    options: [
      {
        label: '选项A',
        value: 'A'
      },

      {
        label: '选项B',
        value: 'B'
      }
    ]
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold,
        value: 'A'
      }
    ]
  };

  notRenderFormZone = true;

  panelTitle = '单选框';

  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: '值变化',
      description: '选中值变化时触发',
      dataSchema: (manager: EditorManager) => {
        const {value, selectedItems, items} = resolveOptionEventDataSchame(
          manager,
          false
        );

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: '数据',
                properties: {
                  value,
                  selectedItems,
                  items
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
      actionType: 'reload',
      actionLabel: '重新加载',
      description: '触发组件数据刷新并重新渲染',
      ...getActionCommonProps('reload')
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
              getSchemaTpl('valueFormula', {
                rendererSchema: (schema: Schema) => schema,
                useSelectMode: true, // 改用 Select 设置模式
                visibleOn: 'this.options && this.options.length > 0'
              }),
              // getSchemaTpl('autoFill')
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('autoFillApi', {
                trigger: 'change'
              })
            ]
          },
          {
            title: '选项',
            id: 'properties-options',
            body: [getSchemaTpl('optionControlV2'), getSchemaTpl('selectFirst')]
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
                getSchemaTpl('switch', {
                  label: '一行选项显示',
                  name: 'inline',
                  hiddenOn: 'this.mode === "inline"',
                  pipeIn: defaultValue(true)
                }),
                {
                  label: '每行选项个数',
                  name: 'columnsCount',
                  hiddenOn: 'this.mode === "inline" || this.inline !== false',
                  type: 'input-range',
                  min: 1,
                  max: 6,
                  pipeIn: defaultValue(1)
                },
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
                ...inputStateTpl('themeCss.radiosControlClassName', '', {
                  fontToken(state) {
                    const s = state.split('-');
                    if (s[1] === 'disabled') {
                      return {
                        'color': `--radio-\${optionType}-\${optionType === "default" ? "disabled-text-color" : "disabled-${
                          s[0] === 'checked' ? 'checked' : 'unchecked'
                        }-text-color"}`,
                        '*': '--radio-${optionType}-default'
                      };
                    }
                    if (s[0] === 'checked') {
                      return {
                        'color': '--radio-${optionType}-checked-text-color',
                        '*': '--radio-${optionType}-default'
                      };
                    }
                    return {
                      'color': `--radio-\${optionType}-${s[1]}-text-color`,
                      '*': '--radio-${optionType}-default'
                    };
                  },
                  backgroundToken(state) {
                    const s = state.split('-');
                    if (s[1] === 'disabled') {
                      return `--radio-\${optionType}-\${optionType === "default" ? "disabled-bg-color" : "disabled-${
                        s[0] === 'checked' ? 'checked' : 'unchecked'
                      }-bg-color"}`;
                    }
                    if (s[0] === 'checked') {
                      return '--radio-${optionType}-checked-bg-color';
                    }
                    return `--radio-\${optionType}-${s[1]}-bg-color`;
                  },
                  radiusToken() {
                    return '--radio-${optionType}-default';
                  },
                  borderToken(state) {
                    const s = state.split('-');
                    let str = s[0] === 'checked' ? 'checked' : s[1];
                    if (s[1] === 'disabled') {
                      str =
                        s[0] === 'checked'
                          ? 'disabled-checked'
                          : 'disabled-unchecked';
                    }
                    return {
                      'topBorderColor': `--radio-\${optionType}-${str}-top-border-color`,
                      'rightBorderColor': `--radio-\${optionType}-${str}-right-border-color`,
                      'bottomBorderColor': `--radio-\${optionType}-${str}-bottom-border-color`,
                      'leftBorderColor': `--radio-\${optionType}-${str}-left-border-color`,
                      '*': '--radio-${optionType}-default'
                    };
                  },
                  state: [
                    {
                      label: '常规',
                      value: 'radios-default'
                    },
                    {
                      label: '悬浮',
                      value: 'radios-hover'
                    },
                    {
                      label: '禁用',
                      value: 'radios-disabled'
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
              title: '单选框样式',
              hiddenOn: 'optionType === "button"',
              body: [
                {
                  label: '隐藏勾选框',
                  type: 'switch',
                  name: 'themeCss?.radiosShowClassName.display',
                  trueValue: 'none'
                },
                ...inputStateTpl('themeCss.radiosClassName', '', {
                  hideFont: true,
                  hideMargin: true,
                  hidePadding: true,
                  hiddenOn: 'themeCss?.radiosShowClassName.display === "none"',
                  backgroundToken: (state: string) => {
                    const s = state.split('-');
                    if (s[0] === 'checked' && s[1] !== 'disabled') {
                      return `--radio-default-checked-bg-color`;
                    }
                    return `--radio-default-${s[1]}-bg-color`;
                  },
                  borderToken: (state: string) => {
                    const s = state.split('-');
                    let color = `--radio-default-${s[1]}-border-color`;
                    if (s[0] === 'checked' && s[1] !== 'disabled') {
                      color = '--radio-default-checked-border-color';
                    }
                    return {
                      color,
                      width: 'var(--borders-width-2)',
                      style: 'var(--borders-style-2)'
                    };
                  },
                  radiusToken: () => {
                    return {'*': 'var(--borders-radius-7)'};
                  },
                  state: [
                    {
                      label: '常规',
                      value: 'radios-default'
                    },
                    {
                      label: '悬浮',
                      value: 'radios-hover'
                    },
                    {
                      label: '禁用',
                      value: 'radios-disabled'
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
                      name: 'themeCss.radiosShowClassName.--radio-default-checked-icon',
                      visibleOn:
                        '${__editorStatethemeCss.radiosClassName == "checked-default" || __editorStatethemeCss.radiosClassName == "checked-hover" || __editorStatethemeCss.radiosClassName == "checked-disabled"}',
                      label: '图标',
                      type: 'icon-select',
                      returnSvg: true,
                      noSize: true
                    },
                    getSchemaTpl('theme:colorPicker', {
                      name: 'themeCss.radiosCheckedInnerClassName.color:default',
                      visibleOn:
                        '${__editorStatethemeCss.radiosClassName == "checked-default"}',
                      label: '图标颜色',
                      labelMode: 'input',
                      editorValueToken: '--radio-default-checked-icon-color'
                    }),
                    getSchemaTpl('theme:colorPicker', {
                      name: 'themeCss.radiosCheckedInnerClassName.color:hover',
                      visibleOn:
                        '${__editorStatethemeCss.radiosClassName == "checked-hover"}',
                      label: '图标颜色',
                      labelMode: 'input',
                      editorValueToken: '--radio-default-checked-icon-color'
                    }),
                    getSchemaTpl('theme:colorPicker', {
                      name: 'themeCss.radiosCheckedInnerClassName.color:disabled',
                      visibleOn:
                        '${__editorStatethemeCss.radiosClassName == "checked-disabled"}',
                      label: '图标颜色',
                      labelMode: 'input',
                      editorValueToken: '--radio-default-disabled-icon-color'
                    })
                  ]
                })
              ]
            },

            getSchemaTpl('theme:cssCode'),
            getSchemaTpl('style:classNames', {
              schema: [
                getSchemaTpl('className', {
                  label: '单个选项',
                  name: 'itemClassName'
                })
              ]
            })
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
    const type = resolveOptionType(node.schema);
    // todo:异步数据case
    let dataSchema: any = {
      type,
      title: node.schema?.label || node.schema?.name,
      rawType: RAW_TYPE_MAP[node.schema.type as SchemaType] || 'string',
      originalValue: node.schema?.value // 记录原始值，循环引用检测需要
    };

    if (node.schema?.joinValues === false) {
      dataSchema = {
        ...dataSchema,
        type: 'object',
        title: node.schema?.label || node.schema?.name,
        properties: {
          [node.schema?.labelField || 'label']: {
            type: 'string',
            title: '文本'
          },
          [node.schema?.valueField || 'value']: {
            type,
            title: '值'
          }
        }
      };
    }

    return dataSchema;
  }
}

registerEditorPlugin(RadiosControlPlugin);
