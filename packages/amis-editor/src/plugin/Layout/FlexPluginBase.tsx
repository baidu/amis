/**
 * @file Flex 常见布局 1:3
 */
import {LayoutBasePlugin, PluginEvent} from 'amis-editor-core';
import {getSchemaTpl, tipedLabel} from 'amis-editor-core';
import type {
  BaseEventContext,
  EditorNodeType,
  RegionConfig,
  RendererJSONSchemaResolveEventContext,
  BasicToolbarItem,
  PluginInterface
} from 'amis-editor-core';

// 默认的列容器Schema
export const defaultFlexColumnSchema = (title?: string) => {
  return {
    type: 'container',
    body: [],
    size: 'xs',
    style: {
      position: 'static',
      display: 'block',
      flex: '1 1 auto',
      flexGrow: 1,
      flexBasis: 'auto'
    },
    wrapperBody: false,
    isFixedHeight: false,
    isFixedWidth: false
  };
};
// 默认的布局容器Schema
const defaultFlexContainerSchema = {
  type: 'flex',
  className: 'p-1',
  items: [
    defaultFlexColumnSchema('第一列'),
    defaultFlexColumnSchema('第二列'),
    defaultFlexColumnSchema('第三列')
  ],
  style: {
    position: 'relative'
  }
};

export class FlexPluginBase extends LayoutBasePlugin {
  static id = 'FlexPluginBase';
  rendererName = 'flex';
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
  scaffold: any = defaultFlexContainerSchema;
  previewSchema = {
    ...this.scaffold
  };

  panelTitle = '布局容器';

  panelJustify = true; // 右侧配置项默认左右展示

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

    const positionTpl = [
      getSchemaTpl('layout:position', {
        visibleOn: '!data.stickyStatus'
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
                title: '布局',
                body: [
                  isSorptionContainer ? getSchemaTpl('layout:sorption') : null,

                  // 吸附容器不显示定位相关配置项
                  ...(isSorptionContainer ? [] : positionTpl),

                  getSchemaTpl('layout:flex-setting', {
                    label: '弹性布局设置',
                    direction: curRendererSchema.direction,
                    justify: curRendererSchema.justify,
                    alignItems: curRendererSchema.alignItems
                  }),

                  getSchemaTpl('layout:flex-wrap'),

                  ...(isFlexItem
                    ? [
                        getSchemaTpl('layout:flex', {
                          isFlexColumnItem,
                          label: isFlexColumnItem ? '高度设置' : '宽度设置',
                          visibleOn:
                            'data.style && (data.style.position === "static" || data.style.position === "relative")'
                        }),
                        getSchemaTpl('layout:flex-grow', {
                          visibleOn:
                            'data.style && data.style.flex === "1 1 auto" && (data.style.position === "static" || data.style.position === "relative")'
                        }),
                        getSchemaTpl('layout:flex-basis', {
                          label: isFlexColumnItem ? '弹性高度' : '弹性宽度',
                          visibleOn:
                            'data.style && (data.style.position === "static" || data.style.position === "relative") && data.style.flex === "1 1 auto"'
                        }),
                        getSchemaTpl('layout:flex-basis', {
                          label: isFlexColumnItem ? '固定高度' : '固定宽度',
                          visibleOn:
                            'data.style && (data.style.position === "static" || data.style.position === "relative") && data.style.flex === "0 0 150px"'
                        })
                      ]
                    : []),

                  getSchemaTpl('layout:overflow-x', {
                    visibleOn: `${
                      isFlexItem && !isFlexColumnItem
                    } && data.style.flex === '0 0 150px'`
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
                    } && (data.isFixedHeight || data.style && data.style.maxHeight) || (${
                      isFlexItem && isFlexColumnItem
                    } && data.style.flex === '0 0 150px')`
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
                    } || ${isFlexItem} && data.style.flex !== '0 0 150px'`
                  }),
                  getSchemaTpl('layout:min-width', {
                    visibleOn: `${
                      !isFlexItem || isFlexColumnItem
                    } || ${isFlexItem} && data.style.flex !== '0 0 150px'`
                  }),

                  getSchemaTpl('layout:overflow-x', {
                    visibleOn: `${
                      !isFlexItem || isFlexColumnItem
                    } && (data.isFixedWidth || data.style && data.style.maxWidth)`
                  }),

                  !isFlexItem ? getSchemaTpl('layout:margin-center') : null,
                  getSchemaTpl('layout:z-index'),
                  !isSorptionContainer &&
                    getSchemaTpl('layout:sticky', {
                      visibleOn:
                        'data.style && (data.style.position !== "fixed" && data.style.position !== "absolute")'
                    }),
                  getSchemaTpl('layout:stickyPosition')
                ]
              },
              getSchemaTpl('status')
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
      label: '子节点集合'
    }
  ];

  buildEditorToolbar(
    {id, info, schema}: BaseEventContext,
    toolbars: Array<BasicToolbarItem>
  ) {
    const store = this.manager.store;
    const parent = store.getSchemaParentById(id);
    const draggableContainer = this.manager.draggableContainer(id);
    const isFlexItem = this.manager?.isFlexItem(id);
    const isFlexColumnItem = this.manager?.isFlexColumnItem(id);
    const newColumnSchema = defaultFlexColumnSchema('新的一列');
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
                defaultFlexContainerSchema,
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
                defaultFlexContainerSchema,
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
            onClick: () => this.manager.addElem(newColumnSchema)
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
