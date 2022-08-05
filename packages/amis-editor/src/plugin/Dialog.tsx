import React from 'react';
import {
  registerEditorPlugin,
  BaseEventContext,
  BasePlugin,
  RegionConfig,
  RendererInfo,
  getSchemaTpl,
  noop
} from 'amis-editor-core';
import {cloneDeep, assign} from 'lodash';
import {getEventControlConfig} from '../renderer/event-control/helper';
import {tipedLabel} from '../component/BaseControl';

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
      description: '点击弹窗确认按钮时触发'
    },
    {
      eventName: 'cancel',
      eventLabel: '取消',
      description: '点击弹窗取消按钮时触发'
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
      actionLabel: '更新数据',
      description: '触发组件数据更新'
    }
  ];

  panelTitle = '弹框';
  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              {
                label: '标题',
                type: 'input-text',
                name: 'title'
              },
              {
                label: '尺寸',
                type: 'button-group-select',
                value: 'md',
                name: 'size',
                size: 'sm',
                options: [
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
              getSchemaTpl('switch', {
                label: tipedLabel(
                  '数据映射',
                  '<div> 当开启数据映射时，弹框中的数据只会包含设置的部分，请绑定数据。如：{"a": "${a}", "b": 2}。</div>'
                  + '<div>当值为 __undefined时，表示删除对应的字段，可以结合{"&": "$$"}来达到黑名单效果。</div>'
                ),
                name: 'dataMapSwitch',
                value: false,
                className: 'm-b-xs',
                onChange: (value: any, oldValue: any, model: any, form: any) => {
                  const newDataValue = value ? {} : null;
                  form.setValues({
                    __dataMap: newDataValue,
                    data: newDataValue
                  });
                }
              }),
              {
                type: 'alert',
                level: 'info',
                visibleOn: 'this.dataMapSwitch',
                className: 'relative',
                body: [
                  {
                    type: 'tpl',
                    tpl: '${data["&"] ? "已开启定制参数功能，可点击关闭该功能。" : "如果需要在默认数据的基础上定制参数，请配置开启参数定制再定义key和value。"}'
                  },
                  {
                    type: 'button',
                    label: '${data["&"] ? "立即关闭" : "立即开启"}',
                    level: 'link',
                    className: 'absolute bottom-3 right-10',
                    onClick: (e: any, props: any) => {
                      const newData = props.data.data?.['&'] === '$$' ? {} : {'&': '$$'};
                      // 用onBulkChange保证代码视图和编辑区域数据保持同步
                      props.onBulkChange({
                        data: newData,
                        __dataMap: {}
                      });
                    }
                  }
                ],
                showCloseButton: true
              },
              getSchemaTpl('combo-container', {
                type: 'input-kv',
                syncDefaultValue: false,
                name: '__dataMap',
                value: null,
                visibleOn: 'this.dataMapSwitch',
                className: 'block -mt-5',
                deleteBtn: {
                  icon: 'fa fa-trash'
                },
                onChange: (value: any, oldValue: any, model: any, form: any) => {
                  // 用assign保证'&'第一个被遍历到
                  const newDataMap = form.data.data?.['&'] ?
                    assign({'&': '$$'}, value) : cloneDeep(value);
                  form.setValues({
                    data: newDataMap
                  });
                  form.setValues({
                    data: newDataMap
                  });
                }
              }),
            ]
          }
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
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
    const {children} = this.props;
    return <div className="ae-InlineModel">{children}</div>;
  }
}
