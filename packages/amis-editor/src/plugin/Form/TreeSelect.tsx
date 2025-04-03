import {
  EditorManager,
  EditorNodeType,
  getI18nEnabled,
  RendererPluginAction,
  RendererPluginEvent,
  defaultValue,
  getSchemaTpl,
  registerEditorPlugin,
  BaseEventContext,
  BasePlugin,
  tipedLabel,
  diff
} from 'amis-editor-core';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';
import {ValidatorTag} from '../../validator';
import {
  resolveOptionEventDataSchame,
  resolveOptionType,
  schemaArrayFormat,
  schemaToArray,
  TREE_BASE_EVENTS
} from '../../util';
import {TreeCommonAction} from './InputTree';
import {inputStateTpl} from '../../renderer/style-control/helper';

export class TreeSelectControlPlugin extends BasePlugin {
  static id = 'TreeSelectControlPlugin';
  // 关联渲染器名字
  rendererName = 'tree-select';
  $schema = '/schemas/TreeSelectControlSchema.json';

  // 组件名称
  name = '树组件';
  isBaseComponent = true;
  disabledRendererPlugin = true;
  icon = 'fa fa-list-alt';
  pluginIcon = 'tree-select-plugin';
  description = '树型结构选择，支持 [内嵌模式] 与 [浮层模式] 的外观切换';
  searchKeywords =
    'tree、树下拉、树下拉框、tree-select、树形选择框、树形选择器';
  docLink = '/amis/zh-CN/components/form/treeselect';
  tags = ['表单项'];
  scaffold = {
    type: 'tree-select',
    label: '树组件',
    name: 'tree',
    clearable: false,
    options: [
      {
        label: '选项A',
        value: 'A',
        children: [
          {
            label: '选项C',
            value: 'C'
          },
          {
            label: '选项D',
            value: 'D'
          }
        ]
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
    body: {
      ...this.scaffold,
      label: '树组件 - 浮层模式',
      mode: 'normal'
    }
  };
  defaultItemAction = {
    type: 'container',
    body: [
      {
        type: 'button',
        icon: 'fa fa-plus',
        level: 'link',
        size: 'xs'
      }
    ]
  };

  notRenderFormZone = true;

  panelTitle = '树选择';

  // 事件定义
  events: (schema: any) => RendererPluginEvent[] = (schema: any) => [
    ...TREE_BASE_EVENTS(schema),
    {
      eventName: 'focus',
      eventLabel: '获取焦点',
      description: '输入框获取焦点时触发',
      dataSchema: (manager: EditorManager) => {
        const {value, items, itemSchema} =
          resolveOptionEventDataSchame(manager);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: '数据',
                properties: {
                  value,
                  item: {
                    type: 'object',
                    title: '选中的项',
                    properties: itemSchema
                  },
                  items
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
        const {value, items, itemSchema} =
          resolveOptionEventDataSchame(manager);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: '数据',
                properties: {
                  value,
                  item: {
                    type: 'object',
                    title: '选中的项',
                    properties: itemSchema
                  },
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
    /** 新增、编辑、删除 */
    ...TreeCommonAction,
    {
      actionType: 'clear',
      actionLabel: '清空',
      description: '清除数据',
      ...getActionCommonProps('clear')
    },
    {
      actionType: 'reset',
      actionLabel: '重置',
      description: '重置数据',
      ...getActionCommonProps('reset')
    },
    {
      actionType: 'setValue',
      actionLabel: '赋值',
      description: '触发组件数据更新',
      ...getActionCommonProps('setValue')
    },
    {
      actionType: 'reload',
      actionLabel: '重新加载',
      description: '触发组件数据刷新并重新渲染',
      ...getActionCommonProps('reload')
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
              {
                type: 'button-group-select',
                name: 'type',
                label: '模式',
                pipeIn: defaultValue('tree-select'),
                options: [
                  {
                    label: '内嵌',
                    value: 'input-tree'
                  },
                  {
                    label: '浮层',
                    value: 'tree-select'
                  }
                ]
              },
              getSchemaTpl('clearable', {
                mode: 'horizontal',
                horizontal: {
                  justify: true,
                  left: 8
                },
                value: false,
                inputClassName: 'is-inline ',
                visibleOn: 'this.type === "tree-select"'
              }),
              getSchemaTpl('switch', {
                label: '可检索',
                name: 'searchable'
              }),
              getSchemaTpl('apiControl', {
                name: 'searchApi',
                label: '选项搜索接口',
                labelClassName: 'none',
                visibleOn: 'this.type === "input-tree" && this.searchable'
              }),
              getSchemaTpl('multiple', {
                body: [
                  {
                    type: 'input-number',
                    label: tipedLabel('节点最小数', '表单校验最少选中的节点数'),
                    name: 'minLength',
                    min: 0
                  },
                  {
                    type: 'input-number',
                    label: tipedLabel('节点最大数', '表单校验最多选中的节点数'),
                    name: 'maxLength',
                    min: 0
                  }
                ]
              }),
              getSchemaTpl('switch', {
                label: tipedLabel(
                  '子节点自动选',
                  '当选中父节点时级联选择子节点'
                ),
                name: 'autoCheckChildren',
                hiddenOn: '!this.multiple',
                value: true
              }),
              getSchemaTpl('switch', {
                label: tipedLabel(
                  '子节点可反选',
                  '子节点可反选，值包含父子节点'
                ),
                name: 'cascade',
                hiddenOn: '!this.multiple || !this.autoCheckChildren'
              }),
              getSchemaTpl('switch', {
                label: tipedLabel(
                  '子节点反选取消父节点',
                  '取消任意子节点选中状态的同时取消父节点选中状态'
                ),
                name: 'autoCancelParent',
                hiddenOn: '!this.multiple || !this.cascade'
              }),
              getSchemaTpl('switch', {
                label: tipedLabel(
                  '值包含父节点',
                  '选中父节点时，值里面将包含父子节点的值，否则只会保留父节点的值'
                ),
                name: 'withChildren',
                hiddenOn:
                  '!this.multiple || !this.autoCheckChildren && this.cascade'
              }),
              getSchemaTpl('switch', {
                label: tipedLabel(
                  '值只含子节点',
                  'ui 行为级联选中子节点，子节点可反选，值只包含子节点的值'
                ),
                name: 'onlyChildren',
                hiddenOn: '!this.multiple  || !this.autoCheckChildren'
              }),

              getSchemaTpl('valueFormula', {
                rendererSchema: {
                  ...context?.schema,
                  type: 'tree-select'
                },
                visibleOn: 'this.options && this.options.length > 0'
              }),

              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('placeholder'),
              getSchemaTpl('description')
            ]
          },
          {
            title: '选项',
            body: [
              getSchemaTpl('treeOptionControl', {
                label: '数据',
                showIconField: true
              }),
              // 自定义选项模板
              getSchemaTpl('optionsMenuTpl', {
                manager: this.manager
              }),
              getSchemaTpl('apiControl', {
                name: 'deferApi',
                label: '懒加载接口',
                labelClassName: 'none'
              }),
              getSchemaTpl('deferField'),
              getSchemaTpl(
                'loadingConfig',
                {
                  visibleOn: 'this.source || !this.options'
                },
                {context}
              ),
              {
                type: 'checkboxes',
                name: 'nodeBehavior',
                label: '节点行为',
                value: ['check'],
                joinValues: false,
                extractValue: true,
                inline: true,
                options: [
                  {
                    label: '选中',
                    value: 'check'
                  },
                  {
                    label: '展开',
                    value: 'unfold'
                  }
                ]
              },
              getSchemaTpl('switch', {
                label: '只可选择叶子节点',
                name: 'onlyLeaf'
              }),
              /** 新增选项 */
              getSchemaTpl('optionAddControl', {
                manager: this.manager,
                collections: [
                  getSchemaTpl('switch', {
                    label: '顶层可新增',
                    value: true,
                    name: 'rootCreatable'
                  }),
                  {
                    type: 'input-text',
                    label: '根节点文案',
                    value: '添加一级节点',
                    name: 'rootCreateTip',
                    hiddenOn: '!this.rootCreatable'
                  },
                  {
                    type: 'input-text',
                    label: '新增文案提示',
                    value: '添加子节点',
                    name: 'createTip'
                  }
                ]
              }),
              /** 编辑选项 */
              getSchemaTpl('optionEditControl', {
                manager: this.manager,
                collections: [
                  {
                    type: 'input-text',
                    label: '编辑文案提示',
                    value: '编辑该节点',
                    name: 'editTip'
                  }
                ]
              }),
              /** 删除选项 */
              getSchemaTpl('optionDeleteControl', {
                manager: this.manager,
                collections: [
                  {
                    type: 'input-text',
                    label: '删除文案提示',
                    value: '移除该节点',
                    name: 'removeTip'
                  }
                ]
              }),
              {
                type: 'select',
                label: '操作栏位置',
                value: '',
                name: 'themeCss.actionControlClassName.marginLeft',
                options: [
                  {
                    label: '左侧',
                    value: ''
                  },
                  {
                    label: '右侧',
                    value: 'auto'
                  }
                ]
              },
              {
                type: 'ae-switch-more',
                mode: 'normal',
                label: '自定义操作',
                bulk: false,
                name: 'itemActions',
                formType: 'extend',
                defaultData: this.defaultItemAction,
                form: {
                  body: [
                    {
                      type: 'button',
                      level: 'primary',
                      size: 'sm',
                      block: true,
                      onClick: this.editDetail.bind(this, context.id),
                      label: '配置自定义操作模板'
                    }
                  ]
                }
              }
            ]
          },
          {
            title: '高级',
            body: [
              getSchemaTpl('valueFormula', {
                name: 'highlightTxt',
                label: '高亮节点字符',
                visibleOn: 'this.type === "input-tree"'
              }),
              {
                type: 'ae-Switch-More',
                mode: 'normal',
                name: 'enableNodePath',
                label: tipedLabel(
                  '选项值包含父节点',
                  '开启后对应节点值会包含父节点'
                ),
                falseValue: false,
                formType: 'extend',
                autoFocus: false,
                form: {
                  body: [
                    {
                      type: 'input-text',
                      label: '路径分隔符',
                      value: '/',
                      name: 'pathSeparator'
                    }
                  ]
                }
              },
              {
                type: 'ae-Switch-More',
                mode: 'normal',
                name: 'hideRoot',
                label: '显示顶级节点',
                trueValue: false,
                falseValue: true,
                formType: 'extend',
                autoFocus: false,
                form: {
                  body: [
                    {
                      type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                      label: '节点文案',
                      value: '顶级',
                      name: 'rootLabel'
                    }
                  ]
                },
                visibleOn: 'this.type === "input-tree"'
              },
              getSchemaTpl('switch', {
                label: tipedLabel(
                  '选项文本仅显示选中节点',
                  '隐藏选择框中已选中节点的祖先节点的文本信息'
                ),
                name: 'hideNodePathLabel',
                visibleOn: 'this.type==="tree-select"'
              }),
              getSchemaTpl('switch', {
                label: '显示节点图标',
                name: 'showIcon',
                value: true
              }),
              getSchemaTpl('switch', {
                label: tipedLabel(
                  '显示节点勾选框',
                  '单选情况下，也可显示树节点勾选框'
                ),
                name: 'showRadio',
                hiddenOn: 'this.multiple'
              }),
              getSchemaTpl('switch', {
                label: tipedLabel('显示层级展开线', '显示树层级展开线'),
                name: 'showOutline'
              }),
              {
                type: 'ae-Switch-More',
                mode: 'normal',
                name: 'initiallyOpen',
                label: tipedLabel(
                  '自定义展开层级',
                  '默认展开所有节点层级，开启后可自定义展开层级数'
                ),
                trueValue: false,
                falseValue: true,
                formType: 'extend',
                autoFocus: false,
                form: {
                  body: [
                    {
                      type: 'input-number',
                      label: '设置层级',
                      name: 'unfoldedLevel',
                      value: 1,
                      min: 0
                    }
                  ]
                }
              },
              getSchemaTpl('virtualThreshold'),
              getSchemaTpl('virtualItemHeight')
            ]
          },
          getSchemaTpl('status', {
            isFormItem: true
          }),
          getSchemaTpl('validation', {tag: ValidatorTag.Tree})
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          getSchemaTpl('theme:formItem'),
          getSchemaTpl('theme:form-label'),
          getSchemaTpl('theme:form-description'),
          {
            title: '输入框样式',
            body: [
              ...inputStateTpl(
                'themeCss.inputControlClassName',
                '--input-default'
              )
            ]
          }
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

  getSubEditorVariable(schema: any): Array<{label: string; children: any}> {
    let labelField = schema?.labelField || 'label';
    let valueField = schema?.valueField || 'value';

    return [
      {
        label: '节点选项',
        children: [
          {
            label: '节点索引',
            value: 'index'
          },
          {
            label: '节点名称',
            value: labelField
          },
          {
            label: '节点值',
            value: valueField
          },
          {
            label: '节点状态',
            value: 'checked'
          }
        ]
      }
    ];
  }

  getDisplayField(data: any) {
    if (
      data.source ||
      (data.map &&
        Array.isArray(data.map) &&
        data.map[0] &&
        Object.keys(data.map[0]).length > 1)
    ) {
      return data.labelField ?? 'label';
    }
    return 'item';
  }

  editDetail(id: string) {
    const manager = this.manager;
    const store = manager.store;
    const node = store.getNodeById(id);
    const value = store.getValueOf(id);
    const defaultItemSchema = this.defaultItemAction;
    let originData = value.itemActions;

    if (originData.type && originData.type !== 'container') {
      originData = {
        type: 'container',
        body: [originData]
      };
    } else {
      originData = originData ?? defaultItemSchema;
    }

    node &&
      value &&
      this.manager.openSubEditor({
        title: '配置自定义操作模板',
        value: originData,
        onChange: (newValue: any) => {
          newValue = {...value, itemActions: newValue};
          manager.panelChangeValue(newValue, diff(value, newValue));
        }
      });
  }
}

registerEditorPlugin(TreeSelectControlPlugin);
