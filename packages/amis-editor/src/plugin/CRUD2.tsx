import React from 'react';
import uniqBy from 'lodash/uniqBy';
import cloneDeep from 'lodash/cloneDeep';
import {
  AfterBuildPanelBody,
  BaseEventContext,
  BasePlugin,
  BasicRendererInfo,
  PluginEvent,
  RendererInfoResolveEventContext,
  ScaffoldForm,
  EditorManager,
  registerEditorPlugin,
  defaultValue,
  getSchemaTpl,
  generateNodeId,
  tipedLabel,
  EditorNodeType,
  DSBuilder,
  DSBuilderManager,
  DSFeature,
  DSFeatureType
} from 'amis-editor-core';
import {flattenDeep, fromPairs, isObject, remove} from 'lodash';
import {ButtonSchema} from 'amis/lib/renderers/Action';
import {FormSchema, SchemaObject} from 'amis/lib/Schema';
import {findTree} from 'amis';
import {CRUD2Schema} from 'amis/lib/renderers/CRUD2';
import {FeatureOption} from '../renderer/FeatureControl';
import {getArgsWrapper} from '../renderer/event-control/helper';
import {Table2RenderereEvent, Table2RendererAction} from './Table2';

import type {RendererPluginAction, RendererPluginEvent} from 'amis-editor-core';

const findObj = (
  obj: any,
  predicate: (obj: any) => boolean,
  stop?: (obj: any) => boolean
): any | void => {
  const waitProcess = [obj];

  while (waitProcess.length) {
    let item: any = waitProcess.pop();
    if (Array.isArray(item)) {
      waitProcess.push(...item);
      continue;
    }

    if (!isObject(item) || (stop && stop(item))) {
      continue;
    }

    if (predicate(item)) {
      return item;
    }

    waitProcess.push(...Object.values(item));
  }
};

const deepRemove = (obj: any, predicate: (obj: any) => boolean): any => {
  const waitProcess = [obj];

  while (waitProcess.length) {
    let item: any = waitProcess.pop();
    if (Array.isArray(item)) {
      remove(item, predicate);
      waitProcess.push(...item);
      continue;
    }

    if (!isObject(item)) {
      continue;
    }

    Object.entries(item).forEach(([key, value]) => {
      if (isObject(value) && predicate(value)) {
        delete item[key];
      }
      waitProcess.push(value);
    });
  }
};

type FeatOption = {
  label: string;
  value: DSFeatureType;
  makeSetting?: (builder: DSBuilder) => any;
  resolveSchema: (setting: any, builder: DSBuilder) => any;
  align?: 'left' | 'right';
};

const Tools: Array<FeatOption> = [
  {
    label: '新增记录',
    value: 'Insert',
    resolveSchema: (setting: any = {}, builder: DSBuilder) => {
      const form: FormSchema = {
        type: 'form',
        body: [],
        onEvent: {
          submitSucc: {
            actions: [
              {
                actionType: 'search',
                componentId: setting.id
              }
            ]
          }
        }
      };
      builder.resolveCreateSchema({
        schema: form,
        setting,
        feat: 'Insert',
        inCrud: true
      });

      return {
        type: 'button',
        behavior: 'Insert',
        label: '新增',
        level: 'primary',
        className: 'm-r-xs',
        onEvent: {
          click: {
            actions: [
              {
                actionType: 'dialog',
                dialog: {
                  title: '新增数据',
                  body: form
                }
              }
            ]
          }
        }
      };
    },
    align: 'left'
  },
  {
    label: '批量编辑',
    value: 'BulkEdit',
    resolveSchema: (setting: any = {}, builder: DSBuilder) => {
      const form: FormSchema = {
        type: 'form',
        // @ts-ignore
        behavior: 'BulkEdit',
        body: [],
        onEvent: {
          submitSucc: {
            actions: [
              {
                actionType: 'search',
                componentId: setting.id
              }
            ]
          }
        }
      };
      builder.resolveCreateSchema({
        schema: form,
        setting,
        feat: 'BulkEdit',
        inCrud: true
      });

      return {
        type: 'button',
        behavior: 'BulkEdit',
        label: '批量编辑',
        className: 'm-r-xs',
        onEvent: {
          click: {
            actions: [
              {
                actionType: 'dialog',
                dialog: {
                  title: '批量编辑',
                  body: form
                }
              }
            ]
          }
        },
        disabledOn: 'selectedItems != null && selectedItems.length < 1'
      };
    },
    align: 'left'
  },
  {
    label: '批量删除',
    value: 'BulkDelete',
    resolveSchema: (setting: any = {}, builder: DSBuilder) => {
      const button: ButtonSchema = {
        type: 'button',
        className: 'm-r-xs',
        label: '批量删除',
        level: 'danger',
        // @ts-ignore
        behavior: 'BulkDelete',
        disabledOn: 'selectedItems != null && selectedItems.length < 1'
      };

      builder.resolveDeleteSchema({
        schema: button,
        setting,
        feat: 'BulkDelete'
      });

      button.onEvent?.click?.actions?.push({
        actionType: 'search',
        componentId: setting.id
      });

      return button;
    },
    align: 'left'
  },
  {
    label: '数据导入',
    value: 'Import',
    resolveSchema: (setting: any = {}, builder: DSBuilder) => {
      return {
        type: 'button',
        className: 'm-r-xs',
        label: '导入',
        // @ts-ignore
        behavior: 'Import'
      };
    },
    align: 'left'
  },
  {
    label: '数据导出',
    value: 'Export',
    resolveSchema: (setting: any = {}, builder: DSBuilder) => {
      return {
        type: 'button',
        className: 'm-r-xs',
        label: '导出',
        // @ts-ignore
        behavior: 'Export'
      };
    },
    align: 'left'
  }
];

