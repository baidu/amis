import {
  registerEditorPlugin,
  BaseEventContext,
  BasePlugin,
  RegionConfig,
  RendererInfo,
  defaultValue,
  getSchemaTpl,
  noop
} from 'amis-editor-core';
import {assign, cloneDeep} from 'lodash';
import {getEventControlConfig} from '../renderer/event-control/helper';
import {InlineModal} from './Dialog';
import {tipedLabel} from 'amis-editor-core';

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
                type: 'button-group-select',
                name: 'position',
                label: '位置',
                value: 'right',
                mode: 'horizontal',
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
                ]
              },
              {
                type: 'button-group-select',
                name: 'size',
                label: '尺寸',
                value: 'md',
                size: 'sm',
                mode: 'horizontal',
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
                label: '显示蒙层',
                pipeIn: defaultValue(true)
              }),
              getSchemaTpl('switch', {
                name: 'showCloseButton',
                label: '展示关闭按钮',
                pipeIn: defaultValue(true)
              }),
              getSchemaTpl('switch', {
                name: 'closeOnOutside',
                label: '点击外部关闭'
              }),
              getSchemaTpl('switch', {
                label: '可按 Esc 关闭',
                name: 'closeOnEsc'
              }),
              getSchemaTpl('switch', {
                name: 'resizable',
                label: '可拖拽抽屉大小',
                value: false
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
                }
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
                type: 'input-text',
                name: 'width',
                label: tipedLabel(
                  '宽度',
                  '位置为 "左" 或 "右" 时生效。 默认宽度为"尺寸"字段配置的宽度，值单位默认为 px，也支持百分比等单位 ，如：100%'
                ),
                disabledOn: 'this.position === "top" || this.position === "bottom"',
                tooltip: '位置为 为 "左" 或 "右" 时生效'
              },
              {
                type: 'input-text',
                name: 'height',
                label: tipedLabel(
                  '高度',
                  '位置为 "上" 或 "下" 时生效。 默认宽度为"尺寸"字段配置的高度，值单位默认为 px，也支持百分比等单位 ，如：100%'
                ),
                disabledOn: 'this.position === "left" || this.position === "right"'
              }
            ]
          },
          {
            title: 'CSS类名',
            body: [
              getSchemaTpl('className', {
                label: '外层'
              }),
              getSchemaTpl('className', {
                label: '标题区域',
                name: 'headClassName'
              }),
              getSchemaTpl('className', {
                label: '内容区域',
                name: 'bodyClassName'
              }),
              getSchemaTpl('className', {
                label: '页脚区域',
                name: 'footClassName'
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

registerEditorPlugin(DrawerPlugin);
