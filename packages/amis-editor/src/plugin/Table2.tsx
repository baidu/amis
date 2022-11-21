import {resolveVariable} from 'amis';

import {setVariable} from 'amis-core';
import {
  BasePlugin,
  BaseEventContext,
  PluginEvent,
  RegionConfig,
  RendererInfoResolveEventContext,
  BasicRendererInfo,
  PluginInterface,
  InsertEventContext,
  ScaffoldForm,
  registerEditorPlugin,
  defaultValue,
  getSchemaTpl,
  tipedLabel,
  repeatArray,
  mockValue,
  EditorNodeType,
  RendererPluginAction,
  RendererPluginEvent
} from 'amis-editor-core';
import {getEventControlConfig} from '../renderer/event-control/helper';
import {SchemaObject} from 'amis/lib/Schema';
import {getArgsWrapper} from '../renderer/event-control/helper';

export class Table2Plugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'table2';
  $schema = '/schemas/TableSchema.json';

  // 组件名称
  name = '表格2';
  isBaseComponent = true;
  panelJustify = true;
  disabledRendererPlugin = true;
  description =
    '用来展示表格数据，可以配置列信息，然后关联数据便能完成展示。支持嵌套、超级表头、列固定、表头固顶、合并单元格等等。当前组件需要配置数据源，不自带数据拉取，请优先使用 「CRUD」 组件。';
  docLink = '/amis/zh-CN/components/table2';
  icon = 'fa fa-table';

  scaffold: SchemaObject = {
    type: 'table2',

    columns: [
      {
        title: '列信息',
        name: 'a'
      }
    ],

    source: '$item'
  };

  regions: Array<RegionConfig> = [
    {
      key: 'columns',
      label: '列集合',
      renderMethod: 'renderTable',
      preferTag: '展示',
      dndMode: 'position-h'
    }
  ];

  previewSchema: any = {
    type: 'table2',
    className: 'text-left m-b-none',
    items: [
      {a: 1, b: 2, c: 9},
      {a: 3, b: 4, c: 8},
      {a: 5, b: 6, c: 7}
    ],
    columns: [
      {
        title: 'A',
        name: 'a'
      },
      {
        title: 'B',
        name: 'b'
      }
    ]
  };

  scaffoldForm: ScaffoldForm = {
    title: '快速构建表格',
    body: [
      {
        name: 'columns',
        type: 'combo',
        multiple: true,
        label: false,
        addButtonText: '新增一列',
        draggable: true,
        items: [
          {
            type: 'input-text',
            name: 'title',
            placeholder: '标题'
          },
          {
            type: 'input-text',
            name: 'name',
            placeholder: '绑定字段名'
          },
          {
            type: 'select',
            name: 'type',
            placeholder: '类型',
            value: 'text',
            options: [
              {
                value: 'text',
                label: '纯文本'
              },
              {
                value: 'tpl',
                label: '模板'
              },
              {
                value: 'image',
                label: '图片'
              },
              {
                value: 'date',
                label: '日期'
              },
              {
                value: 'progress',
                label: '进度'
              },
              {
                value: 'status',
                label: '状态'
              },
              {
                value: 'mapping',
                label: '映射'
              },
              {
                value: 'container',
                label: '容器'
              },
              {
                value: 'operation',
                label: '操作栏'
              }
            ]
          }
        ]
      }
    ],
    canRebuild: true
  };

  panelTitle = '表格';

  events: RendererPluginEvent[] = [
    {
      eventName: 'selectedChange',
      eventLabel: '选择表格项',
      description: '手动选择表格项事件',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.selectedItems': {
              type: 'array',
              title: '已选择行'
            },
            'event.data.unSelectedItems': {
              type: 'array',
              title: '未选择行'
            }
          }
        }
      ]
    },
    {
      eventName: 'columnSort',
      eventLabel: '列排序',
      description: '点击列排序事件',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.orderBy': {
              type: 'string',
              title: '列排序列名'
            },
            'event.data.orderDir': {
              type: 'string',
              title: '列排序值'
            }
          }
        }
      ]
    },
    {
      eventName: 'columnFilter',
      eventLabel: '列筛选',
      description: '点击列筛选事件',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.filterName': {
              type: 'string',
              title: '列筛选列名'
            },
            'event.data.filterValue': {
              type: 'string',
              title: '列筛选值'
            }
          }
        }
      ]
    },
    {
      eventName: 'columnSearch',
      eventLabel: '列搜索',
      description: '点击列搜索事件',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.searchName': {
              type: 'string',
              title: '列搜索列名'
            },
            'event.data.searchValue': {
              type: 'object',
              title: '列搜索数据'
            }
          }
        }
      ]
    },
    {
      eventName: 'orderChange',
      eventLabel: '行排序',
      description: '手动拖拽行排序事件',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.movedItems': {
              type: 'array',
              title: '已排序数据'
            }
          }
        }
      ]
    },
    {
      eventName: 'columnToggled',
      eventLabel: '列显示变化',
      description: '点击自定义列事件',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.columns': {
              type: 'array',
              title: '当前显示的列配置数据'
            }
          }
        }
      ]
    },
    {
      eventName: 'rowClick',
      eventLabel: '行单击',
      description: '点击整行事件',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.rowItem': {
              type: 'object',
              title: '行点击数据'
            }
          }
        }
      ]
    }
  ];

  actions: RendererPluginAction[] = [
    {
      actionType: 'select',
      actionLabel: '设置选中项',
      description: '设置表格的选中项',
      schema: getArgsWrapper([
        /*
        {
          type: 'input-formula',
          variables: '${variables}',
          evalMode: false,
          variableMode: 'tabs',
          label: '选中项',
          size: 'lg',
          name: 'selected',
          mode: 'horizontal'
        }
        */
        {
          name: 'selected',
          label: '选中项',
          type: 'ae-formulaControl',
          variables: '${variables}',
          size: 'lg',
          mode: 'horizontal'
        }
      ])
    },
    {
      actionType: 'selectAll',
      actionLabel: '设置全部选中',
      description: '设置表格全部项选中'
    },
    {
      actionType: 'clearAll',
      actionLabel: '清空选中项',
      description: '清空表格所有选中项'
    }
  ];

  async buildDataSchemas(node: EditorNodeType, region?: EditorNodeType) {
    const itemsSchema: any = {
      $id: 'tableRow',
      type: 'object',
      properties: {}
    };
    const columns: EditorNodeType = node.children.find(
      item => item.isRegion && item.region === 'columns'
    );
    if (columns) {
      for (let current of columns.children) {
        const schema = current.schema;
        if (schema && schema.key) {
          itemsSchema.properties[schema.key] = current.info?.plugin
            ?.buildDataSchemas
            ? await current.info.plugin.buildDataSchemas(current, region)
            : {
                type: 'string',
                title: schema.label || schema.title,
                description: schema.description
              };
        }
      }
    }

    const result: any = {
      $id: 'table2',
      type: 'object',
      properties: {
        items: {
          type: 'array',
          title: '表格数据',
          items: itemsSchema
        }
      }
    };

    if (region?.region === 'columns') {
      result.properties = {
        ...itemsSchema.properties,
        ...result.properties
      };
    }

    return result;
  }

  async getAvailableContextFields(
    scopeNode: EditorNodeType,
    node: EditorNodeType,
    region?: EditorNodeType
  ) {
    // // 只有表单项组件可以使用表单组件的数据域
    // if (
    //   scopeNode.parent?.type === 'crud2'
    // ) {
    //   return scopeNode.parent.info.plugin.getAvailableContextFields?.(
    //     scopeNode.parent,
    //     node,
    //     region
    //   );
    // }
  }

  panelBodyCreator = (context: BaseEventContext) => {
    const isCRUDBody = ['crud', 'crud2'].includes(context.schema.type);

    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: [
          getSchemaTpl('collapseGroup', [
            {
              title: '基本',
              body: [
                {
                  name: 'source',
                  type: 'input-text',
                  label: tipedLabel('数据源', '绑定当前环境变量。'),
                  hidden: isCRUDBody,
                  pipeIn: defaultValue('${items}')
                },

                getSchemaTpl('switch', {
                  name: 'title',
                  label: '显示标题',
                  pipeIn: (value: any) => !!value,
                  pipeOut: (value: any) => {
                    if (value) {
                      return {
                        type: 'container',
                        body: [
                          {
                            type: 'tpl',
                            tpl: '表格标题',
                            inline: false,
                            style: {
                              fontSize: 14
                            }
                          }
                        ]
                      };
                    }
                    return null;
                  }
                }),

                getSchemaTpl('switch', {
                  name: 'showHeader',
                  label: '显示表头',
                  value: true,
                  pipeIn: (value: any) => !!value,
                  pipeOut: (value: any) => !!value
                }),

                getSchemaTpl('switch', {
                  visibleOn: 'this.showHeader !== false',
                  name: 'sticky',
                  label: '冻结表头',
                  pipeIn: defaultValue(false)
                }),

                getSchemaTpl('switch', {
                  name: 'footer',
                  label: '显示表尾',
                  pipeIn: (value: any) => !!value,
                  pipeOut: (value: any) => {
                    if (value) {
                      return {
                        type: 'container',
                        body: [
                          {
                            type: 'tpl',
                            tpl: '表格尾部',
                            inline: false,
                            style: {
                              fontSize: 14
                            }
                          }
                        ]
                      };
                    }
                    return null;
                  }
                }),

                {
                  name: 'scroll.y',
                  label: '内容高度',
                  type: 'button-group-select',
                  pipeIn: (v: any) => v != null,
                  pipeOut: (v: any) => (v ? '' : null),
                  options: [
                    {
                      label: '适配内容',
                      value: false
                    },

                    {
                      label: '固定',
                      value: true
                    }
                  ]
                },

                {
                  type: 'input-group',
                  visibleOn: 'data.scroll && data.scroll.y !== null',
                  label: '高度值',
                  body: [
                    {
                      type: 'input-number',
                      name: 'scroll.y'
                    },
                    {
                      type: 'tpl',
                      addOnclassName: 'border-0 bg-none',
                      tpl: 'px'
                    }
                  ]
                },

                {
                  name: 'scroll.x',
                  label: tipedLabel(
                    '内容宽度',
                    '当列内容过多，超出宽度时，可使用横向滚动方式查看数据。'
                  ),
                  type: 'button-group-select',
                  pipeIn: (v: any) => v != null,
                  pipeOut: (v: any) => (v ? '' : null),
                  options: [
                    {
                      label: '适配内容',
                      value: false
                    },

                    {
                      label: '固定',
                      value: true
                    }
                  ]
                },

                {
                  type: 'input-group',
                  visibleOn: 'data.scroll && data.scroll.x !== null',
                  name: 'scroll.x',
                  label: '宽度值',
                  body: [
                    {
                      type: 'input-number',
                      name: 'scroll.x'
                    },
                    {
                      type: 'tpl',
                      addOnclassName: 'border-0 bg-none',
                      tpl: 'px'
                    }
                  ]
                },

                {
                  name: 'placeholder',
                  pipeIn: defaultValue('暂无数据'),
                  type: 'input-text',
                  label: '占位内容'
                }
              ]
            },
            {
              title: '列设置',
              body: [
                getSchemaTpl('switch', {
                  name: 'resizable',
                  label: tipedLabel('可调整列宽', '用户可通过拖拽调整列宽度'),
                  pipeIn: (value: any) => !!value,
                  pipeOut: (value: any) => value
                }),
                isCRUDBody
                  ? null
                  : {
                      type: 'ae-Switch-More',
                      mode: 'normal',
                      name: 'columnsTogglable',
                      hiddenOnDefault: true,
                      formType: 'extend',
                      label: tipedLabel(
                        '自定义显示列',
                        '自动即列数量大于10自动开启。'
                      ),
                      pipeOut: (value: any) => {
                        if (value && value.columnsTogglable) {
                          return {columnsTogglable: {type: 'column-toggler'}};
                        }
                        return value;
                      },
                      form: {
                        body: [
                          {
                            mode: 'normal',
                            type: 'ae-columnControl'
                          }
                        ]
                      }
                    }
              ]
            },

            {
              title: '行设置',
              body: [
                {
                  name: 'lineHeight',
                  label: '行高度',
                  type: 'select',
                  placeholder: '请选择高度',
                  options: [
                    {label: '跟随内容', value: ''},
                    {label: '高', value: 'large'},
                    {label: '中', value: 'middle'}
                  ],
                  clearable: false,
                  value: ''
                },

                isCRUDBody
                  ? {
                      type: 'ae-Switch-More',
                      mode: 'normal',
                      name: 'rowSelection',
                      label: '可多选',
                      visibleOn: 'data.selectable',
                      hiddenOnDefault: true,
                      formType: 'extend',
                      form: {
                        body: [
                          {
                            label: '可选区域',
                            name: 'rowSelection.rowClick',
                            type: 'button-group-select',
                            value: false,
                            options: [
                              {
                                label: 'CheckBox',
                                value: false
                              },
                              {
                                label: '整行',
                                value: true
                              }
                            ]
                          },
                          {
                            name: 'rowSelection.disableOn',
                            type: 'ae-formulaControl',
                            label: '行禁用条件'
                          },
                          {
                            name: 'rowSelection.selections',
                            label: '选择菜单项',
                            type: 'checkboxes',
                            joinValues: false,
                            inline: false,
                            itemClassName: 'text-sm',
                            options: [
                              {label: '全选', value: 'all'},
                              {label: '反选', value: 'invert'},
                              {label: '取消选择', value: 'none'},
                              {label: '选择奇数项', value: 'odd'},
                              {label: '选择偶数项', value: 'even'}
                            ],
                            pipeIn(v: any) {
                              if (!v) {
                                return;
                              }
                              return v.map((item: any) => ({
                                label: item.text,
                                value: item.key
                              }));
                            },
                            pipeOut(v: any) {
                              if (!v) {
                                return;
                              }
                              return v.map((item: any) => ({
                                key: item.value,
                                text: item.label
                              }));
                            }
                          }
                        ]
                      }
                    }
                  : null,

                {
                  type: 'ae-Switch-More',
                  mode: 'normal',
                  name: 'expandable',
                  label: '可展开',
                  hiddenOnDefault: true,
                  formType: 'extend',
                  form: {
                    body: [
                      {
                        name: 'expandable.expandableOn',
                        visibleOn: 'data.expandable',
                        type: 'ae-formulaControl',
                        label: '行展开条件'
                      }
                    ]
                  }
                },

                getSchemaTpl('switch', {
                  name: 'childrenColumnName',
                  label: '可嵌套',
                  pipeIn: (value: any) => !!value,
                  pipeOut: (value: any) => (value ? 'children' : '')
                }),

                getSchemaTpl('switch', {
                  name: 'draggable',
                  label: '可拖拽',
                  pipeIn: (value: any) => !!value,
                  pipeOut: (value: any) => value
                })
              ]
            },

            {
              title: '状态',
              body: [
                getSchemaTpl('hidden', {
                  label: '隐藏'
                })
              ]
            },

            {
              title: '高级',
              body: [
                getSchemaTpl('apiControl', {
                  label: '快速保存',
                  name: 'quickSaveApi'
                }),

                getSchemaTpl('apiControl', {
                  label: '快速保存单条',
                  name: 'quickSaveItemApi'
                })
              ]
            }
          ])
        ]
      },
      {
        title: '外观',
        body: [
          getSchemaTpl('collapseGroup', [
            {
              title: '基本',
              body: [
                getSchemaTpl('switch', {
                  name: 'bordered',
                  label: '边框',
                  pipeIn: defaultValue(false)
                }),

                {
                  name: 'scroll.x',
                  type: 'input-number',
                  label: '横向滚动'
                },

                {
                  name: 'indentSize',
                  visibleOn: 'data.childrenColumnName',
                  type: 'input-number',
                  unitOptions: [{label: 'px', value: 'px'}],
                  label: '嵌套缩进'
                },

                {
                  name: 'rowSelection.columnWidth',
                  visibleOn: 'data.rowSelection',
                  type: 'input-number',
                  label: '选择列宽度',
                  description: '固定选择列的宽度'
                },

                {
                  name: 'expandable.columnWidth',
                  visibleOn: 'data.expandable',
                  type: 'input-number',
                  label: '展开列宽度',
                  description: '固定展开列的宽度'
                }
              ]
            },

            getSchemaTpl('style:classNames', {
              isFormItem: true,
              schema: [
                {
                  name: 'rowClassNameExpr',
                  type: 'ae-formulaControl',
                  label: '自定义行样式'
                },

                {
                  name: 'expandable.expandedRowClassNameExpr',
                  visibleOn: 'data.expandable',
                  type: 'ae-formulaControl',
                  label: '展开行样式'
                }
              ]
            })
          ])
        ]
      },
      {
        title: '事件',
        body: [
          getSchemaTpl('eventControl', {
            name: 'onEvent',
            ...getEventControlConfig(this.manager, context)
          })
        ]
      }
    ]);
  };

  filterProps(props: any) {
    const arr = Array.isArray(props.value)
      ? props.value
      : typeof props.source === 'string'
      ? resolveVariable(props.source, props.data)
      : resolveVariable('items', props.data);

    if (!Array.isArray(arr) || !arr.length) {
      const mockedData: any = {};

      if (Array.isArray(props.columns)) {
        props.columns.forEach((column: any) => {
          if (column.name) {
            setVariable(mockedData, column.name, mockValue(column));
          }
        });
      }

      props.value = repeatArray(mockedData, 10).map((item, index) => ({
        ...item,
        id: index + 1
      }));
    } else {
      // 只取10条预览，否则太多卡顿
      props.value = arr.slice(0, 10);
    }

    // 如果设置了可展开 默认把第一行展开
    if (props.expandable) {
      if (typeof props.expandable === 'boolean') {
        props.expandable = {};
      }
      if (!props.expandable.type) {
        props.expandable.type = 'container';
        props.expandable.body = [
          {
            type: 'tpl',
            tpl: '展开行内容',
            inline: false
          }
        ];
      }

      props.expandable.keyField = 'id';
      props.expandable.expandedRowKeys = [1];
    }

    return props;
  }

  // 为了能够自动注入数据。
  getRendererInfo(
    context: RendererInfoResolveEventContext
  ): BasicRendererInfo | void {
    const plugin: PluginInterface = this;
    const {schema, renderer} = context;

    if (
      !schema.$$id &&
      ['crud', 'crud2'].includes(schema.$$editor?.renderer.name) &&
      renderer.name === 'table2'
    ) {
      return {
        ...({id: schema.$$editor.id} as any),
        name: plugin.name!,
        regions: plugin.regions,
        patchContainers: plugin.patchContainers,
        vRendererConfig: plugin.vRendererConfig,
        wrapperProps: plugin.wrapperProps,
        wrapperResolve: plugin.wrapperResolve,
        filterProps: plugin.filterProps,
        $schema: plugin.$schema,
        renderRenderer: plugin.renderRenderer
      };
    }
    return super.getRendererInfo(context);
  }

  // 自动插入 label
  beforeInsert(event: PluginEvent<InsertEventContext>) {
    const context = event.context;

    if (
      (context.info.plugin === this ||
        context.node.sameIdChild?.info.plugin === this) &&
      context.region === 'columns'
    ) {
      context.data = {
        ...context.data,
        title: context.data.label ?? context.subRenderer?.name ?? '列名称'
      };
    }
  }
}

registerEditorPlugin(Table2Plugin);
