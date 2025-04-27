import React from 'react';
import {
  registerEditorPlugin,
  BaseEventContext,
  BasePlugin,
  RegionConfig,
  RendererInfo,
  defaultValue,
  getSchemaTpl,
  noop,
  EditorNodeType,
  isEmpty,
  getI18nEnabled,
  JSONPipeOut
} from 'amis-editor-core';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../renderer/event-control/helper';
import {tipedLabel} from 'amis-editor-core';
import omit from 'lodash/omit';
import {InlineModal} from './Dialog';

export class DrawerPlugin extends BasePlugin {
  static id = 'DrawerPlugin';
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
            data: {
              type: 'object',
              title: '数据',
              description: '当前数据域，可以通过.字段名读取对应的值'
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
            data: {
              type: 'object',
              title: '数据',
              description: '当前数据域，可以通过.字段名读取对应的值'
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
      description: '触发抽屉确认操作',
      descDetail: (info: any) => <div>触发确认操作</div>
    },
    {
      actionType: 'cancel',
      actionLabel: '取消',
      description: '触发抽屉取消操作'
    },
    {
      actionType: 'setValue',
      actionLabel: '变量赋值',
      description: '触发组件数据更新',
      ...getActionCommonProps('setValue')
    }
  ];

  panelTitle = '弹框';
  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    const i18nEnabled = getI18nEnabled();
    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              {
                type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                label: '组件名称',
                name: 'editorSetting.displayName'
              },

              {
                type: 'radios',
                label: '弹出方式',
                name: 'actionType',
                pipeIn: (value: any, store: any, data: any) =>
                  value ?? data.type,
                inline: false,
                options: [
                  {
                    label: '弹窗',
                    value: 'dialog'
                  },
                  {
                    label: '抽屉',
                    value: 'drawer'
                  },
                  {
                    label: '确认对话框',
                    value: 'confirmDialog'
                  }
                ]
              },

              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              {
                label: '标题',
                type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                name: 'title'
              },
              getSchemaTpl('switch', {
                name: 'overlay',
                label: '显示蒙层',
                pipeIn: defaultValue(true)
              }),
              getSchemaTpl('button-manager'),
              getSchemaTpl('switch', {
                name: 'showCloseButton',
                label: '展示关闭按钮',
                pipeIn: defaultValue(true)
              }),
              getSchemaTpl('switch', {
                name: 'closeOnOutside',
                label: '点击遮罩关闭'
              }),
              getSchemaTpl('switch', {
                label: '可按 Esc 关闭',
                name: 'closeOnEsc'
              }),
              {
                type: 'ae-StatusControl',
                label: '隐藏按钮区',
                mode: 'normal',
                name: 'hideActions',
                expressionName: 'hideActionsOn'
              },
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
            title: '样式',
            body: [
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
                  visibleOn:
                    'this.position === "left" || this.position === "right" || !this.position'
                },
                heightSchema: {
                  label: tipedLabel(
                    '高度',
                    '位置为 "上" 或 "下" 时生效。 默认宽度为"尺寸"字段配置的高度，值单位默认为 px，也支持百分比等单位 ，如：100%'
                  ),
                  visibleOn:
                    'this.position === "top" || this.position === "bottom"'
                }
              }),
              getSchemaTpl('theme:border', {
                name: 'themeCss.drawerClassName.border'
              }),
              getSchemaTpl('theme:radius', {
                name: 'themeCss.drawerClassName.radius'
              }),
              getSchemaTpl('theme:shadow', {
                name: 'themeCss.drawerClassName.box-shadow'
              }),
              getSchemaTpl('theme:colorPicker', {
                label: '背景',
                name: 'themeCss.drawerClassName.background',
                labelMode: 'input'
              }),
              getSchemaTpl('theme:colorPicker', {
                label: '遮罩颜色',
                name: 'themeCss.drawerMaskClassName.background',
                labelMode: 'input'
              })
            ]
          },
          {
            title: '标题区',
            body: [
              getSchemaTpl('theme:font', {
                label: '文字',
                name: 'themeCss.drawerTitleClassName.font'
              }),
              getSchemaTpl('theme:paddingAndMargin', {
                name: 'themeCss.drawerHeaderClassName.padding-and-margin',
                label: '间距'
              }),
              getSchemaTpl('theme:colorPicker', {
                label: '背景',
                name: 'themeCss.drawerHeaderClassName.background',
                labelMode: 'input'
              })
            ]
          },
          {
            title: '内容区',
            body: [
              getSchemaTpl('theme:border', {
                name: 'themeCss.drawerBodyClassName.border'
              }),
              getSchemaTpl('theme:radius', {
                name: 'themeCss.drawerBodyClassName.radius'
              }),
              getSchemaTpl('theme:paddingAndMargin', {
                name: 'themeCss.drawerBodyClassName.padding-and-margin',
                label: '间距'
              }),
              getSchemaTpl('theme:colorPicker', {
                label: '背景',
                name: 'themeCss.drawerBodyClassName.background',
                labelMode: 'input'
              })
            ]
          },
          {
            title: '底部区',
            body: [
              getSchemaTpl('theme:paddingAndMargin', {
                name: 'themeCss.drawerFooterClassName.padding-and-margin',
                label: '间距'
              }),
              getSchemaTpl('theme:colorPicker', {
                label: '背景',
                name: 'themeCss.drawerFooterClassName.background',
                labelMode: 'input'
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

  /**
   * drawer 高亮区域应该是里面的内容
   */
  wrapperResolve(dom: HTMLElement): HTMLElement | Array<HTMLElement> {
    return dom.lastChild as HTMLElement;
  }

  async buildDataSchemas(
    node: EditorNodeType,
    region?: EditorNodeType,
    trigger?: EditorNodeType
  ) {
    const renderer = this.manager.store.getNodeById(node.id)?.getComponent();
    const data = omit(renderer.props.$schema.data, '$$id');
    const inputParams = JSONPipeOut(renderer.props.$schema.inputParams);
    let dataSchema: any = {
      ...inputParams?.properties
    };

    if (renderer.props.$schema.data === undefined || !isEmpty(data)) {
      // 静态数据
      for (const key in data) {
        if (!['&'].includes(key)) {
          dataSchema[key] = {
            type: typeof data[key] ?? 'string', // 默认文本，不好确定类型
            title: key
          };
        }
      }

      // 弹窗改版可能会有多个按钮触发一个弹窗，无法确定按钮的上下文
      // 数据链
      // const hostNodeDataSchema =
      //   await this.manager.config.getHostNodeDataSchema?.();
      // hostNodeDataSchema
      //   ?.filter(
      //     (item: any) => !['system-variable', 'page-global'].includes(item.$id)
      //   )
      //   ?.forEach((item: any) => {
      //     dataSchema = {
      //       ...dataSchema,
      //       ...item.properties
      //     };
      //   });
    }

    return {
      $id: 'drawer',
      type: 'object',
      ...inputParams,
      title: node.schema?.label || node.schema?.name,
      properties: dataSchema
    };
  }
}

registerEditorPlugin(DrawerPlugin);
