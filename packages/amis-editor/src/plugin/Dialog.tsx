import React from 'react';
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

export class DialogPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'dialog';
  $schema = '/schemas/DialogSchema.json';

  // 组件名称
  name = '弹框';
  isBaseComponent = true;

  wrapperProps = {
    wrapperComponent: InlineModal,
    onClose: noop,
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
      description: '确认'
    },
    {
      eventName: 'cancel',
      eventLabel: '取消',
      description: '取消'
    }
  ];

  actions = [
    {
      actionType: 'confirm',
      actionLabel: '确认',
      description: '确认操作'
    },
    {
      actionType: 'cancel',
      actionLabel: '取消',
      description: '取消操作'
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

          getSchemaTpl('switch', {
            label: '数据映射',
            name: 'data',
            className: 'block m-b-xs',
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
              '<p>当开启数据映射时，弹框中的数据只会包含设置的部分，请绑定数据。如：<code>{"a": "\\${a}", "b": 2}</code></p><p>如果希望在默认的基础上定制，请先添加一个 Key 为 `&` Value 为 `\\$$` 作为第一行。</p><div>当值为 <code>__undefined</code>时，表示删除对应的字段，可以结合<code>{"&": "\\$$"}</code>来达到黑名单效果。</div>',
            messages: {
              validateFailed: '数据映射中存在错误，请仔细检查'
            }
          },

          getSchemaTpl('switch', {
            label: '按 Esc 关闭弹框',
            name: 'closeOnEsc',
            value: false
          }),

          getSchemaTpl('switch', {
            label: '点击弹框外区域关闭弹框',
            name: 'closeOnOutside',
            value: false
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
            className: 'block',
            pipeIn: defaultValue(''),
            options: [
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
                label: '超大',
                value: 'xl'
              }
            ]
          },

          getSchemaTpl('switch', {
            label: '是否显示关闭按钮',
            name: 'showCloseButton',
            value: true
          }),

          getSchemaTpl('className', {
            name: 'headerClassName',
            label: '顶部 CSS 类名'
          }),

          getSchemaTpl('className', {
            name: 'bodyClassName',
            label: '内容 CSS 类名'
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

registerEditorPlugin(DialogPlugin);

export class InlineModal extends React.Component<any, any> {
  componentDidMount() {}

  render() {
    const {children} = this.props;
    return <div className="ae-InlineModel">{children}</div>;
  }
}
