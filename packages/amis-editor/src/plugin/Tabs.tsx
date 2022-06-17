import React from 'react';
import {registerEditorPlugin} from 'amis-editor-core';
import {
  BaseEventContext,
  BasePlugin,
  BasicToolbarItem,
  PluginEvent,
  PreventClickEventContext,
  RegionConfig,
  RendererInfo,
  VRendererConfig
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {mapReactElement} from 'amis-editor-core';
import {VRenderer} from 'amis-editor-core';
import findIndex from 'lodash/findIndex';
import {RegionWrapper as Region} from 'amis-editor-core';
import {Tab} from 'amis';
import {tipedLabel} from '../component/BaseControl';
import {ValidatorTag} from '../validator';
import {getEventControlConfig} from '../util';
import {getComboWrapper} from '../event-action/schema';

export class TabsPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'tabs';
  $schema = '/schemas/TabsSchema.json';

  // 组件名称
  name = '选项卡';
  isBaseComponent = true;
  description = '选项卡，可以将内容分组用选项卡的形式展示，降低用户使用成本。';
  docLink = '/amis/zh-CN/components/tabs';
  tags = ['容器'];
  icon = 'fa fa-folder-o';
  scaffold = {
    type: 'tabs',
    tabs: [
      {
        title: '选项卡1',
        body: '内容1'
      },
      {
        title: '选项卡2',
        body: '内容2'
      }
    ]
  };
  previewSchema = {
    ...this.scaffold
  };

  notRenderFormZone = true;

  regions: Array<RegionConfig> = [
    {
      key: 'toolbar',
      label: '工具栏',
      preferTag: '展示'
    }
  ];

  panelTitle = '选项卡';

  events = [
    {
      eventName: 'change',
      eventLabel: '选项卡切换',
      description: '选项卡切换',
      dataSchema: [
        {
          type: 'object',
          properties: {
            value: {
              type: 'string',
              title: '选项卡索引'
            }
          }
        }
      ]
    }
  ];

  actions = [
    {
      actionType: 'changeActiveKey',
      actionLabel: '修改激活tab值',
      description: '修改当前激活tab项的key',
      config: ['activeKey'],
      desc: (info: any) => {
        return (
          <div>
            <span className="variable-right">{info?.__rendererLabel}</span>
            激活第
            <span className="variable-left variable-right">
              {info?.args?.activeKey}
            </span>
            项
          </div>
        );
      },
      schema: getComboWrapper({
        type: 'input-formula',
        variables: '${variables}',
        evalMode: false,
        variableMode: 'tabs',
        label: '激活项',
        size: 'lg',
        name: 'activeKey',
        mode: 'horizontal'
      })
    }
  ];

  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    const isNewTabMode =
      'data.tabsMode !=="vertical" && data.tabsMode !=="sidebar" && data.tabsMode !=="chrome"';

    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              getSchemaTpl('combo-container', {
                type: 'combo',
                label: '选项卡',
                mode: 'normal',
                name: 'tabs',
                draggableTip: '',
                draggable: true,
                multiple: true,
                minLength: 1,
                scaffold: {
                  title: '选项卡',
                  body: {
                    type: 'tpl',
                    tpl: '内容',
                    inline: false
                  }
                },
                items: [{type: 'input-text', name: 'title', required: true}]
              }),

              getSchemaTpl('switch', {
                name: 'showTip',
                label: tipedLabel(
                  '标题提示',
                  '鼠标移动到选项卡标题时弹出提示，适用于标题超长时进行完整提示'
                ),
                visibleOn: isNewTabMode,
                clearValueOnHidden: true
              })
            ]
          },
          getSchemaTpl('status'),
          {
            title: '高级',
            body: [
              {
                type: 'ae-formulaControl',
                label: tipedLabel(
                  '关联数据',
                  '可用<code>\\${xxx}</code>取值，根据该数据来动态重复渲染所配置的选项卡'
                ),
                name: 'source'
              },
              getSchemaTpl('switch', {
                name: 'mountOnEnter',
                label: tipedLabel(
                  '激活时渲染内容',
                  '只有激活选项卡时才进行内容渲染，提升渲染性能'
                )
              }),
              getSchemaTpl('switch', {
                name: 'unmountOnExit',
                label: tipedLabel(
                  '隐藏后销毁内容',
                  '激活其他选项卡时销毁当前内容，使其再次激活时内容可以重新渲染，适用于数据容器需要每次渲染实时获取数据的场景'
                )
              })
            ]
          }
        ])
      },
      {
        title: '外观',
        body: [
          getSchemaTpl('collapseGroup', [
            {
              title: '基本',
              body: [
                {
                  name: 'tabsMode',
                  label: '样式',
                  type: 'select',
                  options: [
                    {
                      label: '默认',
                      value: ''
                    },
                    {
                      label: '线型',
                      value: 'line'
                    },
                    {
                      label: '简约',
                      value: 'simple'
                    },
                    {
                      label: '加强',
                      value: 'strong'
                    },
                    {
                      label: '卡片',
                      value: 'card'
                    },
                    {
                      label: '仿 Chrome',
                      value: 'chrome'
                    },
                    {
                      label: '水平铺满',
                      value: 'tiled'
                    },
                    {
                      label: '选择器',
                      value: 'radio'
                    },
                    {
                      label: '垂直',
                      value: 'vertical'
                    },
                    {
                      label: '侧边栏',
                      value: 'sidebar'
                    }
                  ],
                  pipeIn: defaultValue('')
                },

                getSchemaTpl('horizontal-align', {
                  label: '标题区位置',
                  name: 'sidePosition',
                  pipeIn: defaultValue('left'),
                  visibleOn: 'data.tabsMode === "sidebar"',
                  clearValueOnHidden: true
                })
              ]
            },
            getSchemaTpl('style:classNames', {
              isFormItem: false,
              schema: [
                getSchemaTpl('className', {
                  name: 'linksClassName',
                  label: '标题区'
                }),

                getSchemaTpl('className', {
                  name: 'toolbarClassName',
                  label: '工具栏'
                }),

                getSchemaTpl('className', {
                  name: 'contentClassName',
                  label: '内容区'
                }),

                getSchemaTpl('className', {
                  name: 'showTipClassName',
                  label: '提示',
                  visibleOn: 'data.showTip',
                  clearValueOnHidden: true
                })
              ]
            })
          ])
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
      }
    ]);
  };

  patchContainers = ['tabs.body'];

  vRendererConfig: VRendererConfig = {
    regions: {
      body: {
        key: 'body',
        label: '内容区'
      }
    },
    panelTitle: '卡片',
    panelJustify: true,
    panelBodyCreator: (context: BaseEventContext) => {
      return getSchemaTpl('tabs', [
        {
          title: '属性',
          body: getSchemaTpl('collapseGroup', [
            {
              title: '基本',
              body: [
                {
                  name: 'title',
                  label: '标题',
                  type: 'input-text',
                  required: true
                },

                {
                  type: 'ae-switch-more',
                  formType: 'extend',
                  mode: 'normal',
                  label: '标题图标',
                  form: {
                    body: [
                      getSchemaTpl('icon'),

                      getSchemaTpl('horizontal-align', {
                        label: '位置',
                        name: 'iconPosition',
                        pipeIn: defaultValue('left'),
                        visibleOn: 'data.icon',
                        clearValueOnHidden: true
                      })
                    ]
                  }
                },

                {
                  label: tipedLabel(
                    'Hash',
                    '设置后，会同步更新地址栏的 Hash。'
                  ),
                  name: 'hash',
                  type: 'input-text'
                }
              ]
            },
            getSchemaTpl('status', {disabled: true}),
            {
              title: '高级',
              body: [
                getSchemaTpl('switch', {
                  name: 'mountOnEnter',
                  label: tipedLabel(
                    '激活时才渲染',
                    '当选项卡选中后才渲染其内容区，可提高渲染性能。'
                  ),
                  visibleOn: '!this.reload',
                  clearValueOnHidden: true
                }),

                getSchemaTpl('switch', {
                  name: 'unmountOnExit',
                  label: tipedLabel(
                    '隐藏即销毁',
                    '关闭选项卡则销毁其内容去，配置「激活时才渲染」选项可实现每次选中均重新加载的效果。'
                  ),
                  visibleOn: '!this.reload',
                  clearValueOnHidden: true
                })
              ]
            }
          ])
        },
        {
          title: '外观',
          body: getSchemaTpl('collapseGroup', [
            getSchemaTpl('style:classNames', {
              isFormItem: false
            })
          ])
        }
      ]);
    }
  };

  wrapperProps = {
    unmountOnExit: true,
    mountOnEnter: true
  };

  tabWrapperResolve = (dom: HTMLElement) => dom.parentElement!;
  overrides = {
    renderTabs(this: any) {
      const dom = this.super();

      if (!this.renderTab && this.props.$$editor && dom) {
        const tabs = this.props.tabs;
        return mapReactElement(dom, item => {
          if (item.type === Tab && item.props.$$id) {
            const id = item.props.$$id;
            const index = findIndex(tabs, (tab: any) => tab.$$id === id);
            const info: RendererInfo = this.props.$$editor;
            const plugin: TabsPlugin = info.plugin as any;

            if (~index) {
              const region = plugin.vRendererConfig?.regions?.body;

              if (!region) {
                return item;
              }

              return React.cloneElement(item, {
                children: (
                  <VRenderer
                    key={id}
                    type={info.type}
                    plugin={info.plugin}
                    renderer={info.renderer}
                    $schema="/schemas/TabSchema.json"
                    hostId={info.id}
                    memberIndex={index}
                    name={`${item.props.title || `卡片${index + 1}`}`}
                    id={id}
                    draggable={false}
                    wrapperResolve={plugin.tabWrapperResolve}
                    schemaPath={`${info.schemaPath}/tabs/${index}`}
                    path={`${this.props.$path}/${index}`} // 好像没啥用
                    data={this.props.data} // 好像没啥用
                  >
                    <Region
                      key={region.key}
                      preferTag={region.preferTag}
                      name={region.key}
                      label={region.label}
                      regionConfig={region}
                      placeholder={region.placeholder}
                      editorStore={plugin.manager.store}
                      manager={plugin.manager}
                      children={item.props.children}
                      wrapperResolve={region.wrapperResolve}
                      rendererName={info.renderer.name}
                    />
                  </VRenderer>
                )
              });
            }
          }

          return item;
        });
      }

      return dom;
    }
  };

  /**
   * 补充切换的 toolbar
   * @param context
   * @param toolbars
   */
  buildEditorToolbar(
    context: BaseEventContext,
    toolbars: Array<BasicToolbarItem>
  ) {
    if (
      context.info.plugin === this &&
      context.info.renderer.name === 'tabs' &&
      !context.info.hostId
    ) {
      const node = context.node;

      toolbars.push({
        level: 'secondary',
        icon: 'fa fa-chevron-left',
        tooltip: '上个卡片',
        onClick: () => {
          const control = node.getComponent();

          if (control?.switchTo) {
            const currentIndex = control.currentIndex();
            control.switchTo(currentIndex - 1);
          }
        }
      });

      toolbars.push({
        level: 'secondary',
        icon: 'fa fa-chevron-right',
        tooltip: '下个卡片',
        onClick: () => {
          const control = node.getComponent();

          if (control?.switchTo) {
            const currentIndex = control.currentIndex();
            control.switchTo(currentIndex + 1);
          }
        }
      });
    }
  }

  onPreventClick(e: PluginEvent<PreventClickEventContext>) {
    const mouseEvent = e.context.data;

    if (mouseEvent.defaultPrevented) {
      return false;
    } else if (
      (mouseEvent.target as HTMLElement).closest('[role=tablist]>li')
    ) {
      return false;
    }

    return;
  }
}

registerEditorPlugin(TabsPlugin);
