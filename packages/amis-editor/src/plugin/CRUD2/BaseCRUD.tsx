/**
 * @file BaseCRUD
 * @desc CRUD2 配置面板的基类
 */

import React from 'react';
import DeepDiff from 'deep-diff';
import isFunction from 'lodash/isFunction';
import flattenDeep from 'lodash/flattenDeep';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import uniq from 'lodash/uniq';
import sortBy from 'lodash/sortBy';
import pick from 'lodash/pick';
import {toast, autobind, isObject} from 'amis';
import {
  BasePlugin,
  EditorManager,
  defaultValue,
  getSchemaTpl,
  tipedLabel
} from 'amis-editor-core';
import {
  DSBuilderManager,
  DSFeatureEnum,
  DSFeatureType,
  ModelDSBuilderKey,
  ApiDSBuilderKey
} from '../../builder';
import {
  getEventControlConfig,
  getArgsWrapper,
  getActionCommonProps,
  buildLinkActionDesc
} from '../../renderer/event-control/helper';
import {CRUD2Schema} from 'amis';
import {deepRemove, findObj, findSchema} from './utils';
import {
  ToolsConfig,
  FiltersConfig,
  OperatorsConfig,
  DefaultMaxDisplayRows
} from './constants';
import {FieldSetting} from '../../renderer/FieldSetting';

import type {IFormItemStore, IFormStore} from 'amis-core';
import type {CRUDScaffoldConfig} from '../../builder/type';
import type {
  ScaffoldForm,
  BuildPanelEventContext,
  EditorNodeType,
  RendererPluginEvent,
  RendererPluginAction
} from 'amis-editor-core';

/** 需要动态控制的属性 */
export type CRUD2DynamicControls = Partial<
  Record<
    'columns' | 'toolbar' | 'filters' | 'primaryField',
    (context: BuildPanelEventContext) => any
  >
>;
export class BaseCRUDPlugin extends BasePlugin {
  static id = 'CRUD2Plugin';

  rendererName = 'crud2';

  name = '表格2.0';

  panelTitle = '表格2.0';

  subPanelTitle = '表格2.0';

  icon = 'fa fa-table';

  panelIcon = 'fa fa-table';

  subPanelIcon = 'fa fa-table';

  pluginIcon = 'table-plugin';

  panelJustify = true;

  multifactor = true;

  order = -1000;

  $schema = '/schemas/CRUD2Schema.json';

  docLink = '/amis/zh-CN/components/table2';

  tags = ['数据容器'];

  events: RendererPluginEvent[];

  actions: RendererPluginAction[];

  scaffold: CRUD2Schema;

  dsManager: DSBuilderManager;

