import {toast} from 'amis';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import React from 'react';

import {registerEditorPlugin} from 'amis-editor-core';
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
  SubRendererInfo
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {isObject, JSONPipeIn} from 'amis-editor-core';
import {setVariable} from 'amis-core';
import {ActionSchema} from 'amis/lib/renderers/Action';
import {getEnv} from 'mobx-state-tree';
import {EditorNodeType, RendererPluginAction} from 'amis-editor-core';
import {normalizeApi} from 'amis-core';

interface ColumnItem {
  label: string;
  type: string;
  name: string;
}

// 将展现控件转成编辑控件
const viewTypeToEditType = (type: string) => {
  return type === 'tpl'
    ? 'input-text'
    : type === 'status' || type === 'mapping'
    ? 'select'
    : `input-${type}`;
};

export class CRUDPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'crud';
  $schema = '/schemas/CRUDSchema.json';

  order = -1000;

  // 组件名称
  name = '增删改查';
  isBaseComponent = true;
  description =
    '用来实现对数据的增删改查，支持三种模式展示：table、cards和list. 负责数据的拉取，分页，单条操作，批量操作，排序，快速编辑等等功能。集成查询条件。';
  docLink = '/amis/zh-CN/components/crud';
  tags = ['功能'];
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

  actions: RendererPluginAction[] = [
    {
      actionType: 'reload',
      actionLabel: '重新加载',
      description: '触发组件数据刷新并重新渲染'
    }
  ];

  btnSchemas = {
    create: {
      label: '新增',
      type: 'button',
      actionType: 'dialog',
      level: 'primary',
      dialog: {
        title: '新增',
        body: {
          type: 'form',
          api: 'xxx/create',
          body: []
        }
      }
    },
    update: {
      label: '编辑',
      type: 'button',
      actionType: 'dialog',
      level: 'link',
      dialog: {
        title: '编辑',
        body: {
          type: 'form',
          api: 'xxx/update',
          body: []
        }
      }
    },
    view: {
      label: '查看',
      type: 'button',
      actionType: 'dialog',
      level: 'link',
      dialog: {
        title: '查看详情',
        body: {
          type: 'form',
          api: 'xxx/update',
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
      api: 'delete:/xxx/delete'
    },
    bulkDelete: {
      type: 'button',
      level: 'danger',
      label: '批量删除',
      actionType: 'ajax',
      confirmText: '确定要删除？',
      api: '/xxx/batch-delete'
    },
    bulkUpdate: {
      type: 'button',
      label: '批量编辑',
      actionType: 'dialog',
      dialog: {
        title: '批量编辑',
        size: 'md',
        body: {
          type: 'form',
          api: '/xxx/bacth-edit',
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
    //   api: '/xxx/delete-one',
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

  scaffoldForm: ScaffoldForm = {
    title: '增删改查快速开始-CRUD',
    body: [
      getSchemaTpl('apiControl', {
        label: '接口地址',
        sampleBuilder: (schema: any) =>
          JSON.stringify(
            {
              status: 0,
              msg: '',
              data: [
                {id: 1, name: 'Jack'},
                {id: 2, name: 'Rose'}
              ]
            },
            null,
            2
          )
      }),
      {
        type: 'button',
        label: '格式校验并自动生成列配置',
        className: 'm-t-xs m-b-xs',
        onClick: async (e: Event, props: any) => {
          const data = props.data;
          const schemaFilter = getEnv((window as any).editorStore).schemaFilter;
          let api: any = data.api;
          // 主要是给爱速搭中替换 url
          if (schemaFilter) {
            api = schemaFilter({
              api: data.api
            }).api;
          }
          const result = await props.env.fetcher(api, data);

          let autoFillKeyValues: Array<any> = [];
          const items = result.data?.rows || result.data?.items;
          if (items?.length) {
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
            // 查询条件的字段列表
            props.formStore.setValues({
              filterSettingSource: autoFillKeyValues.map(column => {
                return column.name;
              })
            });
          } else {
            toast.warning(
              `API返回格式不正确，请点击接口地址右侧示例的问号查看示例`
            );
          }
        }
      },
      {
        name: 'features',
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
            source: '${filterSettingSource}'
          },
          {
            columnRatio: 2,
            type: 'input-number',
            label: '每列显示几个字段',
            value: 3,
            name: 'filterColumnCount'
          }
        ],
        visibleOn: 'data.features && data.features.includes("filter")'
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
            type: 'input-text',
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
    pipeOut: (value: any) => {
      let valueSchema = cloneDeep(value);
      // 查看/删除 操作，可选择是否使用接口返回值预填充
      const features: Array<any> = valueSchema.features;
      const oper: {
        type: 'operation';
        label?: string;
        buttons: Array<ActionSchema>;
      } = {
        type: 'operation',
        label: '操作',
        buttons: []
      };
      const itemBtns: Array<string> = ['update', 'view', 'delete'];
      const hasFeatures = get(features, 'length');

      valueSchema.bulkActions = [];
      /** 统一api格式 */
      valueSchema.api =
        typeof valueSchema.api === 'string'
          ? normalizeApi(valueSchema.api)
          : valueSchema.api;
      hasFeatures &&
        features.forEach((item: string) => {
          if (itemBtns.includes(item)) {
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

            // 添加操作按钮
            this.addItem(oper.buttons, schema);
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
                body: valueSchema.columns.map((column: ColumnItem) => {
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
            let keysFilter = Object.keys(valueSchema.filter || {});
            if (item === 'filter' && !keysFilter.length) {
              if (valueSchema.filterEnabledList) {
                valueSchema.filter = {
                  title: '查询条件'
                };
                valueSchema.filter.columnCount = value.filterColumnCount;
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
      const hasOperate = valueSchema.columns.find(
        (item: any) => item.type === 'operation'
      );
      hasFeatures && !hasOperate && valueSchema.columns.push(oper);
      return valueSchema;
    },
    canRebuild: true
  };

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
          getSchemaTpl('switch', {
            name: 'filter',
            label: '启用查询条件',
            visibleOn: 'data.api && data.api.url',
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
            visibleOn: 'data.api && data.api.url'
          },

          {
            label: '批量操作',
            name: 'bulkActions',
            type: 'combo',
            hiddenOn: 'data.pickerMode && data.multiple',
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
              {
                type: 'tpl',
                tpl: '<span class="label label-success">${label}</span>',
                columnClassName: 'p-t-xs'
              },

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
          },

          // getSchemaTpl('switch', {
          //   name: 'defaultChecked',
          //   label: '默认是否全部勾选',
          //   visibleOn: 'data.bulkActions && data.bulkActions.length',
          //   pipeIn: defaultValue(false)
          // }),

          {
            type: 'divider'
          },

          {
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
              {
                type: 'tpl',
                tpl: '<span class="label label-success">${label}</span>',
                columnClassName: 'p-t-xs'
              },

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
          },

          {
            type: 'divider',
            hiddenOn: 'this.mode && this.mode !== "table" || this.pickerMode'
          },

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

          {
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
          },

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
            name: 'initFetch',
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

          getSchemaTpl('switch', {
            label: '开启定时刷新',
            name: 'interval',
            visibleOn: 'data.api',
            pipeIn: (value: any) => !!value,
            pipeOut: (value: any) => (value ? 3000 : undefined)
          }),

          {
            name: 'interval',
            type: 'input-number',
            visibleOn: 'typeof data.interval === "number"',
            step: 500,
            className: 'm-t-n-sm',
            description: '设置后将自动定时刷新，单位 ms'
          },

          getSchemaTpl('switch', {
            name: 'silentPolling',
            label: '静默刷新',
            visibleOn: '!!data.interval',
            description: '设置自动定时刷新时是否显示loading'
          }),

          {
            name: 'stopAutoRefreshWhen',
            label: '停止定时刷新检测表达式',
            type: 'input-text',
            visibleOn: '!!data.interval',
            description:
              '定时刷新一旦设置会一直刷新，除非给出表达式，条件满足后则不刷新了。'
          },

          getSchemaTpl('switch', {
            name: 'stopAutoRefreshWhenModalIsOpen',
            label: '当有弹框时关闭自动刷新',
            visibleOn: '!!data.interval',
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
            label: '顺序保存接口',
            name: 'saveOrderApi',
            visibleOn: 'data.draggable'
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

          {
            label: '默认消息提示',
            type: 'combo',
            name: 'messages',
            multiLine: true,
            description:
              '覆盖默认消息提示，但如果 api 返回 msg 则会优先使用这个 msg',
            items: [
              {
                label: '获取成功提示',
                type: 'input-text',
                name: 'fetchSuccess'
              },

              {
                label: '获取失败提示',
                type: 'input-text',
                name: 'fetchFailed'
              },

              {
                label: '保存顺序成功提示',
                type: 'input-text',
                name: 'saveOrderSuccess'
              },

              {
                label: '保存顺序失败提示',
                type: 'input-text',
                name: 'saveOrderFailed'
              },

              {
                label: '快速保存成功提示',
                type: 'input-text',
                name: 'quickSaveSuccess'
              },

              {
                label: '快速保存失败提示',
                type: 'input-text',
                name: 'quickSaveFailed'
              }
            ]
          }
        ]
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
                  columns: form.data.__columns || [
                    {
                      label: 'ID',
                      name: 'id'
                    },
                    {
                      label: '列信息',
                      name: 'name'
                    }
                  ],
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
                  card: form.data.__card || {
                    type: 'card',
                    header: {
                      title: '标题',
                      subTitle: '副标题'
                    },
                    body: [
                      {
                        name: 'a',
                        label: 'A'
                      },
                      {
                        name: 'b',
                        label: 'B'
                      }
                    ],
                    actions: [
                      {
                        label: '详情',
                        type: 'button'
                      }
                    ]
                  },
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
                  listItem: form.data.__listItem || {
                    body: [
                      {
                        type: 'tpl',
                        tpl: '简单的展示数据：$a $b'
                      }
                    ],
                    actions: [
                      {
                        icon: 'fa fa-eye',
                        type: 'button'
                      }
                    ]
                  },
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
                    typeof item === 'string' ? {type: 'tpl', tpl: item} : item;
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
              tpl: '内容'
            },
            multiple: true,
            items: [
              {
                type: 'select',
                name: 'type',
                columnClassName: 'w-ssm',
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
          },

          {
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
                    typeof item === 'string' ? {type: 'tpl', tpl: item} : item;
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
              tpl: '内容'
            },
            multiple: true,
            items: [
              {
                type: 'select',
                name: 'type',
                columnClassName: 'w-ssm',
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
          },

          getSchemaTpl('switch', {
            name: 'filterTogglable',
            label: '是否可显隐查询条件',
            visibleOn: 'data.filter'
          }),

          getSchemaTpl('switch', {
            name: 'filterDefaultVisible',
            label: '查询条件默认是否可见',
            visibleOn: 'data.filter && data.filterTogglable',
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
            name: 'hideCheckToggler',
            label: '隐藏选择按钮',
            visibleOn: 'data.checkOnItemClick'
          }),

          getSchemaTpl('className'),

          getSchemaTpl('className', {
            name: 'bodyClassName',
            label: '内容 CSS 类名'
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
            mode: 'inline',
            className: 'block'
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
            hiddenOn: 'data.loadDataOnce',
            items: {
              type: 'input-number',
              required: true
            },
            value: [10]
          },

          getSchemaTpl('name'),

          {
            name: 'itemCheckableOn',
            type: 'input-text',
            label: '配置单条可选中的表达式',
            description: '请使用 js 表达式，不设置的话每条都可选中。',
            visibleOn:
              'data.bulkActions && data.bulkActions.length || data.pickerMode'
          },

          getSchemaTpl('switch', {
            name: 'checkOnItemClick',
            label: '开启单条点击整个区域选中',
            visibleOn:
              'data.bulkActions && data.bulkActions.length || data.pickerMode'
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
    const $$editor = props.$$editor;
    const renderer = $$editor.renderer;
    return (
      <div className="ae-CRUDEditor">
        {this.renderEditableComponents(props)}
        <renderer.component {...props} />
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

  async buildDataSchemas(node: EditorNodeType, region?: EditorNodeType) {
    const child: EditorNodeType = node.children.find(
      item => !!~['table', 'table2', 'cards', 'list'].indexOf(item.type)
    );

    if (!child?.info?.plugin?.buildDataSchemas) {
      return;
    }
    return child.info.plugin.buildDataSchemas(child);
  }
}

registerEditorPlugin(CRUDPlugin);
