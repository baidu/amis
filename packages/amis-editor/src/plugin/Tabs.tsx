import React from 'react';
import {getI18nEnabled, registerEditorPlugin} from 'amis-editor-core';
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
import {tipedLabel} from 'amis-editor-core';
import {
  buildLinkActionDesc,
  getArgsWrapper,
  getEventControlConfig
} from '../renderer/event-control/helper';

export class TabsPlugin extends BasePlugin {
  static id = 'TabsPlugin';
  // 关联渲染器名字
  rendererName = 'tabs';
  useLazyRender = true; // 使用懒渲染
  $schema = '/schemas/TabsSchema.json';

  // 组件名称
  name = '选项卡';
  isBaseComponent = true;
  description = '选项卡，可以将内容分组用选项卡的形式展示，降低用户使用成本。';
  docLink = '/amis/zh-CN/components/tabs';
  tags = ['布局容器'];
  icon = 'fa fa-folder-o';
  pluginIcon = 'tabs-plugin';
  scaffold = {
    type: 'tabs',
    tabs: [
      {
        title: '选项卡1',
        body: []
      },
      {
        title: '选项卡2',
        body: []
      }
    ],
    mountOnEnter: true,
    themeCss: {
      titleControlClassName: {
        'font:default': {
          'text-align': 'center'
        }
      }
    }
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
            data: {
              type: 'object',
              title: '数据',
              properties: {
                value: {
                  type: 'string',
                  title: '选项卡索引'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'delete',
      eventLabel: '选项卡删除',
      description: '选项卡删除',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                value: {
                  type: 'string',
                  title: '选项卡索引'
                }
              }
            }
          }
        }
      ]
    }
  ];

  actions = [
    {
      actionType: 'changeActiveKey',
      actionLabel: '激活指定选项卡',
      description: '修改当前激活tab项',
      config: ['activeKey'],
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            激活
            {buildLinkActionDesc(props.manager, info)}第
            <span className="variable-left variable-right">
              {info?.args?.activeKey}
            </span>
            项
          </div>
        );
      },
      schema: getArgsWrapper(
        getSchemaTpl('formulaControl', {
          name: 'activeKey',
          label: '激活项',
          variables: '${variables}',
          size: 'lg',
          mode: 'horizontal',
          horizontal: {
            left: 'normal'
          }
        })
      )
    },
    {
      actionType: 'deleteTab',
      actionLabel: '删除指定选项卡',
      description: '删除指定hash的tab项',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div>
            删除
            {buildLinkActionDesc(props.manager, info)}
            hash为
            <span className="variable-left variable-right">
              {info?.args?.deleteHash}
            </span>
            的tab项
          </div>
        );
      },
      schema: getArgsWrapper(
        getSchemaTpl('formulaControl', {
          name: 'deleteHash',
          label: '删除项',
          variables: '${variables}',
          size: 'lg',
          mode: 'horizontal',
          placeholder: '请输入hash值',
          horizontal: {
            left: 'normal'
          }
        })
      )
    }
  ];

  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    const isNewTabMode =
      'this.tabsMode !=="vertical" && this.tabsMode !=="sidebar" && this.tabsMode !=="chrome"';

    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
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
                  body: [
                    {
                      type: 'tpl',
                      tpl: '内容',
                      inline: false
                    }
                  ]
                },
                items: [
                  getSchemaTpl('title', {
                    label: false,
                    required: true
                  })
                ]
              }),

              getSchemaTpl('switch', {
                name: 'showTip',
                label: tipedLabel(
                  '标题提示',
                  '鼠标移动到选项卡标题时弹出提示，适用于标题超长时进行完整提示'
                ),
                visibleOn: isNewTabMode,
                clearValueOnHidden: true
              }),

              {
                label: tipedLabel(
                  '初始选项卡',
                  '组件初始化时激活的选项卡，优先级高于激活的选项卡，不可响应上下文数据，选项卡配置hash时使用hash，否则使用索引值，支持获取变量，如：<code>tab\\${id}</code>、<code>\\${id}</code>'
                ),
                type: 'input-text',
                name: 'defaultKey',
                placeholder: '初始默认激活的选项卡',
                pipeOut: (data: string) =>
                  data === '' || isNaN(Number(data)) ? data : Number(data)
              },

              {
                label: tipedLabel(
                  '激活的选项卡',
                  '默认显示某个选项卡，可响应上下文数据，选项卡配置hash时使用hash，否则使用索引值，支持获取变量，如：<code>tab\\${id}</code>、<code>\\${id}</code>'
                ),
                type: 'input-text',
                name: 'activeKey',
                placeholder: '默认激活的选项卡',
                pipeOut: (data: string) =>
                  data === '' || isNaN(Number(data)) ? data : Number(data)
              },
              getSchemaTpl('closable')
            ]
          },
          getSchemaTpl('status'),
          {
            title: '高级',
            body: [
              getSchemaTpl('sourceBindControl', {
                label: tipedLabel(
                  '关联数据',
                  '根据该数据来动态重复渲染所配置的选项卡'
                )
              }),
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
                  label: '展示形式',
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
                  visibleOn: 'this.tabsMode === "sidebar"',
                  clearValueOnHidden: true
                })
              ]
            },
            getSchemaTpl('theme:base', {
              classname: 'titleControlClassName',
              title: '标题样式',
              hidePaddingAndMargin: true,
              hideRadius: true,
              hideShadow: true,
              hideBorder: true,
              hideBackground: true,
              state: ['default', 'hover', 'focused', 'disabled'],
              extra: [
                getSchemaTpl('theme:select', {
                  label: '宽度',
                  name: 'themeCss.titleControlClassName.width'
                }),
                getSchemaTpl('theme:font', {
                  label: '文字',
                  name: 'themeCss.titleControlClassName.font'
                })
              ]
            }),
            getSchemaTpl('theme:base', {
              classname: 'toolbarControlClassName',
              title: '工具栏样式'
            }),
            getSchemaTpl('theme:base', {
              classname: 'contentControlClassName',
              title: '内容区样式'
            }),
            getSchemaTpl('theme:singleCssCode', {
              selectors: [
                {
                  label: '选项卡基本样式',
                  isRoot: true,
                  selector: '.cxd-Tabs'
                },
                {
                  label: '选项卡工具栏样式',
                  selector: '.cxd-Tabs-toolbar'
                },
                {
                  label: '选项卡标题样式',
                  selector: '.cxd-Tabs-link'
                },
                {
                  label: '选项卡内容区样式',
                  selector: '.cxd-Tabs-content'
                }
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
      const i18nEnabled = getI18nEnabled();
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
                  type: i18nEnabled ? 'input-text-i18n' : 'input-text',
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
                        visibleOn: 'this.icon',
                        clearValueOnHidden: true
                      })
                    ]
                  }
                },
                getSchemaTpl('closable'),
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
            getSchemaTpl('theme:base', {
              classname: 'panelControlClassName',
              title: '基本样式'
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
