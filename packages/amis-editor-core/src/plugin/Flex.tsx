/**
 * @file Flex 布局
 */
import {registerEditorPlugin} from '../manager';
import {
  BasePlugin,
  PluginEvent,
  RegionConfig,
  RendererJSONSchemaResolveEventContext
} from '../plugin';
import {getSchemaTpl} from '../component/schemaTpl';
import {EditorNodeType} from '../store/node';

export class FlexPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'flex';
  $schema = '/schemas/FlexSchema.json';
  disabledRendererPlugin = true;

  // 组件名称
  name = 'Flex 布局';
  isBaseComponent = true;
  icon = 'fa fa-columns';
  description = 'flex 布局';
  docLink = '/amis/zh-CN/components/flex';
  tags = ['容器'];
  scaffold = {
    type: 'flex',
    items: [
      {
        type: 'wrapper',
        body: '第一列'
      },
      {
        type: 'wrapper',
        body: '第二列'
      },
      {
        type: 'wrapper',
        body: '第三列'
      }
    ]
  };
  previewSchema = {
    ...this.scaffold
  };

  panelTitle = 'Flex';
  panelBody = [
    getSchemaTpl('tabs', [
      {
        title: '属性',
        className: 'p-none',
        body: [
          getSchemaTpl('collapseGroup', [
            {
              title: '布局',
              body: [
                {
                  name: 'justify',
                  type: 'select',
                  value: 'center',
                  label: '子节点水平分布方式',
                  menuTpl:
                    "<div class='flex justify-between'><span>${label}</span><span class='text-muted text-sm'>${value}</span></div>",
                  options: [
                    {
                      label: '起始端对齐',
                      value: 'flex-start'
                    },
                    {
                      label: '居中对齐',
                      value: 'center'
                    },
                    {
                      label: '末尾端对齐',
                      value: 'flex-end'
                    },
                    {
                      label: '均匀分布（首尾留空）',
                      value: 'space-around'
                    },
                    {
                      label: '均匀分布（首尾对齐）',
                      value: 'space-between'
                    },
                    {
                      label: '均匀分布（元素等间距）',
                      value: 'space-evenly'
                    },
                    {
                      label: '均匀分布（自动拉伸）',
                      value: 'stretch'
                    }
                  ]
                },
                {
                  name: 'alignItems',
                  type: 'select',
                  value: 'center',
                  label: '子节点垂直方向位置',
                  menuTpl:
                    "<div class='flex justify-between'><span>${label}</span><span class='text-muted text-sm'>${value}</span></div>",
                  options: [
                    {
                      label: '起始端对齐',
                      value: 'flex-start'
                    },
                    {
                      label: '居中对齐',
                      value: 'center'
                    },
                    {
                      label: '末尾端对齐',
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
                  ]
                },
                {
                  name: 'direction',
                  type: 'button-group-select',
                  size: 'sm',
                  label: '布局方向',
                  value: 'row',
                  mode: 'row',
                  options: [
                    {label: '水平', value: 'row'},
                    {label: '垂直', value: 'column'}
                  ]
                }
              ]
            },
            {
              title: '子节点管理',
              body: [
                {
                  name: 'items',
                  label: false,
                  type: 'combo',
                  scaffold: {
                    type: 'wrapper',
                    body: '子节点内容'
                  },
                  minLength: 2,
                  multiple: true,
                  // draggable: true,
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
          ...getSchemaTpl('style:common', ['display']),
          {
            title: 'CSS 类名',
            body: [getSchemaTpl('className', {label: '外层CSS类名'})]
          }
        ])
      },
      {
        title: '状态',
        body: [getSchemaTpl('visible'), getSchemaTpl('disabled')]
      }
    ])
  ];

  regions: Array<RegionConfig> = [
    {
      key: 'items',
      label: '子节点集合',
      // 复写渲染器里面的 render 方法
      renderMethod: 'render',
      dndMode: 'position-h'
    }
  ];

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

registerEditorPlugin(FlexPlugin);