  constructor(
    manager: EditorManager,
    events?: RendererPluginEvent[],
    actions?: RendererPluginAction[]
  ) {
    super(manager);

    this.dsManager = new DSBuilderManager(manager);
    this.events = uniqBy([...(events || [])], 'eventName');
    this.actions = uniqBy(
      [
        {
          actionType: 'search',
          actionLabel: '数据查询',
          description: '使用指定条件完成列表数据查询',
          descDetail: (info: any, context: any, props: any) => {
            return (
              <div className="action-desc">
                触发
                {buildLinkActionDesc(props.manager, info)}
                数据查询
              </div>
            );
          },
          schema: getArgsWrapper({
            name: 'query',
            label: '查询条件',
            type: 'ae-formulaControl',
            variables: '${variables}',
            size: 'md',
            mode: 'horizontal'
          })
        },
        {
          actionType: 'loadMore',
          actionLabel: '加载更多',
          description: '加载更多条数据到列表容器',
          descDetail: (info: any, context: any, props: any) => {
            return (
              <div className="action-desc">
                加载
                {buildLinkActionDesc(props.manager, info)}
                更多数据
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
        {
          actionType: 'reload',
          actionLabel: '重新加载',
          description: '触发组件数据刷新并重新渲染',
          ...getActionCommonProps('reload')
        },
        ...(actions || [])
      ],
      'actionType'
    );
  }

  get scaffoldForm(): ScaffoldForm {
    return {
      title: `${this.name}创建向导`,
      mode: {
        mode: 'horizontal',
        horizontal: {
          leftFixed: 'sm'
        }
      },
      className:
        'ae-Scaffold-Modal ae-Scaffold-Modal--CRUD ae-Scaffold-Modal-content :AMISCSSWrapper', //  ae-formItemControl
      stepsBody: true,
      canSkip: true,
      canRebuild: true,
      body: [
        {
          title: '数据配置',
          body: [
            /** 数据源选择 */
            this.dsManager.getDSSelectorSchema({
              onChange: (value: any, oldValue: any, model: any, form: any) => {
                if (value !== oldValue) {
                  const data = form.data;

                  Object.keys(data).forEach(key => {
                    if (
                      key?.toLowerCase()?.endsWith('fields') ||
                      key?.toLowerCase()?.endsWith('api')
                    ) {
                      form.deleteValueByName(key);
                    }
                  });
                  form.deleteValueByName('__fields');
                  form.deleteValueByName('__relations');
                }
                return value;
              }
            }),
            /** 数据源配置 */
            ...this.dsManager.buildCollectionFromBuilders(
              (builder, builderKey) => {
                return {
                  type: 'container',
                  visibleOn: `!this.dsType || this.dsType === '${builderKey}'`,
                  body: flattenDeep([
                    builder.makeSourceSettingForm({
                      feat: DSFeatureEnum.List,
                      renderer: 'crud',
                      inScaffold: true,
                      sourceSettings: {
                        userOrders: true
                      }
                    }),
                    builder.makeFieldsSettingForm({
                      feat: DSFeatureEnum.List,
                      renderer: 'crud',
                      inScaffold: true
                    })
                  ])
                };
              }
            ),
            getSchemaTpl('primaryField', {
              visibleOn: `!this.dsType || this.dsType !== '${ModelDSBuilderKey}'`
            })
          ]
        },
        {
          title: '功能配置',
          body: [
            /** 功能场景选择 */
            ...this.dsManager.buildCollectionFromBuilders(
              (builder, builderKey) => {
                return {
                  type: 'container',
                  visibleOn: `dsType == null || dsType === '${builderKey}'`,
                  body: [
                    {
                      type: 'checkboxes',
                      label: '工具栏',
                      name: ToolsConfig.groupName,
                      joinValues: false,
                      extractValue: true,
                      multiple: true,
                      options: ToolsConfig.options.filter(item =>
                        builder.filterByFeat(item.value)
                      )
                    },
                    {
                      type: 'checkboxes',
                      label: '条件查询',
                      name: FiltersConfig.groupName,
                      multiple: true,
                      joinValues: false,
                      extractValue: true,
                      options: FiltersConfig.options.filter(item =>
                        builder.filterByFeat(item.value)
                      )
                    },
                    {
                      type: 'checkboxes',
                      label: '数据操作',
                      name: OperatorsConfig.groupName,
                      multiple: true,
                      joinValues: false,
                      extractValue: true,
                      options: OperatorsConfig.options.filter(item =>
                        builder.filterByFeat(item.value)
                      )
                    },
                    // 占位，最后一个form item没有间距
                    {
                      type: 'container'
                    }
                  ]
                };
              }
            ),
            /** 各场景字段设置 */
            {
              type: 'tabs',
              tabsMode: 'vertical',
              className: 'ae-Scaffold-Modal-tabs',
              tabs: this.getScaffoldFeatureTab()
            }
          ]
        }
      ],
      /** 用于重新构建的数据回填 */
      pipeIn: async (schema: any) => {
        /** 数据源类型 */
        const dsType = schema?.dsType ?? this.dsManager.getDefaultBuilderKey();
        const builder = this.dsManager.getBuilderByKey(dsType);

        if (!builder) {
          return {dsType};
        }

        const config = await builder.guessCRUDScaffoldConfig({schema});

        return {...config};
      },
      pipeOut: async (config: CRUDScaffoldConfig) => {
        const scaffold: any = cloneDeep(this.scaffold);
        const builder = this.dsManager.getBuilderByScaffoldSetting(config);

        if (!builder) {
          return scaffold;
        }

        const schema = await builder.buildCRUDSchema({
          feats: uniq(
            [
              DSFeatureEnum.List as 'List',
              ...(config.tools ?? []),
              ...(config.filters ?? []),
              ...(config.operators ?? [])
            ].filter(Boolean)
          ),
          renderer: 'crud',
          inScaffold: true,
          entitySource: config?.entitySource,
          fallbackSchema: scaffold,
          scaffoldConfig: config
        });

        /** 脚手架构建的 Schema 加个标识符，避免addChild替换 Schema ID */
        schema.__origin = 'scaffold';

        return schema;
      },
      validate: (data: CRUDScaffoldConfig, form: IFormStore) => {
        const feat = DSFeatureEnum.List;
        const builder = this.dsManager.getBuilderByScaffoldSetting(data);
        const featValue = builder?.getFeatValueByKey(feat);
        const fieldsKey = `${featValue}Fields`;
        const errors: Record<string, string> = {};

        if (
          data?.dsType === ModelDSBuilderKey ||
          builder?.key === ModelDSBuilderKey
        ) {
          return errors;
        }

        const fieldErrors = false;
        // FieldSetting.validator(form.data[fieldsKey]);

        if (fieldErrors) {
          errors[fieldsKey] = fieldErrors;
        }

        return errors;
      }
    };
  }

  /** 各场景字段设置 Schema */
  getScaffoldFeatureTab() {
    const tabs: {title: string; icon: string; body: any; visibleOn: string}[] =
      [];
    [
      {
        groupName: '',
        options: [
          {
            label: '列表展示',
            value: 'List',
            icon: 'fa fa-list'
          }
        ]
      },
      ToolsConfig,
      FiltersConfig,
      OperatorsConfig
    ].forEach(group => {
      group.options.forEach(
        (
          item: {value: DSFeatureType; label: string; icon: string},
          index: number
        ) => {
          this.dsManager.buildCollectionFromBuilders((builder, builderKey) => {
            if (!builder.features.includes(item.value)) {
              return null;
            }

            const tabContent =
              builderKey === ModelDSBuilderKey
                ? [
                    ...builder.makeFieldsSettingForm({
                      feat: item.value,
                      renderer: 'crud',
                      inScaffold: true
                    })
                  ]
                : [
                    ...(item.value === 'Edit'
                      ? /** CRUD的编辑单条需要初始化接口 */ builder.makeSourceSettingForm(
                          {
                            feat: item.value,
                            renderer: 'crud',
                            inScaffold: true,
                            sourceKey: 'initApi'
                          }
                        )
                      : !['List', 'SimpleQuery'].includes(item.value)
                      ? builder.makeSourceSettingForm({
                          feat: item.value,
                          renderer: 'crud',
                          inScaffold: true
                        })
                      : []),
                    ...builder.makeFieldsSettingForm({
                      feat: item.value,
                      renderer: 'crud',
                      inScaffold: true,
                      fieldSettings: {
                        renderLabel: false
                      }
                    })
                  ];

            if (!tabContent || tabContent.length === 0) {
              return null;
            }

            const groupName = group.groupName;
            const extraVisibleOn = groupName
              ? `data["${groupName}"] && ~data['${groupName}'].indexOf('${item.value}')`
              : true;

            tabs.push({
              title: item.label,
              icon: item.icon,
              visibleOn: `(!this.dsType || this.dsType === '${builderKey}') && ${extraVisibleOn}`,
              body: tabContent
                .filter(Boolean)
                .map(formItem => ({...formItem, mode: 'normal'}))
            });

            return;
          });
        }
      );
    });

    return tabs;
  }

  protected _dynamicControls: CRUD2DynamicControls = {
    /** 列配置 */
    columns: context => this.renderColumnsControl(context),
    /** 工具栏配置 */
    toolbar: context => this.renderToolbarCollapse(context),
    /** 搜索栏 */
    filters: context => this.renderFiltersCollapse(context),
    /** 主键 */
    primaryField: context => getSchemaTpl('primaryField')
  };

  /** 需要动态控制的控件 */
  get dynamicControls() {
    return this._dynamicControls;
  }

  set dynamicControls(controls: CRUD2DynamicControls) {
    if (!controls || !isObject(controls)) {
      throw new Error(
        '[amis-editor][CRUD2Plugin] dynamicControls的值必须是一个对象'
      );
    }

    this._dynamicControls = {...this._dynamicControls, ...controls};
  }

  /** CRUD公共配置面板 */
  baseCRUDPanelBody = (context: BuildPanelEventContext) => {
    return getSchemaTpl('tabs', [
      this.renderPropsTab(context),
      // this.renderStylesTab(context),
      this.renderEventTab(context)
    ]);
  };

  /** 拆解一下 CURD 的基础面板配置，方便不同 mode 下模块化组合 */
  /** 属性面板 */
  renderPropsTab(context: BuildPanelEventContext) {
    /** 动态加载的配置集合 */
    const dc = this.dynamicControls;

    return {
      title: '属性',
      className: 'p-none',
      body: [
        getSchemaTpl(
          'collapseGroup',
          [
            /** 基本配置类别 */
            this.renderBasicPropsCollapse(context),
            /** 列设置类别 */
            isFunction(dc.columns) ? dc.columns(context) : dc.columns,
            /** 搜索类别 */
            isFunction(dc.filters) ? dc.filters(context) : dc.filters,
            /** 工具栏类别 */
            isFunction(dc.toolbar) ? dc.toolbar(context) : dc.toolbar,
            /** 分页类别 */
            this.renderPaginationCollapse(context),
            /** 其他类别 */
            this.renderOthersCollapse(context),
            /** 状态类别 */
            {
              title: '状态',
              body: [getSchemaTpl('hidden'), getSchemaTpl('visible')]
            },
            this.renderMockPropsCollapse(context)
          ].filter(Boolean)
        )
      ]
    };
  }

  /** 基础配置 */
  renderBasicPropsCollapse(context: BuildPanelEventContext) {
    /** 动态加载的配置集合 */
    const dc = this.dynamicControls;
    /** 数据源控件 */
    const generateDSControls = () => {
      /** 数据源类型 */
      const dsTypeSelector = this.dsManager.getDSSelectorSchema(
        {
          type: 'select',
          label: '数据源',
          onChange: (
            value: string,
            oldValue: string,
            model: IFormItemStore,
            form: IFormStore
          ) => {
            if (value !== oldValue) {
              const data = form.data;

              Object.keys(data).forEach(key => {
                if (
                  key?.toLowerCase()?.endsWith('fields') ||
                  key?.toLowerCase()?.endsWith('api')
                ) {
                  form.deleteValueByName(key);
                }
              });
              form.deleteValueByName('__fields');
              form.deleteValueByName('__relations');
            }
            return value;
          }
        },
        {schema: context?.schema, sourceKey: 'api'}
      );
      /** 默认数据源类型 */
      const defaultDsType = dsTypeSelector.value;
      /** 数据源配置 */
      const dsSettings = this.dsManager.buildCollectionFromBuilders(
        (builder, builderKey) => {
          return {
            type: 'container',
            visibleOn: `this.dsType == null ? '${builderKey}' === '${
              defaultDsType || ApiDSBuilderKey
            }' : this.dsType === '${builderKey}'`,
            body: builder.makeSourceSettingForm({
              feat: 'List',
              renderer: 'crud',
              inScaffold: false,
              sourceSettings: {
                userOrders: true
              }
            }),
            /** 因为会使用 container 包裹，所以加一个 margin-bottom */
            className: 'mb-3'
          };
        }
      );

      return [dsTypeSelector, ...dsSettings];
    };

    return {
      title: '基本',
      order: 1,
      body: [
        ...generateDSControls(),
        /** 主键配置，TODO：支持联合主键 */
        dc?.primaryField?.(context),
        /** 可选择配置，这里的配置会覆盖底层 Table 的 rowSelection 中的配置 */
        getSchemaTpl('switch', {
          name: 'selectable',
          label: tipedLabel('可选择', '开启后支持选择表格行数据'),
          pipeIn: (value: boolean | undefined, formStore: IFormStore) => {
            if (typeof value === 'boolean') {
              return value;
            }

            const rowSelection = formStore?.data?.rowSelection;
            return rowSelection && isObject(rowSelection);
          }
        }),
        {
          type: 'container',
          className: 'ae-ExtendMore mb-3',
          visibleOn:
            "this.selectable || (this.rowSelection && this.rowSelection?.type !== 'radio')",
          body: [
            getSchemaTpl('switch', {
              name: 'multiple',
              label: '可多选',
              pipeIn: (value: boolean | undefined, formStore: IFormStore) => {
                if (typeof value === 'boolean') {
                  return value;
                }

                const rowSelection = formStore?.data?.rowSelection;

                return rowSelection && isObject(rowSelection)
                  ? rowSelection.type !== 'radio'
                  : false;
              }
            })
          ]
        },
        getSchemaTpl('tablePlaceholder'),
        getSchemaTpl('switch', {
          name: 'syncLocation',
          label: tipedLabel(
            '同步地址栏',
            '开启后会把查询条件数据和分页信息同步到地址栏中，页面中出现多个时，建议只保留一个同步地址栏，否则会相互影响。'
          ),
          pipeIn: defaultValue(true)
        })
      ]
    };
  }

  @autobind
  renderColumnsControl(context: BuildPanelEventContext) {
    const builder = this.dsManager.getBuilderBySchema(context.node.schema);

    return {
      title: '列设置',
      order: 5,
      body: [
        {
          type: 'ae-crud-column-control',
          name: 'columns',
          nodeId: context.id,
          builder
        }
      ]
    };
  }

  @autobind
  renderToolbarCollapse(context: BuildPanelEventContext) {
    const builder = this.dsManager.getBuilderBySchema(context.node.schema);

    return {
      order: 20,
      title: '工具栏',
      body: [
        {
          type: 'ae-crud-toolbar-control',
          name: 'headerToolbar',
          nodeId: context.id,
          builder
        }
      ]
    };
  }

  @autobind
  renderFiltersCollapse(context: BuildPanelEventContext) {
    const builder = this.dsManager.getBuilderBySchema(context.node.schema);
    const collection: any[] = [];
    const order = [
      DSFeatureEnum.SimpleQuery,
      DSFeatureEnum.AdvancedQuery,
      DSFeatureEnum.FuzzyQuery
    ] as DSFeatureType[];
    const sortedFeats = sortBy(builder.features, [feat => order.indexOf(feat)]);

    sortedFeats.forEach(feat => {
      if (/Query$/.test(feat)) {
        collection.push({
          type: 'ae-crud-filters-control',
          name:
            feat === DSFeatureEnum.SimpleQuery ||
            feat === DSFeatureEnum.AdvancedQuery
              ? 'filter'
              : feat === DSFeatureEnum.FuzzyQuery
              ? 'headerToolbar'
              : undefined,
          label:
            feat === DSFeatureEnum.SimpleQuery
              ? '简单查询'
              : feat === DSFeatureEnum.AdvancedQuery
              ? '高级查询'
              : '模糊查询',
          nodeId: context.id,
          feat: feat,
          builder
        });
      }
    });

    return collection.length > 0
      ? {
          order: 10,
          title: '搜索设置',
          body: collection
        }
      : undefined;
  }

  /** 分页类别 */
  renderPaginationCollapse(context: BuildPanelEventContext) {
    const isPagination = 'this.loadType === "pagination"';
    const isInfinity = 'this.loadType === "more"';

    return {
      order: 30,
      title: '分页设置',
      body: [
        {
          label: '分页模式',
          type: 'select',
          name: 'loadType',
          options: [
            {
              label: '无',
              value: ''
            },
            {
              label: '分页',
              value: 'pagination'
            },
            {
              label: '加载更多',
              value: 'more'
            }
          ],
          pipeIn: (data: any) => data || '',
          pipeOut: (data: string) => {
            return data;
          },
          onChange: (value: string, oldValue: any, model: any, form: any) => {
            const schema = cloneDeep(form.data);
            if (oldValue) {
              deepRemove(schema, item => {
                return oldValue === 'more'
                  ? item.behavior === 'loadMore'
                  : item.type === 'pagination';
              });
            }

            if (value) {
              // 新插入的默认放在 footerToolbar 中分栏 的第二栏的最后，没有位置的话向上缺省
              // oldValue && deepRemove(schema);
              const newCompSchema =
                value === 'pagination'
                  ? {
                      type: 'pagination',
                      behavior: 'Pagination',
                      layout: ['total', 'perPage', 'pager'],
                      perPageAvailable: [10, 20, 50, 100]
                    }
                  : schema.pullRefresh.disabled
                  ? null
                  : {
                      type: 'button',
                      behavior: 'loadMore',
                      label: '加载更多',
                      onEvent: {
                        click: {
                          actions: [
                            {
                              componentId: schema.id,
                              groupType: 'component',
                              actionType: 'loadMore'
                            }
                          ],
                          weight: 0
                        }
                      }
                    };

              newCompSchema &&
                this.addFeatToToolbar(schema, newCompSchema, 'footer', 'right');
            }
            form.setValues({
              perPage: value !== 'more' ? undefined : schema.perPage,
              footerToolbar: schema.footerToolbar,
              headerToolbar: schema.headerToolbar
            });
          }
        },
        {
          type: 'container',
          visibleOn: 'this.loadType === "more"',
          body: [
            {
              type: 'switch',
              name: 'pullRefresh.disabled',
              label: '禁用加载更多',
              pipeIn: (value: any) => !!value,
              pipeOut: (value: boolean) => value,
              onChange: (
                value: string,
                oldValue: any,
                model: any,
                form: any
              ) => {
                const schema = cloneDeep(form.data);
                if (value) {
                  deepRemove(schema, item => {
                    return item.behavior === 'loadMore';
                  });
                } else {
                  this.addFeatToToolbar(
                    schema,
                    {
                      type: 'button',
                      behavior: 'loadMore',
                      label: '加载更多',
                      onEvent: {
                        click: {
                          actions: [
                            {
                              componentId: schema.id,
                              groupType: 'component',
                              actionType: 'loadMore'
                            }
                          ],
                          weight: 0
                        }
                      }
                    },
                    'footer',
                    'right'
                  );
                }

                form.setValues({
                  footerToolbar: schema.footerToolbar
                });
              }
            },
            {
              type: 'switch',
              name: 'pullRefresh.showIcon',
              label: '显示图标',
              value: true,
              visibleOn: '!data.pullRefresh?.disabled'
            },
            {
              type: 'switch',
              name: 'pullRefresh.showText',
              label: '显示文本',
              value: true,
              visibleOn: '!data.pullRefresh?.disabled'
            },
            getSchemaTpl('icon', {
              name: 'pullRefresh.iconType',
              label: tipedLabel(
                '图标类型',
                '支持 fontawesome v4 图标、iconfont 图标。如需使用 fontawesome v5/v6 版本,需设置 vendor 为空字符串。默认为 loading-outline'
              ),
              placeholder: '默认为loading-outline',
              visibleOn:
                '!data.pullRefresh?.disabled && data.pullRefresh?.showIcon'
            }),
            getSchemaTpl('theme:colorPicker', {
              name: 'pullRefresh.color',
              label: '文字和图标颜色',
              placeholder: '默认为#777777',
              visibleOn: '!data.pullRefresh?.disabled'
            }),
            {
              type: 'select',
              name: 'pullRefresh.dataAppendTo',
              label: '新数据追加位置',
              options: [
                {label: '底部', value: 'bottom'},
                {label: '顶部', value: 'top'}
              ],
              value: 'bottom',
              visibleOn: '!data.pullRefresh?.disabled'
            },
            {
              type: 'input-number',
              name: 'pullRefresh.minLoadingTime',
              label: '最短加载时间(ms)',
              min: 0,
              step: 100,
              visibleOn: '!data.pullRefresh?.disabled'
            },
            {
              type: 'select',
              name: 'pullRefresh.gestureDirection',
              label: '手势方向',
              options: [
                {label: '向上', value: 'up'},
                {label: '向下', value: 'down'}
              ],
              value: 'up',
              visibleOn: '!data.pullRefresh?.disabled'
            },
            {
              type: 'fieldset',
              title: '移动端下拉刷新文案配置',
              size: 'base',
              visibleOn:
                '!data.pullRefresh?.disabled && data.pullRefresh?.showText',
              body: [
                {
                  type: 'input-text',
                  name: 'pullRefresh.contentText.normalText',
                  label: '默认文字'
                },
                {
                  type: 'input-text',
                  name: 'pullRefresh.contentText.pullingText',
                  label: '下拉过程文字'
                },
                {
                  type: 'input-text',
                  name: 'pullRefresh.contentText.loosingText',
                  label: '释放刷新文字'
                },
                {
                  type: 'input-text',
                  name: 'pullRefresh.contentText.loadingText',
                  label: '加载中文字'
                },
                {
                  type: 'input-text',
                  name: 'pullRefresh.contentText.successText',
                  label: '加载成功文字'
                },
                {
                  type: 'input-text',
                  name: 'pullRefresh.contentText.completedText',
                  label: '加载完成文字'
                }
              ]
            }
          ]
        },
        getSchemaTpl('switch', {
          name: 'loadDataOnce',
          label: '前端分页',
          visibleOn: isPagination
        }),
        getSchemaTpl('switch', {
          name: 'loadDataOnceFetchOnFilter',
          label: tipedLabel(
            '过滤时刷新',
            '在开启前端分页时，表头过滤后是否重新请求初始化 API'
          ),
          visibleOn: isPagination + ' && this.loadDataOnce'
        }),
        getSchemaTpl('switch', {
          name: 'keepItemSelectionOnPageChange',
          label: tipedLabel(
            '保留选择项',
            '默认切换页面、搜索后，用户选择项会被清空，开启此功能后会保留用户选择，可以实现跨页面批量操作。'
          ),
          pipeIn: defaultValue(false),
          visibleOn: isPagination
        }),
        getSchemaTpl('switch', {
          name: 'autoJumpToTopOnPagerChange',
          label: tipedLabel('翻页后回到顶部', '当切分页的时候，是否自动跳顶部'),
          pipeIn: defaultValue(true),
          visibleOn: isPagination
        }),
        {
          name: 'perPage',
          type: 'input-number',
          label: tipedLabel(
            '每页数量',
            '无限加载时，根据此项设置其每页加载数量，留空则默认10条'
          ),
          clearValueOnEmpty: true,
          clearable: true,
          pipeIn: defaultValue(10),
          visibleOn: isInfinity
        },
        {
          type: 'button',
          label: '点击编辑分页组件',
          block: true,
          className: 'mb-1',
          level: 'enhance',
          visibleOn: 'this.loadType === "pagination"',
          onClick: () => {
            const findPage: any = findSchema(
              context?.node?.schema ?? {},
              item =>
                item.type === 'pagination' || item.behavior === 'Pagination',
              'headerToolbar',
              'footerToolbar'
            );

            if (!findPage || !findPage.$$id) {
              toast.error('未找到分页组件');
              return;
            }
            this.manager.setActiveId(findPage.$$id);
          }
        }
      ]
    };
  }

  /** 其他类别 */
  renderOthersCollapse(context: BuildPanelEventContext) {
    return {
      order: 25,
      title: '其他',
      body: [
        {
          type: 'ae-switch-more',
          mode: 'normal',
          formType: 'extend',
          visibleOn: 'this.api',
          label: tipedLabel(
            '接口轮询',
            '开启初始化接口轮询，开启后会按照设定的时间间隔轮询调用接口'
          ),
          autoFocus: false,
          form: {
            body: [
              {
                type: 'input-number',
                name: 'interval',
                label: tipedLabel('轮询间隔', '定时刷新间隔，单位 ms'),
                step: 10,
                min: 1000
              },
              getSchemaTpl('expressionFormulaControl', {
                name: 'stopAutoRefreshWhen',
                label: tipedLabel(
                  '停止条件',
                  '定时刷新停止表达式，条件满足后则停止定时刷新，否则会持续轮询调用初始化接口。'
                ),
                visibleOn: '!!this.interval'
              }),
              getSchemaTpl('switch', {
                name: 'stopAutoRefreshWhenModalIsOpen',
                label: tipedLabel(
                  '模态窗口期间停止',
                  '当页面中存在弹窗时停止接口轮询，避免中断操作'
                )
              })
            ]
          }
        },
        getSchemaTpl('switch', {
          name: 'silentPolling',
          label: tipedLabel('静默拉取', '刷新时是否隐藏加载动画'),
          pipeIn: defaultValue(false)
        })
      ]
    };
  }

  renderMockPropsCollapse(context: BuildPanelEventContext) {
    return {
      title: 'Mock配置',
      order: 35,
      body: [
        {
          type: 'switch',
          label: tipedLabel(
            '数据Mock',
            '开启后，当数据源为空时，会使用 Mock 数据'
          ),
          name: 'editorSetting.mock.enable',
          value: true
        },
        {
          type: 'input-number',
          label: tipedLabel(
            '最大展示行数',
            '设置后，会按照设置数量展示数据，可以提高设计态渲染速度，降低表格高度，便于布局设置。设置为<code>-1</code>则不限制'
          ),
          name: 'editorSetting.mock.maxDisplayRows',
          step: 1,
          min: -1,
          resetValue: -1,
          value: DefaultMaxDisplayRows
        }
      ]
    };
  }

  /** 外观面板 */
  renderStylesTab(context: BuildPanelEventContext) {
    return {
      title: '外观',
      className: 'p-none',
      body: getSchemaTpl('collapseGroup', [
        getSchemaTpl('style:classNames', {
          isFormItem: false,
          schema: [
            getSchemaTpl('className', {
              name: 'bodyClassName',
              label: '表格区域'
            }),

            getSchemaTpl('className', {
              name: 'headerToolbarClassName',
              label: '顶部工具栏'
            }),

            getSchemaTpl('className', {
              name: 'footerToolbarClassName',
              label: '底部工具栏'
            })
          ]
        })
      ])
    };
  }

  /** 事件面板 */
  renderEventTab(context: BuildPanelEventContext) {
    return {
      title: '事件',
      className: 'p-none',
      body: [
        getSchemaTpl('eventControl', {
          name: 'onEvent',
          ...getEventControlConfig(this.manager, context)
        })
      ]
    };
  }

  /** 重新构建 API */
  panelFormPipeOut = async (schema: any, oldSchema: any) => {
    const entity = schema?.api?.entity;

    if (!entity || schema?.dsType !== ModelDSBuilderKey) {
      return schema;
    }

    const builder = this.dsManager.getBuilderBySchema(schema);
    const observedFields = [
      'api',
      'quickSaveApi',
      'quickSaveItemApi',
      'columns',
      'dsType',
      'primaryField',
      'filter',
      'headerToolbar',
      'footerToolbar',
      'columns'
    ];
    const diff = DeepDiff.diff(
      pick(oldSchema, observedFields),
      pick(schema, observedFields)
    );

    if (!diff) {
      return schema;
    }

    try {
      const updatedSchema = await builder.buildApiSchema({
        schema,
        renderer: 'crud',
        sourceKey: 'api',
        apiSettings: {
          diffConfig: {
            enable: true,
            schemaDiff: diff
          }
        }
      });
      return updatedSchema;
    } catch (e) {
      console.error(e);
    }

    return schema;
  };

  emptyContainer = (align?: 'left' | 'right', body: any[] = []) => ({
    type: 'container',
    body,
    wrapperBody: false,
    style: {
      flexGrow: 1,
      flex: '1 1 auto',
      position: 'static',
      display: 'flex',
      flexBasis: 'auto',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignItems: 'stretch',
      ...(align
        ? {
            justifyContent: align === 'left' ? 'flex-start' : 'flex-end'
          }
        : {})
    }
  });

  emptyFlex = (items: any[] = []) => ({
    type: 'flex',
    items,
    style: {
      position: 'static'
    },
    direction: 'row',
    justify: 'flex-start',
    alignItems: 'stretch'
  });

  // headerToolbar 和 footerToolbar 布局换成 flex 包裹 container
  addFeatToToolbar(
    schema: any,
    content: any,
    position: 'header' | 'footer',
    align: 'left' | 'right'
  ) {
    const region = `${position}Toolbar`;
    if (
      !schema[region] ||
      isEmpty(schema[region]) ||
      !Array.isArray(schema[region])
    ) {
      const isArr = Array.isArray(schema[region]);
      const newSchema = this.emptyFlex([
        this.emptyContainer(
          'left',
          isArr || !schema[region] ? [] : [schema[region]]
        ),
        this.emptyContainer('right')
      ]);

      (isArr && schema[region].push(newSchema)) ||
        (schema[region] = [newSchema]);
    }

    // 尝试放到左面第一个，否则只能放外头了
    try {
      // 优先判断没有右边列的情况，避免都走到catch里造成嵌套层数过多的问题
      if (align === 'right' && schema[region][0].items.length < 2) {
        schema[region][0].items.push(this.emptyContainer('right'));
      }

      schema[region][0].items[
        align === 'left' ? 0 : schema[region][0].items.length - 1
      ].body.push(content);
    } catch (e) {
      const olds = [...schema[region]];
      schema[region].length = 0;
      schema[region].push(
        this.emptyFlex([
          this.emptyContainer('left', olds),
          this.emptyContainer('right', content)
        ])
      );
    }
  }

  async buildDataSchemas(
    node: EditorNodeType,
    region?: EditorNodeType,
    trigger?: EditorNodeType
  ) {
    const child: EditorNodeType = node.children.find(
      item => !!~['table2', 'cards', 'list'].indexOf(item.type)
    );

    if (!child?.info?.plugin?.buildDataSchemas) {
      return;
    }

    const tmpSchema = await child.info.plugin.buildDataSchemas?.(
      child,
      region,
      trigger,
      node
    );

    const childDataSchema = {
      ...tmpSchema,
      ...(tmpSchema?.$id ? {} : {$id: `${child.id}-${child.type}`})
    };

    const items =
      childDataSchema?.properties?.rows ?? childDataSchema?.properties?.items;
    const schema: any = {
      $id: 'crud2',
      type: 'object',
      properties: {
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
    const builder = this.dsManager.getBuilderBySchema(scopeNode.schema);

    if (builder && scopeNode.schema.api) {
      return builder.getAvailableContextFields(
        {
          schema: scopeNode.schema,
          sourceKey: 'api',
          feat: scopeNode.schema?.feat ?? 'List'
        },
        node
      );
    }
  }

  generateScaffold(mode: 'table2' | 'cards' | 'list') {
    let schema: any;

    if (mode === 'table2') {
      schema = {
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
    } else if (mode === 'cards') {
      schema = {
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
    } else if (mode === 'list') {
      schema = {
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
    }

    return schema;
  }

  /** 生成预览 Schema */
  generatePreviewSchema = (mode: 'table2' | 'cards' | 'list') => {
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
}
