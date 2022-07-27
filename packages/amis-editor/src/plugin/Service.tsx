import {Button} from 'amis';
import React from 'react';
import {getEventControlConfig} from '../renderer/event-control/helper';

import {
  getSchemaTpl,
  EditorManager,
  RendererPluginAction,
  RendererPluginEvent,
  registerEditorPlugin,
  BaseEventContext,
  BasePlugin,
  RegionConfig,
  DSBuilderManager
} from 'amis-editor-core';
import {flattenDeep} from 'lodash';

export class ServicePlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'service';
  $schema = '/schemas/ServiceSchema.json';

  // 组件名称
  name = '服务 Service';
  isBaseComponent = true;
  description =
    '功能性容器，可以用来加载数据或者加载渲染器配置。加载到的数据在容器可以使用。';
  docLink = '/amis/zh-CN/components/service';
  tags = ['功能', '数据容器'];
  icon = 'fa fa-server';
  pluginIcon = 'service-plugin';
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
      label: '内容区域',
      placeholder: '内容区域'
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

  panelTitle = '服务';

  dsBuilderMgr: DSBuilderManager;

  constructor(manager: EditorManager) {
    super(manager);
    this.dsBuilderMgr = new DSBuilderManager('service', 'api');
  }

  panelBodyCreator = (context: BaseEventContext) => {
    const dsTypeSelect = () =>
      this.dsBuilderMgr.getDSSwitch({
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

    return getSchemaTpl('tabs', [
      {
        title: '属性',
        className: 'p-none',
        body: [
          getSchemaTpl('collapseGroup', [
            {
              title: '基本',
              body: [
                dsTypeSelect(),
                ...this.dsBuilderMgr.collectFromBuilders(
                  (builder, builderFlag) => {
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
                  }
                ),
                getSchemaTpl('initFetch', {
                  visibleOn: 'this.api'
                }),
                getSchemaTpl('interval', {
                  visibleOn: 'this.api'
                }),
                getSchemaTpl('silentPolling'),
                getSchemaTpl('stopAutoRefreshWhen')
              ]
            },
            {
              title: '状态',
              body: [getSchemaTpl('visible')]
            },
            {
              title: '高级',
              body: [
                getSchemaTpl('apiControl', {
                  name: 'schemaApi',
                  label: 'Schema数据源'
                }),
                getSchemaTpl('initFetch', {
                  name: 'initFetchSchema',
                  label: '是否Schema初始加载',
                  visibleOn: 'this.schemaApi'
                }),
                {
                  type: 'divider'
                },
                getSchemaTpl('data'),
                {
                  type: 'divider'
                },
                {
                  type: 'js-editor',
                  allowFullscreen: true,
                  name: 'dataProvider',
                  label: '自定义函数获取数据',
                  description: '将会传递 data 和 setData 两个参数'
                },
                {
                  type: 'divider'
                },
                {
                  name: 'ws',
                  type: 'input-text',
                  label: 'WebSocket 实时更新接口'
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
}

registerEditorPlugin(ServicePlugin);
