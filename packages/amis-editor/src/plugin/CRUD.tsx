import {toast, normalizeApiResponseData} from 'amis';
import cloneDeep from 'lodash/cloneDeep';
import React from 'react';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../renderer/event-control/helper';
import {genCodeSchema} from '../renderer/APIAdaptorControl';
import {
  getI18nEnabled,
  jsonToJsonSchema,
  registerEditorPlugin,
  tipedLabel
} from 'amis-editor-core';
import {
  BaseEventContext,
  BasePlugin,
  BasicRendererInfo,
  BasicSubRenderInfo,
  ChangeEventContext,
  PluginEvent,
  PluginInterface,
  RendererEventContext,
  RendererInfoResolveEventContext,
  ScaffoldForm,
  SubRendererInfo,
  defaultValue,
  getSchemaTpl,
  JSONPipeIn
} from 'amis-editor-core';
import {setVariable, someTree, normalizeApi} from 'amis-core';
import type {CRUDCommonSchema} from 'amis';
import {getEnv} from 'mobx-state-tree';
import type {
  EditorNodeType,
  RendererPluginAction,
  RendererPluginEvent
} from 'amis-editor-core';
import isPlainObject from 'lodash/isPlainObject';
import findLastIndex from 'lodash/findLastIndex';

interface ColumnItem {
  label: string;
  type: string;
  name: string;
}

type CRUDModes = CRUDCommonSchema['mode'];

// 将展现控件转成编辑控件
const viewTypeToEditType = (type: string) => {
  return type === 'tpl'
    ? 'input-text'
    : type === 'status' || type === 'mapping'
    ? 'select'
    : `input-${type}`;
};

export class CRUDPlugin extends BasePlugin {
  static id = 'CRUDPlugin';
  // 关联渲染器名字
  rendererName = 'crud';
  useLazyRender = true; // 使用懒渲染
  $schema = '/schemas/CRUDSchema.json';

  order = -800;

  // 组件名称
  name = '增删改查';
  isBaseComponent = true;
  description =
    '用来实现对数据的增删改查，支持三种模式展示：table、cards和list. 负责数据的拉取，分页，单条操作，批量操作，排序，快速编辑等等功能。集成查询条件。';
  docLink = '/amis/zh-CN/components/crud';
  tags = ['数据容器'];
  icon = 'fa fa-table';
  pluginIcon = 'table-plugin';

  scaffold: any = {
    type: 'crud',
    syncLocation: false,
    api: '',
    columns: [
      {
        name: 'id',
        label: 'ID',
        type: 'text'
      },
      {
        name: 'engine',
        label: '渲染引擎',
        type: 'text'
      }
    ],
    bulkActions: [],
    itemActions: []
  };

