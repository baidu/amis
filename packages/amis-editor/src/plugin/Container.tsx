import React from 'react';
import {Button} from 'amis';
import {Icon} from 'amis-editor-core';
import {
  ActiveEventContext,
  BaseEventContext,
  LayoutBasePlugin,
  RegionConfig,
  PluginEvent,
  ResizeMoveEventContext,
  registerEditorPlugin,
  defaultValue,
  getSchemaTpl,
  RendererPluginEvent
} from 'amis-editor-core';
import {getEventControlConfig} from '../renderer/event-control';
import {EditorNodeType} from 'packages/amis-editor-core/lib';
import {defaultFlexColumnSchema} from './Layout/FlexPluginBase';

export class ContainerPlugin extends LayoutBasePlugin {
  static id = 'ContainerPlugin';
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'container';
  useLazyRender = true; // 使用懒渲染
  $schema = '/schemas/ContainerSchema.json';

  // 组件名称
  name = '容器';
  isBaseComponent = true;
  description = '一个简单的容器，可以将多个渲染器放置在一起。';
  docLink = '/amis/zh-CN/components/container';
  tags = ['布局容器'];
  order = -2;
  icon = 'fa fa-square-o';
  pluginIcon = 'container-plugin';
  scaffold = {
    type: 'container',
    body: [],
    style: {
      position: 'relative',
      display: 'flex',
      inset: 'auto',
      flexWrap: 'nowrap',
      flexDirection: 'column',
      alignItems: 'flex-start'
    },
    size: 'none',
    wrapperBody: false
  };
  previewSchema = {
    ...this.scaffold
  };

  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: '内容区',
      accept: (json, node, dragNode) => {
        // Grid 或者 flex 里面作为栏的时候，不让切换进去
        // 只让其调整顺序
        // node 是 region 节点，node.host 才是容器节点
        // node.host.host 是容器节点所在组件节点
        if (
          dragNode &&
          dragNode.info?.plugin === this &&
          node.host.host === dragNode.host
        ) {
          // sibling 不接受, 通常是调整顺序
          return false;
        }

        return true;
      }
    }
  ];

  panelTitle = '容器';

  panelJustify = true;

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

  onActive(event: PluginEvent<ActiveEventContext>) {
    const context = event.context;

    if (context.info?.plugin !== this || !context.node) {
      return;
    }

    const node = context.node!;
    const isFlexItem = this.manager?.isFlexItem(node.id);
    if (isFlexItem) {
      let isColumnFlex = this.manager.isFlexColumnItem(node.id);
      context?.node.setHeightMutable(
        node?.schema?.isFixedHeight && !isColumnFlex
      );
      context?.node.setWidthMutable(
        (!isColumnFlex && context.node.parent?.children?.length > 1) ||
          node.schema?.style?.flex === '0 0 150px'
      );
    } else {
      context?.node.setHeightMutable(node.schema?.isFixedHeight);
      context?.node.setWidthMutable(node.schema?.isFixedWidth);
    }
  }

  onWidthChangeStart(
    event: PluginEvent<
      ResizeMoveEventContext,
      {
        onMove(e: MouseEvent): void;
        onEnd(e: MouseEvent): void;
      }
    >
  ) {
    const context = event.context;
    const node = context.node;
    const region = node.parent;

    if (node.info?.plugin !== this || !region || !region.isRegion) {
      return;
    }

    const dom = context.dom;
    const parent = dom.parentElement as HTMLElement;
    if (!parent) {
      return;
    }
    const resizer = context.resizer;
    const frameRect = parent.getBoundingClientRect();
    const rect = dom.getBoundingClientRect();
    const isFlexItem = this.manager?.isFlexItem(node.id);
    const isColumnFlex = this.manager?.isFlexColumnItem(node.id);
    const schema = node.schema;
    const index = node.index;
    const isFlexSize =
      schema.style?.flex === '1 1 auto' &&
      (schema.style?.position === 'static' ||
        schema.style?.position === 'relative');

    let flexGrow = 1;
    let width = 0;
    const nodes = region.children;

    event.setData({
      onMove: (e: MouseEvent) => {
        const children = parent.children;

        width = e.pageX - rect.left;
        flexGrow = Math.max(
          1,
          Math.min(12, Math.round((12 * width) / frameRect.width))
        );

        resizer.setAttribute(
          'data-value',
          isFlexSize ? `${flexGrow}` : width + 'px'
        );

        if (isFlexSize) {
          // 需重新计算flex下各子组件占比，按照12等分计算
          for (let i = 0; i < children.length; i++) {
            if (i !== index) {
              let width = children[i].clientWidth;
              if (width > 0) {
                let grow = Math.max(
                  1,
                  Math.min(12, Math.round((12 * width) / frameRect.width))
                );
                nodes[i]?.updateState({
                  style: {
                    ...nodes[i].schema.style,
                    flexGrow: grow
                  }
                });
              }
            } else {
              node.updateState({
                style: {
                  ...node.schema.style,
                  flexGrow: +flexGrow
                }
              });
            }
          }
        } else {
          if (isFlexItem && !isColumnFlex) {
            node.updateState({
              style: {
                ...node.schema.style,
                flex: '0 0 150px',
                flexBasis: `${width}px`
              }
            });
          } else {
            node.updateState({
              style: {
                ...node.schema.style,
                width: `${width}px`
              }
            });
          }
        }

        requestAnimationFrame(() => {
          node.calculateHighlightBox();
        });
      },
      onEnd: () => {
        resizer.removeAttribute('data-value');

        if (isFlexSize) {
          nodes.forEach((item: EditorNodeType) => {
            item.updateSchema({
              style: {
                ...node.schema.style,
                flexGrow: item.state.style?.flexGrow ?? 1
              }
            });
            item.updateState({}, true);
          });
        } else {
          if (isFlexItem && !isColumnFlex) {
            node.updateSchema({
              style: {
                ...node.schema.style,
                flex: `0 0 150px`,
                flexBasis: `${width}px`
              }
            });
          } else {
            node.updateSchema({
              style: {
                ...node.schema.style,
                width: `${width}px`
              }
            });
          }
          node.updateState({}, true);
        }

        requestAnimationFrame(() => {
          node.calculateHighlightBox();
        });
      }
    });
  }

  // onHeightChangeStart(
  //   event: PluginEvent<
  //     ResizeMoveEventContext,
  //     {
  //       onMove(e: MouseEvent): void;
  //       onEnd(e: MouseEvent): void;
  //     }
  //   >
  // ) {
  //   // console.log('on height change start');
  //   // return this.onSizeChangeStart(event, 'vertical');
  // }

  panelBodyCreator = (context: BaseEventContext) => {
    const curRendererSchema = context?.schema;
    const isRowContent =
      curRendererSchema?.direction === 'row' ||
      curRendererSchema?.direction === 'row-reverse';
    // const isFlexContainer = this.manager?.isFlexContainer(context?.id);
    const isFreeContainer = curRendererSchema?.isFreeContainer || false;
    const isFlexItem = this.manager?.isFlexItem(context?.id);
    const isFlexColumnItem = this.manager?.isFlexColumnItem(context?.id);
    const node = context.node;

    const parent = node.parent?.schema;
    const draggableContainer = this.manager.draggableContainer(context?.id);
    const canAppendSiblings =
      parent &&
      isFlexItem &&
      !draggableContainer &&
      this.manager?.canAppendSiblings();

    const newItemSchema = isFlexColumnItem
      ? defaultFlexColumnSchema('', false)
      : defaultFlexColumnSchema();

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
          // {
          //   title: '基本',
          //   body: [
          //     {
          //       name: 'wrapperComponent',
          //       label: '容器标签',
          //       type: 'select',
          //       searchable: true,
          //       options: [
          //         'div',
          //         'p',
          //         'h1',
          //         'h2',
          //         'h3',
          //         'h4',
          //         'h5',
          //         'h6',
          //         'article',
          //         'aside',
          //         'code',
          //         'footer',
          //         'header',
          //         'section'
          //       ],
          //       pipeIn: defaultValue('div'),
          //       validations: {
          //         isAlphanumeric: true,
          //         matchRegexp: '/^(?!.*script).*$/' // 禁用一下script标签
          //       },
          //       validationErrors: {
          //         isAlpha: 'HTML标签不合法，请重新输入',
          //         matchRegexp: 'HTML标签不合法，请重新输入'
          //       },
          //       validateOnChange: false
          //     },
          //     getSchemaTpl('layout:padding')
          //   ]
          // },
          {
            title: '基本',
            body: [
              canAppendSiblings && {
                type: 'wrapper',
                size: 'none',
                className: 'grid grid-cols-2 gap-4 mb-4',
                body: [
                  {
                    children: (
                      <Button
                        size="sm"
                        onClick={() =>
                          this.manager.appendSiblingSchema(
                            newItemSchema,
                            true,
                            true
                          )
                        }
                      >
                        <Icon
                          className="icon"
                          icon={
                            isFlexColumnItem
                              ? 'top-arrow-to-top'
                              : 'left-arrow-to-left'
                          }
                        />
                        <span>
                          {isFlexColumnItem ? '上方' : '左侧'}插入一
                          {isFlexColumnItem ? '行' : '列'}
                        </span>
                      </Button>
                    )
                  },
                  {
                    children: (
                      <Button
                        size="sm"
                        onClick={() =>
                          this.manager.appendSiblingSchema(
                            newItemSchema,
                            false,
                            true
                          )
                        }
                      >
                        <Icon
                          className="icon"
                          icon={
                            isFlexColumnItem
                              ? 'arrow-to-bottom'
                              : 'arrow-to-right'
                          }
                        />
                        <span>
                          {isFlexColumnItem ? '下方' : '右侧'}插入一
                          {isFlexColumnItem ? '行' : '列'}
                        </span>
                      </Button>
                    )
                  }
                ]
              },

              getSchemaTpl('theme:paddingAndMargin', {
                name: 'themeCss.baseControlClassName.padding-and-margin:default'
              }),
              getSchemaTpl('theme:border', {
                name: `themeCss.baseControlClassName.border:default`
              }),
              getSchemaTpl('theme:colorPicker', {
                name: 'themeCss.baseControlClassName.background:default',
                label: '背景',
                needCustom: true,
                needGradient: true,
                needImage: true,
                labelMode: 'input'
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
                  if (
                    !isFlexItem ||
                    context.node.parent?.children?.length > 1
                  ) {
                    context?.node.setWidthMutable(value);
                  }
                }
              }),
              getSchemaTpl('layout:width', {
                visibleOn: `${!isFlexItem || isFlexColumnItem}`
              }),
              getSchemaTpl('layout:max-width', {
                visibleOn: `${
                  !isFlexItem || isFlexColumnItem
                } || ${isFlexItem} && this.style.flex !== '0 0 150px'`
              }),
              getSchemaTpl('layout:min-width', {
                visibleOn: `${
                  !isFlexItem || isFlexColumnItem
                } || ${isFlexItem} && this.style.flex !== '0 0 150px'`
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
              getSchemaTpl('layout:z-index')
            ]
          },
          getSchemaTpl('status'),
          {
            title: '高级',
            body: [
              getSchemaTpl('layout:position', {
                visibleOn: '!this.stickyStatus'
              }),
              getSchemaTpl('layout:originPosition'),
              getSchemaTpl('layout:inset', {
                mode: 'vertical'
              }),
              getSchemaTpl('layout:sticky', {
                visibleOn:
                  'this.style && (this.style.position !== "fixed" && this.style.position !== "absolute")'
              }),
              getSchemaTpl('layout:stickyPosition')
            ]
          }
        ])
      },
      {
        title: '外观',
        className: 'p-none',
        body: getSchemaTpl('collapseGroup', [
          ...getSchemaTpl('theme:common', {exclude: ['layout']})
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

registerEditorPlugin(ContainerPlugin);
