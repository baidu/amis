import React from 'react';
import DeepDiff from 'deep-diff';
import pick from 'lodash/pick';
import {render as amisRender} from 'amis';
import flattenDeep from 'lodash/flattenDeep';
import {
  EditorNodeType,
  JSONPipeOut,
  jsonToJsonSchema,
  registerEditorPlugin,
  BaseEventContext,
  BasePlugin,
  RegionConfig,
  getSchemaTpl,
  tipedLabel
} from 'amis-editor-core';
import {DSBuilderManager} from '../builder/DSBuilderManager';
import {DSFeatureEnum, ModelDSBuilderKey, ApiDSBuilderKey} from '../builder';
import {
  getEventControlConfig,
  getActionCommonProps,
  buildLinkActionDesc
} from '../renderer/event-control/helper';

import type {Schema} from 'amis-core';
import type {
  EditorManager,
  RendererPluginAction,
  RendererPluginEvent
} from 'amis-editor-core';

export class ServicePlugin extends BasePlugin {
  static id = 'ServicePlugin';
  // 关联渲染器名字
  rendererName = 'service';
  useLazyRender = true; // 使用懒渲染

  name = '服务Service';

  panelTitle = '服务Service';

  icon = 'fa fa-server';

  pluginIcon = 'service-plugin';

  panelIcon = 'service-plugin';

  $schema = '/schemas/ServiceSchema.json';

  isBaseComponent = true;

  order = -850;

  description =
    '功能性容器，可以用来加载数据或者加载渲染器配置。加载到的数据在容器可以使用。';

  searchKeywords = '功能型容器';

  docLink = '/amis/zh-CN/components/service';

  tags = ['数据容器'];