const FilterTypes: Array<FeatOption> = [
  {
    label: '模糊查询',
    value: 'FuzzyQuery',
    resolveSchema: (setting: any = {}, builder: DSBuilder) => {
      const formId = generateNodeId();
      return {
        type: 'form',
        behavior: 'FuzzyQuery',
        id: formId,
        submitOnChange: true,
        wrapWithPanel: false,
        onEvent: {
          validateSucc: {
            actions: [
              {
                actionType: 'search',
                componentId: setting.id,
                args: {
                  query: '${event.data}'
                }
              }
            ]
          }
        },
        body: [
          {
            name: 'keywords',
            type: 'input-text',
            label: false,
            addOn: {
              type: 'button',
              label: '搜索',
              onEvent: {
                click: {
                  actions: [
                    {
                      actionType: 'submit',
                      componentId: formId
                    }
                  ]
                }
              }
            }
          }
        ]
      };
    }
  },
  {
    label: '简单查询',
    value: 'SimpleQuery',
    resolveSchema: (setting: any = {}, builder: DSBuilder) => {
      return {
        title: '简单查询',
        type: 'form',
        mode: 'inline',
        behavior: 'SimpleQuery',
        body: builder.resolveSimpleFilterSchema({setting}) || [],
        actions: [
          {
            type: 'submit',
            label: '查询'
          },
          {
            type: 'reset',
            label: '重置'
          }
        ],
        onEvent: {
          validateSucc: {
            actions: [
              {
                actionType: 'search',
                componentId: setting.id,
                args: {
                  query: {
                    simpleFilters: '${event.data}'
                  }
                }
              }
            ]
          }
        }
      };
    }
  },
  {
    label: '高级查询',
    value: 'AdvancedQuery',
    resolveSchema: (setting: any = {}, builder: DSBuilder) => {
      return {
        title: '高级查询',
        type: 'form',
        mode: 'inline',
        behavior: 'AdvancedQuery',
        body: builder.resolveAdvancedFilterSchema({setting}) || [],
        actions: [
          {
            type: 'submit',
            label: '查询'
          },
          {
            type: 'reset',
            label: '重置'
          }
        ],
        onEvent: {
          validateSucc: {
            actions: [
              {
                actionType: 'search',
                componentId: setting.id,
                args: {
                  query: {
                    customFilters: '${event.data}'
                  }
                }
              }
            ]
          }
        }
      };
    }
  }
];

// 数据操作
const DataOperators: Array<FeatOption> = [
  {
    label: '查看详情',
    value: 'View',
    resolveSchema: (setting: any = {}, builder: DSBuilder) => {
      return {
        type: 'button',
        label: '查看',
        level: 'link',
        behavior: 'View',
        onEvent: {
          click: {
            actions: [
              {
                actionType: 'dialog',
                dialog: {
                  type: 'form',
                  title: '查看',
                  body: builder.resolveViewSchema({setting})
                }
              }
            ]
          }
        }
      };
    }
  },
  {
    label: '编辑记录',
    value: 'Edit',
    resolveSchema: (setting: any = {}, builder: DSBuilder) => {
      const form: FormSchema = {
        type: 'form',
        body: [],
        onEvent: {
          submitSucc: {
            actions: [
              {
                actionType: 'search',
                componentId: setting.id
              }
            ]
          }
        }
      };
      builder.resolveCreateSchema({
        schema: form,
        setting,
        feat: 'Edit',
        inCrud: true
      });

      return {
        type: 'button',
        label: '编辑',
        level: 'link',
        behavior: 'Edit',
        onEvent: {
          click: {
            actions: [
              {
                actionType: 'dialog',
                dialog: {
                  title: '编辑',
                  body: form
                }
              }
            ]
          }
        }
      };
    }
  },
  {
    label: '删除记录',
    value: 'Delete',
    resolveSchema: (setting: any = {}, builder: DSBuilder) => {
      const button: ButtonSchema = {
        type: 'button',
        className: 'm-r-xs',
        label: '删除',
        level: 'link',
        // @ts-ignore
        behavior: 'Delete'
      };
      builder.resolveDeleteSchema({
        schema: button,
        setting,
        feat: 'Delete'
      });

      button.onEvent?.click?.actions?.push({
        actionType: 'search',
        componentId: setting.id
      });

      return button;
    }
  }
];

const generatePreviewSchema = (mode: 'table2' | 'cards' | 'list') => {
  const columnSchema: any = [
    {
      label: 'Engine',
      name: 'engine'
    },
    {
      label: 'Browser',
      name: 'browser'
    },
    {
      name: 'version',
      label: 'Version'
    }
  ];

  const actionSchema = {
    type: 'button',
    level: 'link',
    icon: 'fa fa-eye',
    actionType: 'dialog',
    dialog: {
      title: '查看详情',
      body: {
        type: 'form',
        body: [
          {
            label: 'Engine',
            name: 'engine',
            type: 'static'
          },
          {
            name: 'browser',
            label: 'Browser',
            type: 'static'
          },
          {
            name: 'version',
            label: 'Version',
            type: 'static'
          }
        ]
      }
    }
  };

  const itemSchema =
    mode === 'cards'
      ? {card: {body: columnSchema, actions: actionSchema}}
      : mode === 'list'
      ? {
          listItem: {
            body: {
              type: 'hbox',
              columns: columnSchema
            }
          },
          actions: actionSchema
        }
      : {
          columns: columnSchema.concat([
            {
              name: 'operation',
              title: '操作',
              buttons: [actionSchema]
            }
          ])
        };

  return {
    type: 'crud2',
    mode,
    source: '$items',
    data: {
      items: [
        {
          engine: 'Trident',
          browser: 'Internet Explorer 4.0',
          platform: 'Win 95+',
          version: '4',
          grade: 'X'
        }
      ]
    },
    ...itemSchema
  };
};

