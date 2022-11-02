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
      description: '点击抽屉确认按钮时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data': {
              type: 'object',
              title: '抽屉数据'
            }
          }
        }
      ]
    },
    {
      eventName: 'cancel',
      eventLabel: '取消',
      description: '点击抽屉取消按钮时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data': {
              type: 'object',
              title: '抽屉数据'
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
                ],
                pipeIn: defaultValue('right'),
                pipeOut: (value: any) => (value ? value : 'right'),
                onChange: (
                  value: string,
                  oldValue: string,
                  model: any,
                  form: any
                ) => {
                  if (value === 'left' || value === 'right') {
                    form.deleteValueByName('height');
                  } else if (value === 'top' || value === 'bottom') {
                    form.deleteValueByName('width');
                  }
                }
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
                type: 'button-group-select',
                name: 'size',
                label: '尺寸',
                size: 'sm',
                mode: 'horizontal',
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
              getSchemaTpl('style:widthHeight', {
                widthSchema: {
                  label: tipedLabel(
                    '宽度',
                    '位置为 "左" 或 "右" 时生效。 默认宽度为"尺寸"字段配置的宽度，值单位默认为 px，也支持百分比等单位 ，如：100%'
                  ),
                  disabledOn:
                    'this.position === "top" || this.position === "bottom"'
                },
                heightSchema: {
                  label: tipedLabel(
                    '高度',
                    '位置为 "上" 或 "下" 时生效。 默认宽度为"尺寸"字段配置的高度，值单位默认为 px，也支持百分比等单位 ，如：100%'
                  ),
                  disabledOn:
                    'this.position === "left" || this.position === "right" || !this.position'
                }
              })
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