  events: RendererPluginEvent[] = [
    {
      eventName: 'fetchInited',
      eventLabel: '初始化数据接口请求完成',
      description: '远程初始化数据接口请求完成时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                responseData: {
                  type: 'object',
                  title: '响应数据'
                },
                responseStatus: {
                  type: 'number',
                  title: '响应状态(0表示成功)'
                },
                responseMsg: {
                  type: 'string',
                  title: '响应消息'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'research',
      eventLabel: '重新加载',
      description: '重新加载或查询重置时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                responseData: {
                  type: 'object',
                  title: '响应数据'
                },
                responseStatus: {
                  type: 'number',
                  title: '响应状态(0表示成功)'
                },
                responseMsg: {
                  type: 'string',
                  title: '响应消息'
                }
              }
            }
          }
        }
      ]
    },
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
                  title: '已选择行记录'
                },
                unSelectedItems: {
                  type: 'array',
                  title: '未选择行记录'
                },
                selectedIndexes: {
                  type: 'array',
                  title: '已选择行索引'
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
      actionType: 'reload',
      actionLabel: '重新加载',
      description: '触发组件数据刷新并重新渲染',
      ...getActionCommonProps('reload')
    },
    {
      actionLabel: '变量赋值',
      actionType: 'setValue',
      description: '更新列表记录',
      ...getActionCommonProps('setValue')
    }
  ];

  btnSchemas = {
    create: {
      label: '新增',
      type: 'button',
      actionType: 'dialog',
      level: 'primary',
      editorSetting: {
        behavior: 'create'
      },
      dialog: {
        title: '新增',
        body: {
          type: 'form',
          api: '',
          body: []
        }
      }
    },
    update: {
      label: '编辑',
      type: 'button',
      actionType: 'dialog',
      level: 'link',
      editorSetting: {
        behavior: 'update'
      },
      dialog: {
        title: '编辑',
        body: {
          type: 'form',
          api: '',
          initApi: '',
          body: []
        }
      }
    },
    view: {
      label: '查看',
      type: 'button',
      actionType: 'dialog',
      level: 'link',
      editorSetting: {
        behavior: 'view'
      },
      dialog: {
        title: '查看详情',
        body: {
          type: 'form',
          initApi: '',
          body: []
        }
      }
    },
    delete: {
      type: 'button',
      label: '删除',
      actionType: 'ajax',
      level: 'link',
      className: 'text-danger',
      confirmText: '确定要删除？',
      api: '',
      editorSetting: {
        behavior: 'delete'
      }
    },
    bulkDelete: {
      type: 'button',
      level: 'danger',
      label: '批量删除',
      actionType: 'ajax',
      confirmText: '确定要删除？',
      api: '',
      editorSetting: {
        behavior: 'bulkDelete'
      }
    },
    bulkUpdate: {
      type: 'button',
      label: '批量编辑',
      actionType: 'dialog',
      editorSetting: {
        behavior: 'bulkUpdate'
      },
      dialog: {
        title: '批量编辑',
        size: 'md',
        body: {
          type: 'form',
          api: '',
          body: [
            {
              label: '字段1',
              text: '字段1',
              type: 'input-text'
            }
          ]
        }
      }
    },
    // itemDelete: {
    //   type: 'button',
    //   level: 'danger',
    //   label: '删除',
    //   api: '',
    //   actionType: 'ajax',
    //   confirmText: '确定要删除？'
    // },
    filter: {
      title: '查询条件',
      body: [
        {
          type: 'input-text',
          name: 'keywords',
          label: '关键字'
        }
      ]
    }
  };

  get scaffoldForm(): ScaffoldForm {
    const i18nEnabled = getI18nEnabled();
    return {
      title: '增删改查快速开始-CRUD',
      body: [
        getSchemaTpl('apiControl', {
          label: '接口地址',
          sampleBuilder: (schema: any) =>
            JSON.stringify(
              {
                status: 0,
                msg: '',
                data: {
                  items: [{id: 1, engine: 'Webkit'}],
                  total: 1
                }
              },
              null,
              2
            )
        }),
        {
          type: 'button',
          label: '格式校验并自动生成列配置',
          className: 'm-b-sm',
          visibleOn: '${api.url || api && ISTYPE(api, "string")}',
          onClick: async (e: Event, props: any) => {
            const data = props.data;
            const schemaFilter = getEnv(
              (window as any).editorStore
            ).schemaFilter;
            let api: any = data.api;
            // 主要是给爱速搭中替换 url
            if (schemaFilter) {
              api = schemaFilter({
                api: data.api
              }).api;
            }
            const response = await props.env.fetcher(api, data);
            const result = normalizeApiResponseData(response.data);
            let autoFillKeyValues: Array<any> = [];
            let items = result?.items ?? result?.rows;

            /** 非标返回，取data中的第一个数组作为返回值，和AMIS中处理逻辑同步 */
            if (!Array.isArray(items)) {
              for (const key of Object.keys(result)) {
                if (result.hasOwnProperty(key) && Array.isArray(result[key])) {
                  items = result[key];
                  break;
                }
              }
            }

            if (Array.isArray(items) && items[0]) {
              Object.keys(items[0]).forEach((key: any) => {
                const value = items[0][key];
                autoFillKeyValues.push({
                  label: key,
                  type: 'text',
                  name: key
                });
              });
              props.formStore.setValues({
                columns: autoFillKeyValues
              });
            } else {
              toast.warning(
                'API返回格式不正确，请点击接口地址右侧示例查看CRUD数据接口结构要求'
              );
            }
          }
        },
        {
          name: '__features',
          label: '启用功能',
          type: 'checkboxes',
          joinValues: false,
          extractValue: true,
          itemClassName: 'max-w-lg',
          options: [
            {label: '新增', value: 'create'},
            {label: '查询', value: 'filter'},
            {label: '批量删除', value: 'bulkDelete'},
            {label: '批量修改', value: 'bulkUpdate'},
            {label: '操作栏-编辑', value: 'update'},
            {label: '操作栏-查看详情', value: 'view'},
            {label: '操作栏-删除', value: 'delete'}
          ]
        },
        {
          type: 'group',
          body: [
            {
              columnRatio: 10,
              type: 'checkboxes',
              label: '启用的查询字段',
              name: 'filterEnabledList',
              joinValues: false,
              source:
                '${ARRAYMAP(ARRAYFILTER(columns, item => item.name), item => ({label: item.label || item.name, value: item.name}))}'
            },
            {
              columnRatio: 2,
              type: 'input-number',
              label: '每列显示几个字段',
              value: 3,
              name: '__filterColumnCount'
            }
          ],
          visibleOn: "${__features && CONTAINS(__features, 'filter')}"
        },
        {
          name: 'columns',
          type: 'input-table',
          label: false,
          addable: true,
          removable: true,
          needConfirm: false,
          columns: [
            {
              type: i18nEnabled ? 'input-text-i18n' : 'input-text',
              name: 'label',
              label: '标题'
            },
            {
              type: 'input-text',
              name: 'name',
              label: '绑定字段名'
            },
            {
              type: 'select',
              name: 'type',
              label: '类型',
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
                  value: 'operation',
                  label: '操作栏'
                }
              ]
            }
          ]
        }
      ],
      pipeIn: (value: any) => {
        const __features = [];
        // 收集 filter
        if (value.filter) {
          __features.push('filter');
        }

        let actions = [];
        if (value.mode === 'cards' && Array.isArray(value.card?.body)) {
          actions = Array.isArray(value.card.actions)
            ? value.card.actions.concat()
            : [];
        } else if (
          value.mode === 'list' &&
          Array.isArray(value.listItem?.body)
        ) {
          actions = Array.isArray(value.listItem.actions)
            ? value.listItem.actions.concat()
            : [];
        } else if (Array.isArray(value.columns)) {
          actions =
            value.columns
              .find((value: any) => value?.type === 'operation')
              ?.buttons?.concat() || [];
        }

        // 收集 列操作
        const operBtns: Array<string> = ['update', 'view', 'delete'];
        actions.forEach((btn: any) => {
          if (operBtns.includes(btn.editorSetting?.behavior || '')) {
            __features.push(btn.editorSetting?.behavior);
          }
        });

        // 收集批量操作
        if (Array.isArray(value.bulkActions)) {
          value.bulkActions.forEach((item: any) => {
            if (item.editorSetting?.behavior) {
              __features.push(item.editorSetting?.behavior);
            }
          });
        }
        // 收集新增
        if (
          Array.isArray(value.headerToolbar) &&
          value.headerToolbar.some(
            (item: any) => item.editorSetting?.behavior === 'create'
          )
        ) {
          __features.push('create');
        }
        return {
          ...value,
          ...(value.mode !== 'table'
            ? {
                columns:
                  value.columns ||
                  this.transformByMode({
                    from: value.mode,
                    to: 'table',
                    schema: value
                  })
              }
            : {}),
          __filterColumnCount: value?.filter?.columnCount || 3,
          __features: __features,
          __LastFeatures: [...__features]
        };
      },
      pipeOut: (value: any) => {
        let valueSchema = cloneDeep(value);
        /** 统一api格式 */
        valueSchema.api =
          typeof valueSchema.api === 'string'
            ? normalizeApi(valueSchema.api)
            : valueSchema.api;

        const features: string[] = valueSchema.__features;
        const lastFeatures: string[] = valueSchema.__LastFeatures;
        const willAddedList = features.filter(
          item => !lastFeatures.includes(item)
        );
        const willRemoveList = lastFeatures.filter(
          item => !features.includes(item)
        );

        const operButtons: any[] = [];
        const operBtns: string[] = ['update', 'view', 'delete'];

        if (!valueSchema.bulkActions) {
          valueSchema.bulkActions = [];
        } else {
          // 删除 未勾选的批量操作
          valueSchema.bulkActions = valueSchema.bulkActions.filter(
            (item: any) =>
              !willRemoveList.includes(item.editorSetting?.behavior)
          );
        }

        // 删除 未勾选的 filter
        if (willRemoveList.includes('filter') && valueSchema.filter) {
          delete valueSchema.filter;
        }

        // 删除 未勾选的 新增
        if (
          willRemoveList.includes('create') &&
          Array.isArray(valueSchema.headerToolbar)
        ) {
          valueSchema.headerToolbar = valueSchema.headerToolbar.filter(
            (item: any) => item.editorSetting?.behavior !== 'create'
          );
        }

        willAddedList.length &&
          willAddedList.forEach((item: string) => {
            if (operBtns.includes(item)) {
              // 列操作按钮
              let schema;
              if (item === 'update') {
                schema = cloneDeep(this.btnSchemas.update);
                schema.dialog.body.body = value.columns
                  .filter(
                    ({type}: any) => type !== 'progress' && type !== 'operation'
                  )
                  .map(({type, ...rest}: any) => ({
                    ...rest,
                    type: viewTypeToEditType(type)
                  }));
              } else if (item === 'view') {
                schema = cloneDeep(this.btnSchemas.view);
                schema.dialog.body.body = value.columns.map(
                  ({type, ...rest}: any) => ({
                    ...rest,
                    type: 'static'
                  })
                );
              } else if (item === 'delete') {
                schema = cloneDeep(this.btnSchemas.delete);
                schema.api = valueSchema.api?.method?.match(/^(post|delete)$/i)
                  ? valueSchema.api
                  : {...valueSchema.api, method: 'post'};
              }
              schema && operButtons.push(schema);
            } else {
              // 批量操作
              if (item === 'bulkUpdate') {
                this.addItem(
                  valueSchema.bulkActions,
                  cloneDeep(this.btnSchemas.bulkUpdate)
                );
              }

              if (item === 'bulkDelete') {
                this.addItem(
                  valueSchema.bulkActions,
                  cloneDeep(this.btnSchemas.bulkDelete)
                );
              }

              // 创建
              if (item === 'create') {
                const createSchemaBase = this.btnSchemas.create;
                createSchemaBase.dialog.body = {
                  type: 'form',
                  api: valueSchema.api?.method?.match(/^(post|put)$/i)
                    ? valueSchema.api
                    : {...valueSchema.api, method: 'post'},
                  body: valueSchema.columns
                    .filter(
                      ({type}: any) =>
                        type !== 'progress' && type !== 'operation'
                    )
                    .map((column: ColumnItem) => {
                      const type = column.type;
                      return {
                        type: viewTypeToEditType(type),
                        name: column.name,
                        label: column.label
                      };
                    })
                };
                valueSchema.headerToolbar = [createSchemaBase, 'bulkActions'];
              }
              // 查询
              let keysFilter = Object.keys(valueSchema.filter || {});
              if (item === 'filter' && !keysFilter.length) {
                if (valueSchema.filterEnabledList) {
                  valueSchema.filter = {
                    title: '查询条件'
                  };
                  valueSchema.filter.columnCount = value.__filterColumnCount;
                  valueSchema.filter.mode = 'horizontal';
                  valueSchema.filter.body = valueSchema.filterEnabledList.map(
                    (item: any) => {
                      return {
                        type: 'input-text',
                        label: item.label,
                        name: item.value
                      };
                    }
                  );
                }
              }
            }
          });

        // 处理列操作按钮
        const lastIndex = findLastIndex(
          value.columns || [],
          (item: any) => item.type === 'operation'
        );
        if (lastIndex === -1) {
          if (operButtons.length) {
            valueSchema.columns.push({
              type: 'operation',
              label: '操作',
              buttons: operButtons
            });
          }
        } else {
          const operColumn = valueSchema.columns[lastIndex];
          operColumn.buttons = (operColumn.buttons || [])
            .filter(
              (btn: any) =>
                !willRemoveList.includes(btn.editorSetting?.behavior)
            )
            .concat(operButtons);
        }

        const {card, columns, listItem, ...rest} = valueSchema;

        return {
          ...rest,
          ...(valueSchema.mode === 'cards'
            ? {
                card: this.transformByMode({
                  from: 'table',
                  to: 'cards',
                  schema: valueSchema
                })
              }
            : valueSchema.mode === 'list'
            ? {
                listItem: this.transformByMode({
                  from: 'table',
                  to: 'list',
                  schema: valueSchema
                })
              }
            : columns
            ? {columns}
            : {})
        };
      },
      canRebuild: true
    };
  }

  addItem(source: any, target: any) {
    const canAdd = source.find((item: any) => item.label === target.label);
    if (!canAdd) {
      source.push(target);
    }
  }

  multifactor = true;
  previewSchema: any = {
    syncLocation: false,
    type: 'crud',
    className: 'text-left',
    bodyClassName: 'm-b-none',
    affixHeader: false,
    data: {
      items: [
        {a: 1, b: 2},
        {a: 3, b: 4},
        {a: 5, b: 6}
      ]
    },
    source: '${items}',
    columns: [
      {
        label: 'A',
        name: 'a'
      },
      {
        label: 'B',
        name: 'b'
      },
      {
        type: 'operation',
        label: '操作',
        buttons: [
          {
            icon: 'fa fa-eye',
            type: 'button'
          },

          {
            icon: 'fa fa-edit',
            type: 'button'
          }
        ]
      }
    ]
  };

  oldFilter?: any;
  panelTitle = '增删改查';
  panelBodyCreator = (context: BaseEventContext) => {
    const store = this.manager.store;
    const id = context.id;

    return getSchemaTpl('tabs', [
      {
        title: '常规',
        body: [
          getSchemaTpl('layout:originPosition', {value: 'left-top'}),
          getSchemaTpl('switch', {
            name: 'filter',
            label: '启用查询条件',
            visibleOn:
              'this.api && this.api.url || typeof this.api === "string" && this.api',
            pipeIn: (value: any) => !!value,
            pipeOut: (value: any, originValue: any) => {
              if (value) {
                return (
                  this.oldFilter ||
                  JSONPipeIn({
                    title: '查询条件',
                    body: [
                      {
                        type: 'input-text',
                        name: 'keywords',
                        label: '关键字'
                      }
                    ]
                  })
                );
              } else {
                this.oldFilter = originValue;
              }

              return null;
            }
          }),

          {
            type: 'divider',
            visibleOn: 'this.api && this.api.url'
          },

          getSchemaTpl('combo-container', {
            label: '批量操作',
            name: 'bulkActions',
            type: 'combo',
            hiddenOn: 'this.pickerMode && this.multiple',
            inputClassName: 'ae-BulkActions-control',
            multiple: true,
            draggable: true,
            draggableTip: '',
            scaffold: {
              label: '按钮',
              type: 'button'
            },
            labelRemark: {
              className: 'm-l-xs',
              trigger: 'click',
              rootClose: true,
              content:
                '通过此可以管理批量操作按钮，只有设置了批量操作按钮才会出现选择框，可在外观中配置批量操作按钮位置。',
              placement: 'left'
            },
            items: [
              getSchemaTpl('tpl:btnLabel'),

              {
                columnClassName: 'p-t-xs col-edit',
                children: ({index}: any) => (
                  <button
                    onClick={this.handleBulkActionEdit.bind(this, id, index)}
                    data-tooltip="修改"
                    data-position="bottom"
                    className="text-muted"
                  >
                    <i className="fa fa-pencil" />
                  </button>
                )
              }
            ]
          }),

          // getSchemaTpl('switch', {
          //   name: 'defaultChecked',
          //   label: '默认是否全部勾选',
          //   visibleOn: 'this.bulkActions && this.bulkActions.length',
          //   pipeIn: defaultValue(false)
          // }),

          {
            type: 'divider'
          },

          getSchemaTpl('combo-container', {
            label: '单条操作',
            name: 'itemActions',
            type: 'combo',
            labelRemark: {
              className: 'm-l-xs',
              trigger: 'click',
              rootClose: true,
              content:
                '设置后，当鼠标悬停行数据上，会出现该操作按钮，同时顶部操作栏也会显示该按钮，勾选成员时与批量按钮智能切换。',
              placement: 'left'
            },
            hiddenOn: 'this.mode && this.mode !== "table" || this.pickerMode',
            inputClassName: 'ae-BulkActions-control',
            multiple: true,
            draggable: true,
            scaffold: {
              label: '按钮',
              type: 'button'
            },
            items: [
              getSchemaTpl('tpl:btnLabel'),

              {
                type: 'checkbox',
                className: 'text-xs',
                option: '悬停隐藏',
                name: 'hiddenOnHover'
              },

              {
                columnClassName: 'p-t-xs col-edit',
                children: ({index}: any) => (
                  <button
                    onClick={this.handleItemActionEdit.bind(this, id, index)}
                    data-tooltip="修改"
                    data-position="bottom"
                    className="text-muted"
                  >
                    <i className="fa fa-pencil" />
                  </button>
                )
              }
            ]
          }),

          {
            type: 'divider',
            hiddenOn: 'this.mode && this.mode !== "table" || this.pickerMode'
          },

          getSchemaTpl('switch', {
            name: 'selectable',
            label: '开启选择',
            pipeIn: defaultValue(false),
            labelRemark: {
              className: 'm-l-xs',
              trigger: 'click',
              rootClose: true,
              content: '开启后即便没有批量操作按钮也显示可点选',
              placement: 'left'
            }
          }),

          getSchemaTpl('switch', {
            name: 'multiple',
            label: '开启多选',
            visibleOn: '${selectable}',
            pipeIn: defaultValue(true),
            labelRemark: {
              className: 'm-l-xs',
              trigger: 'click',
              rootClose: true,
              content: '控制是单选还是多选',
              placement: 'left'
            }
          }),

          getSchemaTpl('switch', {
            name: 'syncLocation',
            label: '同步地址栏',
            pipeIn: defaultValue(true),
            labelRemark: {
              className: 'm-l-xs',
              trigger: 'click',
              rootClose: true,
              content:
                '开启后会把查询条件数据和分页信息同步到地址栏中，页面中出现多个时，建议只保留一个同步地址栏，否则会相互影响。',
              placement: 'left'
            }
          }),

          getSchemaTpl('combo-container', {
            label: '默认参数',
            type: 'input-kv',
            name: 'defaultParams',
            labelRemark: {
              className: 'm-l-xs',
              trigger: 'click',
              rootClose: true,
              content: '可以用来设置默认参数，比如 <code>perPage:20</code>',
              placement: 'left'
            }
          }),

          {
            type: 'divider'
          },

          getSchemaTpl('switch', {
            name: 'keepItemSelectionOnPageChange',
            label: '保留条目选择',
            visbileOn:
              'this.bulkActions && this.bulkActions.length || this.itemActions && this.itemActions.length',
            labelRemark: {
              className: 'm-l-xs',
              trigger: 'click',
              rootClose: true,
              content:
                '默认分页、搜索后，用户选择条目会被清空，开启此选项后会保留用户选择，可以实现跨页面批量操作。',
              placement: 'left'
            }
          }),

          {
            name: 'labelTpl',
            type: 'input-text',
            label: '单条描述模板',
            visibleOn: 'this.keepItemSelectionOnPageChange',
            labelRemark: {
              className: 'm-l-xs',
              trigger: 'click',
              rootClose: true,
              content:
                '开启【保留条目选择】后会把所有已选择条目列出来，此选项可以用来定制条目展示文案。',
              placement: 'left'
            }
          },

          {
            name: 'primaryField',
            label: '指定主键',
            type: 'input-text',
            pipeIn: defaultValue('id'),
            description: '默认<code>id</code>，用于批量操作获取行级数据'
          }
        ]
      },

      {
        title: '接口',
        body: [
          getSchemaTpl('apiControl', {
            label: '数据拉取接口',
            sampleBuilder: () => {
              const data: any = {
                items: [],
                total: 0
              };
              const columns: any[] = context?.schema?.columns ?? [];
              const row = {};

              columns.forEach(column => {
                if (column.name) {
                  setVariable(row, column.name, 'sample');
                }
              });
              data.items.push(row);
              return JSON.stringify(
                {
                  status: 0,
                  msg: '',
                  data: data
                },
                null,
                2
              );
            }
          }),

          {
            name: 'initFetch',
            type: 'radios',
            label: '是否初始拉取',
            pipeIn: (value: any) =>
              (typeof value == 'boolean' && value) ||
              (typeof value !== 'boolean' && ''),
            inline: true,
            onChange: () => {},
            options: [
              {
                label: '是',
                value: true
              },

              {
                label: '否',
                value: false
              },

              {
                label: '表达式',
                value: ''
              }
            ]
          },

          {
            name: 'initFetchOn',
            autoComplete: false,
            visibleOn: 'typeof this.initFetch !== "boolean"',
            type: 'input-text',
            placeholder: '用 JS 表达式来决定',
            className: 'm-t-n-sm'
          },

          getSchemaTpl('switch', {
            name: 'loadDataOnce',
            label: '一次性拉取',
            labelRemark: {
              className: 'm-l-xs',
              trigger: 'click',
              rootClose: true,
              content:
                '开启后，数据只会在初始的时候拉取，后续分页、排序不再请求接口，都由前端直接完成。',
              placement: 'left'
            }
          }),

          {
            name: 'matchFunc',
            type: 'ae-functionEditorControl',
            allowFullscreen: true,
            mode: 'normal',
            label: tipedLabel(
              '搜索匹配函数',
              '自定义搜索匹配函数，当开启<code>loadDataOnce</code>时，会基于该函数计算的匹配结果进行过滤，主要用于处理列字段类型较为复杂或者字段值格式和后端返回不一致的场景。<code>matchSorter</code>函数用于处理复杂的过滤场景，比如模糊匹配等，更多详细内容推荐查看<a href="https://github.com/kentcdodds/match-sorter" target="_blank">match-sorter</a>。'
            ),
            renderLabel: true,
            params: [
              {
                label: 'items',
                tip: genCodeSchema('/* 当前列表的全量数据 */\nitems: any[]')
              },
              {
                label: 'itemsRaw',
                tip: genCodeSchema(
                  '/* 最近一次接口返回的全量数据 */\nitemsRaw: any[]'
                )
              },
              {
                label: 'options',
                tip: genCodeSchema(
                  '/* 额外的配置 */\noptions?: {\n  /* 查询参数 */\n  query: Record < string, any>;\n  /* 列配置 */\n  columns: any;\n  /** match-sorter 匹配函数 */\n  matchSorter: (items: any[], value: string, options?: MatchSorterOptions<any>) => any[]\n}'
                )
              }
            ],
            placeholder: `return items;`,
            visibleOn: '${loadDataOnce === true}'
          },

          getSchemaTpl('switch', {
            label: '开启定时刷新',
            name: 'interval',
            visibleOn: 'this.api',
            pipeIn: (value: any) => !!value,
            pipeOut: (value: any) => (value ? 3000 : undefined)
          }),

          {
            name: 'interval',
            type: 'input-number',
            visibleOn: 'typeof this.interval === "number"',
            step: 500,
            className: 'm-t-n-sm',
            description: '设置后将自动定时刷新，单位 ms'
          },

          getSchemaTpl('switch', {
            name: 'silentPolling',
            label: '静默刷新',
            visibleOn: '!!this.interval',
            description: '设置自动定时刷新时是否显示loading'
          }),

          {
            name: 'stopAutoRefreshWhen',
            label: '停止定时刷新检测表达式',
            type: 'input-text',
            visibleOn: '!!this.interval',
            description:
              '定时刷新一旦设置会一直刷新，除非给出表达式，条件满足后则不刷新了。'
          },

          getSchemaTpl('switch', {
            name: 'stopAutoRefreshWhenModalIsOpen',
            label: '当有弹框时关闭自动刷新',
            visibleOn: '!!this.interval',
            description: '弹框打开关闭自动刷新，关闭弹框又恢复'
          }),

          {
            type: 'divider'
          },

          getSchemaTpl('switch', {
            name: 'draggable',
            label: '是否可拖拽排序'
          }),

          getSchemaTpl('apiControl', {
            label: tipedLabel(
              '顺序保存接口',
              `<p><code>ids</code>: <span>用 id 来记录新的顺序</span></p>
              <p><code>rows</code>: <span>数组格式，新的顺序，数组里面包含所有原始信息</span></p>
              <p><code>insetAfter</code> / <code>insertBefore</code>: <span>这是 amis 生成的 diff 信息，对象格式，key 为目标成员的 primaryField 值，即 id，value 为数组，数组中存放成员 primaryField 值</span></p>`
            ),
            name: 'saveOrderApi',
            visibleOn: 'this.draggable'
          }),

          {
            type: 'divider'
          },

          getSchemaTpl('apiControl', {
            label: '快速保存接口',
            name: 'quickSaveApi',
            description:
              '当 column 中设置了快速编辑后将使用此接口批量保存数据。'
          }),

          {
            type: 'divider'
          },

          getSchemaTpl('apiControl', {
            label: '快速保存单条接口',
            name: 'quickSaveItemApi',
            description:
              '当 column 中设置了快速编辑且设置了立即保存，将使用此接口保存数据。'
          }),

          {
            type: 'divider'
          },

          getSchemaTpl('loadingConfig', {}, {context}),

          {
            type: 'divider'
          },

          {
            label: '默认消息提示',
            type: 'combo',
            name: 'messages',
            multiLine: true,
            description:
              '覆盖默认消息提示，但如果 api 返回 msg 则会优先使用这个 msg',
            items: [
              getSchemaTpl('fetchSuccess'),
              getSchemaTpl('fetchFailed'),
              getSchemaTpl('saveOrderSuccess'),
              getSchemaTpl('saveOrderFailed'),
              getSchemaTpl('quickSaveSuccess'),
              getSchemaTpl('quickSaveFailed')
            ]
          }
        ],
        visibleOn: '!this.pickerMode'
      },

      {
        title: '外观',
        body: [
          {
            label: '内容展示模式',
            name: 'mode',
            type: 'button-group-select',
            size: 'xs',
            pipeIn: (value: any, values: any) =>
              (value === 'grid' ? 'cards' : value) ?? 'table',
            onChange: (value: any, oldValue: any, model: any, form: any) => {
              let headerHasColumnsToggle = form?.data?.headerToolbar?.some(
                (item: any) => item.type === 'columns-toggler'
              );
              let headerToolbar = cloneDeep(form?.data?.headerToolbar);
              let columnsToggler;
              if (value !== 'table' && oldValue === 'table') {
                // 存储table模式是否有 columns-toggler
                columnsToggler = headerToolbar?.find(
                  (item: any) => item.type === 'columns-toggler'
                ) || {
                  type: 'columns-toggler',
                  align: 'right'
                };
                form.setValues({
                  __headerHasColumnsToggler: headerHasColumnsToggle
                });
              }
              headerToolbar =
                value === 'table'
                  ? headerToolbar
                  : headerToolbar?.filter(
                      (item: any) => item.type !== 'columns-toggler'
                    );
              if (value === 'table') {
                if (
                  form?.data?.__headerHasColumnsToggler &&
                  !headerHasColumnsToggle
                ) {
                  headerToolbar?.push(
                    form?.data?.__cacheColumnsToggler || {
                      type: 'columns-toggler',
                      align: 'right'
                    }
                  );
                }
                form.setValues({
                  headerToolbar,
                  columns:
                    form.data.__columns ||
                    this.transformByMode({
                      from: oldValue,
                      to: value,
                      schema: form.data
                    }),
                  __headerHasColumnsToggler: headerHasColumnsToggle,
                  __card: form.data.card || form.data.__card,
                  __listItem: form.data.listItem || form.data.__listItem
                });
                form.deleteValueByName('card');
                form.deleteValueByName('listItem');
              } else if (value === 'cards') {
                oldValue === 'table' &&
                  form.setValues({
                    __cacheColumnsToggler: columnsToggler
                  });
                form.setValues({
                  headerToolbar,
                  card:
                    form.data.__card ||
                    this.transformByMode({
                      from: oldValue,
                      to: value,
                      schema: form.data
                    }),
                  __columns: form.data.columns || form.data.__columns,
                  __listItem: form.data.listItem || form.data.__listItem
                });
                form.deleteValueByName('columns');
                form.deleteValueByName('listItem');
              } else {
                oldValue === 'table' &&
                  form.setValues({
                    __cacheColumnsToggler: columnsToggler
                  });
                form.setValues({
                  headerToolbar,
                  listItem:
                    form.data.__listItem ||
                    this.transformByMode({
                      from: oldValue,
                      to: value,
                      schema: form.data
                    }),
                  __columns: form.data.columns || form.data.__columns,
                  __card: form.data.card || form.data.__card
                });
                form.deleteValueByName('columns');
                form.deleteValueByName('card');
              }
            },
            options: [
              {
                value: 'table',
                label: '表格'
              },

              {
                value: 'cards',
                label: '卡片'
              },

              {
                value: 'list',
                label: '列表'
              }
            ]
          },

          {
            type: 'switch',
            name: 'showIndexBar',
            label: '显示索引条',
            visibleOn: 'this.mode === "list"',
            pipeIn: defaultValue(false),
            onChange: (
              value: boolean,
              oldValue: boolean,
              model: any,
              form: any
            ) => {
              if (value) {
                form.setValueByName('indexBarOffset', 0);
                form.setValueByName('indexField', 'title');
              }
            }
          },

          {
            type: 'container',
            visibleOn: 'this.mode === "list" && this.showIndexBar',
            body: [
              {
                type: 'input-number',
                name: 'indexBarOffset',
                label: '顶部偏移量',
                value: 0,
                min: 0,
                max: 200,
                unit: 'px',
                description: '点击索引条跳转时，与顶部保持的距离'
              },
              {
                type: 'input-text',
                name: 'indexField',
                label: '索引字段',
                value: 'title',
                placeholder: '请输入索引字段名',
                description: '根据指定字段的首字母进行索引，默认使用 title 字段'
              }
            ]
          },

          getSchemaTpl('combo-container', {
            name: 'headerToolbar',
            type: 'combo',
            draggable: true,
            draggableTip: '',
            descrition: '非内建内容请在预览区选中后编辑',
            label: '顶部工具栏配置',
            pipeIn: (value: any) => {
              if (!Array.isArray(value)) {
                value = value ? [value] : ['bulkActions'];
              }
              return value.map((item: any) => {
                let type = item.type;

                if (
                  typeof item === 'string' &&
                  ~[
                    'bulkActions',
                    'bulk-actions',
                    'pagination',
                    'statistics',
                    'switch-per-page',
                    'filter-toggler',
                    'load-more',
                    'export-csv',
                    'export-excel'
                  ].indexOf(item)
                ) {
                  type = item === 'bulkActions' ? 'bulk-actions' : item;
                  item = {type};
                } else if (typeof item === 'string') {
                  type = 'tpl';
                  item =
                    typeof item === 'string'
                      ? {type: 'tpl', tpl: item, wrapperComponent: ''}
                      : item;
                }
                return {
                  type,
                  ...item
                };
              });
            },
            pipeOut: (value: any) => {
              if (Array.isArray(value)) {
                return value.map((item: any) => {
                  if (item.type === 'button') {
                    return JSONPipeIn({
                      label: '按钮',
                      type: 'button',
                      ...item
                    });
                  } else if (item.type === 'tpl') {
                    return JSONPipeIn({
                      type: 'tpl',
                      tpl: '内容',
                      wrapperComponent: '',
                      ...item
                    });
                  }

                  return item;
                });
              }

              return [];
            },
            scaffold: {
              type: 'tpl',
              wrapperComponent: '',
              tpl: '内容'
            },
            multiple: true,
            items: [
              {
                type: 'select',
                name: 'type',
                columnClassName: 'w-ssm',
                overlay: {
                  align: 'left',
                  width: 150
                },
                options: [
                  {
                    value: 'bulk-actions',
                    label: '操作栏'
                  },

                  {
                    value: 'pagination',
                    label: '分页'
                  },

                  {
                    value: 'statistics',
                    label: '统计数据'
                  },

                  {
                    value: 'switch-per-page',
                    label: '切换页码'
                  },

                  {
                    value: 'load-more',
                    label: '加载更多'
                  },

                  {
                    value: 'export-csv',
                    label: '导出 CSV'
                  },

                  {
                    value: 'export-excel',
                    label: '导出 Excel'
                  },

                  {
                    value: 'columns-toggler',
                    label: '列选择器',
                    visibleOn: '!this.mode || this.mode === "table"'
                  },

                  {
                    value: 'filter-toggler',
                    label: '查询条件切换'
                  },

                  {
                    value: 'drag-toggler',
                    label: '拖拽切换'
                  },
                  // list和cards自带全选了，没必要再加了
                  // {
                  //   value: 'check-all',
                  //   label: '全选',
                  //   hiddenOn: '!this.mode || this.mode === "table"'
                  // },

                  {
                    value: 'tpl',
                    label: '文本'
                  },

                  {
                    value: 'button',
                    label: '按钮'
                  }
                ]
              },

              {
                name: 'align',
                placeholder: '对齐方式',
                type: 'select',
                size: 'xs',
                options: [
                  {
                    label: '左对齐',
                    value: 'left'
                  },

                  {
                    label: '右对齐',
                    value: 'right'
                  }
                ]
              }

              // {
              //   type: 'remark',
              //   content: '详情请在预览区域选中后进行编辑。',
              //   trigger: ['click'],
              //   rootClose: true,
              //   placement: 'left',
              //   visibleOn:
              //     '!~["bulkActions", "drag-toggler", "check-all", "bulk-actions", "pagination", "statistics", "switch-per-page", "filter-toggler", "load-more"].indexOf(this.type)',
              //   columnClassName: 'no-grow w-3x p-t-xs',
              //   className: 'm-l-none'
              // }
            ]
          }),

          getSchemaTpl('combo-container', {
            name: 'footerToolbar',
            type: 'combo',
            draggable: true,
            draggableTip: '',
            descrition: '非内建内容请在预览区选中后编辑',
            label: '底部工具栏配置',
            pipeIn: (value: any) => {
              if (!Array.isArray(value)) {
                value = value ? [value] : ['statistics', 'pagination'];
              }

              return value.map((item: any) => {
                let type = item.type;

                if (
                  typeof item === 'string' &&
                  ~[
                    'bulkActions',
                    'bulk-actions',
                    'pagination',
                    'statistics',
                    'switch-per-page',
                    'filter-toggler',
                    'load-more',
                    'export-csv',
                    'export-excel'
                  ].indexOf(item)
                ) {
                  type = item === 'bulkActions' ? 'bulk-actions' : item;
                  item = {type};
                } else if (typeof item === 'string') {
                  type = 'tpl';
                  item =
                    typeof item === 'string'
                      ? {type: 'tpl', tpl: item, wrapperComponent: ''}
                      : item;
                }

                return {
                  type,
                  ...item
                };
              });
            },
            pipeOut: (value: any) => {
              if (Array.isArray(value)) {
                return value.map((item: any) => {
                  if (item.type === 'button') {
                    return JSONPipeIn({
                      label: '按钮',
                      type: 'button',
                      ...item
                    });
                  } else if (item.type === 'tpl') {
                    return JSONPipeIn({
                      type: 'tpl',
                      tpl: '内容',
                      wrapperComponent: '',
                      ...item
                    });
                  }

                  return item;
                });
              }

              return [];
            },
            scaffold: {
              type: 'tpl',
              tpl: '内容',
              wrapperComponent: ''
            },
            multiple: true,
            items: [
              {
                type: 'select',
                name: 'type',
                columnClassName: 'w-ssm',
                overlay: {
                  align: 'left',
                  width: 150
                },
                options: [
                  {
                    value: 'bulk-actions',
                    label: '操作栏'
                  },

                  {
                    value: 'pagination',
                    label: '分页'
                  },

                  {
                    value: 'statistics',
                    label: '统计数据'
                  },

                  {
                    value: 'switch-per-page',
                    label: '切换页码'
                  },

                  {
                    value: 'load-more',
                    label: '加载更多'
                  },

                  {
                    value: 'export-csv',
                    label: '导出 CSV'
                  },

                  {
                    value: 'export-excel',
                    label: '导出 Excel'
                  },

                  {
                    value: 'columns-toggler',
                    label: '列选择器',
                    hiddenOn: '["grid", "cards", "list"].indexOf(this.mode)'
                  },

                  {
                    value: 'filter-toggler',
                    label: '查询条件切换'
                  },

                  {
                    value: 'drag-toggler',
                    label: '拖拽切换'
                  },

                  {
                    value: 'check-all',
                    label: '全选',
                    hiddenOn: '!this.mode || this.mode === "table"'
                  },

                  {
                    value: 'tpl',
                    label: '文本'
                  },

                  {
                    value: 'button',
                    label: '按钮'
                  }
                ]
              },

              {
                name: 'align',
                placeholder: '对齐方式',
                size: 'xs',
                type: 'select',
                options: [
                  {
                    label: '左对齐',
                    value: 'left'
                  },

                  {
                    label: '右对齐',
                    value: 'right'
                  }
                ]
              },

              {
                type: 'remark',
                content: '详情请在预览区域选中后进行编辑。',
                trigger: ['click'],
                rootClose: true,
                placement: 'left',
                visibleOn:
                  '!~["bulkActions", "drag-toggler", "check-all", "bulk-actions", "pagination", "statistics", "switch-per-page", "filter-toggler", "load-more", "export-csv", "export-excel"].indexOf(this.type)',
                columnClassName: 'no-grow w-3x p-t-xs',
                className: 'm-l-none'
              }
            ]
          }),

          getSchemaTpl('switch', {
            name: 'filterTogglable',
            label: '是否可显隐查询条件',
            visibleOn: 'this.filter'
          }),

          getSchemaTpl('switch', {
            name: 'filterDefaultVisible',
            label: '查询条件默认是否可见',
            visibleOn: 'this.filter && this.filterTogglable',
            pipeIn: defaultValue(true)
          }),

          getSchemaTpl('switch', {
            name: 'hideQuickSaveBtn',
            label: '隐藏顶部快速保存提示'
          }),

          getSchemaTpl('switch', {
            name: 'alwaysShowPagination',
            label: '是否总是显示分页'
          }),

          getSchemaTpl('switch', {
            name: 'autoFillHeight',
            label: '内容区域自适应高度'
          }),

          getSchemaTpl('switch', {
            name: 'hideCheckToggler',
            label: '隐藏选择按钮',
            visibleOn: 'this.checkOnItemClick'
          }),

          getSchemaTpl('className'),

          getSchemaTpl('className', {
            name: 'bodyClassName',
            label: '内容 CSS 类名'
          }),

          {
            type: 'container',
            visibleOn: `this.headerToolbar && this.headerToolbar.some(item => item === 'load-more' || item.type === 'load-more') ||
                      this.footerToolbar && this.footerToolbar.some(item => item === 'load-more' || item.type === 'load-more')`,
            body: [
              {
                type: 'group',
                body: [
                  {
                    name: 'loadMoreProps.showIcon',
                    label: '显示图标',
                    type: 'switch',
                    value: true
                  },
                  {
                    name: 'loadMoreProps.showText',
                    label: '显示文本',
                    type: 'switch',
                    value: true
                  }
                ]
              },
              getSchemaTpl('icon', {
                name: 'loadMoreProps.iconType',
                label: tipedLabel(
                  '图标类型',
                  '支持 fontawesome v4 图标、iconfont 图标。如需使用 fontawesome v5/v6 版本,需设置 vendor 为空字符串。默认为 loading-outline'
                ),
                value: 'loading-outline',
                visibleOn: 'this.loadMoreProps && this.loadMoreProps.showIcon'
              }),
              {
                name: 'loadMoreProps.minLoadingTime',
                type: 'input-number',
                label: tipedLabel(
                  '最小加载时间',
                  '指定加载时显示loading的最小时间(毫秒)'
                ),
                value: 0
              },
              {
                name: 'loadMoreProps.dataAppendTo',
                type: 'select',
                label: tipedLabel(
                  '数据追加方式',
                  '指定新加载的数据追加到已有数据的位置'
                ),
                value: 'bottom',
                options: [
                  {
                    label: '追加到底部',
                    value: 'bottom'
                  },
                  {
                    label: '追加到顶部',
                    value: 'top'
                  }
                ]
              },
              {
                type: 'group',
                label: '文本配置',
                visibleOn: 'this.loadMoreProps && this.loadMoreProps.showText',
                body: [
                  {
                    name: 'loadMoreProps.contentText.contentdown',
                    label: '加载前',
                    type: 'input-text',
                    value: '点击加载更多'
                  },
                  {
                    name: 'loadMoreProps.contentText.contentrefresh',
                    label: '加载中',
                    type: 'input-text',
                    value: '加载中...'
                  },
                  {
                    name: 'loadMoreProps.contentText.contentnomore',
                    label: '加载完成',
                    type: 'input-text',
                    value: '没有更多数据了'
                  }
                ]
              },
              getSchemaTpl('theme:colorPicker', {
                name: 'loadMoreProps.color',
                label: '文字颜色'
              })
            ]
          }
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
      },

      {
        title: '其他',
        body: [
          getSchemaTpl('ref'),
          {
            name: 'source',
            label: '数据源',
            type: 'input-text',
            description:
              '不填写，默认读取接口返回的 items 或者 rows 属性，如果是别的，请在此设置，如： <code>\\${xxxx}</code>'
          },

          {
            name: 'perPage',
            label: '每页数量',
            type: 'input-number'
          },

          getSchemaTpl('switch', {
            name: 'keepItemSelectionOnPageChange',
            label: '翻页时保留选择'
          }),

          {
            name: 'maxKeepItemSelectionLength',
            label: '最大选择数量',
            type: 'input-number',
            mode: 'horizontal',
            horizontal: {
              justify: true
            }
          },

          {
            name: 'pageField',
            label: '页码字段名',
            type: 'input-text',
            pipeIn: defaultValue('page')
          },

          {
            name: 'perPageField',
            label: '分页步长字段名',
            type: 'input-text',
            pipeIn: defaultValue('perPage')
          },

          {
            name: 'totalField',
            label: '总条数字段名',
            type: 'input-text',
            pipeIn: defaultValue('total')
          },

          {
            name: 'orderField',
            label: '排序权重字段',
            type: 'input-text',
            labelRemark: {
              className: 'm-l-xs',
              trigger: 'click',
              rootClose: true,
              content:
                '设置用来确定位置的字段名，设置后新的顺序将被赋值到该字段中。',
              placement: 'left'
            }
          },

          {
            name: 'perPageAvailable',
            label: '切换每页数',
            type: 'input-array',
            hiddenOn: 'this.loadDataOnce',
            items: {
              type: 'input-number',
              required: true
            },
            value: [5, 10, 20, 50, 100]
          },

          getSchemaTpl('name'),

          {
            name: 'itemCheckableOn',
            type: 'input-text',
            label: '配置单条可选中的表达式',
            description: '请使用 js 表达式，不设置的话每条都可选中。',
            visibleOn:
              'this.bulkActions && this.bulkActions.length || this.pickerMode'
          },

          getSchemaTpl('switch', {
            name: 'checkOnItemClick',
            label: '开启单条点击整个区域选中',
            visibleOn:
              'this.bulkActions && this.bulkActions.length || this.pickerMode'
          }),

          getSchemaTpl('switch', {
            name: 'autoJumpToTopOnPagerChange',
            label: '自动跳顶部',
            description: '当切分页的时候，是否自动跳顶部'
          }),

          getSchemaTpl('switch', {
            name: 'syncResponse2Query',
            label: '同步查询条件',
            description: '查询后将返回的数据同步到查询条件上'
          })
        ]
      }
    ]);
  };

  handleBulkActionEdit(id: string, index: number) {
    const store = this.manager.store;
    const schema = store.getSchema(id);
    const action = schema?.bulkActions[index];

    if (action && action.$$id) {
      store.setActiveId(action.$$id);
    }
  }
  handleItemActionEdit(id: string, index: number) {
    const store = this.manager.store;
    const schema = store.getSchema(id);
    const action = schema?.itemActions[index];

    if (action && action.$$id) {
      store.setActiveId(action.$$id);
    }
  }

  wrapperProps = {
    affixHeader: false
  };

  /**
   * 默认什么组件都加入的子组件里面，子类里面可以复写这个改变行为。
   * @param context
   * @param renderers
   */
  buildSubRenderers(
    context: RendererEventContext,
    renderers: Array<SubRendererInfo>
  ): BasicSubRenderInfo | Array<BasicSubRenderInfo> | void {
    const plugin: PluginInterface = this;
    if (plugin.name && plugin.description) {
      return {
        name: plugin.name,
        icon: plugin.icon,
        pluginIcon: plugin.pluginIcon,
        description: plugin.description,
        previewSchema: plugin.previewSchema,
        tags: plugin.tags,
        docLink: plugin.docLink,
        type: plugin.type,
        scaffold: plugin.scaffold,
        disabledRendererPlugin: plugin.disabledRendererPlugin,
        isBaseComponent: plugin.isBaseComponent,
        scaffoldForm: this.scaffoldForm,
        rendererName: plugin.rendererName
      };
    }
  }

  getRendererInfo(
    context: RendererInfoResolveEventContext
  ): BasicRendererInfo | void {
    const info = super.getRendererInfo(context);
    if (info) {
      info.scaffoldForm = this.scaffoldForm;
    }
    return info;
  }

  renderEditableComponents(props: any) {
    const render = props.render;
    const bulkActions = props.bulkActions;
    const itemActions = props.itemActions;
    const doms: Array<JSX.Element> = [];

    if (Array.isArray(bulkActions) && bulkActions.length) {
      doms.push(
        <div key="bulkActions" className="ae-EditableRender">
          <div className="ae-EditableRender-title">批量操作</div>
          <div className="ae-EditableRender-body">
            {bulkActions.map(action =>
              render(
                'bulk-action',
                {
                  type: 'button',
                  size: 'sm',
                  ...action
                },
                {
                  key: action.$$id
                }
              )
            )}
          </div>
        </div>
      );
    }

    if (Array.isArray(itemActions) && itemActions.length) {
      doms.push(
        <div key="itemActions" className="ae-EditableRender">
          <div className="ae-EditableRender-title">单条操作</div>
          <div className="ae-EditableRender-body">
            {itemActions.map(action =>
              render(
                'bulk-action',
                {
                  type: 'button',
                  size: 'sm',
                  ...action
                },
                {
                  key: action.$$id
                }
              )
            )}
          </div>
        </div>
      );
    }

    if (!doms.length) {
      return null;
    }

    return (
      <div className="ae-EditableRenderers">
        <div className="ae-EditableRenderers-tip">「增删改查」编辑辅助区</div>
        {doms}
      </div>
    );
  }

  renderRenderer(props: any) {
    const {$$editor, style, ...rest} = props;
    const renderer = $$editor.renderer;
    return (
      <div className="ae-CRUDEditor" style={style} data-role="container">
        {this.renderEditableComponents(props)}
        <renderer.component $$editor={$$editor} {...rest} />
      </div>
    );
  }

  filterProps(props: any) {
    if (props.pickerMode) {
      props.options = props.data.options;
    }

    return props;
  }

  afterUpdate(event: PluginEvent<ChangeEventContext>) {
    const context = event.context;

    // mode 内容形式变化，需要重新构建面板。
    if (
      context.info.plugin === this &&
      context.diff?.some(change => change.path?.join('.') === 'mode')
    ) {
      setTimeout(() => {
        this.manager.buildPanels();
        this.manager.buildToolbars();
      }, 20);
    }
  }

  async buildDataSchemas(
    node: EditorNodeType,
    region?: EditorNodeType,
    trigger?: EditorNodeType,
    parent?: EditorNodeType
  ) {
    const child: EditorNodeType = node.children.find(
      item => !!~['table', 'table2', 'cards', 'list'].indexOf(item.type)
    );

    if (!child?.info?.plugin?.buildDataSchemas) {
      return;
    }

    const tmpSchema = await child.info.plugin.buildDataSchemas?.(
      child,
      undefined,
      trigger,
      node
    );

    let childSchema = {
      ...tmpSchema,
      ...(tmpSchema?.$id ? {} : {$id: `${child.id}-${child.type}`})
    };

    // 兼容table的rows，并自行merged异步数据
    if (child.type === 'table') {
      let itemsSchema: any = {}; // 收集选择记录中的列
      const columns: EditorNodeType = child.children.find(
        item => item.isRegion && item.region === 'columns'
      );
      const rowsSchema = childSchema.properties.rows?.items;

      if (trigger) {
        const isColumnChild = someTree(
          columns?.children,
          item => item.id === trigger.id
        );

        // merge异步数据中的单列成员，因为rendererBeforeDispatchEvent无法区分是否需要单列成员
        const scope = this.manager.dataSchema.getScope(
          `${node.id}-${node.type}`
        );
        // 列表记录成员字段
        const menberProps = (
          scope.getSchemaById('crudFetchInitedData')?.properties?.items as any
        )?.items?.properties;
        // 所有字段
        let tmpProperties: any = {
          ...menberProps,
          ...rowsSchema?.properties
        };

        Object.keys(tmpProperties).map(key => {
          itemsSchema[key] = {
            ...tmpProperties[key]
          };
        });

        if (isColumnChild) {
          const childScope = this.manager.dataSchema.getScope(
            `${child.id}-${child.type}-currentRow`
          );

          if (childScope) {
            childScope?.setSchemas([
              {
                $id: `${child.id}-${child.type}-currentRow`,
                type: 'object',
                properties: itemsSchema
              }
            ]);
            childScope.tag = `当前行记录 : ${node.type}`;
          }
        }
      }
      childSchema = {
        $id: childSchema.$id,
        type: childSchema.type,
        properties: {
          items: childSchema.properties.rows,
          selectedItems: {
            ...childSchema.properties.selectedItems,
            items: {
              ...childSchema.properties.selectedItems.items,
              properties: itemsSchema
            }
          },
          unSelectedItems: {
            ...childSchema.properties.unSelectedItems,
            items: {
              ...childSchema.properties.unSelectedItems.items,
              properties: itemsSchema
            }
          },
          selectedIndexes: {
            type: 'array',
            title: '已选择行索引'
          },
          count: {
            type: 'number',
            title: '总行数'
          },
          page: {
            type: 'number',
            title: '当前页码'
          }
        }
      };
    }

    return childSchema;
  }

  rendererBeforeDispatchEvent(node: EditorNodeType, e: any, data: any) {
    if (e === 'fetchInited' || e === 'research') {
      const scope = this.manager.dataSchema.getScope(`${node.id}-${node.type}`);
      const jsonschema: any = {
        $id: 'crudFetchInitedData',
        type: 'object',
        ...jsonToJsonSchema(data.responseData, (type: string, key: string) => {
          if (type === 'array' && key === 'items') {
            return '数据列表';
          }
          if (type === 'number' && key === 'count') {
            return '总行数';
          }
          return key;
        })
      };

      scope?.removeSchema(jsonschema.$id);
      scope?.addSchema(jsonschema);
    }
  }

  /** crud 不同 mode 之间转换时候，主体的转换 */
  transformByMode({
    from,
    to,
    schema
  }: {
    from: CRUDModes;
    to: CRUDModes;
    schema: any;
  }) {
    const fields = [];
    const actions = [];

    if (!from || from === 'table') {
      (schema.columns || []).forEach((item: any) => {
        if (!isPlainObject(item)) {
          return;
        } else if (item.type === 'operation') {
          actions.push(...(item?.buttons || []));
        } else {
          fields.push(item);
        }
      });
    } else {
      const name = from === 'cards' ? 'card' : 'listItem';
      fields.push(...(schema?.[name]?.body || []));
      actions.push(...(schema?.[name]?.actions || []));
    }

    // 保底
    fields.length ||
      fields.push(
        ...[
          {
            type: 'text',
            name: schema.labelField || 'label',
            label: 'label'
          },
          {
            type: 'text',
            name: schema.valueField || 'value',
            label: 'value'
          }
        ]
      );

    if (to === 'table') {
      return fields.concat({
        type: 'operation',
        label: '操作',
        buttons: actions
      });
    } else if (to === 'cards') {
      return {
        type: 'card',
        header: {
          title: '标题',
          subTitle: '副标题'
        },
        body: fields,
        actions
      };
    }
    return {
      body: fields,
      actions
    };
  }
}

registerEditorPlugin(CRUDPlugin);
