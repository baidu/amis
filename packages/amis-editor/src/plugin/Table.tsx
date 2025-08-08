import React from 'react';
import {Button, resolveVariable} from 'amis';
import type {DataScope, SchemaObject} from 'amis';
import {
  getI18nEnabled,
  RendererPluginAction,
  RendererPluginEvent,
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
  repeatArray,
  diff,
  mockValue,
  EditorNodeType,
  defaultValue,
  getSchemaTpl,
  tipedLabel
} from 'amis-editor-core';
import type {EditorManager} from 'amis-editor-core';
import {setVariable, someTree} from 'amis-core';
import {reaction} from 'mobx';
import {DSBuilderManager} from '../builder/DSBuilderManager';
import {
  getEventControlConfig,
  getArgsWrapper,
  buildLinkActionDesc
} from '../renderer/event-control/helper';
import {
  schemaArrayFormat,
  schemaToArray,
  resolveArrayDatasource
} from '../util';
import {getActionCommonProps} from '../renderer/event-control/helper';

export class TablePlugin extends BasePlugin {
  static id = 'TablePlugin';
  // 关联渲染器名字
  rendererName = 'table';
  useLazyRender = true; // 使用懒渲染
  $schema = '/schemas/TableSchema.json';

  // 组件名称
  name = '原子表格';
  tags = ['展示'];
  isBaseComponent = true;
  description =
    '用来展示表格数据，可以配置列信息，然后关联数据便能完成展示。支持嵌套、超级表头、列固定、表头固顶、合并单元格等等。当前组件需要配置数据源，不自带数据拉取，请优先使用 「CRUD」 组件。';
  docLink = '/amis/zh-CN/components/table';
  icon = 'fa fa-table';
  pluginIcon = 'table-plugin';
  scaffold: SchemaObject = {
    type: 'table',
    columns: [
      {
        label: '列信息',
        name: 'a'
      }
    ]
  };

  regions: Array<RegionConfig> = [
    {
      key: 'columns',
      label: '列集合',
      renderMethod: 'renderTableContent',
      preferTag: '展示',
      dndMode: 'position-h'
    }
  ];

  //renderTableContent

  previewSchema: any = {
    type: 'table',
    className: 'text-left m-b-none',
    affixHeader: false,
    items: [
      {a: 1, b: 2},
      {a: 3, b: 4},
      {a: 5, b: 6}
    ],
    columns: [
      {
        label: 'A',
        name: 'a'
      },
      {
        label: 'B',
        name: 'b'
      }
    ]
  };

