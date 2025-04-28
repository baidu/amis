import {
  EditorManager,
  EditorNodeType,
  RendererPluginAction,
  RendererPluginEvent,
  getSchemaTpl,
  registerEditorPlugin,
  BasePlugin,
  BaseEventContext,
  getI18nEnabled,
  tipedLabel
} from 'amis-editor-core';
import type {Schema} from 'amis';
import {ValidatorTag} from '../../validator';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';
import {resolveOptionEventDataSchame, resolveOptionType} from '../../util';
import {inputStateTpl} from '../../renderer/style-control/helper';

export class NestedSelectControlPlugin extends BasePlugin {
  static id = 'NestedSelectControlPlugin';
  // 关联渲染器名字
  rendererName = 'nested-select';
  $schema = '/schemas/NestedSelectControlSchema.json';

  // 组件名称
  name = '级联选择器';
  isBaseComponent = true;
  icon = 'fa fa-indent';
  pluginIcon = 'nested-select-plugin';
  description = '适用于选项中含有子项，可通过 source 拉取选项，支持多选';
  docLink = '/amis/zh-CN/components/form/nestedselect';
  tags = ['表单项'];
  scaffold = {
    type: 'nested-select',
    label: '级联选择器',
    name: 'nestedSelect',
    onlyChildren: true,
    options: [
      {
        label: '选项A',
        value: 'A'
      },

      {
        label: '选项B',
        value: 'B',
        children: [
          {
            label: '选项b1',
            value: 'b1'
          },
          {
            label: '选项b2',
            value: 'b2'
          }
        ]
      },
      {
        label: '选项C',
        value: 'C',
        children: [
          {
            label: '选项c1',
            value: 'c1'
          },
          {
            label: '选项c2',
            value: 'c2'
          }
        ]
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
        ...this.scaffold
      }
    ]
  };

  panelTitle = '级联选择器';
  notRenderFormZone = true;
  panelDefinitions = {
    options: {
      label: '选项 Options',
      name: 'options',
      type: 'combo',
      multiple: true,
      multiLine: true,
      draggable: true,
      addButtonText: '新增选项',
      scaffold: {
        label: '',
        value: ''
      },
      items: [
        {
          type: 'group',
          body: [
            getSchemaTpl('optionsLabel'),

            {
              type: 'input-text',
              name: 'value',
              placeholder: '值',
              unique: true
            }
          ]
        },
        {
          $ref: 'options',
          label: '子选项',
          name: 'children',
          addButtonText: '新增子选项'
        }
      ]
    }
  };
  panelJustify = true;
  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: '值变化',
      description: '选中值变化时触发',
      dataSchema: (manager: EditorManager) => {
        const {value, selectedItems} = resolveOptionEventDataSchame(manager);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: '数据',
                properties: {
                  value,
                  selectedItems
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'focus',
      eventLabel: '获取焦点',
      description: '输入框获取焦点时触发',
      dataSchema: (manager: EditorManager) => {
        const {value, selectedItems} = resolveOptionEventDataSchame(manager);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: '数据',
                properties: {
                  value,
                  selectedItems
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'blur',
      eventLabel: '失去焦点',
      description: '输入框失去焦点时触发',
      dataSchema: (manager: EditorManager) => {
        const {value, selectedItems} = resolveOptionEventDataSchame(manager);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: '数据',
                properties: {
                  value,
                  selectedItems
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
  panelBodyCreator = (context: BaseEventContext) => {
    const renderer: any = context.info.renderer;
    const i18nEnabled = getI18nEnabled();
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
              getSchemaTpl('clearable'),
              {
                type: 'ae-Switch-More',
                name: 'searchable',
                label: '可检索',
                mode: 'normal',
                value: false,
                hiddenOnDefault: true,
                formType: 'extend',
                form: {
                  body: [
                    {
                      type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                      name: 'noResultsText',
                      label: tipedLabel('空提示', '检索无结果时的文本')
                    }
                  ]
                }
              },
              getSchemaTpl('onlyLeaf'),
              [
                {
                  type: 'switch',
                  label: '可多选',
                  name: 'multiple',
                  value: false,
                  inputClassName: 'is-inline'
                },
                {
                  type: 'container',
                  className: 'ae-ExtendMore mb-3',
                  visibleOn: 'this.multiple',
                  body: [
                    {
                      type: 'switch',
                      label: tipedLabel(
                        '父级作为返回值',
                        '开启后选中父级，不会全选子级选项，并且父级作为值返回'
                      ),
                      horizontal: {
                        left: 6,
                        justify: true
                      },
                      name: 'onlyChildren',
                      inputClassName: 'is-inline',
                      visibleOn: '!this.onlyLeaf',
                      pipeIn: (value: any) => !value,
                      pipeOut: (value: any) => !value,
                      onChange: (
                        value: any,
                        origin: any,
                        item: any,
                        form: any
                      ) => {
                        if (!value) {
                          // 父级作为返回值
                          form.setValues({
                            cascade: true,
                            withChildren: false,
                            onlyChildren: true
                          });
                        } else {
                          form.setValues({
                            withChildren: false,
                            cascade: false,
                            onlyChildren: false
                          });
                        }
                      }
                    },
                    getSchemaTpl('joinValues'),
                    getSchemaTpl('delimiter', {
                      visibleOn: 'this.joinValues'
                    }),
                    getSchemaTpl('extractValue', {
                      visibleOn: '!this.joinValues'
                    })
                  ]
                }
              ],
              getSchemaTpl('valueFormula', {
                rendererSchema: (schema: Schema) => schema
              }),
              getSchemaTpl('hideNodePathLabel'),
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('placeholder'),
              getSchemaTpl('description'),
              getSchemaTpl('autoFillApi')
            ]
          },
          {
            title: '选项',
            body: [
              getSchemaTpl('treeOptionControl'),
              getSchemaTpl(
                'loadingConfig',
                {
                  visibleOn: 'this.source || !this.options'
                },
                {context}
              )
            ]
          },
          getSchemaTpl('status', {isFormItem: true}),
          getSchemaTpl('validation', {
            tag: (data: any) => {
              return ValidatorTag.MultiSelect;
            }
          })
        ])
      },
      {
        title: '外观',
        body: [
          getSchemaTpl('collapseGroup', [
            getSchemaTpl('theme:formItem'),
            getSchemaTpl('theme:form-label'),
            getSchemaTpl('theme:form-description'),
            {
              title: '选择框样式',
              body: [
                ...inputStateTpl(
                  'themeCss.nestedSelectControlClassName',
                  '--select-base'
                )
              ]
            },
            {
              title: '下拉框样式',
              body: [
                ...inputStateTpl(
                  'themeCss.nestedSelectPopoverClassName',
                  '--select-base-${state}-option',
                  {
                    state: [
                      {label: '常规', value: 'default'},
                      {label: '悬浮', value: 'hover'},
                      {label: '选中', value: 'focused'}
                    ]
                  }
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

registerEditorPlugin(NestedSelectControlPlugin);