export class CRUD2Plugin extends BasePlugin {
  constructor(manager: EditorManager) {
    super(manager);
    this.dsBuilderMgr = new DSBuilderManager('crud2', 'api');
  }

  async afterBuildPanelBody(event: PluginEvent<AfterBuildPanelBody>) {
    const {context} = event.context;

    if (
      context.info.renderer?.isFormItem &&
      new RegExp('/crud2/filter/').test(context.path)
    ) {
      await this.addFilterPanelSetting(event.context);
    } else if (
      context.schema.type === 'crud2' &&
      context.schema.mode === this.scaffold.mode
    ) {
      this.addListPanelSetting(event.context);
    }
  }

  async addFilterPanelSetting(context: AfterBuildPanelBody) {
    const {info, node} = context.context;
    if (info.renderer?.isFormItem) {
      const form = node.getClosestParentByType('form');
      const host = node.getClosestParentByType('crud2');

      if (
        !host ||
        !form ||
        !form.schema.behavior ||
        host.schema.mode !== this.scaffold.mode
      ) {
        return;
      }

      const builder = this.dsBuilderMgr.resolveBuilderBySchema(
        host.schema,
        'api'
      );
      const body = await builder.makeFieldFilterSetting({
        schema: host.schema,
        sourceKey: 'api',
        fieldName: node.schema.name
      });

      if (!body || !body.length) {
        return;
      }

      // 可能会出错，但是cards table2 list 配置面板结构统一，因此
      (context.data as any).tabs.forEach((tab: any) => {
        if (tab.title === '属性' || tab.title === '常规') {
          tab.body[0].body.forEach((collapse: any) => {
            if (collapse.title === '基本') {
              // 在标题后面插入过滤条件
              collapse.body.splice(2, 0, ...body);
            }
          });
        }
      });
    }
  }

  addDataOperatorSchema(schema: any, content: any) {}

  addFeatToToolbar(
    schema: any,
    content: any,
    position: 'header' | 'footer',
    align: 'left' | 'right'
  ) {
    const region = `${position}Toolbar`;
    schema[region] = schema[region] || [
      {
        type: 'grid',
        columns: [
          {
            body: []
          },
          {
            columnClassName: 'text-right',
            body: []
          }
        ]
      }
    ];
    // 尝试放到左面第一个，否则只能放外头了
    try {
      schema[region][0].columns[align === 'left' ? 0 : 1].body.unshift(content);
    } catch (e) {
      schema[region].unshift(content);
    }
  }

  filterOperators(builder: DSBuilder, context: BaseEventContext) {
    const operators: FeatureOption[] = [];
    Tools.forEach(tool => {
      if (!builder.features.includes(tool.value)) {
        return;
      }
      operators.push({
        ...tool,
        remove: (schema: any) => {
          deepRemove(
            schema.headerToolbar,
            item => item.behavior === tool.value
          );
          deepRemove(
            schema.footerToolbar,
            item => item.behavior === tool.value
          );
        },
        add: (data: any) => {
          this.addFeatToToolbar(
            data,
            tool.resolveSchema(data, builder),
            'header',
            tool.align!
          );
        },
        isActive: (data: any) => {
          return this.isFeatActive(
            data,
            tool.value,
            'headerToolbar',
            'footerToolbar'
          );
        }
      });
    });

    // 只有表格才能找到操作列放这个内容，卡片和列表不知道位置
    // if (context.schema.mode === 'table2') {
    //   DataOperators.forEach(op => {
    //     if (!builder.features.includes(op.value)) {
    //       return;
    //     }
    //     operators.push({
    //       ...op,
    //       remove: (schema: any) => {
    //         deepRemove(schema.columns, item => item.behavior === op.value);
    //       },
    //       add: (data: any) => {
    //         this.addDataOperatorSchema(data, op.resolveSchema(data, builder));
    //       },
    //       isActive: (data: any) => {
    //         return this.isFeatActive(data, op.value, 'columns');
    //       }
    //     });
    //   });
    // }

    return operators;
  }

  makeFeatSetting(feat: FeatOption, builder: DSBuilder, inScaffold: boolean) {
    if (feat.makeSetting) {
      return feat.makeSetting(builder);
    }

    return builder.makeFieldsSettingForm({
      feat: feat.value,
      inCrud: true,
      inScaffold
    });
  }

  isFeatActive(schema: any, feat: DSFeatureType, ...scope: string[]) {
    if (scope.length === 0) {
      return findObj(schema, item => item.behavior === feat);
    }
    let region = null;
    while ((region = scope.shift())) {
      if (findObj(schema[region], item => item.behavior === feat)) {
        return true;
      }
    }
    return false;
  }

  removeFeatSchema(schema: any, feat: DSFeatureType, ...scope: string[]) {
    if (scope.length === 0) {
      return deepRemove(schema, item => item.behavior === feat);
    }
    let region = null;
    while ((region = scope.shift())) {
      deepRemove(schema[region], item => item.behavior === feat);
    }
    return false;
  }

