import {setVariable, someTree} from 'amis-core';
import {
  BaseEventContext,
  BasePlugin,
  registerEditorPlugin,
  defaultValue,
  getSchemaTpl,
  RendererPluginEvent,
  RendererPluginAction,
  tipedLabel,
  mockValue,
  RegionConfig,
  getI18nEnabled,
  EditorNodeType,
  EditorManager
} from 'amis-editor-core';
import {DSBuilderManager} from '../../builder/DSBuilderManager';
import {ValidatorTag} from '../../validator';
import {
  getArgsWrapper,
  getEventControlConfig,
  getActionCommonProps,
  buildLinkActionDesc
} from '../../renderer/event-control/helper';
import {generateId, resolveInputTableEventDataSchame} from '../../util';
import React from 'react';

export class ComboControlPlugin extends BasePlugin {
  static id = 'ComboControlPlugin';
  // 关联渲染器名字
  rendererName = 'combo';
  $schema = '/schemas/ComboControlSchema.json';

  // 组件名称
  name = '组合输入';
  isBaseComponent = true;
  icon = 'fa fa-group';
  pluginIcon = 'combo-plugin';
  description = '多个表单项的组合，可配置是否增加和删除初始设定的模板';
  docLink = '/amis/zh-CN/components/form/combo';
  tags = ['表单项'];
  scaffold = {
    type: 'combo',
    label: '组合输入',
    name: 'combo',
    multiple: true,
    addable: true,
    removable: true,
    removableMode: 'icon',
    addBtn: {
      label: '新增',
      icon: 'fa fa-plus',
      level: 'primary',
      size: 'sm'
    },
    items: [
      {
        type: 'input-text',
        name: 'text',
        placeholder: '文本',
        id: generateId()
      },
      {
        type: 'select',
        name: 'select',
        placeholder: '选项',
        id: generateId(),
        options: [
          {
            label: 'A',
            value: 'a'
          },
          {
            label: 'B',
            value: 'b'
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
        ...this.scaffold,
        value: [{text: 'Row 1', select: 'a'}, {}]
      }
    ]
  };

  // 容器配置
  regions: Array<RegionConfig> = [
    {
      key: 'items',
      label: '内容区',
      preferTag: '内容区',
      renderMethod: 'renderItems'
    }
  ];

  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'add',
      eventLabel: '添加',
      description: '添加组合项时触发',
      dataSchema: (manager: EditorManager) => {
        const {value} = resolveInputTableEventDataSchame(manager);

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
                    ...value,
                    title: '组合项的值'
                  }
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'delete',
      eventLabel: '删除',
      description: '删除组合项',
      dataSchema: (manager: EditorManager) => {
        const {value, item} = resolveInputTableEventDataSchame(manager);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: '数据',
                properties: {
                  key: {
                    type: 'number',
                    title: '被删除的索引'
                  },
                  value: {
                    type: 'string',
                    ...value,
                    title: '组合项的值'
                  },
                  item: {
                    type: 'object',
                    ...item,
                    title: '被删除的项'
                  }
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'dragEnd',
      eventLabel: '拖拽结束',
      description: '当组合项拖拽结束且位置发生变化时触发',
      dataSchema: (manager: EditorManager) => {
        const {value, item} = resolveInputTableEventDataSchame(manager);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: '数据',
                properties: {
                  index: {
                    type: 'number',
                    title: '拖拽后的索引'
                  },
                  oldIndex: {
                    type: 'number',
                    title: '拖拽前的索引'
                  },
                  item: {
                    type: 'object',
                    ...item,
                    title: '被拖拽的项'
                  },
                  value: {
                    type: 'string',
                    ...value,
                    title: '拖拽前组合项的值'
                  },
                  oldValue: {
                    type: 'string',
                    ...value,
                    title: '拖拽后组合项的值'
                  }
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'tabsChange',
      eventLabel: '切换tab',
      description: '当设置 tabsMode 为 true 时，切换选项卡时触发',
      dataSchema: (manager: EditorManager) => {
        const {value, item} = resolveInputTableEventDataSchame(manager);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: '数据',
                properties: {
                  key: {
                    type: 'number',
                    title: '选项卡索引'
                  },
                  value: {
                    type: 'string',
                    ...value,
                    title: '组合项的值'
                  },
                  item: {
                    type: 'object',
                    ...item,
                    title: '被激活的项'
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
      actionType: 'addItem',
      actionLabel: '添加项',
      description: '添加新的项',
      innerArgs: ['item'],
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            {buildLinkActionDesc(props.manager, info)}
            添加项
          </div>
        );
      },
      schema: getArgsWrapper({
        type: 'combo',
        label: '添加项',
        name: 'item',
        draggable: false,
        multiple: true,
        removable: true,
        required: true,
        addable: true,
        strictMode: false,
        canAccessSuperData: true,
        mode: 'horizontal',
        items: [
          {
            name: 'key',
            type: 'input-text',
            required: true,
            placeholder: '变量名',
            source: '${__setValueDs}'
          },
          getSchemaTpl('formulaControl', {
            name: 'val',
            variables: '${variables}',
            inputMode: 'input-group'
          })
        ]
      })
    },
    {
      actionType: 'setValue',
      actionLabel: '赋值',
      description: '触发组件数据更新',
      ...getActionCommonProps('setValue')
    }
  ];

  panelTitle = '组合输入';

  notRenderFormZone = true;

  panelJustify = true;

  dsManager: DSBuilderManager;

  constructor(manager: EditorManager) {
    super(manager);
    this.dsManager = new DSBuilderManager(manager);
  }

  panelBodyCreator = (context: BaseEventContext) => {
    const i18nEnabled = getI18nEnabled();
    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: [
          getSchemaTpl('collapseGroup', [
            {
              className: 'p-none',
              title: '常用',
              body: [
                getSchemaTpl('formItemName', {
                  required: true
                }),
                getSchemaTpl('label'),

                getSchemaTpl('valueFormula', {
                  rendererSchema: {
                    ...context?.schema,
                    type: 'textarea'
                  },
                  label: tipedLabel(
                    '默认值',
                    '支持 <code>now、+1day、-2weeks、+1hours、+2years</code>等这种相对值用法'
                  ),
                  pipeOut: (value: any) => {
                    try {
                      return typeof JSON.parse(value) === 'number'
                        ? value
                        : JSON.parse(value);
                    } catch (err) {
                      return value;
                    }
                  }
                }),
                // 多选模式和条数绑定了，所以设定了多选，条数开启
                getSchemaTpl('switch', {
                  name: 'multiple',
                  label: '可多选',
                  pipeIn: defaultValue(true),
                  onChange: (
                    value: any,
                    oldValue: any,
                    model: any,
                    form: any
                  ) => {
                    form.setValueByName('addable', value);
                    form.setValueByName('removable', value);
                    !value && form.setValueByName('draggable', false);
                    form.setValueByName('flat', false);
                    form.setValueByName('maxLength', undefined);
                    form.setValueByName('minLength', undefined);
                  }
                }),
                {
                  type: 'container',
                  className: 'ae-ExtendMore mb-3',
                  visibleOn: 'this.multiple',
                  body: [
                    {
                      label: '最多条数',
                      name: 'maxLength',
                      type: 'input-number'
                    },
                    {
                      label: '最少条数',
                      name: 'minLength',
                      type: 'input-number'
                    }
                  ]
                },
                getSchemaTpl('switch', {
                  name: 'flat',
                  label: tipedLabel(
                    '打平值',
                    '默认数组内的数据结构为对象，如果只有一个表单项，可以配置将值打平，那么数组内放置的就是那个表单项的值'
                  ),
                  visibleOn:
                    'Array.isArray(this.items) && this.items.length === 1 && this.multiple'
                }),
                {
                  type: 'container',
                  className: 'ae-ExtendMore mb-3',
                  visibleOn: 'this.multiple && this.flat',
                  body: [getSchemaTpl('joinValues'), getSchemaTpl('delimiter')]
                },
                // 可排序，排序和新增无关，和多选模式有关
                getSchemaTpl('switch', {
                  name: 'draggable',
                  label: '可排序',
                  pipeIn: defaultValue(false),
                  visibleOn: 'this.multiple'
                }),
                {
                  type: 'container',
                  className: 'ae-ExtendMore mb-3',
                  visibleOn: 'this.draggable',
                  body: [getSchemaTpl('draggableTip')]
                },

                // 可新增
                getSchemaTpl('switch', {
                  name: 'addable',
                  label: tipedLabel(
                    '可新增',
                    '如需要拓展自定义的新增功能，可通过配置组件-新增项来拓展'
                  ),
                  visibleOn: 'this.multiple',
                  pipeIn: defaultValue(false),
                  onChange: (
                    value: any,
                    oldValue: any,
                    model: any,
                    form: any
                  ) => {
                    if (value) {
                      form.setValueByName('addBtn', {
                        label: '新增',
                        icon: 'fa fa-plus',
                        level: 'primary',
                        size: 'sm'
                      });
                    }
                  }
                }),

                // 可删除
                getSchemaTpl('switch', {
                  name: 'removable',
                  label: '可删除',
                  pipeIn: defaultValue(false),
                  visibleOn: 'this.multiple',
                  onChange: (
                    value: any,
                    oldValue: any,
                    model: any,
                    form: any
                  ) => {
                    if (value) {
                      form.setValueByName('removableMode', 'icon');
                      form.setValueByName('deleteIcon', undefined);
                      form.setValueByName('deleteBtn', undefined);
                    }
                  }
                }),
                {
                  type: 'container',
                  className: 'ae-ExtendMore mb-3',
                  visibleOn: 'this.removable',
                  body: [
                    // 自定义删除按钮开关
                    {
                      type: 'button-group-select',
                      name: 'removableMode',
                      label: '按钮模式',
                      options: [
                        {
                          label: '图标',
                          value: 'icon'
                        },
                        {
                          label: '按钮',
                          value: 'button'
                        }
                      ],
                      onChange: (
                        value: any,
                        oldValue: any,
                        model: any,
                        form: any
                      ) => {
                        if (value === 'icon') {
                          form.setValueByName('deleteBtn', undefined);
                        } else if (value === 'button') {
                          form.setValueByName('deleteBtn', {
                            label: '删除',
                            level: 'default'
                          });
                        }
                      }
                    },
                    // getSchemaTpl('icon', {
                    //   name: 'deleteIcon',
                    //   label: '图标',
                    //   visibleOn: 'this.removableMode === "icon"'
                    // }),
                    {
                      label: '文案',
                      name: 'deleteBtn.label',
                      type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                      visibleOn: 'this.removableMode === "button"'
                    },
                    getSchemaTpl('buttonLevel', {
                      label: '样式',
                      name: 'deleteBtn.level',
                      visibleOn: 'this.removableMode === "button"'
                    }),
                    getSchemaTpl('apiControl', {
                      name: 'deleteApi',
                      label: '删除',
                      renderLabel: false,
                      mode: 'normal'
                    }),
                    getSchemaTpl('deleteConfirmText')
                  ]
                },

                {
                  type: 'select',
                  name: '__uniqueItems',
                  label: '配置唯一项',
                  source: '${items|pick:name}',
                  pipeIn: (value: any, form: any) => {
                    // 从 items 中获取设置了 unique: true 的项的 name
                    const items = form.data.items || [];
                    return items
                      .filter((item: any) => item.unique)
                      .map((item: any) => item.name);
                  },
                  onChange: (
                    value: string[],
                    oldValue: any,
                    model: any,
                    form: any
                  ) => {
                    // 获取当前的 items
                    const items = [...(form.data.items || [])];
                    // 修改 items 中的 unique 属性
                    const updatedItems = items.map(item => {
                      if (value === item.name) {
                        return {...item, unique: true};
                      } else {
                        const newItem = {...item};
                        delete newItem.unique;
                        return newItem;
                      }
                    });
                    // 更新 items
                    form.setValueByName('items', updatedItems);
                  }
                },
                getSchemaTpl('labelRemark'),
                getSchemaTpl('remark'),

                getSchemaTpl('placeholder'),
                getSchemaTpl('description')
              ]
            },
            getSchemaTpl('collapseGroup', [
              {
                className: 'p-none',
                title: '高级',
                body: [
                  getSchemaTpl('switch', {
                    name: 'canAccessSuperData',
                    label: '自动填充父级变量',
                    pipeIn: defaultValue(false)
                  }),

                  getSchemaTpl('switch', {
                    name: 'strictMode',
                    label: tipedLabel(
                      '严格模式',
                      '如果你希望环境变量的值实时透传到 Combo 中，请关闭此选项。'
                    ),
                    value: true
                  }),

                  getSchemaTpl('combo-container', {
                    name: 'syncFields',
                    visibleOn: '!this.strictMode',
                    label: tipedLabel(
                      '同步字段',
                      '如果 Combo 层级比较深，底层的获取外层的数据可能不同步。但是给 combo 配置这个属性就能同步下来。'
                    ),
                    type: 'combo',
                    mode: 'normal',
                    multiple: true,
                    canAccessSuperData: true,
                    items: [
                      {
                        name: 'field',
                        type: 'input-text'
                      }
                    ],
                    value: [],
                    pipeIn(value?: Array<string>) {
                      return (value ?? []).map(item => ({field: item}));
                    },
                    pipeOut(value?: Array<{field: string}>) {
                      return (value ?? []).map(item => {
                        const keys = Object.keys(item);
                        return keys.length > 0 ? item.field : '';
                      });
                    }
                  }),

                  getSchemaTpl('switch', {
                    name: 'lazyLoad',
                    label: tipedLabel(
                      '懒加载',
                      '如果数据比较多，比较卡顿时，可开启此配置项'
                    ),
                    pipeIn: defaultValue(false),
                    visibleOn: 'this.multiple && !this.tabsMode'
                  })
                ]
              }
            ]),
            getSchemaTpl('status', {
              isFormItem: true,
              readonly: true
            }),
            getSchemaTpl('validation', {tag: ValidatorTag.MultiSelect})
          ])
        ]
      },
      {
        title: '外观',
        className: 'p-none',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            visibleOn: 'this.multiple',
            body: [
              {
                name: 'tabsMode',
                label: '展示形式',
                type: 'button-group-select',
                inputClassName: 'items-center',
                size: 'sm',
                options: [
                  {label: '表单', value: false},
                  {label: '选项卡', value: true}
                ],
                pipeIn: defaultValue(false),
                onChange: (
                  value: any,
                  oldValue: any,
                  model: any,
                  form: any
                ) => {
                  if (value) {
                    form.setValueByName('lazyLoad', undefined);
                  }
                }
              },
              {
                type: 'container',
                className: 'ae-ExtendMore mb-3',
                visibleOn: 'this.tabsMode',
                body: [
                  {
                    type: 'select',
                    name: 'tabsStyle',
                    label: '样式',
                    pipeIn: defaultValue(''),
                    options: [
                      {
                        label: '默认',
                        value: ''
                      },
                      {
                        label: '线型',
                        value: 'line'
                      },
                      {
                        label: '卡片',
                        value: 'card'
                      },
                      {
                        label: '选择器',
                        value: 'radio'
                      }
                    ]
                  },
                  getSchemaTpl('formulaControl', {
                    label: '标题模版',
                    name: 'tabsLabelTpl'
                  })
                ]
              },
              // 表单多行展示
              getSchemaTpl('switch', {
                name: 'multiLine',
                label: '多行展示',
                pipeIn: defaultValue(false),
                visibleOn: '!this.tabsMode',
                onChange: (
                  value: boolean,
                  oldValue: any,
                  model: any,
                  form: any
                ) => {
                  if (!value) {
                    form.setValueByName('subFormMode', undefined);
                    form.setValueByName('noBorder', undefined);
                  }
                }
              }),
              getSchemaTpl('switch', {
                visibleOn: '!this.tabsMode && this.multiLine',
                name: 'noBorder',
                label: '去掉边框',
                pipeIn: defaultValue(false)
              })
            ]
          },
          getSchemaTpl('style:formItem', {
            renderer: context.info.renderer,
            schema: [
              getSchemaTpl('subFormItemMode', {
                visibleOn: 'this.multiLine',
                type: 'select',
                label: '子表单'
              })
            ]
          }),
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
  };

  filterProps(props: any, node: EditorNodeType) {
    if (!node.state.value) {
      // 至少显示一个成员，否则啥都不显示。
      if (
        props.multiple &&
        !props.value &&
        !props.$schema.value &&
        !props.$ref
      ) {
        const mockedData = {};
        if (Array.isArray(props.items) && props.items.length === 0) {
          props.items.forEach((control: any) => {
            control.name &&
              setVariable(mockedData, control.name, mockValue(control));
          });
        }
        node.updateState({
          value: [mockedData]
        });
      }
    }
    return props;
  }

  async buildDataSchemas(
    node: EditorNodeType,
    region?: EditorNodeType,
    trigger?: EditorNodeType,
    parent?: EditorNodeType
  ) {
    const itemsSchema: any = {
      $id: `${node.id}-${node.type}-tableRows`,
      type: 'object',
      properties: {}
    };
    const items = node.children?.find(
      child => child.isRegion && child.region === 'items'
    );
    const parentScopeId = `${parent?.id}-${parent?.type}${
      node.parent?.type === 'cell' ? '-currentRow' : ''
    }`;
    let isColumnChild = false;

    if (trigger && items) {
      isColumnChild = someTree(items.children, item => item.id === trigger?.id);

      if (isColumnChild) {
        const scopeId = `${node.id}-${node.type}-currentRow`;
        if (this.manager.dataSchema.getScope(scopeId)) {
          this.manager.dataSchema.removeScope(scopeId);
        }

        if (this.manager.dataSchema.getScope(parentScopeId)) {
          this.manager.dataSchema.switchTo(parentScopeId);
        }

        this.manager.dataSchema.addScope([], scopeId);
        this.manager.dataSchema.current.tag = '当前行记录';
        this.manager.dataSchema.current.group = '组件上下文';
      }
    }

    const pool = items?.children?.concat() || [];

    while (pool.length) {
      const current = pool.shift() as EditorNodeType;
      const schema = current.schema;
      if (schema?.name) {
        const tmpSchema = await current.info.plugin.buildDataSchemas?.(
          current,
          region,
          trigger,
          node
        );
        itemsSchema.properties[schema.name] = {
          tmpSchema,
          ...(tmpSchema?.$id ? {} : {$id: `${current!.id}-${current!.type}`})
        };
      }
    }

    if (isColumnChild) {
      const scopeId = `${node.id}-${node.type}-currentRow`;
      const scope = this.manager.dataSchema.getScope(scopeId);
      scope?.addSchema(itemsSchema);
    }

    if (node.schema?.multiple) {
      return {
        $id: 'combo',
        type: 'array',
        title: node.schema?.label || node.schema?.name,
        items: itemsSchema
      };
    }

    return {
      ...itemsSchema,
      title: node.schema?.label || node.schema?.name
    };
  }

  async getAvailableContextFields(
    scopeNode: EditorNodeType,
    target: EditorNodeType,
    region?: EditorNodeType
  ) {
    let scope;
    let builder;

    if (
      target.type === scopeNode.type ||
      (target.parent.isRegion && target.parent.region === 'items')
    ) {
      scope = scopeNode.parent.parent;
      builder = this.dsManager.getBuilderBySchema(scope.schema);
    }

    if (builder && scope.schema.api) {
      return builder.getAvailableContextFields(
        {
          schema: scope.schema,
          sourceKey: 'api',
          feat: scope.schema?.feat ?? 'List',
          scopeNode
        },
        /** ID相同为本体，否则为子项 */
        target?.id === scopeNode?.id ? scopeNode : target
      );
    }
  }
}

registerEditorPlugin(ComboControlPlugin);
