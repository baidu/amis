/**
 * @file Flex 常见布局 1:3
 */
import {BasePlugin, PluginEvent} from 'amis-editor-core';
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
    position: 'static',
  },
  direction: "row",
  justify: 'flex-start',
  alignItems: 'stretch'
};

export class FlexPluginBase extends BasePlugin {
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
  tags = ['布局'];
  scaffold: any = defaultFlexContainerSchema;
  previewSchema = {
    ...this.scaffold
  };

  panelTitle = '布局容器';

  panelJustify = true; // 右侧配置项默认左右展示

  panelBodyCreator = (context: BaseEventContext) => {
    const curRendererSchema = context?.schema;
    const isRowContent =
      curRendererSchema?.direction === 'row' ||
      curRendererSchema?.direction === 'row-reverse';
    const isFlexItem = this.manager?.isFlexItem(context?.id);
    const isFlexColumnItem = this.manager?.isFlexColumnItem(context?.id);
    // 判断是否为吸附容器
    const isSorptionContainer = curRendererSchema?.isSorptionContainer || false;

    const positionTpl = [
      getSchemaTpl('layout:position'),
      getSchemaTpl('layout:originPosition'),
      getSchemaTpl('layout:inset', {
        mode: 'vertical'
      }),
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

                  getSchemaTpl('layout:flexDirection', {
                    name: 'direction'
                  }),

                  getSchemaTpl('layout:justifyContent', {
                    name: 'justify',
                    label: '水平对齐方式',
                    options: [
                      {
                        label: '左对齐',
                        value: 'flex-start'
                      },
                      {
                        label: '居中对齐',
                        value: 'center'
                      },
                      {
                        label: '右对齐',
                        value: 'flex-end'
                      },
                      {
                        label: '两端对齐',
                        value: 'space-between'
                      },
                      {
                        label: '均匀分布',
                        value: 'space-evenly'
                      }
                    ],
                    visibleOn:
                      'data.direction === "row" || data.direction === "row-reverse"'
                  }),
                  // 备注: 重复一个是为了能实时联动，后续需要amis优化，支持label使用公式表达式
                  getSchemaTpl('layout:justifyContent', {
                    name: 'justify',
                    label: '垂直对齐方式',
                    options: [
                      {
                        label: '顶部对齐',
                        value: 'flex-start'
                      },
                      {
                        label: '居中对齐',
                        value: 'center'
                      },
                      {
                        label: '底部对齐',
                        value: 'flex-end'
                      },
                      {
                        label: '两端对齐',
                        value: 'space-between'
                      },
                      {
                        label: '均匀分布',
                        value: 'space-evenly'
                      }
                    ],
                    visibleOn:
                      'data.direction === "column" || data.direction === "column-reverse"'
                  }),
                  getSchemaTpl('layout:alignItems', {
                    name: 'alignItems',
                    label: '水平对齐方式',
                    options: [
                      {
                        label: '左对齐',
                        value: 'flex-start'
                      },
                      {
                        label: '居中对齐',
                        value: 'center'
                      },
                      {
                        label: '右对齐',
                        value: 'flex-end'
                      },
                      {
                        label: '基线对齐',
                        value: 'baseline'
                      },
                      {
                        label: '自动拉伸',
                        value: 'stretch'
                      }
                    ],
                    visibleOn:
                      'data.direction === "column" || data.direction === "column-reverse"'
                  }),
                  getSchemaTpl('layout:alignItems', {
                    name: 'alignItems',
                    label: '垂直对齐方式',
                    options: [
                      {
                        label: '顶部对齐',
                        value: 'flex-start'
                      },
                      {
                        label: '居中对齐',
                        value: 'center'
                      },
                      {
                        label: '底部对齐',
                        value: 'flex-end'
                      },
                      {
                        label: '基线对齐',
                        value: 'baseline'
                      },
                      {
                        label: '高度撑满',
                        value: 'stretch'
                      }
                    ],
                    visibleOn:
                      'data.direction === "row" || data.direction === "row-reverse"'
                  }),
                  getSchemaTpl('layout:flex-wrap'),

                  isFlexItem
                  ? getSchemaTpl('layout:flex', {
                      isFlexColumnItem,
                      label: isFlexColumnItem ? '高度设置' : '宽度设置',
                      visibleOn:
                        'data.style && (data.style.position === "static" || data.style.position === "relative")'
                    })
                  : null,
                  isFlexItem
                  ? getSchemaTpl('layout:flex-grow', {
                      visibleOn:
                        'data.style && data.style.flex === "1 1 auto" && (data.style.position === "static" || data.style.position === "relative")'
                    })
                  : null,
                  isFlexItem
                  ? getSchemaTpl('layout:flex-basis', {
                      label: isFlexColumnItem ? '弹性高度' : '弹性宽度',
                      visibleOn:
                        'data.style && (data.style.position === "static" || data.style.position === "relative") && data.style.flex === "1 1 auto"'
                    })
                  : null,
                  isFlexItem
                  ? getSchemaTpl('layout:flex-basis', {
                      label: isFlexColumnItem ? '固定高度' : '固定宽度',
                      visibleOn:
                        'data.style && (data.style.position === "static" || data.style.position === "relative") && data.style.flex === "0 0 150px"'
                    })
                  : null,

                  getSchemaTpl('layout:overflow-x', {
                    visibleOn: `${
                      isFlexItem && !isFlexColumnItem
                    } && data.style.flex === '0 0 150px'`
                  }),

                  getSchemaTpl('layout:isFixedHeight', {
                    visibleOn: `${!isFlexItem || !isFlexColumnItem}`
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
                    visibleOn: `${!isFlexItem || isFlexColumnItem}`
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
                    } && (data.isFixedWidth || data.style && data.style.maxWidth)`
                  }),

                  !isFlexItem ? getSchemaTpl('layout:margin-center') : null,
                  getSchemaTpl('layout:z-index'),
                  !isSorptionContainer && getSchemaTpl('layout:sticky'),
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
            ...getSchemaTpl('style:common', []),
            {
              title: 'CSS 类名',
              body: [getSchemaTpl('className', {label: '外层CSS类名'})]
            }
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

    const toolbarsTooltips:any = {};
    toolbars.forEach(toolbar => {
      if (toolbar.tooltip) {
        toolbarsTooltips[toolbar.tooltip] = 1;
      }
    });

    if (
      parent &&
      (info.renderer?.name === 'flex' || info.renderer?.name === 'container') &&
      !isFlexItem && // 备注：如果是列级元素就不需要显示了
      !draggableContainer
    ) {
      // 非特殊布局元素（fixed、absolute）支持前后插入追加布局元素功能icon
      if (!toolbarsTooltips['上方插入布局容器']) {
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

    if (isFlexItem && !draggableContainer) {
      if (!toolbarsTooltips[`${isFlexColumnItem ? '上方' : '左侧'}插入列级容器`]) {
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