  filterColumns(builder: DSBuilder, context: BaseEventContext) {
    const existColsName: string[] = [];
    const columns: FeatureOption[] = [];

    // 实时获取，否则点击预览再回到编辑的时context中的node失效
    const node = this.manager.store.getNodeById(context.id);

    if (!node?.schema?.columns) {
      return columns;
    }

    const existColumnNames: any = {};
    let hasOperatorCol: boolean = false;
    node.schema.columns?.forEach((col: any) => {
      if (col.key) {
        existColumnNames[col.key] = true;
      }

      // 已有的可以从 table columns 中生成，从 node 中实时获取有可能schema为空
      col.$$id &&
        col.title &&
        columns.push({
          label: col.title,
          value: col.$$id
        });

      if (!hasOperatorCol || col.type === 'operation') {
        hasOperatorCol = true;
      }
    });

    const fields = node!.schema.__fields; // || node!.schema?.$$m?.listFields;

    if (fields) {
      // 通过 fields 生成可使用的 column 配置，以便增删
      const appendCols = builder.makeTableColumnsByFields(
        fields,
        node!.schema.__relations
      );
      if (appendCols?.length) {
        appendCols.forEach((col: any) => {
          if (existColumnNames[col.key]) {
            return;
          }

          columns.push({
            label: col.title,
            value: null,
            add: data => {
              data.columns.push(col);
            },
            isActive: () => false
          });
        });
      }
    }

    if (!hasOperatorCol) {
      columns.push({
        label: '操作列',
        value: null,
        isActive: () => false,
        add: data => {
          data.columns.push({
            type: 'operation',
            title: '操作',
            buttons: []
          });
        }
      });
    }

    // context.node.

    // // 只有表格才能找到操作列放这个内容，卡片和列表不知道位置
    // if (context.schema.mode === 'table2') {
    //   DataOperators.forEach(op => {
    //     if (!builder.features.includes(op.value)) {
    //       return;
    //     }
    //     operators.push({
    //       ...op,
    //       remove: (schema: any) => {
    //         deepRemove(schema.columns, item => item.behavior === op.value);
    //       },
    //       add: (data: any) => {
    //         this.addDataOperatorSchema(data, op.resolveSchema(data, builder));
    //       },
    //       isActive:(data: any) => {
    //         return this.isFeatActive(data, op.value, 'columns');
    //       }
    //     });
    //   });
    // }
    return columns;
  }

  addListPanelSetting(context: AfterBuildPanelBody) {
    const body = context.data as any;
    const builder = this.dsBuilderMgr.resolveBuilderBySchema(
      context.context.schema,
      'api'
    );

    body.tabs.forEach((tab: any) => {
      if (tab.title === '属性' || tab.title === '常规') {
        tab.className = 'p-none';
        tab.body = [
          getSchemaTpl('collapseGroup', this.addBaseCrudPanel(context))
        ];
      }
    });
  }

  sortPanelOrder(arr: any[]) {
    return arr.sort((a: any, b: any) => (a.order ?? 100) - (b.order ?? 101));
  }

  // 基础通用配置，table、cards、list 都可以用
  // 组件独有的配置在各自类里实现
  addBaseCrudPanel(context: AfterBuildPanelBody) {
    const body = context.data as any;
    const builder = this.dsBuilderMgr.resolveBuilderBySchema(
      context.context.schema,
      'api'
    );
    return [
      {
        title: '基本',
        order: 1,
        body: [
          this.dsBuilderMgr.getDSSwitch({
            type: 'select',
            label: '数据源',
            onChange: (value: any, oldValue: any, model: any, form: any) => {
              if (value !== oldValue) {
                const data = form.data;
                Object.keys(data).forEach(key => {
                  if (key.endsWith('Fields') || key.endsWith('api')) {
                    form.deleteValueByName(key);
                  }
                });
                form.deleteValueByName('__fields');
              }
              return value;
            }
          }),
          // 数据源选择
          ...this.dsBuilderMgr.collectFromBuilders((builder, builderFlag) => {
            return {
              type: 'container',
              visibleOn: `dsType == null || dsType === '${builderFlag}'`,
              body: builder.makeSourceSettingForm({
                feat: 'List',
                inCrud: true
              })
            };
          }),
          {
            name: 'placeholder',
            pipeIn: defaultValue('暂无数据'),
            type: 'input-text',
            label: '占位内容'
          }
        ]
      },
      {
        order: 10,
        title: '搜索设置',
        body: FilterTypes.map(item => {
          // 当前数据源可能不开启这个功能
          if (!builder.features.includes(item.value)) {
            return null;
          }

          const fields: any = [];
          // await builder.getContextFileds({
          //   schema: context.node.schema,
          //   feat: item.value,
          //   sourceKey: 'api'
          // });

          // 开关配置
          // const moreConfig = builder.makeFieldsSettingForm({
          //   feat: item.value,
          //   inCrud: true,
          //   inScaffold: false
          // });

          const base = {
            label: item.label,
            name: `__${item.value}`, // 没有真实作用，只是有这个才触发onChange
            pipeIn: (value: any, form: any) => {
              if (item.value === 'FuzzyQuery') {
                return this.isFeatActive(
                  form.data,
                  item.value,
                  'headerToolbar',
                  'footerToolvar'
                );
              }
              return this.isFeatActive(form.data, item.value, 'filter');
            },
            onChange: (
              value: boolean,
              oldValue: any,
              model: any,
              form: any
            ) => {
              const schema = cloneDeep(form.data);
              if (value === true) {
                if (item.value === 'FuzzyQuery') {
                  this.addFeatToToolbar(
                    schema,
                    item.resolveSchema(schema, builder),
                    'header',
                    'right'
                  );
                } else {
                  schema.filter && Array.isArray(schema.filter)
                    ? schema.filter.push(item.resolveSchema(schema, builder))
                    : (schema.filter = [item.resolveSchema(schema, builder)]);
                }
              } else if (value === false) {
                this.removeFeatSchema(schema, item.value);
              }
              form.setValues(schema);
              return undefined;
            }
          };
          return fields && fields.length
            ? {
                ...base,
                type: 'ae-switch-more',
                formType: 'extend',
                mode: 'normal',
                form: {
                  body: fields
                }
              }
            : getSchemaTpl('switch', base);
        })
      },
      {
        order: 20,
        title: '工具栏',
        body: [
          {
            type: 'ae-feature-control',
            label: false,
            features: this.filterOperators(builder, context.context),
            goFeatureComp: (feat: any) => {
              let node = context.context.node;
              if (node.isSecondFactor) {
                node = node.parent;
              }
              return findTree(
                node.children,
                item => item.schema.behavior === feat.value
              )?.id;
            },
            manager: this.manager,
            addable: true,
            addText: '添加操作',
            removeable: true
          }
        ]
      },
      getSchemaTpl('status', {readonly: true})
    ];
  }

