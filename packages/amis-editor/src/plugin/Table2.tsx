import React from 'react';
import {Icon, Button} from 'amis';
import {setVariable, someTree, isObject} from 'amis-core';
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
  RendererPluginEvent,
  BuildPanelEventContext
} from 'amis-editor-core';
import {DSBuilderManager} from '../builder/DSBuilderManager';
import {
  getEventControlConfig,
  getArgsWrapper
} from '../renderer/event-control/helper';
import {resolveArrayDatasource} from '../util';

import type {SchemaObject} from 'amis';
import type {IFormItemStore, IFormStore} from 'amis-core';
import type {EditorManager} from 'amis-editor-core';

export const Table2RenderereEvent: RendererPluginEvent[] = [
  {
    eventName: 'selectedChange',
    eventLabel: '选择表格项',
    description: '手动选择表格项事件',
    dataSchema: [
      {
        type: 'object',
        properties: {
          data: {
            type: 'object',
            title: '数据',
            properties: {
              selectedItems: {
                type: 'array',
                title: '已选行记录'
              },
              unSelectedItems: {
                type: 'array',
                title: '未选行记录'
              }
            }
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
          data: {
            type: 'object',
            title: '数据',
            properties: {
              orderBy: {
                type: 'string',
                title: '列名'
              },
              orderDir: {
                type: 'string',
                title: '排序值'
              }
            }
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
          data: {
            type: 'object',
            title: '数据',
            properties: {
              filterName: {
                type: 'string',
                title: '列名'
              },
              filterValue: {
                type: 'string',
                title: '筛选值'
              }
            }
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
          data: {
            type: 'object',
            title: '数据',
            properties: {
              searchName: {
                type: 'string',
                title: '列名'
              },
              searchValue: {
                type: 'object',
                title: '搜索值'
              }
            }
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
          data: {
            type: 'object',
            title: '数据',
            properties: {
              movedItems: {
                type: 'array',
                title: '已排序记录'
              }
            }
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
          data: {
            type: 'object',
            title: '数据',
            properties: {
              columns: {
                type: 'array',
                title: '当前显示的列配置'
              }
            }
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
          data: {
            type: 'object',
            title: '数据',
            properties: {
              item: {
                type: 'object',
                title: '当前行记录'
              },
              index: {
                type: 'number',
                title: '当前行索引'
              }
            }
          }
        }
      }
    ]
  },
  {
    eventName: 'rowMouseEnter',
    eventLabel: '鼠标移入行事件',
    description: '移入整行时触发',
    dataSchema: [
      {
        type: 'object',
        properties: {
          data: {
            type: 'object',
            title: '数据',
            properties: {
              item: {
                type: 'object',
                title: '当前行记录'
              },
              index: {
                type: 'number',
                title: '当前行索引'
              }
            }
          }
        }
      }
    ]
  },
  {
    eventName: 'rowMouseLeave',
    eventLabel: '鼠标移出行事件',
    description: '移出整行时触发',
    dataSchema: [
      {
        type: 'object',
        properties: {
          data: {
            type: 'object',
            title: '数据',
            properties: {
              item: {
                type: 'object',
                title: '当前行记录'
              },
              index: {
                type: 'number',
                title: '当前行索引'
              }
            }
          }
        }
      }
    ]
  }
];

export const Table2RendererAction: RendererPluginAction[] = [
  {
    actionType: 'select',
    actionLabel: '设置选中项',
    description: '设置表格的选中项',
    schema: getArgsWrapper([
      getSchemaTpl('formulaControl', {
        name: 'selected',
        label: '选中项',
        variables: '${variables}',
        size: 'lg',
        mode: 'horizontal'
      })
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

export type Table2DynamicControls = Partial<
  Record<
    | 'primaryField'
    | 'rowSelectionKeyField'
    | 'expandableKeyField'
    | 'quickSaveApi'
    | 'quickSaveItemApi'
    | 'draggable'
    | 'itemDraggableOn'
    | 'saveOrderApi'
    | 'columnTogglable',
    (context: BaseEventContext) => any
  >
>;

export class Table2Plugin extends BasePlugin {
  static id = 'Table2Plugin';

  disabledRendererPlugin = true;

  name = '表格';

  panelTitle = '表格';

  icon = 'fa fa-table';

  panelIcon = 'fa fa-table';

  pluginIcon = 'table-plugin';

  rendererName = 'table2';

  isBaseComponent = true;

  panelJustify = true;

  $schema = '/schemas/TableSchema2.json';

  description =
    '用来展示表格数据，可以配置列信息，然后关联数据便能完成展示。支持嵌套、超级表头、列固定、表头固顶、合并单元格等等。当前组件需要配置数据源，不自带数据拉取，请优先使用 「CRUD」 组件。';

  docLink = '/amis/zh-CN/components/table2';

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
    canRebuild: true,
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
    ]
  };

  events: RendererPluginEvent[] = Table2RenderereEvent;

  actions: RendererPluginAction[] = Table2RendererAction;

  dsManager: DSBuilderManager;

  constructor(manager: EditorManager) {
    super(manager);
    this.dsManager = new DSBuilderManager(manager);
  }

  // 为了能够自动注入数据。
  getRendererInfo(
    context: RendererInfoResolveEventContext
  ): BasicRendererInfo | void {
    const plugin: PluginInterface = this;
    const {schema, renderer} = context;
    const isCRUD = ['crud', 'crud2'].includes(
      context?.schema?.name ?? context?.schema?.$$editor?.renderer?.name
    );

    if (!schema.$$id && isCRUD && renderer.name === 'table2') {
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

  filterProps(props: any) {
    const arr = resolveArrayDatasource(props);

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
            wrapperComponent: '',
            inline: false
          }
        ];
      }

      props.expandable.keyField = 'id';
      props.expandable.expandedRowKeys = [1];
    }

    return props;
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

  async buildDataSchemas(
    node: EditorNodeType,
    region?: EditorNodeType,
    trigger?: EditorNodeType
  ) {
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
        if (schema?.name) {
          itemsSchema.properties[schema.name] = current.info?.plugin
            ?.buildDataSchemas
            ? await current.info.plugin.buildDataSchemas(current, region)
            : {
                type: 'string',
                title: schema.label || schema.title
              };
        }
      }
    }

    let cellProperties = {};
    if (trigger) {
      const isColumnChild = someTree(
        columns?.children,
        item => item.id === trigger.id
      );

      isColumnChild && (cellProperties = itemsSchema.properties);
    }

    const result: any = {
      $id: 'table2',
      type: 'object',
      properties: {
        ...cellProperties,
        rows: {
          type: 'array',
          title: '数据列表',
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
    if (
      node?.info?.renderer?.name &&
      ['table-cell', 'cell-field'].includes(node.info.renderer.name)
    ) {
      if (
        scopeNode.parent?.type === 'crud2' &&
        scopeNode.parent?.path?.endsWith('crud2')
      ) {
        return scopeNode.parent.info.plugin.getAvailableContextFields?.(
          scopeNode.parent,
          node,
          region
        );
      }

      if (
        scopeNode.parent?.type === 'service' &&
        scopeNode.parent?.parent?.path?.endsWith('service')
      ) {
        return scopeNode.parent.parent.info.plugin.getAvailableContextFields?.(
          scopeNode.parent.parent,
          node,
          region
        );
      }
    }

    const builder = this.dsManager.getBuilderBySchema(scopeNode.schema);

    if (builder && scopeNode.schema.api) {
      return builder.getAvailableContextFields(
        {
          schema: scopeNode.schema,
          sourceKey: 'api',
          feat: 'List'
        },
        node
      );
    }
  }

  protected _dynamicControls: Table2DynamicControls = {
    primaryField: context => {
      return getSchemaTpl('primaryField', {
        /** CRUD下，该项配置提升到CRUD中 */
        hiddenOn: `data.type && (data.type === "crud" || data.type === "crud2")`
      });
    },
    quickSaveApi: context => {
      return getSchemaTpl('apiControl', {
        name: 'quickSaveApi',
        renderLabel: false,
        label: {
          type: 'tpl',
          tpl: '快速保存',
          className: 'flex items-end'
        }
      });
    },
    quickSaveItemApi: context => {
      return getSchemaTpl('apiControl', {
        name: 'quickSaveItemApi',
        renderLabel: false,
        label: {
          type: 'tpl',
          tpl: '快速保存单条',
          className: 'flex items-end'
        }
      });
    },
    rowSelectionKeyField: context => {
      return {
        type: 'input-text',
        name: 'rowSelection.keyField',
        label: '数据源key'
      };
    },
    expandableKeyField: context => {
      return {
        type: 'input-text',
        name: 'rowSelection.keyField',
        label: '数据源key'
      };
    },
    draggable: context =>
      getSchemaTpl('switch', {
        name: 'draggable',
        label: '可拖拽'
      }),
    itemDraggableOn: context =>
      getSchemaTpl('formulaControl', {
        label: '可拖拽条件',
        name: 'itemDraggableOn'
      }),
    saveOrderApi: context => {
      return getSchemaTpl('apiControl', {
        name: 'saveOrderApi',
        renderLabel: false,
        label: {
          type: 'tpl',
          tpl: '保存排序',
          className: 'flex items-end'
        }
      });
    },
    columnTogglable: context => false
  };

  /** 需要动态控制的控件 */
  get dynamicControls() {
    return this._dynamicControls;
  }

  set dynamicControls(controls: Table2DynamicControls) {
    if (!controls || !isObject(controls)) {
      throw new Error(
        '[amis-editor][Table2Plugin] dynamicControls的值必须是一个对象'
      );
    }

    this._dynamicControls = {...this._dynamicControls, ...controls};
  }

  isCRUDContext(context: BaseEventContext) {
    return context.schema.type === 'crud2' || context.schema.type === 'crud';
  }

  panelBodyCreator = (context: BaseEventContext) => {
    const isCRUDContext = this.isCRUDContext(context);
    const dc = this.dynamicControls;

    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: [
          getSchemaTpl('collapseGroup', [
            {
              title: '基本',
              body: [
                getSchemaTpl('layout:originPosition', {value: 'left-top'}),
                getSchemaTpl('formulaControl', {
                  label: tipedLabel('数据源', '绑定当前上下文变量'),
                  hidden: isCRUDContext,
                  name: 'source',
                  pipeIn: defaultValue('${items}')
                }),
                isCRUDContext ? null : dc?.primaryField?.(context),
                isCRUDContext ? null : dc?.quickSaveApi?.(context),
                isCRUDContext ? null : dc?.quickSaveItemApi?.(context),
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
                            wrapperComponent: '',
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
                            wrapperComponent: '',
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
                getSchemaTpl('tablePlaceholder', {
                  hidden: isCRUDContext
                })
                // TODD: 组件功能没有支持，暂时隐藏
                // {
                //   type: 'input-number',
                //   name: 'combineNum',
                //   label: '合并单元格'
                // }
              ].filter(Boolean)
            },
            {
              title: '列设置',
              body: [
                dc?.columnTogglable?.(context),
                getSchemaTpl('switch', {
                  name: 'resizable',
                  label: tipedLabel('可调整列宽', '用户可通过拖拽调整列宽度'),
                  pipeIn: (value: any) => !!value,
                  pipeOut: (value: any) => value
                }),
                isCRUDContext
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
              ].filter(Boolean)
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
                {
                  type: 'ae-Switch-More',
                  mode: 'normal',
                  name: 'rowSelection',
                  label: '可选择',
                  hiddenOnDefault: true,
                  formType: 'extend',
                  form: {
                    body: [
                      /** 如果为 CRUD 背景下，主键配置、选择类型在 CRUD 面板中，此处应该隐藏 */
                      isCRUDContext
                        ? null
                        : dc?.rowSelectionKeyField?.(context),
                      isCRUDContext
                        ? null
                        : {
                            name: 'rowSelection.type',
                            label: '选择类型',
                            type: 'button-group-select',
                            options: [
                              {
                                label: '多选',
                                value: 'checkbox'
                              },
                              {
                                label: '单选',
                                value: 'radio'
                              }
                            ],
                            pipeIn: (value: any, formStore: IFormStore) => {
                              if (value != null && typeof value === 'string') {
                                return value;
                              }

                              const schema = formStore?.data;

                              return schema?.selectable === true
                                ? schema.multiple
                                  ? 'checkbox'
                                  : 'radio'
                                : 'checkbox';
                            }
                          },
                      getSchemaTpl('switch', {
                        name: 'rowSelection.fixed',
                        label: '固定选择列'
                      }),
                      {
                        type: 'input-number',
                        name: 'rowSelection.columnWidth',
                        label: '选择列列宽',
                        min: 0,
                        pipeOut: (data: number) => data || undefined
                      },
                      {
                        label: '可选区域',
                        name: 'rowSelection.rowClick',
                        type: 'button-group-select',
                        value: false,
                        options: [
                          {
                            label: '整行',
                            value: true
                          },
                          {
                            label: '勾选框',
                            value: false
                          }
                        ]
                      },
                      getSchemaTpl('formulaControl', {
                        name: 'rowSelection.disableOn',
                        label: '行禁用条件'
                      }),
                      {
                        name: 'rowSelection.selections',
                        label: '选择菜单项',
                        type: 'checkboxes',
                        joinValues: false,
                        inline: false,
                        itemClassName: 'text-sm',
                        options: [
                          {label: '全选所有', value: 'all'},
                          {label: '反选当页', value: 'invert'},
                          {label: '清空所有', value: 'none'},
                          {label: '选择奇数行', value: 'odd'},
                          {label: '选择偶数行', value: 'even'}
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
                    ].filter(Boolean)
                  }
                },
                getSchemaTpl('formulaControl', {
                  label: '行可勾选条件',
                  name: 'itemCheckableOn'
                }),
                {
                  type: 'input-number',
                  name: 'maxKeepItemSelectionLength',
                  label: '最大选择条数'
                },
                {
                  type: 'ae-Switch-More',
                  mode: 'normal',
                  name: 'expandable',
                  label: '可展开',
                  hiddenOnDefault: true,
                  formType: 'extend',
                  form: {
                    body: [
                      dc?.expandableKeyField?.(context),
                      {
                        type: 'select',
                        label: '展开按钮位置',
                        name: 'expandable.position',
                        options: [
                          {
                            label: '默认',
                            value: ''
                          },
                          {
                            label: '左侧',
                            value: 'left'
                          },
                          {
                            label: '右侧',
                            value: 'right'
                          },
                          {
                            label: '隐藏',
                            value: 'none'
                          }
                        ]
                      },
                      getSchemaTpl('formulaControl', {
                        name: 'expandable.expandableOn',
                        visibleOn: 'data.expandable',
                        label: '可展开条件'
                      }),
                      {
                        name: 'expandable',
                        asFormItem: true,
                        label: false,
                        children: ({
                          value,
                          onBulkChange,
                          onChange,
                          name,
                          data,
                          form
                        }: any) => {
                          const newValue = {
                            ...value,
                            ...(value && value.type
                              ? {}
                              : {
                                  type: 'container',
                                  body: [
                                    {
                                      type: 'tpl',
                                      tpl: '展开行内容',
                                      inline: false
                                    }
                                  ]
                                })
                          };
                          return (
                            <Button
                              className="w-full flex flex-col items-center"
                              onClick={() => {
                                this.manager.openSubEditor({
                                  title: '配置展开区域',
                                  value: newValue,
                                  onChange: value => {
                                    onBulkChange({
                                      [name]: value
                                    });
                                  },
                                  data: {
                                    ...this.manager.store.ctx
                                  } //默认数据
                                });
                              }}
                            >
                              <span className="inline-flex items-center">
                                <Icon icon="edit" className="mr-1 w-3" />
                                配置展开区域
                              </span>
                            </Button>
                          );
                        }
                      }
                    ]
                  }
                },
                {
                  type: 'input-text',
                  label: tipedLabel(
                    '嵌套字段',
                    '声明数据结构中作为子节点的字段名称，默认是<code>children</code>'
                  ),
                  name: 'childrenColumnName',
                  pipeIn: defaultValue('children')
                },
                dc?.draggable?.(context),
                dc?.itemDraggableOn?.(context),
                dc?.saveOrderApi?.(context),
                {
                  name: 'showBadge',
                  label: '行角标',
                  type: 'ae-switch-more',
                  mode: 'normal',
                  formType: 'extend',
                  bulk: true,
                  defaultData: {
                    itemBadge: {
                      mode: 'dot'
                    }
                  },
                  isChecked: (e: any) => {
                    const {data, name} = e;
                    return data[name];
                  },
                  form: {
                    body: [
                      {
                        type: 'ae-badge',
                        label: false,
                        name: 'itemBadge',
                        contentsOnly: true
                      }
                    ]
                  }
                }
              ]
            },
            {
              title: '分页设置',
              body: [
                getSchemaTpl('switch', {
                  name: 'keepItemSelectionOnPageChange',
                  label: tipedLabel(
                    '保留选择项',
                    '默认切换页面、搜索后，用户选择项会被清空，开启此功能后会保留用户选择，可以实现跨页面批量操作。'
                  ),
                  /** 目前仅支持2种类型，默认是 pagination */
                  visibleOn: '!data.loadType || data.loadType !== "more"'
                }),
                {
                  name: 'maxKeepItemSelectionLength',
                  type: 'input-number',
                  label: '最大选择条数',
                  visibleOn: 'data.keepItemSelectionOnPageChange'
                }
              ]
            },
            {
              title: '状态',
              body: [
                getSchemaTpl('hidden', {
                  label: '隐藏'
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
                  name: 'size',
                  label: '控件尺寸',
                  type: 'select',
                  pipeIn: defaultValue('default'),
                  options: [
                    {
                      label: '小',
                      value: 'small'
                    },
                    {
                      label: '默认',
                      value: 'default'
                    },
                    {
                      label: '大',
                      value: 'large'
                    }
                  ]
                },
                getSchemaTpl('switch', {
                  name: 'autoFillHeight',
                  label: '高度自适应'
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
                  name: 'indentSize',
                  visibleOn: 'data.childrenColumnName',
                  type: 'input-number',
                  unitOptions: [{label: 'px', value: 'px'}],
                  label: tipedLabel(
                    '缩进尺寸',
                    '嵌套结构展示时，设置子节点的缩进值，单位为px'
                  )
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
              isFormItem: false,
              schema: [
                getSchemaTpl('className', {
                  label: '行类名',
                  name: 'rowClassName'
                }),
                getSchemaTpl('formulaControl', {
                  name: 'rowClassNameExpr',
                  label: '自定义行样式'
                }),
                getSchemaTpl('formulaControl', {
                  name: 'expandable.expandedRowClassNameExpr',
                  visibleOn: 'data.expandable',
                  label: '展开行样式'
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
}

registerEditorPlugin(Table2Plugin);
