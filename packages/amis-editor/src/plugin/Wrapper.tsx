import {registerEditorPlugin} from 'amis-editor-core';
import {
  LayoutBasePlugin,
  RegionConfig,
  BaseEventContext
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';

export class WrapperPlugin extends LayoutBasePlugin {
  static id = 'WrapperPlugin';
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'wrapper';
  $schema = '/schemas/AMISWrapperSchema.json';
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
                    visibleOn: '!this.stickyStatus'
                  }),
                  getSchemaTpl('layout:originPosition'),
                  getSchemaTpl('layout:inset', {
                    mode: 'vertical'
                  }),
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
                  !isFlexItem
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
              {
                title: '常用',
                body: [getSchemaTpl('layout:padding')]
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