  dsBuilderMgr: DSBuilderManager;

  // 关联渲染器名字
  rendererName = 'crud2';
  multifactor = true;
  $schema = '/schemas/CRUD2Schema.json';

  order = -1000;

  docLink = '/amis/zh-CN/components/crud';
  tags = ['数据容器'];

  scaffold: CRUD2Schema;

  /**
   * 获取脚手架中场景选择Tab
   */
  getScaffoldFeatureTab() {
    const generator = (feat: FeatOption, featGroup?: string) =>
      this.dsBuilderMgr.collectFromBuilders((builder, builderName) => {
        if (!builder.features.includes(feat.value)) {
          return null;
        }

        const content = this.makeFeatSetting(feat, builder, true);
        if (!content || content.length === 0) {
          return null;
        }

        const isFeatOpened = featGroup
          ? `data['${featGroup}'] && ~data['${featGroup}'].indexOf('${feat.value}')`
          : true;

        return {
          title: feat.label,
          visibleOn: `(!data.dsType || data.dsType === '${builderName}') && ${isFeatOpened}`,
          body: content
            .filter((i: any) => i)
            .map((formItem: object) => ({
              ...formItem,
              mode: 'normal'
            }))
        };
      });

    return flattenDeep([
      generator({
        label: '列表展示',
        value: 'List',
        resolveSchema() {}
      }),
      Tools.map(item => generator(item, 'tools')),
      FilterTypes.map(item => generator(item, 'filters')),
      DataOperators.map(item => generator(item, 'operators'))
    ]).filter(i => i);
  }

  name: string;

  /** 将数据资源和数据操作进行填充 */
  resolveListField(setting: any, schema: any, builder: DSBuilder) {}

  scaffoldFormCache?: ScaffoldForm;

  get scaffoldForm(): ScaffoldForm {
    if (this.scaffoldFormCache) {
      return this.scaffoldFormCache;
    }
    this.scaffoldFormCache = {
      title: `${this.name}创建向导`,
      mode: {
        mode: 'horizontal',
        horizontal: {
          leftFixed: 'sm'
        }
      },
      className: 'ae-Scaffold-Modal ae-formItemControl',
      stepsBody: true,
      body: [
        {
          title: '数据配置',
          body: [
            this.dsBuilderMgr.getDSSwitch({
              onChange: (value: any, oldValue: any, model: any, form: any) => {
                if (value !== oldValue) {
                  const data = form.data;
                  Object.keys(data).forEach(key => {
                    if (key.endsWith('Fields') || key.endsWith('api')) {
                      form.deleteValueByName(key);
                    }
                  });
                  form.deleteValueByName('__fields');
                }
                return value;
              }
            }),
            // 数据源选择
            ...this.dsBuilderMgr.collectFromBuilders((builder, builderFlag) => {
              return {
                type: 'container',
                visibleOn: `dsType == null || dsType === '${builderFlag}'`,
                body: flattenDeep([
                  builder.makeSourceSettingForm({
                    feat: 'List',
                    inScaffold: true,
                    inCrud: true
                  })
                ])
              };
            })
          ]
        },
        {
          title: '功能配置',
          body: [
            ...this.dsBuilderMgr.collectFromBuilders((builder, builderName) => {
              const check = (item: FeatOption) =>
                DSFeature[item.value] == null ||
                builder.features.includes(item.value);
              return {
                type: 'container',
                visibleOn: `dsType == null || dsType === '${builderName}'`,
                body: [
                  {
                    type: 'checkboxes',
                    label: '工具栏',
                    name: 'tools',
                    joinValues: false,
                    extractValue: true,
                    multiple: true,
                    options: Tools.filter(check)
                  },
                  {
                    type: 'checkboxes',
                    label: '条件查询',
                    name: 'filters',
                    multiple: true,
                    joinValues: false,
                    extractValue: true,
                    options: FilterTypes.filter(check)
                  },
                  {
                    type: 'checkboxes',
                    label: '数据操作',
                    name: 'operators',
                    multiple: true,
                    joinValues: false,
                    extractValue: true,
                    options: DataOperators.filter(check)
                  },
                  // 占位，最后一个form item没有间距
                  {
                    type: 'container'
                  }
                ]
              };
            }),
            {
              type: 'tabs',
              tabsMode: 'vertical',
              className: 'ae-Scaffold-Modal-Tabs',
              tabs: this.getScaffoldFeatureTab()
            }
          ]
        }
      ],
      pipeIn: (value: any) => {
        return (
          value?.$$m || {
            dsType: this.dsBuilderMgr.getDefaultBuilderName()
          }
        );
      },
      pipeOut: (value: any) => {
        // 决定组件基础配置和所使用的模式
        const schema: any = cloneDeep(this.scaffold);
        const builder = this.dsBuilderMgr.resolveBuilderBySetting(value);
        if (!builder) {
          return schema;
        }

        // list功能
        builder.resolveSourceSchema({
          schema,
          feat: 'List',
          setting: value,
          name: 'api',
          inCrud: true
        });

        schema.id = schema.id ?? generateNodeId(); // 先生成一个，方便其他流程生成事件动作
        value.id = schema.id; // 事件动作需要
        schema.$$m = value;

        if (value.filters) {
          schema.filter = [];
          FilterTypes.forEach(feat => {
            if (!value.filters.includes(feat.value)) {
              return;
            }
            if (feat.value === 'FuzzyQuery') {
              this.addFeatToToolbar(
                schema,
                feat.resolveSchema(value, builder),
                'header',
                'right'
              );
              return;
            }
            schema.filter.push(feat.resolveSchema(value, builder));
          });
        }

        if (value.tools) {
          Tools.concat()
            .reverse()
            .forEach(feat => {
              if (value.tools.includes(feat.value)) {
                this.addFeatToToolbar(
                  schema,
                  feat.resolveSchema(value, builder),
                  'header',
                  feat.align!
                );
              }
            });

          if (
            value.tools.find((obj: any) =>
              ['BulkEdit', 'BulkDelete'].includes(obj)
            )
          ) {
            schema.multiple = true;
            // schema.selectable = true;
            schema.rowSelection = this.resolveRowSelection(schema);
          }
        }

        this.resolveListField(value, schema, builder);

        this.addFeatToToolbar(
          schema,
          {
            type: 'pagination',
            behavior: 'Pagination',
            layout: ['total', 'perPage', 'pager', 'go']
          },
          'footer',
          'right'
        );

        return schema;
      },
      canRebuild: true
    };

    return this.scaffoldFormCache;
  }

