import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin, RegionConfig, BaseEventContext} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';

export class WrapperPlugin extends BasePlugin {
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
                  isFlexItem ? getSchemaTpl('layout:flex', {
                    isFlexColumnItem,
                    visibleOn: 'data.style && (data.style.position === "static" || data.style.position === "relative")',
                  }) : null,
                  isFlexItem ? getSchemaTpl('layout:flex-grow', {
                    visibleOn: 'data.style && data.style.flex !== "0 0 auto" && (data.style.position === "static" || data.style.position === "relative")',
                  }) : null,
                  isFlexItem ? getSchemaTpl('layout:flex-basis', {
                    label: isFlexColumnItem ? '默认高度' : '默认宽度',
                    visibleOn: 'data.style && (data.style.position === "static" || data.style.position === "relative")',
                  }) : null,
                  getSchemaTpl('layout:position'),
                  getSchemaTpl('layout:originPosition'),
                  getSchemaTpl('layout:inset', {
                    mode: 'vertical'
                  }),
                  getSchemaTpl('layout:z-index'),
                  getSchemaTpl('layout:display'),
                  getSchemaTpl('layout:flexDirection', {
                    visibleOn: 'data.style && data.style.display === "flex"',
                  }),

                  getSchemaTpl('layout:justifyContent', {
                    label: '水平对齐方式',
                    visibleOn: 'data.style && data.style.display === "flex" && data.style.flexDirection === "row" || data.style.flexDirection === "row-reverse"'
                  }),
                  getSchemaTpl('layout:justifyContent', {
                    label: '垂直对齐方式',
                    visibleOn: 'data.style && data.style.display === "flex" && (data.style.flexDirection === "column" || data.style.flexDirection === "column-reverse")'
                  }),
                  getSchemaTpl('layout:alignItems', {
                    label: '水平对齐方式',
                    visibleOn: 'data.style && data.style.display === "flex" && (data.style.flexDirection === "column" || data.style.flexDirection === "column-reverse")'
                  }),
                  getSchemaTpl('layout:alignItems', {
                    label: '垂直对齐方式',
                    visibleOn: 'data.style && data.style.display === "flex" && (data.style.flexDirection === "row" || data.style.flexDirection === "row-reverse")'
                  }),

                  getSchemaTpl('layout:flex-wrap', {
                    visibleOn: 'data.style && data.style.display === "flex"',
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
                    visibleOn: `${!isFlexItem || !isFlexColumnItem} && (data.isFixedHeight || data.style && data.style.maxHeight) || (${isFlexItem && isFlexColumnItem} && data.style.flex === '0 0 auto')`,
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
                    visibleOn: `${!isFlexItem || isFlexColumnItem} && (data.isFixedWidth || data.style && data.style.maxWidth) || (${isFlexItem && !isFlexColumnItem} && data.style.flex === '0 0 auto')`,
                  }),

                  !isFlexItem ? getSchemaTpl('layout:margin-center') : null,
                ]
              },
              {
                title: '常用',
                body: [
                  {
                    label: '内间距',
                    type: 'button-group-select',
                    name: 'size',
                    size: 'xs',
                    mode: 'row',
                    className: 'ae-buttonGroupSelect--justify',
                    options: [
                      {
                        label: '极小',
                        value: 'xs'
                      },
                      {
                        label: '小',
                        value: 'sm'
                      },
                      {
                        label: '默认',
                        value: ''
                      },
                      {
                        label: '中',
                        value: 'md'
                      },
                      {
                        label: '大',
                        value: 'lg'
                      },
                      {
                        label: '无',
                        value: 'none'
                      }
                    ],
                    pipeIn: defaultValue('')
                  }
                ]
              },
              getSchemaTpl('status'),
              {
                title: '子节点管理',
                body: [
                  {
                    name: 'body',
                    label: false,
                    type: 'combo',
                    scaffold: {
                      type: 'tpl',
                      tpl: '子节点',
                      inline: false
                    },
                    multiple: true,
                    draggableTip: '',
                    items: [
                      {
                        type: 'tpl',
                        tpl:
                          '<span class="label label-default">子节点${index | plus}</span>'
                      }
                    ]
                  }
                ]
              }
            ])
          ]
        },
        {
          title: '外观',
          className: 'p-none',
          body: getSchemaTpl('collapseGroup', [
            ...getSchemaTpl('style:common'),
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
  }
}

registerEditorPlugin(WrapperPlugin);
