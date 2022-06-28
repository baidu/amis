/**
 * @file Flex 常见布局 1:3
 */
import {
  BasePlugin,
  PluginEvent
} from 'amis-editor-core';
import {getSchemaTpl} from 'amis-editor-core';
import type {
  BaseEventContext,
  EditorNodeType,
  RegionConfig,
  RendererJSONSchemaResolveEventContext
} from 'amis-editor-core';
import {tipedLabel} from '../../component/BaseControl';

export class FlexPluginBase extends BasePlugin {
  rendererName = 'flex';
  $schema = '/schemas/FlexSchema.json';
  disabledRendererPlugin = false;

  // 组件名称
  name = '布局容器';
  isBaseComponent = true;
  icon = 'fa fa-columns';
  pluginIcon = 'flex-container-plugin';
  description = '布局容器 是基于 CSS Flex 实现的布局效果，它比 Grid 和 HBox 对子节点位置的可控性更强，比用 CSS 类的方式更易用';
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

  panelJustify = true; // 右侧配置项默认左右展示

  panelBodyCreator = (context: BaseEventContext) => {
    const curRendererSchema = context?.schema;
    const isRowContent = curRendererSchema?.direction === 'row' || curRendererSchema?.direction === 'row-reverse';
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
                  getSchemaTpl('layout:position'),
                  getSchemaTpl('layout:inset', {
                    mode: 'vertical',
                  }),
                  getSchemaTpl('layout:z-index'),
                  getSchemaTpl('layout:flexDirection', {
                    name: 'direction',
                  }),
                  getSchemaTpl('layout:justifyContent', {
                    name: 'justify',
                    // mode: 'vertical', // 改成上下展示模式
                    label: tipedLabel(`${isRowContent ? '水平' : '垂直'}对齐方式`, '设置子元素在主轴上的对齐方式')
                  }),
                  getSchemaTpl('layout:alignItems', {
                    name: 'alignItems',
                    label: tipedLabel(`${isRowContent ? '垂直' : '水平'}对齐方式`, '设置子元素在交叉轴上的对齐方式')
                  }),
                  getSchemaTpl('layout:isFixedHeight'),
                  getSchemaTpl('layout:height'),
                  getSchemaTpl('layout:isFixedWidth'),
                  getSchemaTpl('layout:width'),
                  getSchemaTpl('layout:max-height'),
                  getSchemaTpl('layout:max-width'),
                  getSchemaTpl('layout:overflow-x'),
                  getSchemaTpl('layout:overflow-y'),
                  getSchemaTpl('layout:margin-center'),
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
  };

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