  events: RendererPluginEvent[] = uniqBy(
    [...Table2RenderereEvent],
    'eventName'
  );

  actions: RendererPluginAction[] = uniqBy(
    [
      {
        actionType: 'search',
        actionLabel: '数据查询',
        description: '使用指定条件完成列表数据查询',
        descDetail: (info: any) => {
          return (
            <div>
              <span className="variable-right">{info?.__rendererLabel}</span>
              触发数据查询
            </div>
          );
        },
        schema: getArgsWrapper(
          /*
        {
          type: 'input-formula',
          variables: '${variables}',
          evalMode: false,
          variableMode: 'tabs',
          label: '查询条件',
          size: 'md',
          name: 'query',
          mode: 'horizontal'
        }
      */
          {
            name: 'query',
            label: '查询条件',
            type: 'ae-formulaControl',
            variables: '${variables}',
            size: 'md',
            mode: 'horizontal'
          }
        )
      },
      // {
      //   actionType: 'resetQuery',
      //   actionLabel: '重置查询',
      //   description: '重新恢复查询条件为初始值',
      //   descDetail: (info: any) => {
      //     return (
      //       <div>
      //         <span className="variable-right">{info?.__rendererLabel}</span>
      //         重置初始查询条件
      //       </div>
      //     );
      //   }
      // },
      {
        actionType: 'loadMore',
        actionLabel: '加载更多',
        description: '加载更多条数据到列表容器',
        descDetail: (info: any) => {
          return (
            <div>
              <span className="variable-right">{info?.__rendererLabel}</span>
              加载更多数据
            </div>
          );
        }
      },
      {
        actionType: 'startAutoRefresh',
        actionLabel: '启动自动刷新',
        description: '启动自动刷新'
      },
      {
        actionType: 'stopAutoRefresh',
        actionLabel: '停止自动刷新',
        description: '停止自动刷新'
      },
      ...Table2RendererAction
    ],
    'actionType'
  );

  previewSchema: any = {
    syncLocation: false,
    type: 'crud2',
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
        title: 'A',
        name: 'a'
      },
      {
        title: 'B',
        name: 'b'
      },
      {
        name: 'operation',
        title: '操作',
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

  getRendererInfo(
    context: RendererInfoResolveEventContext
  ): BasicRendererInfo | void {
    const {renderer, schema} = context;
    if (
      this.scaffold &&
      renderer.name === 'crud2' &&
      schema.mode === this.scaffold.mode
    ) {
      return super.getRendererInfo(context);
    }
  }

  async buildDataSchemas(node: EditorNodeType, region?: EditorNodeType) {
    const child: EditorNodeType = node.children.find(
      item => !!~['table2', 'cards', 'list'].indexOf(item.type)
    );

    let items;
    // 先从数据源获取可用字段
    const builder = this.dsBuilderMgr.resolveBuilderBySchema(
      node.schema,
      'api'
    );
    if (builder && node.schema.api) {
      const fields = await builder.getContextFileds({
        schema: node.schema,
        sourceKey: 'api',
        feat: 'List'
      });

      if (fields) {
        items = {
          type: 'object',
          properties: fromPairs(
            fields.map(field => {
              return [
                field.value,
                {
                  type: field.valueType || 'string',
                  title: field.label
                }
              ];
            })
          )
        };
      }
    }

    // 数据源没配置或者拿不到数据，从已配置的内容组合一下做兜底处理
    if (items == null) {
      const childDataSchema = await child?.info.plugin.buildDataSchemas?.(
        child,
        region
      );
      items = childDataSchema?.properties?.items;
    }

    const schema: any = {
      $id: 'crud2',
      type: 'object',
      properties: {
        ...items?.properties,
        items: {
          ...items,
          title: '全部数据'
        },
        selectedItems: {
          ...items,
          title: '选中数据'
        },
        unSelectedItems: {
          ...items,
          title: '未选中数据'
        },
        page: {
          type: 'number',
          title: '当前页码'
        },
        total: {
          type: 'number',
          title: '总数据条数'
        }
      }
    };

    return schema;
  }

  async getAvailableContextFields(
    scopeNode: EditorNodeType,
    node: EditorNodeType,
    region?: EditorNodeType
  ) {
    // 先从数据源获取可用字段
    const builder = this.dsBuilderMgr.resolveBuilderBySchema(
      scopeNode.schema,
      'api'
    );
    if (builder && scopeNode.schema.api) {
      return builder.getAvailableContextFileds(
        {
          schema: scopeNode.schema,
          sourceKey: 'api',
          feat: 'List'
        },
        node
      );
    }
  }

  resolveRowSelection(schema: any, multiple: boolean = true) {
    return {
      type: multiple ? 'checkbox' : 'radio',
      keyField:
        schema?.$$m?.__fields?.find((item: any) => item.isPrimayKey)?.key ||
        'id'
    };
  }
}

export class TableCRUDPlugin extends CRUD2Plugin {
  // 组件名称
  name = '表格';
  isBaseComponent = true;
  description =
    '用来实现对数据的增删改查，支持三种模式展示：table、cards和list. 负责数据的拉取，分页，单条操作，批量操作，排序，快速编辑等等功能。集成查询条件。';

