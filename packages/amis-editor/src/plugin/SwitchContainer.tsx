import {
  BaseEventContext,
  LayoutBasePlugin,
  RegionConfig,
  registerEditorPlugin,
  getSchemaTpl,
  RendererPluginEvent,
  VRendererConfig,
  VRenderer,
  RendererInfo,
  BasicToolbarItem
} from 'amis-editor-core';
import {RegionWrapper as Region} from 'amis-editor-core';
import {getEventControlConfig} from '../renderer/event-control';
import React from 'react';
import {generateId} from '../util';

export class SwitchContainerPlugin extends LayoutBasePlugin {
  static id = 'SwitchContainerPlugin';
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'switch-container';
  $schema = '/schemas/SwitchContainerSchema.json';

  // 组件名称
  name = '状态容器';
  isBaseComponent = true;
  description = '根据状态进行组件条件渲染的容器，方便设计多状态组件';
  tags = ['布局容器'];
  order = -2;
  icon = 'fa fa-square-o';
  pluginIcon = 'switch-container-plugin';
  scaffold = {
    type: 'switch-container',
    items: [
      {
        title: '状态一',
        id: generateId(),
        body: [
          {
            type: 'tpl',
            tpl: '状态一内容',
            wrapperComponent: '',
            id: generateId()
          }
        ]
      },
      {
        title: '状态二',
        id: generateId(),
        body: [
          {
            type: 'tpl',
            tpl: '状态二内容',
            wrapperComponent: '',
            id: generateId()
          }
        ]
      }
    ],
    style: {
      position: 'static',
      display: 'block'
    }
  };
  previewSchema = {
    ...this.scaffold
  };

  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: '内容区'
    }
  ];

  panelTitle = '状态容器';

  panelJustify = true;

  vRendererConfig: VRendererConfig = {
    regions: {
      body: {
        key: 'body',
        label: '内容区',
        placeholder: '状态',
        wrapperResolve: (dom: HTMLElement) => dom
      }
    },
    panelTitle: '状态',
    panelJustify: true,
    panelBodyCreator: (context: BaseEventContext) => {
      return getSchemaTpl('tabs', [
        {
          title: '属性',
          body: getSchemaTpl('collapseGroup', [
            {
              title: '基础',
              body: [
                {
                  name: 'title',
                  label: '状态名称',
                  type: 'input-text',
                  required: true
                },
                getSchemaTpl('expressionFormulaControl', {
                  evalMode: false,
                  label: '状态条件',
                  name: 'visibleOn',
                  placeholder: '\\${xxx}'
                })
              ]
            }
          ])
        }
      ]);
    }
  };

  wrapperProps = {
    unmountOnExit: true,
    mountOnEnter: true
  };

  stateWrapperResolve = (dom: HTMLElement) => dom;
  overrides = {
    renderBody(this: any, item: any) {
      const dom = this.super(item);
      const info: RendererInfo = this.props.$$editor;
      const items = this.props.items || [];
      const index = items.findIndex((cur: any) => cur.$$id === item.$$id);

      if (!info || !info.plugin) {
        return dom;
      }

      const plugin: SwitchContainerPlugin = info.plugin as any;
      const id = item.$$id;
      const region = plugin.vRendererConfig?.regions?.body;

      return (
        <VRenderer
          type={info.type}
          plugin={info.plugin}
          renderer={info.renderer}
          multifactor
          key={id}
          //$schema="/schemas/ListBodyField.json"
          hostId={info.id}
          memberIndex={index}
          name={`${item.title || `状态${index + 1}`}`}
          id={id}
          draggable={false}
          wrapperResolve={plugin.stateWrapperResolve}
          schemaPath={`${info.schemaPath}/items/${index}`}
          path={`${this.props.$path}/${index}`}
          data={this.props.data}
        >
          {region ? (
            <Region
              key={region.key}
              preferTag={region.preferTag}
              name={region.key}
              label={region.label}
              regionConfig={region}
              placeholder={region.placeholder}
              editorStore={plugin.manager.store}
              manager={plugin.manager}
              children={dom}
              wrapperResolve={region.wrapperResolve}
              rendererName={info.renderer.name}
            />
          ) : (
            dom
          )}
        </VRenderer>
      );
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
      context.info.renderer.name === 'switch-container' &&
      !context.info.hostId
    ) {
      const node = context.node;
      toolbars.unshift({
        icon: 'fa fa-chevron-right',
        tooltip: '下个状态',
        onClick: () => {
          const control = node.getComponent();
          if (control?.switchTo) {
            let index =
              control.state.activeIndex < 0 ? 0 : control.state.activeIndex;
            control.switchTo(index + 1);
          }
        }
      });

      toolbars.unshift({
        icon: 'fa fa-chevron-left',
        tooltip: '上个状态',
        onClick: () => {
          const control = node.getComponent();
          if (control?.switchTo) {
            let index = control.state.activeIndex;
            control.switchTo(index - 1);
          }
        }
      });
    }
  }

  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'click',
      eventLabel: '点击',
      description: '点击时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            context: {
              type: 'object',
              title: '上下文',
              properties: {
                nativeEvent: {
                  type: 'object',
                  title: '鼠标事件对象'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'mouseenter',
      eventLabel: '鼠标移入',
      description: '鼠标移入时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            context: {
              type: 'object',
              title: '上下文',
              properties: {
                nativeEvent: {
                  type: 'object',
                  title: '鼠标事件对象'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'mouseleave',
      eventLabel: '鼠标移出',
      description: '鼠标移出时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            context: {
              type: 'object',
              title: '上下文',
              properties: {
                nativeEvent: {
                  type: 'object',
                  title: '鼠标事件对象'
                }
              }
            }
          }
        }
      ]
    }
  ];

  panelBodyCreator = (context: BaseEventContext) => {
    const curRendererSchema = context?.schema;
    const isFreeContainer = curRendererSchema?.isFreeContainer || false;
    const isFlexItem = this.manager?.isFlexItem(context?.id);
    const isFlexColumnItem = this.manager?.isFlexColumnItem(context?.id);

    const displayTpl = [
      getSchemaTpl('layout:display'),

      getSchemaTpl('layout:flex-setting', {
        visibleOn:
          'this.style && (this.style.display === "flex" || this.style.display === "inline-flex")',
        direction: curRendererSchema.direction,
        justify: curRendererSchema.justify,
        alignItems: curRendererSchema.alignItems
      }),

      getSchemaTpl('layout:flex-wrap', {
        visibleOn:
          'this.style && (this.style.display === "flex" || this.style.display === "inline-flex")'
      })
    ];

    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              {
                type: 'ae-listItemControl',
                mode: 'normal',
                name: 'items',
                label: '状态列表',
                addTip: '新增组件状态',
                minLength: 1,
                items: [
                  {
                    type: 'input-text',
                    placeholder: '请输入显示文本',
                    label: '状态名称',
                    mode: 'horizontal',
                    name: 'title'
                  },
                  getSchemaTpl('expressionFormulaControl', {
                    name: 'visibleOn',
                    mode: 'horizontal',
                    label: '显示条件'
                  })
                ],
                scaffold: {
                  title: '状态',
                  body: [
                    {
                      type: 'tpl',
                      tpl: '状态内容',
                      wrapperComponent: '',
                      inline: false
                    }
                  ]
                }
              }
            ]
          },
          getSchemaTpl('status')
        ])
      },
      {
        title: '外观',
        className: 'p-none',
        body: getSchemaTpl('collapseGroup', [
          getSchemaTpl('theme:base', {
            collapsed: false,
            extra: []
          }),
          {
            title: '布局',
            body: [
              getSchemaTpl('layout:originPosition'),
              getSchemaTpl('layout:inset', {
                mode: 'vertical'
              }),

              // 自由容器不需要 display 相关配置项
              ...(!isFreeContainer ? displayTpl : []),

              ...(isFlexItem
                ? [
                    getSchemaTpl('layout:flex', {
                      isFlexColumnItem,
                      label: isFlexColumnItem ? '高度设置' : '宽度设置',
                      visibleOn:
                        'this.style && (this.style.position === "static" || this.style.position === "relative")'
                    }),
                    getSchemaTpl('layout:flex-grow', {
                      visibleOn:
                        'this.style && this.style.flex === "1 1 auto" && (this.style.position === "static" || this.style.position === "relative")'
                    }),
                    getSchemaTpl('layout:flex-basis', {
                      label: isFlexColumnItem ? '弹性高度' : '弹性宽度',
                      visibleOn:
                        'this.style && (this.style.position === "static" || this.style.position === "relative") && this.style.flex === "1 1 auto"'
                    }),
                    getSchemaTpl('layout:flex-basis', {
                      label: isFlexColumnItem ? '固定高度' : '固定宽度',
                      visibleOn:
                        'this.style && (this.style.position === "static" || this.style.position === "relative") && this.style.flex === "0 0 150px"'
                    })
                  ]
                : []),

              getSchemaTpl('layout:overflow-x', {
                visibleOn: `${
                  isFlexItem && !isFlexColumnItem
                } && this.style.flex === '0 0 150px'`
              }),

              getSchemaTpl('layout:isFixedHeight', {
                visibleOn: `${!isFlexItem || !isFlexColumnItem}`,
                onChange: (value: boolean) => {
                  context?.node.setHeightMutable(value);
                }
              }),
              getSchemaTpl('layout:height', {
                visibleOn: `${!isFlexItem || !isFlexColumnItem}`
              }),
              getSchemaTpl('layout:max-height', {
                visibleOn: `${!isFlexItem || !isFlexColumnItem}`
              }),
              getSchemaTpl('layout:min-height', {
                visibleOn: `${!isFlexItem || !isFlexColumnItem}`
              }),
              getSchemaTpl('layout:overflow-y', {
                visibleOn: `${
                  !isFlexItem || !isFlexColumnItem
                } && (this.isFixedHeight || this.style && this.style.maxHeight) || (${
                  isFlexItem && isFlexColumnItem
                } && this.style.flex === '0 0 150px')`
              }),

              getSchemaTpl('layout:isFixedWidth', {
                visibleOn: `${!isFlexItem || isFlexColumnItem}`,
                onChange: (value: boolean) => {
                  context?.node.setWidthMutable(value);
                }
              }),
              getSchemaTpl('layout:width', {
                visibleOn: `${!isFlexItem || isFlexColumnItem}`
              }),
              getSchemaTpl('layout:max-width', {
                visibleOn: `${!isFlexItem || isFlexColumnItem}`
              }),
              getSchemaTpl('layout:min-width', {
                visibleOn: `${!isFlexItem || isFlexColumnItem}`
              }),

              getSchemaTpl('layout:overflow-x', {
                visibleOn: `${
                  !isFlexItem || isFlexColumnItem
                } && (this.isFixedWidth || this.style && this.style.maxWidth)`
              }),

              !isFlexItem ? getSchemaTpl('layout:margin-center') : null,
              !isFlexItem && !isFreeContainer
                ? getSchemaTpl('layout:textAlign', {
                    name: 'style.textAlign',
                    label: '内部对齐方式',
                    visibleOn:
                      'this.style && this.style.display !== "flex" && this.style.display !== "inline-flex"'
                  })
                : null,
              getSchemaTpl('layout:z-index'),
              getSchemaTpl('layout:sticky', {
                visibleOn:
                  'this.style && (this.style.position !== "fixed" && this.style.position !== "absolute")'
              }),
              getSchemaTpl('layout:stickyPosition')
            ]
          },
          {
            title: '自定义样式',
            body: [
              {
                type: 'theme-cssCode',
                label: false
              }
            ]
          }
        ])
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

registerEditorPlugin(SwitchContainerPlugin);
