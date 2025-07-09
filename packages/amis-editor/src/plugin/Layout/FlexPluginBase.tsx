/**
 * @file Flex 常见布局 1:3
 */
import React from 'react';
import {
  JSONPipeOut,
  LayoutBasePlugin,
  PluginEvent,
  reGenerateID,
  tipedLabel
} from 'amis-editor-core';
import {getSchemaTpl} from 'amis-editor-core';
import {Button, PlainObject} from 'amis';
import type {
  BaseEventContext,
  EditorNodeType,
  RegionConfig,
  RendererJSONSchemaResolveEventContext,
  BasicToolbarItem,
  PluginInterface
} from 'amis-editor-core';
import {Icon} from 'amis-editor-core';
import {JSONChangeInArray, JSONPipeIn, repeatArray} from 'amis-editor-core';
import {isAlive} from 'mobx-state-tree';

// 默认的列容器Schema
export const defaultFlexColumnSchema = (
  title?: string,
  disableFlexBasis: boolean = true
) => {
  let style: PlainObject = {
    position: 'static',
    display: 'block',
    flex: '1 1 auto',
    flexGrow: 1
  };
  if (disableFlexBasis) {
    style.flexBasis = 0;
  }
  return {
    type: 'container',
    body: [],
    size: 'none',
    style,
    wrapperBody: false,
    isFixedHeight: false,
    isFixedWidth: false
  };
};

const defaultFlexPreviewSchema = (title?: string) => {
  return {
    type: 'tpl',
    tpl: title,
    wrapperComponent: '',
    className: 'bg-light center',
    style: {
      display: 'block',
      flex: '1 1 auto',
      flexBasis: 0,
      textAlign: 'center',
      marginRight: 10
    },
    inline: false
  };
};

// 默认的布局容器Schema
const defaultFlexContainerSchema = (
  flexItemSchema: (title?: string) => any = defaultFlexColumnSchema
) => ({
  type: 'flex',
  items: [
    flexItemSchema('第一列'),
    flexItemSchema('第二列'),
    flexItemSchema('第三列')
  ],
  style: {
    position: 'relative',
    rowGap: '10px',
    columnGap: '10px'
  }
});

export class FlexPluginBase extends LayoutBasePlugin {
  static id = 'FlexPluginBase';
  rendererName = 'flex';
  useLazyRender = true; // 使用懒渲染
  $schema = '/schemas/FlexSchema.json';
  disabledRendererPlugin = false;

  name = '布局容器';
  order = -1200;
  isBaseComponent = true;
  icon = 'fa fa-columns';
  pluginIcon = 'flex-container-plugin';
  description =
    '布局容器 是基于 CSS Flex 实现的布局效果，它比 Grid 和 HBox 对子节点位置的可控性更强，比用 CSS 类的方式更易用';
  docLink = '/amis/zh-CN/components/flex';
  tags = ['布局容器'];
  scaffold: any = defaultFlexContainerSchema();
  previewSchema = defaultFlexContainerSchema(defaultFlexPreviewSchema);

  panelTitle = '布局容器';

  panelJustify = true; // 右侧配置项默认左右展示

  getChildNodes = (node: EditorNodeType) => {
    let nodes = node.children || [];

    if (nodes.length === 1 && nodes[0].isRegion) {
      nodes = nodes[0].children || [];
    }

    return nodes;
  };

  // 设置分栏的默认布局比例
  setFlexLayout = (node: EditorNodeType, value: string) => {
    if (/^[\d:]+$/.test(value) && isAlive(node)) {
      let list = value.trim().split(':');
      let children = this.getChildNodes(node);
      const isColumn = String(node.schema?.style?.flexDirection).includes(
        'column'
      );

      // 更新flex布局
      for (let i = 0; i < children.length; i++) {
        let child = children[i];
        child.updateSchemaStyle({
          flexGrow: +list[i],
          width: undefined,
          flexBasis: isColumn ? 'auto' : 0,
          flex: '1 1 auto'
        });
      }

      // 增加或删除列
      if (children.length < list.length) {
        for (let i = 0; i < list.length - children.length; i++) {
          let newColumnSchema = defaultFlexColumnSchema('', !isColumn);
          newColumnSchema.style.flexGrow = +list[i];
          this.manager.addElem(newColumnSchema, true, false);
        }
      } else if (children.length > list.length) {
        // 如果删除的列里面存在元素，截断生成新的flex放在组件后面
        const newSchema = JSONPipeIn(JSONPipeOut(node.schema));
        newSchema.items = newSchema.items.slice(list.length);

        node.updateSchema({
          items: node.schema.items.slice(0, list.length)
        });

        if (
          (newSchema.items as PlainObject[]).some(
            (item, index) => item.body?.length
          )
        ) {
          const parent = node.parent;
          this.manager.addChild(
            parent.id,
            parent.region,
            newSchema,
            parent?.children?.[node.index + 1]?.id
          );
        }
      }
    }
    return undefined;
  };

