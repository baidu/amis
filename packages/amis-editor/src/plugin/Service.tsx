import {Button} from 'amis';
import React from 'react';
import {registerEditorPlugin} from 'amis-editor-core';
import {BaseEventContext, BasePlugin, RegionConfig} from 'amis-editor-core';
import {getSchemaTpl} from 'amis-editor-core';
import {getEventControlConfig} from '../util';

import type {
  RendererPluginAction,
  RendererPluginEvent
} from 'amis-editor-core';

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
  tags = ['功能'];
  icon = 'fa fa-server';
  pluginIcon = 'service-plugin';
  scaffold = {
    type: 'service',
    body: [
      {
        type: 'tpl',
        tpl: '内容',
        inline: false
      }
    ]
  };
  previewSchema = {
    type: 'tpl',
    tpl: '功能性组件，用于数据拉取。'
  };

  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: '内容区'
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

  panelBodyCreator = (context: BaseEventContext) => {
    return getSchemaTpl('tabs', [
      {
        title: '属性',
        className: 'p-none',
        body: [
          getSchemaTpl('collapseGroup', [
            {
              title: '基本',
              body: [
                getSchemaTpl('name'),
                {
                  children: (
                    <Button
                      level="info"
                      size="sm"
                      className="m-b-sm"
                      block
                      onClick={() => {
                        // this.manager.showInsertPanel('body', context.id);
                        this.manager.showRendererPanel('');
                      }}
                    >
                      添加内容
                    </Button>
                  )
                }
              ]
            },
            {
              title: '数据接口',
              body: [
                getSchemaTpl('apiControl', {
                  name: 'api',
                  label: '数据接口',
                  messageDesc:
                    '设置 service 默认提示信息，当 service 没有返回 msg 信息时有用，如果 service 返回携带了 msg 值，则还是以 service 返回为主'
                }),
                {
                  name: 'ws',
                  type: 'input-text',
                  label: 'WebSocket 实时更新接口'
                },
                /** initFetchOn可以通过api的sendOn属性控制 */
                getSchemaTpl('switch', {
                  name: 'initFetch',
                  label: '数据接口初始加载',
                  visibleOn: 'this.api'
                }),
                {
                  name: 'interval',
                  label: '定时刷新间隔',
                  visibleOn: 'this.api',
                  type: 'input-number',
                  step: 500,
                  description: '设置后将自动定时刷新，单位 ms'
                },
                getSchemaTpl('switch', {
                  name: 'silentPolling',
                  label: '静默加载',
                  visibleOn: '!!data.interval',
                  description: '设置自动定时刷新是否显示加载动画'
                }),
                {
                  name: 'stopAutoRefreshWhen',
                  label: '停止定时刷新检测',
                  type: 'input-text',
                  visibleOn: '!!data.interval',
                  description:
                    '定时刷新一旦设置会一直刷新，除非给出表达式，条件满足后则不刷新了。'
                }
              ]
            },
            {
              title: 'Schema接口',
              body: [
                getSchemaTpl('apiControl', {
                  name: 'schemaApi',
                  label: '内容 Schema 接口'
                }),
                getSchemaTpl('switch', {
                  name: 'initFetchSchema',
                  label: 'Schema接口初始加载',
                  visibleOn: 'this.schemaApi'
                })
              ]
            },
            {
              title: '全局配置',
              body: [
                getSchemaTpl('data'),
                {
                  type: 'js-editor',
                  allowFullscreen: true,
                  name: 'dataProvider',
                  label: '自定义函数获取数据',
                  description: '将会传递 data 和 setData 两个参数'
                },
                {
                  label: '默认消息信息',
                  type: 'combo',
                  name: 'messages',
                  multiLine: true,
                  description:
                    '设置 service 默认提示信息，当 service 没有返回 msg 信息时有用，如果 service 返回携带了 msg 值，则还是以 service 返回为主',
                  items: [
                    {
                      label: '获取成功',
                      type: 'input-text',
                      name: 'fetchSuccess'
                    },
                    {
                      label: '获取失败',
                      type: 'input-text',
                      name: 'fetchFailed'
                    }
                  ]
                }
              ]
            },
            {
              title: '状态',
              body: [getSchemaTpl('ref'), getSchemaTpl('visible')]
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
