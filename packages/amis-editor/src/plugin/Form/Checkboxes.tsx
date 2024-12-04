import {
  defaultValue,
  setSchemaTpl,
  getSchemaTpl,
  valuePipeOut,
  EditorNodeType,
  EditorManager,
  undefinedPipeOut,
  RendererPluginAction,
  RendererPluginEvent,
  BasePlugin,
  BasicSubRenderInfo,
  RendererEventContext,
  SubRendererInfo,
  BaseEventContext,
  registerEditorPlugin
} from 'amis-editor-core';
import type {Schema} from 'amis';
import {ValidatorTag} from '../../validator';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';
import {
  OPTION_EDIT_EVENTS,
  resolveOptionEventDataSchame,
  resolveOptionType
} from '../../util';
import {inputStateTpl} from '../../renderer/style-control/helper';

export class CheckboxesControlPlugin extends BasePlugin {
  static id = 'CheckboxesControlPlugin';
  // 关联渲染器名字
  rendererName = 'checkboxes';
  $schema = '/schemas/CheckboxesControlSchema.json';

  // 组件名称
  name = '复选框';
  isBaseComponent = true;
  icon = 'fa fa-check-square';
  pluginIcon = 'checkboxes-plugin';
  description =
    '通过<code>options</code>配置多个勾选框，也可以通过<code>source</code>拉取选项';
  docLink = '/amis/zh-CN/components/form/checkboxes';
  tags = ['表单项'];
  scaffold = {
    type: 'checkboxes',
    label: '复选框',
    name: 'checkboxes',
    multiple: true,
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
        value: 'A',
        ...this.scaffold
      }
    ]
  };

  notRenderFormZone = true;

  panelTitle = '复选框';

  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: '值变化',
      description: '选中值变化时触发',
      dataSchema: (manager: EditorManager) => {
        const {value} = resolveOptionEventDataSchame(manager, true);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: '数据',
                properties: {
                  value
                }
              }
            }
          }
        ];
      }
    },
    ...OPTION_EDIT_EVENTS
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
    const renderer: any = context.info.renderer;

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
              [
                getSchemaTpl('switch', {
                  label: '可全选',
                  name: 'checkAll',
                  value: false,
                  visibleOn: 'this.multiple',
                  onChange: (value: any, origin: any, item: any, form: any) => {
                    if (!value) {
                      // 可全选关闭时，默认全选也需联动关闭
                      form.setValueByName('defaultCheckAll', false);
                      form.setValueByName('checkAllText', undefined);
                    }
                  }
                }),
                {
                  type: 'container',
                  className: 'ae-ExtendMore mb-2',
                  visibleOn: 'this.checkAll',
                  body: [
                    getSchemaTpl('switch', {
                      label: '默认全选',
                      name: 'defaultCheckAll',
                      value: false
                    }),
                    {
                      type: 'input-text',
                      label: '全选文本',
                      name: 'checkAllText'
                    }
                  ]
                }
              ],
              getSchemaTpl('joinValues', {
                visibleOn: true
              }),
              getSchemaTpl('delimiter', {
                visibleOn: 'this.joinValues === true'
              }),
              getSchemaTpl('extractValue'),
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('description'),
              getSchemaTpl('autoFillApi', {
                trigger: 'change'
              })
            ]
          },
          {
            title: '选项',
            id: 'properties-options',
            body: [
              getSchemaTpl('optionControlV2', {
                multiple: true
              }),
              getSchemaTpl('valueFormula', {
                rendererSchema: (schema: Schema) => ({
                  ...schema,
                  type: 'input-text'
                }),
                pipeOut: undefinedPipeOut,
                // 默认值组件设计有些问题，自动发起了请求，接口数据作为了默认值选项，接口形式应该是设置静态值或者FX
                needDeleteProps: ['source'],
                // 当数据源是自定义静态选项时，不额外配置默认值，在选项上直接勾选即可，放开会有个bug：当去掉勾选时，默认值配置组件不清空，只是schema清空了value
                visibleOn: 'this.selectFirst !== true && this.source != null'
              }),
              // 自定义选项模板
              getSchemaTpl('optionsMenuTpl', {
                manager: this.manager
              }),
              /** 新增选项 */
              getSchemaTpl('optionAddControl', {
                manager: this.manager
              }),
              /** 编辑选项 */
              getSchemaTpl('optionEditControl', {
                manager: this.manager
              }),
              /** 删除选项 */
              getSchemaTpl('optionDeleteControl')
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
                ...inputStateTpl('themeCss.checkboxesControlClassName', '', {
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
                  name: 'themeCss.checkboxesShowClassName.display',
                  trueValue: 'none'
                },
                ...inputStateTpl('themeCss.checkboxesClassName', '', {
                  hideFont: true,
                  hideMargin: true,
                  hidePadding: true,
                  hiddenOn:
                    'themeCss.checkboxesShowClassName.display === "none"',
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
                      name: 'themeCss.checkboxesShowClassName.--checkbox-default-checked-default-icon',
                      visibleOn:
                        '${__editorStatethemeCss.checkboxesClassName == "checked-default" || __editorStatethemeCss.checkboxesClassName == "checked-hover" || __editorStatethemeCss.checkboxesClassName == "checked-disabled"}',
                      label: '图标',
                      type: 'icon-select',
                      returnSvg: true,
                      noSize: true
                    },
                    getSchemaTpl('theme:colorPicker', {
                      name: 'themeCss.checkboxesInnerClassName.color:default',
                      visibleOn:
                        '${__editorStatethemeCss.checkboxesClassName == "checked-default"}',
                      label: '图标颜色',
                      labelMode: 'input',
                      editorValueToken:
                        '--checkbox-${optionType}-checked-default-icon-color'
                    }),
                    getSchemaTpl('theme:colorPicker', {
                      name: 'themeCss.checkboxesInnerClassName.color:hover',
                      visibleOn:
                        '${__editorStatethemeCss.checkboxesClassName == "checked-hover"}',
                      label: '图标颜色',
                      labelMode: 'input',
                      editorValueToken:
                        '--checkbox-${optionType}-checked-default-icon-color'
                    }),
                    getSchemaTpl('theme:colorPicker', {
                      name: 'themeCss.checkboxesInnerClassName.color:disabled',
                      visibleOn:
                        '${__editorStatethemeCss.checkboxesClassName == "checked-disabled"}',
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
    const type = resolveOptionType(node.schema);
    // todo:异步数据case
    let dataSchema: any = {
      type,
      title: node.schema?.label || node.schema?.name,
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

    if (node.schema?.multiple) {
      if (node.schema?.extractValue) {
        dataSchema = {
          type: 'array',
          title: node.schema?.label || node.schema?.name
        };
      } else if (node.schema?.joinValues === false) {
        dataSchema = {
          type: 'array',
          title: node.schema?.label || node.schema?.name,
          items: {
            type: 'object',
            title: '成员',
            properties: dataSchema.properties
          },
          originalValue: dataSchema.originalValue
        };
      }
    }

    return dataSchema;
  }
}

registerEditorPlugin(CheckboxesControlPlugin);