  get scaffoldForm(): ScaffoldForm {
    const i18nEnabled = getI18nEnabled();
    return {
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
              type: i18nEnabled ? 'input-text-i18n' : 'input-text',
              name: 'label',
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
                // {
                //     value: 'datetime',
                //     label: '日期时间'
                // },
                // {
                //     value: 'time',
                //     label: '时间'
                // },
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
  }

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
                },
                indexPath: {
                  type: 'number',
                  title: '行索引路劲'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'rowDbClick',
      eventLabel: '行双击',
      description: '双击整行事件',
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
                },
                indexPath: {
                  type: 'number',
                  title: '行索引路劲'
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
                },
                indexPath: {
                  type: 'number',
                  title: '行索引路劲'
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
                },
                indexPath: {
                  type: 'number',
                  title: '行索引路劲'
                }
              }
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
      innerArgs: ['selected'],
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            设置
            {buildLinkActionDesc(props.manager, info)}
            选中项
          </div>
        );
      },
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
      description: '设置表格全部项选中',
      ...getActionCommonProps('selectAll')
    },
    {
      actionType: 'clearAll',
      actionLabel: '清空选中项',
      description: '清空表格所有选中项',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            清空
            {buildLinkActionDesc(props.manager, info)}
            选中项
          </div>
        );
      }
    },
    {
      actionType: 'initDrag',
      actionLabel: '开启排序',
      description: '开启表格拖拽排序功能',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            开启
            {buildLinkActionDesc(props.manager, info)}
            排序
          </div>
        );
      }
    },
    {
      actionType: 'cancelDrag',
      actionLabel: '取消排序',
      description: '取消表格拖拽排序功能',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            取消
            {buildLinkActionDesc(props.manager, info)}
            排序
          </div>
        );
      }
    }
  ];

  panelJustify = true;

  dsManager: DSBuilderManager;

  constructor(manager: EditorManager) {
    super(manager);
    this.dsManager = new DSBuilderManager(manager);
  }

  panelBodyCreator = (context: BaseEventContext) => {
    const isCRUDBody = context.schema.type === 'crud';
    const i18nEnabled = getI18nEnabled();
    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              {
                name: 'title',
                type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                label: '标题'
              },

              isCRUDBody
                ? null
                : getSchemaTpl('sourceBindControl', {
                    label: '数据源'
                  }),

              {
                name: 'combineNum',
                label: tipedLabel(
                  '自动合并单元格',
                  '设置从左到右多少列内启用自动合并单元格，根据字段值是否相同来决定是否合并。'
                ),
                type: 'input-number',
                labelAlign: 'left',
                horizontal: {
                  left: 5,
                  right: 7
                },
                placeholder: '设置列数'
              },
              {
                type: 'ae-switch-more',
                mode: 'normal',
                formType: 'extend',
                label: '头部',
                name: 'showHeader',
                pipeIn: (value: any) => value ?? true,
                falseValue: false, // 这个属性模式按true处理，关闭不能删除，除非去掉配置的header
                form: {
                  body: [
                    {
                      children: (
                        <Button
                          level="primary"
                          size="sm"
                          block
                          onClick={this.editHeaderDetail.bind(this, context.id)}
                        >
                          配置头部
                        </Button>
                      )
                    }
                  ]
                }
              },
              {
                type: 'ae-switch-more',
                mode: 'normal',
                formType: 'extend',
                label: '底部',
                name: 'showFooter',
                pipeIn: (value: any) => value ?? true,
                falseValue: false, // 这个属性模式按true处理，关闭不能删除，除非去掉配置的footer
                form: {
                  body: [
                    {
                      children: (
                        <Button
                          level="primary"
                          size="sm"
                          block
                          onClick={this.editFooterDetail.bind(this, context.id)}
                        >
                          配置底部
                        </Button>
                      )
                    }
                  ]
                }
              },

              {
                type: 'input-number',
                name: 'lazyRenderAfter',
                label: '懒渲染行数',
                description:
                  '表格渲染时，超过多少行后才开始懒渲染，默认 100 行。可以提升渲染性能。',
                pipeIn: defaultValue(100)
              }

              // {
              //   children: (
              //     <div>
              //       <Button
              //         level="info"
              //         size="sm"
              //         className="m-b-sm"
              //         block
              //         onClick={this.handleAdd}
              //       >
              //         新增一列
              //       </Button>
              //     </div>
              //   )
              // },

              // {
              //   children: (
              //     <div>
              //       <Button
              //         level="success"
              //         size="sm"
              //         block
              //         onClick={this.handleColumnsQuickEdit.bind(this)}
              //       >
              //         快速编辑列信息
              //       </Button>
              //     </div>
              //   )
              // }
            ]
          },
          getSchemaTpl('status')
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              {
                name: 'columnsTogglable',
                label: tipedLabel(
                  '列显示开关',
                  '是否展示表格列的显隐控件，“自动”即列数量大于5时自动开启'
                ),
                type: 'button-group-select',
                pipeIn: defaultValue('auto'),
                size: 'sm',
                labelAlign: 'left',
                options: [
                  {
                    label: '自动',
                    value: 'auto'
                  },

                  {
                    label: '开启',
                    value: true
                  },

                  {
                    label: '关闭',
                    value: false
                  }
                ]
              },

              getSchemaTpl('switch', {
                name: 'showIndex',
                label: '是否显示序号',
                pipeIn: defaultValue(false)
              }),

              getSchemaTpl('switch', {
                name: 'affixHeader',
                label: '是否固定表头',
                pipeIn: defaultValue(true)
              }),

              getSchemaTpl('switch', {
                name: 'footable',
                label: tipedLabel(
                  '是否开启单条底部展示',
                  '如果列太多显示会很臃肿，可以考虑把部分列放在当前行的底部展示'
                ),
                pipeIn: (value: any) => !!value
              }),

              {
                name: 'footable.expand',
                type: 'button-group-select',
                size: 'sm',
                visibleOn: 'this.footable',
                label: '底部默认展开',
                pipeIn: defaultValue('none'),
                options: [
                  {
                    label: '第一条',
                    value: 'first'
                  },

                  {
                    label: '所有',
                    value: 'all'
                  },

                  {
                    label: '不展开',
                    value: 'none'
                  }
                ]
              },

              getSchemaTpl('tablePlaceholder'),
              {
                name: 'rowClassNameExpr',
                type: 'input-text',
                label: '行高亮规则',
                placeholder: `支持模板语法，如 <%= this.id % 2 ? 'bg-success' : '' %>`
              }
            ]
          },
          {
            title: 'CSS类名',
            body: [
              getSchemaTpl('className', {
                label: '外层'
              }),

              getSchemaTpl('className', {
                name: 'tableClassName',
                label: '表格'
              }),

              getSchemaTpl('className', {
                name: 'headerClassName',
                label: '顶部外层'
              }),

              getSchemaTpl('className', {
                name: 'footerClassName',
                label: '底部外层'
              }),

              getSchemaTpl('className', {
                name: 'toolbarClassName',
                label: '工具栏'
              })
            ]
          }
        ])
      },
      isCRUDBody
        ? null
        : {
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

        node.updateState({
          value: repeatArray(mockedData, 1).map((item, index) => ({
            ...item,
            id: index + 1
          }))
        });
      } else {
        // 只取10条预览，否则太多卡顿
        node.updateState({
          value: arr.slice(0, 3)
        });
      }
    }

    // 编辑模式，不允许表格调整宽度
    props.resizable = false;
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
      schema.$$editor?.renderer.name === 'crud' &&
      renderer.name === 'table'
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
        label: context.data.label ?? context.subRenderer?.name ?? '列名称'
      };
    }
  }

  async buildDataSchemas(
    node: EditorNodeType,
    region?: EditorNodeType,
    trigger?: EditorNodeType,
    parent?: EditorNodeType
  ) {
    let itemsSchema: any = {
      $id: `${node.id}-${node.type}-tableRows`,
      type: 'object',
      properties: {}
    };
    const columns: EditorNodeType = node.children.find(
      item => item.isRegion && item.region === 'columns'
    );
    const parentScopeId = `${parent?.id}-${parent?.type}${
      node.parent?.type === 'cell' ? '-currentRow' : ''
    }`;
    let isColumnChild = false;

    // 追加当前行scope
    if (trigger) {
      isColumnChild = someTree(
        columns?.children,
        item => item.id === trigger.id
      );

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

    let index = 0;
    const cells: any = columns.children.concat();
    // 存在预览节点，限制下遍历数
    while (cells.length > 0 && index < node.schema.columns.length) {
      const cell = cells.shift() as EditorNodeType;
      // cell的孩子貌似只会有一个
      const items = cell.children.concat();
      while (items.length) {
        const current = items.shift() as EditorNodeType;
        const schema = current.schema;
        if (schema.name) {
          const tmpSchema = await current.info.plugin.buildDataSchemas?.(
            current,
            region,
            trigger,
            node
          );
          itemsSchema.properties[schema.name] = {
            ...tmpSchema,
            ...(tmpSchema?.$id ? {} : {$id: `${current!.id}-${current!.type}`})
          };
        }
      }
      index++;
    }

    // 收集source绑定的列表成员
    if (node.schema.source) {
      const sourceMatch1 = node.schema.source.match(/\$\{(.*?)\}/);
      const sourceMatch2 = node.schema.source.match(/\$(\w+$)/);
      const source = sourceMatch1
        ? sourceMatch1[1]
        : sourceMatch2
        ? sourceMatch2[1]
        : '';
      let scope: any = this.manager.dataSchema.getScope(
        `${node.info.id}-${node.info.type}`
      );

      while (scope) {
        const rowMembers: any = scope.schemas.find(
          (item: any) => item.properties?.[source]
        );

        if (rowMembers) {
          itemsSchema = {
            ...itemsSchema,
            properties: {
              ...itemsSchema.properties,
              ...(rowMembers.properties?.[source] as any)?.items?.properties
            }
          };
        }
        scope = rowMembers ? undefined : scope.parent;
      }
    }

    if (region?.region === 'columns') {
      return itemsSchema;
    }

    // 追加当前行数据
    if (isColumnChild) {
      const scopeId = `${node.id}-${node.type}-currentRow`;
      const scope = this.manager.dataSchema.getScope(scopeId);
      scope?.addSchema(itemsSchema);
    }

    return {
      $id: `${node.id}-${node.type}`,
      type: 'object',
      properties: {
        rows: {
          type: 'array',
          title: '数据列表',
          items: itemsSchema
        },
        selectedItems: {
          type: 'array',
          title: '已选中行',
          items: itemsSchema
        },
        unSelectedItems: {
          type: 'array',
          title: '未选中行',
          items: itemsSchema
        }
      }
    };
  }

  async getAvailableContextFields(
    scopeNode: EditorNodeType,
    node: EditorNodeType,
    region?: EditorNodeType
  ) {
    if (node?.info?.renderer?.name === 'table-cell') {
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

  editHeaderDetail(id: string) {
    const manager = this.manager;
    const store = manager.store;
    const node = store.getNodeById(id);
    const value = store.getValueOf(id);

    const defaultHeader = {
      type: 'tpl',
      tpl: '头部',
      wrapperComponent: ''
    };

    node &&
      value &&
      this.manager.openSubEditor({
        title: '配置头部',
        value: schemaToArray(value.header ?? defaultHeader),
        slot: {
          type: 'container',
          body: '$$'
        },
        onChange: newValue => {
          newValue = {...value, header: schemaArrayFormat(newValue)};
          manager.panelChangeValue(newValue, diff(value, newValue));
        }
      });
  }

  editFooterDetail(id: string) {
    const manager = this.manager;
    const store = manager.store;
    const node = store.getNodeById(id);
    const value = store.getValueOf(id);

    const defaultFooter = {
      type: 'tpl',
      tpl: '底部',
      wrapperComponent: ''
    };

    node &&
      value &&
      this.manager.openSubEditor({
        title: '配置底部',
        value: schemaToArray(value.footer ?? defaultFooter),
        slot: {
          type: 'container',
          body: '$$'
        },
        onChange: newValue => {
          newValue = {...value, footer: schemaArrayFormat(newValue)};
          manager.panelChangeValue(newValue, diff(value, newValue));
        }
      });
  }

  unWatchWidthChange: {[propName: string]: () => void} = {};
  componentRef(node: EditorNodeType, ref: any) {
    if (ref) {
      const store = ref.props.store;
      this.unWatchWidthChange[node.id] = reaction(
        () =>
          store.columns.map((column: any) => column.pristine.width).join(','),
        () => {
          ref.updateTableInfoLazy(() => {
            this.manager.store.highlightNodes.forEach(node =>
              node.calculateHighlightBox()
            );
          });
        }
      );
    } else {
      this.unWatchWidthChange[node.id]?.();
    }
  }
}

registerEditorPlugin(TablePlugin);
