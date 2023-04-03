import {
  ActiveEventContext,
  BaseEventContext,
  LayoutBasePlugin,
  RegionConfig,
  PluginEvent,
  ResizeMoveEventContext,
  registerEditorPlugin,
  defaultValue,
  getSchemaTpl
} from 'amis-editor-core';

export class ContainerPlugin extends LayoutBasePlugin {
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'container';
  $schema = '/schemas/ContainerSchema.json';

  // 组件名称
  name = '容器';
  isBaseComponent = true;
  description = '一个简单的容器，可以将多个渲染器放置在一起。';
  tags = ['布局'];
  order = -2;
  icon = 'fa fa-square-o';
  pluginIcon = 'container-plugin';
  scaffold = {
    type: 'container',
    body: [],
    style: {
      position: 'static',
      display: 'block'
    },
    wrapperBody: false
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

  panelTitle = '容器';

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    const curRendererSchema = context?.schema;
    const isRowContent =
      curRendererSchema?.direction === 'row' ||
      curRendererSchema?.direction === 'row-reverse';
    // const isFlexContainer = this.manager?.isFlexContainer(context?.id);
    const isFreeContainer = curRendererSchema?.isFreeContainer || false;
    const isFlexItem = this.manager?.isFlexItem(context?.id);
    const isFlexColumnItem = this.manager?.isFlexColumnItem(context?.id);

    const displayTpl = [
      getSchemaTpl('layout:display'),
      getSchemaTpl('layout:flexDirection', {
        visibleOn: 'data.style && data.style.display === "flex"'
      }),
      getSchemaTpl('layout:justifyContent', {
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
          'data.style && data.style.display === "flex" && data.style.flexDirection === "row" || data.style.flexDirection === "row-reverse"'
      }),
      getSchemaTpl('layout:justifyContent', {
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
          'data.style && data.style.display === "flex" && (data.style.flexDirection === "column" || data.style.flexDirection === "column-reverse")'
      }),
      getSchemaTpl('layout:alignItems', {
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
          'data.style && data.style.display === "flex" && (data.style.flexDirection === "column" || data.style.flexDirection === "column-reverse")'
      }),
      getSchemaTpl('layout:alignItems', {
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
          'data.style && data.style.display === "flex" && (data.style.flexDirection === "row" || data.style.flexDirection === "row-reverse")'
      }),
      getSchemaTpl('layout:flex-wrap', {
        visibleOn: 'data.style && data.style.display === "flex"'
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
                name: 'wrapperComponent',
                label: '容器标签',
                type: 'select',
                searchable: true,
                options: [
                  'div',
                  'p',
                  'h1',
                  'h2',
                  'h3',
                  'h4',
                  'h5',
                  'h6',
                  'article',
                  'aside',
                  'code',
                  'footer',
                  'header',
                  'section'
                ],
                pipeIn: defaultValue('div'),
                validations: {
                  isAlphanumeric: true,
                  matchRegexp: '/^(?!.*script).*$/' // 禁用一下script标签
                },
                validationErrors: {
                  isAlpha: 'HTML标签不合法，请重新输入',
                  matchRegexp: 'HTML标签不合法，请重新输入'
                },
                validateOnChange: false
              },
              getSchemaTpl('layout:padding')
            ]
          },
          {
            title: '布局',
            body: [
              getSchemaTpl('layout:position', {
                visibleOn: '!data.stickyStatus'
              }),
              getSchemaTpl('layout:originPosition'),
              getSchemaTpl('layout:inset', {
                mode: 'vertical'
              }),

              // 自由容器不需要 display 相关配置项
              ...(!isFreeContainer ? displayTpl : []),

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
              !isFlexItem && !isFreeContainer
                ? getSchemaTpl('layout:textAlign', {
                    name: 'style.textAlign',
                    label: '内部对齐方式',
                    visibleOn:
                      'data.style && data.style.display !== "flex" && data.style.display !== "inline-flex"'
                  })
                : null,
              getSchemaTpl('layout:z-index'),
              getSchemaTpl('layout:sticky', {
                visibleOn:
                  'data.style && (data.style.position !== "fixed" && data.style.position !== "absolute")'
              }),
              getSchemaTpl('layout:stickyPosition')
            ]
          },
          getSchemaTpl('status')
        ])
      },
      {
        title: '外观',
        className: 'p-none',
        body: getSchemaTpl('collapseGroup', [
          ...getSchemaTpl('style:common', ['layout']),
          getSchemaTpl('style:classNames', {
            isFormItem: false,
            schema: [
              getSchemaTpl('className', {
                name: 'bodyClassName',
                label: '内容区'
              })
            ]
          })
        ])
      }
    ]);
  };
}

registerEditorPlugin(ContainerPlugin);