  resetFlexBasis = (node: EditorNodeType, flexSetting: PlainObject = {}) => {
    let schema = node.schema;
    if (
      String(flexSetting.flexDirection).includes('column') &&
      !schema?.style?.height
    ) {
      const children = this.getChildNodes(node);
      children.forEach(child => {
        if (
          !child.schema?.style?.height ||
          /^0/.test(child.schema?.style?.flexBasis)
        ) {
          child.updateSchemaStyle({
            flexBasis: undefined
          });
        }
      });
    }
  };

  insertItem = (node: EditorNodeType, direction: string) => {
    if (node.info?.plugin !== this) {
      return;
    }
    const store = this.manager.store;
    const newSchema = JSONPipeIn(JSONPipeOut(node.schema));

    const parent = node.parent;
    const nextId =
      direction === 'upper' ? node.id : parent?.children?.[node.index + 1]?.id;
    const child = this.manager.addChild(
      parent.id,
      parent.region,
      newSchema,
      nextId
    );
    if (child) {
      // mobx 修改数据是异步的
      setTimeout(() => {
        store.setActiveId(child.$$id);
      }, 100);
    }
  };

  panelBodyCreator = (context: BaseEventContext) => {
    const curRendererSchema = context?.schema || {};
    const isRowContent =
      curRendererSchema?.direction === 'row' ||
      curRendererSchema?.direction === 'row-reverse';
    const isFlexContainer = this.manager?.isFlexContainer(context?.id);
    const isFlexItem = this.manager?.isFlexItem(context?.id);
    const isFlexColumnItem = this.manager?.isFlexColumnItem(context?.id);
    // 判断是否为吸附容器
    const isSorptionContainer = curRendererSchema?.isSorptionContainer || false;
    const flexDirection = context.node?.schema?.style?.flexDirection || 'row';

    const positionTpl = [
      getSchemaTpl('layout:position', {
        visibleOn: '!this.stickyStatus'
      }),
      getSchemaTpl('layout:originPosition'),
      getSchemaTpl('layout:inset', {
        mode: 'vertical'
      })
    ];

    return [
      getSchemaTpl('tabs', [
        {
          title: '属性',
          className: 'p-none',
          body: [
            getSchemaTpl('collapseGroup', [
              {
                title: '基础',
                body: [
                  context.node &&
                    getSchemaTpl('layout:flex-layout', {
                      name: 'layout',
                      label: '快捷版式设置',
                      flexDirection,
                      strictMode: false,
                      pipeIn: () => {
                        if (isAlive(context.node)) {
                          let children = context.node?.children || [];
                          if (
                            children.every(
                              item => item.schema?.style?.flex === '1 1 auto'
                            )
                          ) {
                            return children
                              .map(item => item.schema?.style?.flexGrow || 1)
                              .join(':');
                          }
                        }
                        return undefined;
                      },
                      pipeOut: (value: string) =>
                        this.setFlexLayout(context.node, value)
                    }),

                  {
                    type: 'wrapper',
                    size: 'none',
                    className: 'grid grid-cols-2 gap-4 mb-4',
                    body: [
                      {
                        children: (
                          <Button
                            size="sm"
                            onClick={() =>
                              this.insertItem(context.node, 'under')
                            }
                          >
                            <Icon className="icon" icon="arrow-to-bottom" />
                            <span>下方插入新行</span>
                          </Button>
                        )
                      },
                      {
                        children: (
                          <Button
                            size="sm"
                            onClick={() =>
                              this.insertItem(context.node, 'upper')
                            }
                          >
                            <Icon className="icon" icon="top-arrow-to-top" />
                            <span>上方插入新行</span>
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

                  getSchemaTpl('layout:flex-setting', {
                    label: '内部对齐设置',
                    direction: curRendererSchema.direction,
                    justify: curRendererSchema.justify || 'center',
                    alignItems: curRendererSchema.alignItems,
                    pipeOut: (value: any) => {
                      // 纵向排列的非固定高度flex容器子元素去掉为0的flexBasis
                      this.resetFlexBasis(context.node, value);
                      return value;
                    }
                  }),

                  getSchemaTpl('layout:flex-wrap'),

                  getSchemaTpl('layout:flex-basis', {
                    label: '行间隔',
                    tooltip: '垂直排布时，内部容器之间的间隔',
                    name: 'style.rowGap'
                  }),
                  getSchemaTpl('layout:flex-basis', {
                    label: '列间隔',
                    tooltip: '水平排布时，内部容器之间的间隔',
                    name: 'style.columnGap'
                  }),

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
                  getSchemaTpl('layout:z-index'),
                  !isSorptionContainer &&
                    getSchemaTpl('layout:sticky', {
                      visibleOn:
                        'this.style && (this.style.position !== "fixed" && this.style.position !== "absolute")'
                    }),
                  getSchemaTpl('layout:stickyPosition')
                ]
              },
              getSchemaTpl('status'),
              {
                title: '高级',
                body: [
                  isSorptionContainer ? getSchemaTpl('layout:sorption') : null,
                  // 吸附容器不显示定位相关配置项
                  ...(isSorptionContainer ? [] : positionTpl)
                ]
              }
            ])
          ]
        },
        {
          title: '外观',
          className: 'p-none',
          body: getSchemaTpl('collapseGroup', [
            ...getSchemaTpl('theme:common', {exclude: ['layout']})
          ])
        }
      ])
    ];
  };

  regions: Array<RegionConfig> = [
    {
      key: 'items',
      label: '子节点集合',
      renderMethod: 'renderItems'
    }
  ];

  buildEditorToolbar(
    {id, info, schema, node}: BaseEventContext,
    toolbars: Array<BasicToolbarItem>
  ) {
    // const store = this.manager.store;
    const parent = node.parent?.schema; // 或者 store.getSchemaParentById(id, true);
    const draggableContainer = this.manager.draggableContainer(id);
    const isFlexItem = this.manager?.isFlexItem(id);
    const isFlexColumnItem = this.manager?.isFlexColumnItem(id);
    const newColumnSchema = isFlexColumnItem
      ? defaultFlexColumnSchema('', false)
      : defaultFlexColumnSchema();
    const canAppendSiblings = this.manager?.canAppendSiblings();
    const toolbarsTooltips: any = {};
    toolbars.forEach(toolbar => {
      if (toolbar.tooltip) {
        toolbarsTooltips[toolbar.tooltip] = 1;
      }
    });

    if (
      parent &&
      (info.renderer?.name === 'flex' || info.renderer?.name === 'container') &&
      !draggableContainer &&
      !schema?.isFreeContainer
    ) {
      // 非特殊布局元素（fixed、absolute）支持前后插入追加布局元素功能icon
      // 备注：如果是列级元素不需要显示
      if (
        !toolbarsTooltips['上方插入布局容器'] &&
        !isFlexItem &&
        canAppendSiblings
      ) {
        toolbars.push(
          {
            iconSvg: 'add-btn',
            tooltip: '上方插入布局容器',
            level: 'special',
            placement: 'right',
            className: 'ae-InsertBefore is-vertical',
            onClick: () =>
              this.manager.appendSiblingSchema(
                defaultFlexContainerSchema(),
                true,
                true
              )
          },
          {
            iconSvg: 'add-btn',
            tooltip: '下方插入布局容器',
            level: 'special',
            placement: 'right',
            className: 'ae-InsertAfter is-vertical',
            onClick: () =>
              this.manager.appendSiblingSchema(
                defaultFlexContainerSchema(),
                false,
                true
              )
          }
        );
      }

      // 布局容器 右上角插入子元素
      if (info.renderer?.name === 'flex') {
        if (!toolbarsTooltips['新增列级元素']) {
          toolbars.push({
            iconSvg: 'add-btn',
            tooltip: '新增列级元素',
            level: 'special',
            placement: 'bottom',
            className: 'ae-AppendChild',
            onClick: () =>
              this.manager.addElem(defaultFlexColumnSchema('', true))
          });
        }
      }
    }

    if (
      parent &&
      (parent.type === 'flex' || parent.type === 'container') &&
      isFlexItem &&
      !draggableContainer &&
      canAppendSiblings
    ) {
      if (
        !toolbarsTooltips[`${isFlexColumnItem ? '上方' : '左侧'}插入列级容器`]
      ) {
        // 布局容器的列级元素 增加左右插入icon
        toolbars.push(
          {
            iconSvg: 'add-btn',
            tooltip: `${isFlexColumnItem ? '上方' : '左侧'}插入列级容器`,
            level: 'special',
            placement: 'right',
            className: isFlexColumnItem
              ? 'ae-InsertBefore is-vertical'
              : 'ae-InsertBefore',
            onClick: () =>
              this.manager.appendSiblingSchema(newColumnSchema, true, true)
          },
          {
            iconSvg: 'add-btn',
            tooltip: `${isFlexColumnItem ? '下方' : '右侧'}插入列级容器`,
            level: 'special',
            placement: isFlexColumnItem ? 'right' : 'left',
            className: isFlexColumnItem
              ? 'ae-InsertAfter is-vertical'
              : 'ae-InsertAfter',
            onClick: () =>
              this.manager.appendSiblingSchema(newColumnSchema, false, true)
          }
        );
      }
    }
  }

  afterResolveJsonSchema(
    event: PluginEvent<RendererJSONSchemaResolveEventContext>
  ) {
    const context = event.context;
    const parent = context.node.parent?.host as EditorNodeType;

    if (parent?.info?.plugin === this) {
      event.setData('/schemas/FlexColumn.json');
    }
  }
}
