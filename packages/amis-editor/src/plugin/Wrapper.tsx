import {registerEditorPlugin} from 'amis-editor-core';
import {LayoutBasePlugin, RegionConfig, BaseEventContext} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';

export class WrapperPlugin extends LayoutBasePlugin {
  // 关联渲染器名字
  rendererName = 'wrapper';
  $schema = '/schemas/WrapperSchema.json';
  disabledRendererPlugin = true; // 组件面板不显示

  // 组件名称
  name = '包裹';
  isBaseComponent = true;
  description = '类似于容器，唯一的区别在于会默认会有一层内边距。';
  docLink = '/amis/zh-CN/components/wrapper';
  tags = ['容器'];
  icon = 'fa fa-square-o';
  scaffold = {
    type: 'wrapper',
    body: '内容'
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

  panelTitle = '包裹';

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    const curRendererSchema = context?.schema;
    // const isFlexContainer = this.manager?.isFlexContainer(context?.id);
    const isFlexItem = this.manager?.isFlexItem(context?.id);
    const isFlexColumnItem = this.manager?.isFlexColumnItem(context?.id);

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
                  getSchemaTpl('layout:position', {
                    visibleOn: '!data.stickyStatus'
                  }),
                  getSchemaTpl('layout:originPosition'),
                  getSchemaTpl('layout:inset', {
                    mode: 'vertical'
                  }),
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
                  }),

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
                  !isFlexItem ? getSchemaTpl('layout:textAlign', {
                    name: 'style.textAlign',
                    label: '内部对齐方式',
                    visibleOn: 'data.style && data.style.display !== "flex" && data.style.display !== "inline-flex"'
                  }) : null,
                  getSchemaTpl('layout:z-index')
                ]
              },
              {
                title: '常用',
                body: [
                  getSchemaTpl('layout:padding'),
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
            ...getSchemaTpl('style:common', ['layout']),
            {
              title: 'CSS 类名',
              body: [
                getSchemaTpl('className', {
                  description: '设置样式后，大小设置将无效。',
                  pipeIn: defaultValue('bg-white')
                })
              ]
            }
          ])
        }
      ])
    ];
  };
  
}

registerEditorPlugin(WrapperPlugin);
