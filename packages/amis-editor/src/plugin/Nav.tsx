import {render} from 'amis';
import React from 'react';
import {TooltipWrapper} from 'amis-ui';
import {
  registerEditorPlugin,
  BasePlugin,
  BaseEventContext,
  getSchemaTpl,
  RendererPluginEvent,
  RendererPluginAction,
  tipedLabel
} from 'amis-editor-core';
import {
  getEventControlConfig,
  getActionCommonProps,
  buildLinkActionDesc
} from '../renderer/event-control/helper';

export class NavPlugin extends BasePlugin {
  static id = 'NavPlugin';
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'nav';
  $schema = '/schemas/NavSchema.json';

  // 组件名称
  name = '导航';
  isBaseComponent = true;
  description = '用来渲染导航菜单，支持横排和竖排。';
  docLink = '/amis/zh-CN/components/nav';
  tags = ['功能'];
  icon = 'fa fa-map-signs';
  pluginIcon = 'nav-plugin';
  scaffold = {
    type: 'nav',
    stacked: true,
    popupClassName: 'app-popover :AMISCSSWrapper',
    links: [
      {
        label: '页面1',
        to: '?id=1',
        target: '_self',
        id: '0'
      },
      {
        label: '页面2',
        to: '?id=2',
        target: '_self',
        id: '1'
      }
    ]
  };
  previewSchema = {
    ...this.scaffold
  };

  panelTitle = '导航';

