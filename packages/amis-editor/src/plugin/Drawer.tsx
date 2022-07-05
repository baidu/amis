import {registerEditorPlugin} from 'amis-editor-core';
import {
  BaseEventContext,
  BasePlugin,
  RegionConfig,
  RendererInfo
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {noop} from 'amis-editor-core';
import {getEventControlConfig} from '../util';
import {InlineModal} from './Dialog';

export class DrawerPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'drawer';
  $schema = '/schemas/DrawerSchema.json';

  // 组件名称
  name = '抽屉式弹框';
  isBaseComponent = true;
  wrapperProps = {
    wrapperComponent: InlineModal,
    onClose: noop,
    resizable: false,
    show: true
  };

  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: '内容区',
      renderMethod: 'renderBody',
      renderMethodOverride: (regions, insertRegion) =>
        function (this: any, ...args: any[]) {
          const info: RendererInfo = this.props.$$editor;
          const dom = this.super(...args);

          if (info && args[1] === 'body') {
            return insertRegion(this, dom, regions, info, info.plugin.manager);
          }

          return dom;
        }
    },
    {
      key: 'actions',
      label: '按钮组',
      renderMethod: 'renderFooter',
      wrapperResolve: dom => dom
    }
  ];

  // 现在没用，后面弹窗优化后有用
  events = [
    {
      eventName: 'confirm',
      eventLabel: '确认',
      description: '点击抽屉确认按钮时触发'
    },
    {
      eventName: 'cancel',
      eventLabel: '取消',
      description: '点击抽屉取消按钮时触发'
    }
  ];

  actions = [
    {
      actionType: 'confirm',
      actionLabel: '确认',
      description: '触发抽屉确认操作'
    },
    {
      actionType: 'cancel',
      actionLabel: '取消',
      description: '触发抽屉取消操作'
    },
    {
      actionType: 'setValue',
      actionLabel: '更新数据',
      description: '触发组件数据更新'
    }
  ];

  panelTitle = '弹框';
  panelBodyCreator = (context: BaseEventContext) => {
    return getSchemaTpl('tabs', [
      {
        title: '常规',
        body: [
          {
            label: '标题',
            type: 'input-text',
            name: 'title'
          },

          // {
          //   children: (
          //     <Button
          //       size="sm"
          //       className="m-b-sm"
          //       level="info"
          //       block
          //       onClick={() => this.manager.showInsertPanel('body')}
          //     >
          //       新增内容
          //     </Button>
          //   )
          // },

          {
            type: 'divider'
          },

          {
            label: '位置',
            type: 'button-group-select',
            name: 'position',
            value: 'right',
            size: 'sm',
            mode: 'inline',
            className: 'block',
            options: [
              {
                label: '左',
                value: 'left'
              },
              {
                label: '上',
                value: 'top'
              },
              {
                label: '右',
                value: 'right'
              },
              {
                label: '下',
                value: 'bottom'
              }
            ],
            description: '定义弹框从什么位置呼出'
          },

          getSchemaTpl('switch', {
            label: '数据映射',
            name: 'data',
            className: 'm-b-xs',
            pipeIn: (value: any) => !!value,
            pipeOut: (value: any) => (value ? {'&': '$$'} : null)
          }),

          {
            type: 'tpl',
            visibleOn: '!this.data',
            tpl:
              '<p class="text-sm text-muted">当没开启数据映射时，弹框中默认会拥有触发打开弹框按钮所在环境的所有数据。</p>'
          },

          {
            type: 'input-kv',
            syncDefaultValue: false,
            name: 'data',
            visibleOn: 'this.data',
            descriptionClassName: 'help-block text-xs m-b-none',
            description:
              '<p>当开启数据映射时，弹框中的数据只会包含设置的部分，请绑定数据。如：<code>{"a": "\\${a}", "b": 2}</code></p><p>如果希望在默认的基础上定制，请先添加一个 Key 为 `&` Value 为 `\\$$` 作为第一行。</p><div>当值为 <code>__undefined</code>时，表示删除对应的字段，可以结合<code>{"&": "\\$$"}</code>来达到黑名单效果。</div>'
          },

          getSchemaTpl('switch', {
            name: 'closeOnOutside',
            label: '点击外部关闭弹框'
          }),

          getSchemaTpl('switch', {
            label: '按 Esc 可关闭',
            name: 'closeOnEsc'
          })
        ]
      },
      {
        title: '外观',
        body: [
          {
            label: '尺寸',
            type: 'button-group-select',
            name: 'size',
            size: 'sm',
            mode: 'inline',
            className: 'block',
            options: [
              {
                label: '超小',
                value: 'xs'
              },
              {
                label: '小',
                value: 'sm'
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
                label: '超大',
                value: 'xl'
              }
            ]
          },

          getSchemaTpl('switch', {
            name: 'overlay',
            label: '是否显示蒙层',
            pipeIn: defaultValue(true)
          }),

          getSchemaTpl('switch', {
            name: 'resizable',
            label: '可拉拽',
            description: '定义弹框是否可拉拽调整大小',
            pipeIn: defaultValue(false)
          }),

          getSchemaTpl('className'),
          getSchemaTpl('className', {
            label: 'bodyClassName 类名',
            name: 'bodyClassName'
          })
        ]
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

  buildSubRenderers() {}
}

registerEditorPlugin(DrawerPlugin);
