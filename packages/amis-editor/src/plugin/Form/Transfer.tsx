import {
  EditorManager,
  EditorNodeType,
  defaultValue,
  getSchemaTpl,
  BasePlugin,
  BaseEventContext,
  registerEditorPlugin,
  tipedLabel,
  RendererPluginAction,
  RendererPluginEvent,
  getI18nEnabled,
  undefinedPipeOut
} from 'amis-editor-core';
import type {Schema} from 'amis';
import {getEventControlConfig} from '../../renderer/event-control/helper';
import {ValidatorTag} from '../../validator';
import {resolveOptionEventDataSchame, resolveOptionType} from '../../util';
import {getActionCommonProps} from '../../renderer/event-control/helper';

export class TransferPlugin extends BasePlugin {
  static id = 'TransferPlugin';
  // 关联渲染器名字
  rendererName = 'transfer';
  $schema = '/schemas/TransferControlSchema.json';

  // 组件名称
  name = '穿梭器';
  isBaseComponent = true;
  icon = 'fa fa-th-list';
  pluginIcon = 'transfer-plugin';
  description = '穿梭器组件';
  docLink = '/amis/zh-CN/components/form/transfer';
  tags = ['表单项'];
  scaffold = {
    label: '分组',
    type: 'transfer',
    name: 'transfer',
    options: [
      {
        label: '诸葛亮',
        value: 'zhugeliang'
      },
      {
        label: '曹操',
        value: 'caocao'
      }
    ],
    selectMode: 'list',
    resultListModeFollowSelect: false
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

  panelTitle = '穿梭器';

  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: '值变化',
      description: '输入框失去焦点时触发',
      dataSchema: (manager: EditorManager) => {
        const {value, items} = resolveOptionEventDataSchame(manager, true);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: '数据',
                properties: {
                  value,
                  items
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'selectAll',
      eventLabel: '全选',
      description: '选中所有选项',
      dataSchema: (manager: EditorManager) => {
        const {items} = resolveOptionEventDataSchame(manager, true);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: '数据',
                properties: {
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
      description: '清空选中内容',
      ...getActionCommonProps('clear')
    },
    {
      actionType: 'reset',
      actionLabel: '重置',
      description: '重置选择的内容',
      ...getActionCommonProps('reset')
    },
    {
      actionType: 'selectAll',
      actionLabel: '全选',
      description: '选中所有选项',
      ...getActionCommonProps('selectAll')
    },
    {
      actionType: 'setValue',
      actionLabel: '赋值',
      description: '触发组件数据更新，多值用“,”分隔',
      ...getActionCommonProps('setValue')
    }
  ];

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

  notRenderFormZone = true;

  panelJustify = true;

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
              getSchemaTpl('valueFormula', {
                rendererSchema: (schema: Schema) => ({
                  ...schema,
                  type: 'select',
                  multiple: true
                }),
                visibleOn: 'this.options.length > 0'
              }),
              getSchemaTpl('switch', {
                label: '统计数据',
                name: 'statistics'
              }),
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('description')
            ]
          },
          {
            title: '左侧选项面板',
            body: [
              {
                label: '展示形式',
                name: 'selectMode',
                type: 'select',
                options: [
                  {
                    label: '列表形式',
                    value: 'list'
                  },
                  {
                    label: '表格形式',
                    value: 'table'
                  },
                  {
                    label: '树形形式',
                    value: 'tree'
                  }
                ],
                onChange: (value: any, origin: any, item: any, form: any) => {
                  form.setValues({
                    options: undefined,
                    columns: undefined,
                    value: '',
                    valueTpl: ''
                  });
                  // 主要解决直接设置value、valueTpl为undefined配置面板不生效问题，所以先设置''，后使用setTimout设置为undefined
                  setTimeout(() => {
                    form.setValues({
                      value: undefined,
                      valueTpl: undefined
                    });
                  }, 100);
                }
              },

              getSchemaTpl(
                'loadingConfig',
                {
                  visibleOn: 'this.source || !this.options'
                },
                {context}
              ),
              getSchemaTpl('optionControl', {
                visibleOn: 'this.selectMode === "list"',
                multiple: true
              }),

              {
                type: 'ae-transferTableControl',
                label: '数据',
                visibleOn: 'this.selectMode === "table"',
                mode: 'normal',
                // 自定义change函数
                onValueChange: (
                  type: 'options' | 'columns',
                  data: any,
                  onBulkChange: Function
                ) => {
                  if (type === 'options') {
                    onBulkChange(data);
                  } else if (type === 'columns') {
                    const columns = data.columns;
                    if (data.columns.length > 0) {
                      data.valueTpl = `\${${columns[0].name}}`;
                    }
                    onBulkChange(data);
                  }
                }
              },

              getSchemaTpl('treeOptionControl', {
                visibleOn: 'this.selectMode === "tree"'
              }),

              getSchemaTpl('switch', {
                label: '可检索',
                name: 'searchable'
              }),
              getSchemaTpl('switch', {
                label: tipedLabel(
                  '仅包含子节点的值',
                  '仅在autoCheckChildren=true时生效'
                ),
                value: true,
                name: 'onlyChildren',
                visibleOn: 'this.selectMode === "tree"'
              }),
              getSchemaTpl('switch', {
                label: '选中父节点自动选中子节点',
                name: 'autoCheckChildren',
                value: true,
                visibleOn: 'this.selectMode === "tree"'
              }),

              getSchemaTpl('optionsMenuTpl', {
                manager: this.manager,
                onChange: (value: any) => {},
                visibleOn: 'this.selectMode !== "table"'
              }),

              {
                label: '标题',
                name: 'selectTitle',
                type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                inputClassName: 'is-inline '
              }
            ]
          },
          {
            title: '右侧结果面板',
            body: [
              {
                type: 'button-group-select',
                label: '展示形式',
                name: 'resultListModeFollowSelect',
                inputClassName: 'items-center',
                options: [
                  {label: '列表形式', value: false},
                  {label: '跟随左侧', value: true}
                ],
                onChange: (value: any, origin: any, item: any, form: any) => {
                  form.setValueByName('sortable', !value ? true : undefined);
                }
              },
              getSchemaTpl('switch', {
                label: tipedLabel(
                  '可检索',
                  '查询功能目前只支持根据名称或值来模糊匹配查询'
                ),
                name: 'resultSearchable'
              }),
              getSchemaTpl('sortable', {
                label: '支持排序',
                mode: 'horizontal',
                horizontal: {
                  justify: true,
                  left: 8
                },
                inputClassName: 'is-inline',
                visibleOn:
                  'this.selectMode === "list" && !this.resultListModeFollowSelect'
              }),

              getSchemaTpl('optionsMenuTpl', {
                name: 'valueTpl',
                manager: this.manager,
                onChange: (value: any) => {},
                visibleOn:
                  '!(this.selectMode === "table" && this.resultListModeFollowSelect)'
              }),
              {
                label: '标题',
                name: 'resultTitle',
                type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                inputClassName: 'is-inline '
              }
            ]
          },
          {
            title: '高级',
            body: [
              getSchemaTpl('virtualThreshold'),
              getSchemaTpl('virtualItemHeight')
            ]
          },
          getSchemaTpl('status', {isFormItem: true}),
          getSchemaTpl('validation', {tag: ValidatorTag.MultiSelect})
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          getSchemaTpl('theme:formItem'),
          getSchemaTpl('style:classNames', [
            getSchemaTpl('className', {
              label: '描述',
              name: 'descriptionClassName',
              visibleOn: 'this.description'
            }),
            getSchemaTpl('className', {
              name: 'addOn.className',
              label: 'AddOn',
              visibleOn: 'this.addOn && this.addOn.type === "text"'
            })
          ]),
          ...(this.rendererName === 'transfer-picker'
            ? [
                {
                  title: '边框',
                  key: 'borderMode',
                  body: [getSchemaTpl('borderMode')]
                },
                {
                  title: '弹窗',
                  key: 'picker',
                  body: [
                    {
                      name: 'pickerSize',
                      type: 'select',
                      pipeIn: defaultValue(''),
                      pipeOut: undefinedPipeOut,
                      label: '弹窗大小',
                      options: [
                        {
                          label: '默认',
                          value: ''
                        },
                        {
                          value: 'sm',
                          label: '小'
                        },

                        {
                          label: '中',
                          value: 'md'
                        },

                        {
                          label: '大',
                          value: 'lg'
                        },

                        {
                          label: '特大',
                          value: 'xl'
                        },

                        {
                          label: '全屏',
                          value: 'full'
                        }
                      ]
                    }
                  ]
                }
              ]
            : [])
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
  };

  buildDataSchemas(node: EditorNodeType, region: EditorNodeType) {
    const type = resolveOptionType(node.schema);
    // todo:异步数据case
    let dataSchema: any = {
      type,
      title: node.schema?.label || node.schema?.name,
      originalValue: node.schema?.value // 记录原始值，循环引用检测需要
    };

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
        },
        originalValue: dataSchema.originalValue
      };
    }

    return dataSchema;
  }
}

registerEditorPlugin(TransferPlugin);