  order = -1000;
  icon = 'fa fa-table';

  disabledRendererPlugin = true;

  previewSchema: any = generatePreviewSchema('table2');

  scaffold: any = {
    type: 'crud2',
    mode: 'table2',
    columns: [
      {
        name: 'id',
        title: 'ID',
        type: 'container',
        body: [
          {
            type: 'text'
          }
        ]
      },
      {
        name: 'engine',
        title: '示例',
        type: 'container',
        body: [
          {
            type: 'text'
          }
        ]
      }
    ]
  };

  panelTitle: '表格';

  addListPanelSetting(context: AfterBuildPanelBody) {
    const body = context.data as any;
    const builder = this.dsBuilderMgr.resolveBuilderBySchema(
      context.context.schema,
      'api'
    );

    body.tabs.forEach((tab: any) => {
      if (tab.title === '属性') {
        tab.body = [
          getSchemaTpl(
            'collapseGroup',
            this.sortPanelOrder([
              ...this.addBaseCrudPanel(context),
              {
                title: '列设置',
                order: 3,
                body: [
                  getSchemaTpl('switch', {
                    name: 'columnsTogglable',
                    label: tipedLabel(
                      '自定义显示列',
                      '自动即列数量大于10自动开启。'
                    ),
                    onChange: (
                      value: boolean,
                      oldValue: any,
                      model: any,
                      form: any
                    ) => {
                      const schema = cloneDeep(form.data);
                      if (value === true) {
                        this.addFeatToToolbar(
                          schema,
                          {type: 'column-toggler'},
                          'header',
                          'right'
                        );
                      } else {
                        deepRemove(
                          schema.headerToolbar,
                          item => item.type === 'column-toggler'
                        );
                        schema.columns.forEach((item: any) => {
                          if (item.toggled !== undefined) {
                            delete item.toggled;
                          }
                        });
                      }
                      form.setValues(schema);
                      return undefined;
                    }
                  }),
                  {
                    type: 'ae-feature-control',
                    label: false,
                    features: () => {
                      return this.filterColumns(builder, context.context);
                    },
                    goFeatureComp: (feat: any) => feat.value,
                    removeFeature: (feat: any) => {
                      this.manager.del(feat.value);
                    },
                    manager: this.manager,
                    addable: true,
                    removeable: true,
                    sortable: true,
                    onSort: (schema: any, e: any) => {
                      if (schema?.columns?.length > 1) {
                        schema.columns[e.oldIndex] = schema.columns.splice(
                          e.newIndex,
                          1,
                          schema.columns[e.oldIndex]
                        )[0];
                      }
                    },
                    checkableOn: 'data.columnsTogglable',
                    isItemChecked: (item: any, index: number, schema: any) => {
                      console.log('isItemChecked', item);
                      return schema.columns[index]?.toggled !== false;
                    },
                    onItemCheck: (
                      checked: boolean,
                      index: number,
                      schema: any
                    ) => {
                      schema.columns[index].toggled = checked;
                    },
                    customAction: (props: any) => {
                      const {onBulkChange, schema} = props;
                      return {
                        type: 'flex',
                        items: [
                          {
                            type: 'button',
                            label: '添加列',
                            level: 'link',
                            onClick: () => {
                              schema?.columns?.push({
                                title: '新添加列'
                              });
                              onBulkChange(schema);
                            }
                          },
                          {
                            type: 'button',
                            label: '添加操作列',
                            level: 'link',
                            onClick: () => {
                              schema?.columns?.push({
                                type: 'operation',
                                title: '操作',
                                buttons: [
                                  {
                                    label: '操作按钮',
                                    type: 'button',
                                    level: 'link'
                                  }
                                ]
                              });
                              onBulkChange(schema);
                            }
                          }
                        ],
                        justify: 'space-between',
                        alignItems: 'center',
                        direction: 'row'
                      };
                    }
                  }
                ]
              },
              {
                title: '表格设置',
                order: 90,
                body: [
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
                  getSchemaTpl('interval'),
                  getSchemaTpl('switch', {
                    name: 'syncLocation',
                    label: tipedLabel(
                      '同步地址栏',
                      '开启后会把查询条件数据和分页信息同步到地址栏中，页面中出现多个时，建议只保留一个同步地址栏，否则会相互影响。'
                    ),
                    pipeIn: defaultValue(true)
                  }),
                  getSchemaTpl('apiControl', {
                    mode: 'normal',
                    label: '快速保存',
                    name: 'quickSaveApi'
                  }),

                  getSchemaTpl('apiControl', {
                    mode: 'normal',
                    label: '快速保存单条',
                    name: 'quickSaveItemApi'
                  })
                ]
              },
              {
                title: '行设置',
                order: 80,
                body: [
                  getSchemaTpl('switch', {
                    label: '可选择',
                    name: 'rowSelection',
                    pipeIn: (item: any) => !!item,
                    pipeOut: (item: any) =>
                      item
                        ? this.resolveRowSelection(context.context.schema)
                        : undefined
                  }),
                  getSchemaTpl('switch', {
                    name: 'keepItemSelectionOnPageChange',
                    label: tipedLabel(
                      '保留选择项',
                      '默认切换页面、搜索后，用户选择项会被清空，开启此功能后会保留用户选择，可以实现跨页面批量操作。'
                    ),
                    visbileOn: 'this.selectable'
                  })
                ]
              }
            ])
          )
        ];
      }
    });
  }