  panelDefinitions = {
    links: {
      label: '菜单管理',
      name: 'links',
      type: 'combo',
      multiple: true,
      draggable: true,
      addButtonText: '新增菜单',
      multiLine: true,
      messages: {
        validateFailed: '菜单中存在配置错误，请仔细检查'
      },
      scaffold: {
        label: '',
        to: ''
      },
      items: [
        getSchemaTpl('label', {
          label: '名称',
          required: true
        }),

        {
          type: 'input-text',
          name: 'to',
          label: '跳转地址',
          required: true
        },
        getSchemaTpl('switch', {
          label: '是否新开页面',
          name: 'target',
          pipeIn: (value: any) => value === '_parent',
          pipeOut: (value: any) => (value ? '_parent' : '_blank')
        }),
        getSchemaTpl('icon', {
          name: 'icon',
          label: '图标'
        }),
        getSchemaTpl('switch', {
          label: '初始是否展开',
          name: 'unfolded'
        }),
        {
          type: 'group',
          label: '是否高亮',
          direction: 'vertical',
          className: 'm-b-none',
          labelRemark: {
            trigger: 'click',
            rootClose: true,
            className: 'm-l-xs',
            content: '可以配置该菜单是否要高亮',
            placement: 'left'
          },
          body: [
            {
              name: 'active',
              type: 'radios',
              inline: true,
              // pipeIn: (value:any) => typeof value === 'boolean' ? value : '1'
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
              name: 'activeOn',
              autoComplete: false,
              visibleOn: 'typeof this.active !== "boolean"',
              type: 'input-text',
              placeholder: '留空将自动分析菜单地址',
              className: 'm-t-n-sm'
            }
          ]
        },
        getSchemaTpl('switch', {
          label: '包含子菜单',
          name: 'children',
          pipeIn: (value: any) => !!value,
          pipeOut: (value: any) => (value ? [{label: '', to: ''}] : undefined),
          messages: {
            validateFailed: '子菜单中存在配置错误，请仔细检查'
          }
        }),
        {
          name: 'children',
          $ref: 'links',
          visibleOn: 'this.children',
          label: '子菜单管理',
          addButtonText: '新增子菜单'
        }
      ]
    }
  };

  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'click',
      eventLabel: '菜单点击',
      description: '菜单点击时触发',
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
      eventName: 'change',
      eventLabel: '菜单选中',
      description: '菜单选中时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据'
            }
          }
        }
      ]
    },
    {
      eventName: 'toggled',
      eventLabel: '菜单展开',
      description: '菜单展开时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据'
            }
          }
        }
      ]
    },
    {
      eventName: 'collapsed',
      eventLabel: '菜单折叠',
      description: '菜单折叠时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据'
            }
          }
        }
      ]
    },
    {
      eventName: 'loaded',
      eventLabel: '数据加载完成',
      description: '数据加载完成后触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据'
            }
          }
        }
      ]
    }
  ];

  // 动作定义
  actions: RendererPluginAction[] = [
    {
      actionType: 'updateItems',
      actionLabel: '更新菜单项',
      description: '触发组件更新菜单项',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            更新
            {buildLinkActionDesc(props.manager, info)}
            菜单项
          </div>
        );
      }
    },
    {
      actionType: 'collapse',
      actionLabel: '菜单折叠',
      description: '触发组件的折叠与展开',
      ...getActionCommonProps('collapse')
    },
    {
      actionType: 'reload',
      actionLabel: '重新加载',
      description: '触发组件数据刷新并重新渲染',
      ...getActionCommonProps('reload')
    }
  ];

  panelBodyCreator = (context: BaseEventContext) => {
    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              getSchemaTpl('switch', {
                name: 'stacked',
                label: '横向摆放',
                pipeIn: (value: boolean) => !value,
                pipeOut: (value: boolean) => !value
              }),
              getSchemaTpl('switch', {
                name: 'mode',
                label: [
                  {
                    children: (
                      <TooltipWrapper
                        tooltipClassName="ae-nav-tooltip-wrapper"
                        trigger="hover"
                        rootClose={true}
                        placement="top"
                        tooltipTheme="dark"
                        style={{
                          fontSize: '12px'
                        }}
                        tooltip={{
                          children: () => (
                            <div>
                              <span>
                                默认为内联模式，开启后子菜单不在父级下方展开，会悬浮在菜单的侧边展示
                              </span>
                              <div className="nav-mode-gif" />
                            </div>
                          )
                        }}
                      >
                        <span>子菜单悬浮展示</span>
                      </TooltipWrapper>
                    )
                  }
                ],
                visibleOn: 'this.stacked',
                pipeIn: (value: any) => value === 'float',
                pipeOut: (value: boolean) => (value ? 'float' : 'inline')
              }),
              getSchemaTpl('switch', {
                label: tipedLabel(
                  '手风琴模式',
                  '点击菜单，只展开当前父级菜单，收起其他展开的菜单'
                ),
                visibleOn: 'this.stacked && this.mode !== "float"',
                name: 'accordion'
              }),
              {
                type: 'input-number',
                name: 'defaultOpenLevel',
                label: tipedLabel('默认展开层级', '默认展开全部菜单的对应层级'),
                visibleOn: 'this.stacked && this.mode !== "float"',
                mode: 'horizontal',
                labelAlign: 'left'
              },
              {
                type: 'input-number',
                name: 'level',
                label: tipedLabel(
                  '最大显示层级',
                  '配置后将隐藏超过该层级的菜单项，如最大显示两级，菜单项的三级及以下将被隐藏'
                ),
                mode: 'horizontal',
                labelAlign: 'left'
              }
            ]
          },
          {
            title: '菜单项',
            body: [
              getSchemaTpl('navControl'),
              // 角标
              getSchemaTpl('nav-badge', {
                visibleOn: 'this.links'
              })
              // 默认选中菜单
              // getSchemaTpl('nav-default-active', {
              //   visibleOn: 'this.links'
              // })
            ]
          },
          // {
          //   title: '高级',
          //   body: [
          //     getSchemaTpl('switch', {
          //       name: 'draggable',
          //       label: '拖拽排序',
          //       visibleOn:
          //         'this.source && this.source !== "${amisStore.app.portalNav}"'
          //     }),
          //     getSchemaTpl('switch', {
          //       name: 'dragOnSameLevel',
          //       label: '仅同级拖拽',
          //       visibleOn: 'this.draggable'
          //     }),
          //     getSchemaTpl('apiControl', {
          //       name: 'saveOrderApi',
          //       label: '保存排序接口',
          //       mode: 'normal',
          //       visibleOn:
          //         'this.source && this.source !== "${amisStore.app.portalNav}"'
          //     })
          //   ]
          // },
          {
            title: '状态',
            body: [getSchemaTpl('visible'), getSchemaTpl('hidden')]
          }
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl(
          'collapseGroup',
          getSchemaTpl('style:common', ['layout'])
        )
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

registerEditorPlugin(NavPlugin);
