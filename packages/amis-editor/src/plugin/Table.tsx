import {resolveVariable} from 'amis';
import {RendererPluginAction, RendererPluginEvent} from 'amis-editor-core';
import {setVariable} from 'amis-core';

import {registerEditorPlugin, repeatArray} from 'amis-editor-core';
import {
  BasePlugin,
  BaseEventContext,
  PluginEvent,
  RegionConfig,
  RendererInfoResolveEventContext,
  BasicRendererInfo,
  PluginInterface,
  InsertEventContext,
  ScaffoldForm
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {mockValue} from 'amis-editor-core';
import {EditorNodeType} from 'amis-editor-core';
import {SchemaObject} from 'amis/lib/Schema';
import {
  getArgsWrapper,
  getEventControlConfig
} from '../renderer/event-control/helper';

export class TablePlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'table';
  $schema = '/schemas/TableSchema.json';

  // 组件名称
  name = '表格';
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
      innerArgs: ['selected'],
      schema: getArgsWrapper([
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
    },
    {
      actionType: 'initDrag',
      actionLabel: '开启排序',
      description: '开启表格拖拽排序功能'
    }
  ];

  panelBodyCreator = (context: BaseEventContext) => {
    const isCRUDBody = context.schema.type === 'crud';

    return getSchemaTpl('tabs', [
      {
        title: '常规',
        body: [
          {
            name: 'title',
            type: 'input-text',
            label: '标题'
          },

          isCRUDBody
            ? null
            : {
                name: 'source',
                type: 'input-text',
                label: '数据源',
                pipeIn: defaultValue('${items}'),
                description: '绑定当前环境变量'
              },

          {
            name: 'combineNum',
            label: '自动合并单元格',
            type: 'input-number',
            placeholder: '设置列数',
            description:
              '设置从左到右多少列内启用自动合并单元格，根据字段值是否相同来决定是否合并。'
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
      {
        title: '外观',
        body: [
          {
            name: 'columnsTogglable',
            label: '展示列显示开关',
            type: 'button-group-select',
            pipeIn: defaultValue('auto'),
            mode: 'inline',
            className: 'w-full',
            size: 'xs',
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
            ],
            description: '自动即列数量大于5个时自动开启'
          },

          getSchemaTpl('switch', {
            name: 'affixHeader',
            label: '是否固顶表头',
            pipeIn: defaultValue(true)
          }),

          getSchemaTpl('switch', {
            name: 'showHeader',
            label: '是否显示头部',
            pipeIn: defaultValue(true)
          }),

          getSchemaTpl('switch', {
            name: 'showFooter',
            label: '是否显示底部',
            pipeIn: defaultValue(true)
          }),

          getSchemaTpl('switch', {
            name: 'footable',
            label: '是否开启单条底部展示',
            description:
              '如果列太多显示会很臃肿，可以考虑把部分列放在当前行的底部展示',
            pipeIn: (value: any) => !!value
          }),

          {
            name: 'footable.expand',
            type: 'button-group-select',
            size: 'xs',
            visibleOn: 'data.footable',
            label: '底部默认展开',
            pipeIn: defaultValue('none'),
            mode: 'inline',
            className: 'w-full',
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

          {
            name: 'placeholder',
            pipeIn: defaultValue('暂无数据'),
            type: 'input-text',
            label: '无数据提示'
          },
          {
            name: 'rowClassNameExpr',
            type: 'input-text',
            label: '行高亮规则',
            placeholder: `支持模板语法，如 <%= data.id % 2 ? 'bg-success' : '' %>`
          },
          getSchemaTpl('className', {
            label: '外层 CSS 类名'
          }),

          getSchemaTpl('className', {
            name: 'tableClassName',
            label: '表格 CSS 类名'
          }),

          getSchemaTpl('className', {
            name: 'headerClassName',
            label: '顶部外层 CSS 类名'
          }),

          getSchemaTpl('className', {
            name: 'footerClassName',
            label: '底部外层 CSS 类名'
          }),

          getSchemaTpl('className', {
            name: 'toolbarClassName',
            label: '工具栏 CSS 类名'
          })
        ]
      },
      {
        title: '显隐',
        body: [getSchemaTpl('ref'), getSchemaTpl('visible')]
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

      props.value = repeatArray(mockedData, 1).map((item, index) => ({
        ...item,
        id: index + 1
      }));
    } else {
      // 只取10条预览，否则太多卡顿
      props.value = arr.slice(0, 10);
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

  async buildDataSchemas(node: EditorNodeType, region?: EditorNodeType) {
    const itemsSchema: any = {
      $id: 'tableRow',
      type: 'object',
      properties: {}
    };
    const columns: EditorNodeType = node.children.find(
      item => item.isRegion && item.region === 'columns'
    );

    for (let current of columns.children) {
      const schema = current.schema;
      if (schema.name) {
        itemsSchema.properties[schema.name] = current.info?.plugin
          ?.buildDataSchemas
          ? await current.info.plugin.buildDataSchemas(current, region)
          : {
              type: 'string',
              title: schema.label || schema.name,
              description: schema.description
            };
      }
    }

    if (region?.region === 'columns') {
      return itemsSchema;
    }

    return {
      $id: 'table',
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: itemsSchema
        }
      }
    };
  }
}

registerEditorPlugin(TablePlugin);
