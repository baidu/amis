import React from 'react';
import {Button} from 'amis-ui';
import {
  registerEditorPlugin,
  BaseEventContext,
  BasePlugin,
  RegionConfig,
  RendererInfo,
  getSchemaTpl,
  noop,
  defaultValue
} from 'amis-editor-core';
import {getEventControlConfig} from '../renderer/event-control/helper';

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
      description: '点击弹窗确认按钮时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data': {
              type: 'object',
              title: '弹窗数据'
            }
          }
        }
      ]
    },
    {
      eventName: 'cancel',
      eventLabel: '取消',
      description: '点击弹窗取消按钮时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data': {
              type: 'object',
              title: '弹窗数据'
            }
          }
        }
      ]
    }
  ];

  actions = [
    {
      actionType: 'confirm',
      actionLabel: '确认',
      description: '触发弹窗确认操作'
    },
    {
      actionType: 'cancel',
      actionLabel: '取消',
      description: '触发弹窗取消操作'
    },
    {
      actionType: 'setValue',
      actionLabel: '变量赋值',
      description: '触发组件数据更新'
    }
  ];

  panelTitle = '弹框';
  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    // 确认对话框的配置面板
    if (context.schema?.dialogType === 'confirm') {
      return getSchemaTpl('tabs', [
        {
          title: '属性',
          body: getSchemaTpl('collapseGroup', [
            {
              title: '基本',
              body: [
                getSchemaTpl('layout:originPosition', {value: 'left-top'}),
                {
                  label: '标题',
                  type: 'input-text',
                  name: 'title'
                },
                getSchemaTpl('layout:originPosition', {value: 'left-top'}),
                {
                  label: '确认按钮文案',
                  type: 'input-text',
                  name: 'confirmText'
                },
                getSchemaTpl('layout:originPosition', {value: 'left-top'}),
                {
                  label: '取消按钮文案',
                  type: 'input-text',
                  name: 'cancelText'
                },
                getSchemaTpl('switch', {
                  label: '可按 Esc 关闭',
                  name: 'closeOnEsc',
                  value: false
                })
              ]
            }
          ])
        },
        {
          title: '外观',
          body: getSchemaTpl('collapseGroup', [
            {
              title: '基本',
              body: [
                {
                  label: '尺寸',
                  type: 'button-group-select',
                  name: 'size',
                  size: 'sm',
                  options: [
                    {
                      label: '标准',
                      value: ''
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
                  ],
                  pipeIn: defaultValue(''),
                  pipeOut: (value: string) => (value ? value : undefined)
                },
                getSchemaTpl('buttonLevel', {
                  label: '确认按钮样式',
                  name: 'confirmBtnLevel'
                }),
                getSchemaTpl('buttonLevel', {
                  label: '取消按钮样式',
                  name: 'cancelBtnLevel'
                })
              ]
            }
          ])
        }
      ]);
    }
    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              {
                label: '标题',
                type: 'input-text',
                name: 'title'
              },
              getSchemaTpl('switch', {
                label: '展示关闭按钮',
                name: 'showCloseButton',
                value: true
              }),
              getSchemaTpl('switch', {
                label: '可按 Esc 关闭',
                name: 'closeOnEsc',
                value: false
              }),
              getSchemaTpl('switch', {
                label: '左下角展示报错消息',
                name: 'showErrorMsg',
                value: true
              }),
              getSchemaTpl('switch', {
                label: '左下角展示loading动画',
                name: 'showLoading',
                value: true
              }),
              getSchemaTpl('dataMap')
            ]
          }
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              {
                label: '尺寸',
                type: 'button-group-select',
                name: 'size',
                size: 'sm',
                options: [
                  {
                    label: '标准',
                    value: ''
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
                ],
                pipeIn: defaultValue(''),
                pipeOut: (value: string) => (value ? value : undefined)
              }
            ]
          },
          {
            title: 'CSS类名',
            body: [
              getSchemaTpl('className', {
                name: 'className',
                label: '外层'
              }),
              getSchemaTpl('className', {
                name: 'bodyClassName',
                label: '内容区域'
              })
            ]
          }
        ])
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
    let {
      children,
      dialogType,
      cancelText,
      confirmText,
      cancelBtnLevel,
      confirmBtnLevel
    } = this.props;
    if (dialogType === 'confirm') {
      children = children.filter((item: any) => item?.key !== 'actions');
      return (
        <div className="ae-InlineModal">
          {children}
          <div className="ae-InlineModal-footer">
            <Button
              className="ae-InlineModal-footer-btn"
              level={cancelBtnLevel}
            >
              {cancelText || '取消'}
            </Button>
            <Button
              className="ae-InlineModal-footer-btn"
              level={confirmBtnLevel}
            >
              {confirmText || '确认'}
            </Button>
          </div>
        </div>
      );
    }
    return <div className="ae-InlineModal">{children}</div>;
  }
}
