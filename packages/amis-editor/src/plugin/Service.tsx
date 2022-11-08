import {render as amisRender} from 'amis';
import React from 'react';
import flattenDeep from 'lodash/flattenDeep';
import {
  EditorNodeType,
  jsonToJsonSchema,
  registerEditorPlugin,
  BaseEventContext,
  BasePlugin,
  RegionConfig,
  getSchemaTpl,
  DSBuilderManager,
  tipedLabel
} from 'amis-editor-core';
import type {
  EditorManager,
  RendererPluginAction,
  RendererPluginEvent
} from 'amis-editor-core';

import {getEventControlConfig} from '../renderer/event-control/helper';

export class ServicePlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'service';
  $schema = '/schemas/ServiceSchema.json';
  // 组件名称
  name = '服务';
  panelTitle = '服务';
  isBaseComponent = true;
  description =
    '功能性容器，可以用来加载数据或者加载渲染器配置。加载到的数据在容器可以使用。';
  docLink = '/amis/zh-CN/components/service';
  tags = ['数据容器'];
  icon = 'fa fa-cube';
  // pluginIcon = 'service-plugin';
  scaffold = {
    type: 'service',
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
      eventName: 'fetchInited',
      eventLabel: 'api 初始化数据',
      description: 'api 初始化完成'
    },
    {
      eventName: 'fetchSchemaInited',
      eventLabel: 'schemaApi 初始化数据',
      description: 'schemaApi 初始化完成'
    }
  ];

  actions: RendererPluginAction[] = [
    {
      actionType: 'reload',
      actionLabel: '重新加载',
      description: '触发组件数据刷新并重新渲染'
    },
    {
      actionType: 'rebuild',
      actionLabel: '重新构建',
      description: '触发schemaApi刷新，重新构建Schema'
    },
    {
      actionType: 'setValue',
      actionLabel: '变量赋值',
      description: '更新数据域数据'
    }
  ];

  dsBuilderMgr: DSBuilderManager;

  constructor(manager: EditorManager) {
    super(manager);

    this.dsBuilderMgr = new DSBuilderManager('service', 'api');
  }

  panelBodyCreator = (context: BaseEventContext) => {
    const dsManager = this.dsBuilderMgr;
    /** 数据来源选择器 */
    const dsTypeSelect = () =>
      dsManager.getDSSwitch({
        type: 'button-group-select',
        mode: 'horizontal',
        labelClassName: 'w-24',
        labelAlign: 'left',
        tiled: true,
        onChange: (value: any, oldValue: any, model: any, form: any) => {
          if (value !== oldValue) {
            const data = form.data;
            Object.keys(data).forEach(key => {
              if (key.endsWith('Fields') || key.toLowerCase().endsWith('api')) {
                form.deleteValueByName(key);
              }
            });
            form.deleteValueByName('__fields');
          }
          return value;
        }
      });
    /** 数据源配置 */
    const dsSetting = dsManager.collectFromBuilders((builder, builderFlag) => {
      return {
        type: 'container',
        visibleOn: `this.dsType == null || this.dsType === '${builderFlag}'`,
        body: flattenDeep([
          builder.makeSourceSettingForm({
            name: 'api',
            label: '数据源',
            feat: 'View',
            inScaffold: false,
            inCrud: false
          })
        ])
      };
    });

    return getSchemaTpl('tabs', [
      {
        title: '属性',
        className: 'p-none',
        body: [
          getSchemaTpl('collapseGroup', [
            {
              title: '基本',
              body: [
                getSchemaTpl('name', {
                  mode: 'horizontal',
                  horizontal: {
                    justify: true,
                    left: 2
                  }
                }),
                dsTypeSelect(),
                ...dsSetting
                // {
                //   children: (
                //     <Button
                //       level="info"
                //       size="sm"
                //       className="m-b-sm"
                //       block
                //       onClick={() => {
                //         // this.manager.showInsertPanel('body', context.id);
                //         this.manager.showRendererPanel('');
                //       }}
                //     >
                //       添加内容
                //     </Button>
                //   )
                // }
              ]
            },
            {
              title: '状态',
              body: [getSchemaTpl('visible')]
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
                {
                  type: 'divider'
                },
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
                    'typeof this.schemaApi === "string" ? this.schemaApi : this.schemaApi.url'
                }),
                {
                  type: 'divider'
                },
                {
                  name: 'ws',
                  type: 'input-text',
                  label: tipedLabel(
                    'WebSocket接口',
                    'Service 支持通过WebSocket(ws)获取数据，用于获取实时更新的数据。'
                  )
                },
                {
                  type: 'divider'
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

  rendererBeforeDispatchEvent(node: EditorNodeType, e: any, data: any) {
    if (e === 'fetchInited') {
      const scope = this.manager.dataSchema.getScope(`${node.id}-${node.type}`);
      const jsonschema: any = {
        $id: 'serviceFetchInitedData',
        ...jsonToJsonSchema(data)
      };

      scope?.removeSchema(jsonschema.$id);
      scope?.addSchema(jsonschema);
    }
  }
}

registerEditorPlugin(ServicePlugin);