  scaffold = {
    type: 'service',
    /** region 区域的 placeholder 会撑开内容区 */
    body: []
  };
  previewSchema = {
    type: 'service',
    body: [
      {
        type: 'tpl',
        tpl: '内容区域',
        inline: false,
        className: 'bg-light wrapper'
      }
    ]
  };

  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: '内容区',
      placeholder: amisRender({
        type: 'wrapper',
        size: 'lg',
        body: {type: 'tpl', tpl: '内容区域'}
      })
    }
  ];

  events: RendererPluginEvent[] = [
    {
      eventName: 'init',
      eventLabel: '初始化',
      description: '组件实例被创建并插入 DOM 中时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              description: '当前数据域，可以通过.字段名读取对应的值'
            }
          }
        }
      ]
    },
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
      eventName: 'fetchSchemaInited',
      eventLabel: '初始化Schema接口请求完成',
      description: '远程初始化Schema接口请求完成时触发',
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
      actionType: 'rebuild',
      actionLabel: '重新构建',
      description: '触发schemaApi刷新，重新构建Schema',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            重新构建
            {buildLinkActionDesc(props.manager, info)}
            Schema
          </div>
        );
      }
    },
    {
      actionType: 'setValue',
      actionLabel: '变量赋值',
      description: '更新数据域数据',
      ...getActionCommonProps('setValue')
    }
  ];

  dsManager: DSBuilderManager;

  constructor(manager: EditorManager) {
    super(manager);
    this.dsManager = new DSBuilderManager(manager);
  }

  panelBodyCreator = (context: BaseEventContext) => {
    const dsManager = this.dsManager;
    /** 数据源控件 */
    const generateDSControls = () => {
      const dsTypeSelector = dsManager.getDSSelectorSchema(
        {
          type: 'select',
          mode: 'horizontal',
          horizontal: {
            justify: true,
            left: 'col-sm-4'
          },
          onChange: (value: any, oldValue: any, model: any, form: any) => {
            if (value !== oldValue) {
              const data = form.data;
              Object.keys(data).forEach(key => {
                if (
                  key?.toLowerCase()?.endsWith('fields') ||
                  key?.toLowerCase().endsWith('api')
                ) {
                  form.deleteValueByName(key);
                }
              });
              form.deleteValueByName('__fields');
              form.deleteValueByName('__relations');
              form.setValueByName('api', undefined);
            }
            return value;
          }
        },
        {schema: context?.schema, sourceKey: 'api'}
      );
      /** 默认数据源类型 */
      const defaultDsType = dsTypeSelector.value;
      const dsSettings = dsManager.buildCollectionFromBuilders(
        (builder, builderKey) => {
          return {
            type: 'container',
            visibleOn: `data.dsType == null ? '${builderKey}' === '${
              defaultDsType || ApiDSBuilderKey
            }' : data.dsType === '${builderKey}'`,
            body: flattenDeep([
              builder.makeSourceSettingForm({
                feat: 'View',
                renderer: 'service',
                inScaffold: false,
                sourceSettings: {
                  name: 'api',
                  label: '接口配置',
                  mode: 'horizontal',
                  ...(builderKey === 'api' || builderKey === 'apicenter'
                    ? {
                        horizontalConfig: {
                          labelAlign: 'left',
                          horizontal: {
                            justify: true,
                            left: 4
                          }
                        }
                      }
                    : {}),
                  useFieldManager: builderKey === ModelDSBuilderKey
                }
              })
            ])
          };
        }
      );

      return [dsTypeSelector, ...dsSettings];
    };

    return getSchemaTpl('tabs', [
      {
        title: '属性',
        className: 'p-none',
        body: [
          getSchemaTpl('collapseGroup', [
            {
              title: '基本',
              body: [
                getSchemaTpl('layout:originPosition', {value: 'left-top'}),
                ...generateDSControls()
              ]
            },
            {
              title: '高级',
              body: [
                getSchemaTpl('combo-container', {
                  type: 'input-kv',
                  mode: 'normal',
                  name: 'data',
                  label: '初始化静态数据'
                }),
                getSchemaTpl('apiControl', {
                  name: 'schemaApi',
                  label: tipedLabel(
                    'Schema数据源',
                    '配置schemaApi后，可以实现动态渲染页面内容'
                  )
                }),
                getSchemaTpl('initFetch', {
                  name: 'initFetchSchema',
                  label: '是否Schema初始加载',
                  visibleOn:
                    'typeof this.schemaApi === "string" ? this.schemaApi : this.schemaApi && this.schemaApi.url'
                }),
                {
                  name: 'ws',
                  type: 'input-text',
                  label: tipedLabel(
                    'WebSocket接口',
                    'Service 支持通过WebSocket(ws)获取数据，用于获取实时更新的数据。'
                  )
                },
                {
                  type: 'js-editor',
                  allowFullscreen: true,
                  name: 'dataProvider',
                  label: tipedLabel(
                    '自定义函数获取数据',
                    '对于复杂的数据获取情况，可以使用外部函数获取数据'
                  ),
                  placeholder:
                    '/**\n * @param data 上下文数据\n * @param setData 更新数据的函数\n * @param env 环境变量\n */\ninterface DataProvider {\n   (data: any, setData: (data: any) => void, env: any): void;\n}\n'
                }
              ]
            },
            {
              title: '状态',
              body: [getSchemaTpl('visible'), getSchemaTpl('hidden')]
            }
          ])
        ]
      },
      {
        title: '外观',
        body: [getSchemaTpl('className')]
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

  panelFormPipeOut = async (schema: any, oldSchema: any) => {
    const entity = schema?.api?.entity;

    if (!entity || schema?.dsType !== ModelDSBuilderKey) {
      return schema;
    }

    const builder = this.dsManager.getBuilderBySchema(schema);
    const observedFields = ['api'];
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
        renderer: 'service',
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

  patchSchema(schema: Schema) {
    return schema.hasOwnProperty('dsType') &&
      schema.dsType != null &&
      typeof schema.dsType === 'string'
      ? schema
      : {...schema, dsType: ApiDSBuilderKey};
  }

  async buildDataSchemas(
    node: EditorNodeType,
    region?: EditorNodeType,
    trigger?: EditorNodeType
  ) {
    let jsonschema: any = {
      ...jsonToJsonSchema(JSONPipeOut(node.schema.data ?? {}))
    };
    const pool = node.children.concat();

    while (pool.length) {
      const current = pool.shift() as EditorNodeType;
      const schema = current.schema;

      if (current.rendererConfig?.isFormItem && schema?.name) {
        const tmpSchema = await current.info.plugin.buildDataSchemas?.(
          current,
          undefined,
          trigger,
          node
        );
        jsonschema.properties[schema.name] = {
          ...tmpSchema,
          ...(tmpSchema?.$id ? {} : {$id: `${current.id}-${current.type}`})
        };
      } else if (!current.rendererConfig?.storeType) {
        pool.push(...current.children);
      }
    }

    return jsonschema;
  }

  rendererBeforeDispatchEvent(node: EditorNodeType, e: any, data: any) {
    if (e === 'fetchInited') {
      const scope = this.manager.dataSchema.getScope(`${node.id}-${node.type}`);
      const jsonschema: any = {
        $id: 'serviceFetchInitedData',
        ...jsonToJsonSchema(data.responseData)
      };

      scope?.removeSchema(jsonschema.$id);
      scope?.addSchema(jsonschema);
    }
  }

  async getAvailableContextFields(
    scopeNode: EditorNodeType,
    node: EditorNodeType,
    region?: EditorNodeType
  ) {
    const builder = this.dsManager.getBuilderBySchema(scopeNode.schema);

    if (builder && scopeNode.schema.api) {
      return builder.getAvailableContextFields(
        {
          schema: scopeNode.schema,
          sourceKey: 'api',
          feat: DSFeatureEnum.List
        },
        node
      );
    }
  }
}

registerEditorPlugin(ServicePlugin);