  resolveListField(setting: any, schema: any, builder: DSBuilder) {
    // builder.resolveTableSchema({schema, setting, inCrud: true});

    schema.columns = builder.resolveViewSchema({
      setting,
      feat: 'List'
    });

    if (setting.operators?.length) {
      const operators: SchemaObject[] = [];
      DataOperators.forEach(feat => {
        if (setting.operators?.includes(feat.value)) {
          operators.push(feat.resolveSchema(setting, builder));
        }
      });

      schema.columns.push({
        type: 'operation',
        title: '操作',
        buttons: operators
      });
    }
  }
}

export class CardsCRUDPlugin extends CRUD2Plugin {
  // 组件名称
  name = '卡片列表';
  isBaseComponent = true;
  description =
    '围绕卡片列表的数据增删改查. 负责数据的拉取，分页，单条操作，批量操作，排序，快速编辑等等功能，集成查询条件。';

  order = -1000;
  icon = 'fa fa-list-alt';

  disabledRendererPlugin = true;

  previewSchema: any = generatePreviewSchema('cards');

  scaffold: any = {
    type: 'crud2',
    mode: 'cards',
    card: {
      type: 'card2',
      body: [
        {
          type: 'container',
          body: [
            {
              type: 'tpl',
              tpl: '标题',
              inline: false,
              style: {
                marginTop: '0',
                marginBottom: '0',
                paddingTop: '',
                paddingBottom: ''
              },
              wrapperComponent: 'h2'
            },
            {
              type: 'form',
              body: [
                {
                  type: 'static-tpl',
                  label: '字段',
                  tpl: '内容'
                }
              ]
            },
            {
              type: 'divider'
            },
            {
              type: 'button-group'
            }
            // {
            //   type: 'tpl',
            //   tpl: '副标题内容',
            //   inline: false,
            //   wrapperComponent: '',
            //   style: {
            //     color: '#9b9b9b',
            //     marginTop: '0',
            //     marginBottom: '0'
            //   }
            // }
          ]
          // style: {
          //   borderStyle: 'solid',
          //   borderColor: '#ebebeb',
          //   borderWidth: '1px',
          //   'borderRadius': '5px',
          //   'paddingTop': '10px',
          //   'paddingRight': '10px',
          //   'paddingBottom': '0',
          //   'paddingLeft': '10px'
          // }
        }
      ]
    }
  };

  panelTitle: '卡片列表';

  resolveListField(setting: any, schema: any, builder: DSBuilder) {
    let fields = setting.listFields;
    if (!fields || !fields.length) {
      return;
    }

    schema.card.body[0].body = builder.resolveViewSchema({
      setting,
      feat: 'List'
    });

    if (setting.operators?.length) {
      const operators: SchemaObject[] = [];
      DataOperators.forEach(feat => {
        if (setting.operators?.includes(feat.value)) {
          operators.push(feat.resolveSchema(setting, builder));
        }
      });

      schema.card.body.push({
        type: 'button-group',
        buttons: operators
      });
    }
  }

  /**填充一个数据操作 */
  fillOperatorSchema(schema: any, content: any) {
    let col = schema.columns.find((item: any) => item.type === 'operators');
    if (!col) {
      schema.columns.push({
        type: 'operation',
        title: '操作',
        buttons: [content]
      });
      return;
    }
    col.buttons.push(content);
  }

  /** 判断内容区是否有填充数据操作 */
  existOperator(feat: DSFeatureType, schema: any) {
    return findObj(schema.card.body, item => item.behavior === feat);
  }
}

export class ListCRUDPlugin extends CRUD2Plugin {
  // 组件名称
  name = '列表';
  isBaseComponent = true;
  description =
    '围绕列表的数据增删改查. 负责数据的拉取，分页，单条操作，批量操作，排序，快速编辑等等功能，集成查询条件。';

  order = -1000;
  icon = 'fa fa-list';

  disabledRendererPlugin = true;

  previewSchema: any = generatePreviewSchema('list');

  scaffold: any = {
    type: 'crud2',
    mode: 'list',
    listItem: {
      body: [
        {
          type: 'container',
          body: [
            {
              type: 'tpl',
              tpl: '标题',
              inline: false,
              style: {
                marginTop: '0',
                marginBottom: '0',
                paddingTop: '',
                paddingBottom: ''
              },
              wrapperComponent: 'h2'
            },
            {
              type: 'tpl',
              tpl: '副标题内容',
              inline: false,
              wrapperComponent: '',
              style: {
                color: '#9b9b9b',
                marginTop: '0',
                marginBottom: '0'
              }
            }
          ]
        }
      ]
    }
  };

  resolveListField(setting: any, schema: any, builder: DSBuilder) {
    let fields = setting.listFields;
    if (!fields || !fields.length) {
      return;
    }

    schema.listItem.body[0].body = builder.resolveViewSchema({
      setting,
      feat: 'List'
    });

    if (setting.operators?.length) {
      const operators: SchemaObject[] = [];
      DataOperators.forEach(feat => {
        if (setting.operators?.includes(feat.value)) {
          operators.push(feat.resolveSchema(setting, builder));
        }
      });

      schema.listItem.body.push({
        type: 'button-group',
        buttons: operators
      });
    }
  }

  /** 判断内容区是否有填充数据操作 */
  existOperator(feat: DSFeatureType, schema: any) {
    return findObj(schema.listItem.body, item => item.behavior === feat);
  }
}
// 还是得去掉注册，否则脚手架一些配置会从这边取
// registerEditorPlugin(TableCRUDPlugin);
// registerEditorPlugin(CardsCRUDPlugin);
// registerEditorPlugin(ListCRUDPlugin);
