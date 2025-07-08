import React from 'react';
import {Button, Drawer, Icon, Modal} from 'amis-ui';
import {
  registerEditorPlugin,
  BaseEventContext,
  BasePlugin,
  RegionConfig,
  RendererInfo,
  getSchemaTpl,
  noop,
  defaultValue,
  EditorNodeType,
  isEmpty,
  getI18nEnabled,
  BuildPanelEventContext,
  BasicPanelItem,
  PluginEvent,
  ChangeEventContext,
  JSONPipeOut
} from 'amis-editor-core';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../renderer/event-control/helper';
import omit from 'lodash/omit';
import type {RendererConfig, Schema} from 'amis-core';
import {ModalProps} from 'amis-ui/lib/components/Modal';
import ModalSettingPanel from '../component/ModalSettingPanel';
import find from 'lodash/find';

interface InlineModalProps extends ModalProps {
  type: string;
  children: any;
  dialogType?: string;
  cancelText?: string;
  confirmText?: string;
  cancelBtnLevel?: string;
  confirmBtnLevel?: string;
  editorDialogMountNode?: HTMLDivElement;
}

export class DialogPlugin extends BasePlugin {
  static id = 'DialogPlugin';
  // 关联渲染器名字
  rendererName = 'dialog';
  $schema = '/schemas/DialogSchema.json';

  // 组件名称
  name = '弹窗';
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
      description: '点击弹窗取消按钮时触发',
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
      description: '触发弹窗确认操作',
      descDetail: (info: any) => <div>打开确认对话框</div>
    },
    {
      actionType: 'cancel',
      actionLabel: '取消',
      description: '触发弹窗取消操作'
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
    // 确认对话框的配置面板
    if (context.schema?.dialogType === 'confirm') {
      return getSchemaTpl('tabs', [
        {
          title: '属性',
          body: getSchemaTpl('collapseGroup', [
            {
              title: '基本',
              body: [
                {
                  type: 'input-text',
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

                {
                  label: '标题',
                  type: 'input-text',
                  name: 'title'
                },
                {
                  label: '确认按钮文案',
                  type: 'input-text',
                  name: 'confirmText'
                },
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

              getSchemaTpl('button-manager'),

              getSchemaTpl('switch', {
                label: '展示关闭按钮',
                name: 'showCloseButton',
                value: true
              }),
              getSchemaTpl('switch', {
                label: '点击遮罩关闭',
                name: 'closeOnOutside',
                value: false
              }),
              getSchemaTpl('switch', {
                label: '可按 Esc 关闭',
                name: 'closeOnEsc',
                value: false
              }),
              {
                type: 'ae-StatusControl',
                label: '隐藏按钮区',
                mode: 'normal',
                name: 'hideActions',
                expressionName: 'hideActionsOn'
              },
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
                label: '是否可拖拽',
                name: 'draggable',
                value: false
              }),
              getSchemaTpl('switch', {
                label: '是否可全屏',
                name: 'allowFullscreen',
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
                label: '尺寸',
                type: 'button-group-select',
                name: 'size',
                size: 'xs',
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
                  },
                  {
                    label: '自定义',
                    value: 'custom'
                  }
                ],
                pipeIn: defaultValue(''),
                pipeOut: (value: string) => (value ? value : undefined),
                onChange: (
                  value: string,
                  oldValue: string,
                  model: any,
                  form: any
                ) => {
                  if (value !== 'custom') {
                    form.setValueByName('style', undefined);
                  }
                }
              },
              getSchemaTpl('theme:width2', {
                name: 'style.width',
                disabled: true,
                visibleOn: 'this.size !== "custom"',
                pipeIn: (value: any, form: any) => {
                  if (!form.data.size) {
                    return '500px';
                  } else if (form.data.size === 'sm') {
                    return '350px';
                  } else if (form.data.size === 'md') {
                    return '800px';
                  } else if (form.data.size === 'lg') {
                    return '1100px';
                  } else if (form.data.size === 'xl') {
                    return '90%';
                  }
                  return '';
                }
              }),
              getSchemaTpl('theme:width2', {
                name: 'style.width',
                visibleOn: 'this.size === "custom"',
                pipeIn: defaultValue('500px')
              }),
              getSchemaTpl('theme:height2', {
                name: 'style.height',
                disabled: true,
                visibleOn: 'this.size !== "custom"'
              }),

              getSchemaTpl('theme:height2', {
                name: 'style.height',
                visibleOn: 'this.size === "custom"'
              }),
              getSchemaTpl('theme:border', {
                name: 'themeCss.dialogClassName.border'
              }),
              getSchemaTpl('theme:radius', {
                name: 'themeCss.dialogClassName.radius'
              }),
              getSchemaTpl('theme:shadow', {
                name: 'themeCss.dialogClassName.box-shadow'
              }),
              getSchemaTpl('theme:colorPicker', {
                label: '背景',
                name: 'themeCss.dialogClassName.background',
                labelMode: 'input'
              }),
              getSchemaTpl('theme:colorPicker', {
                label: '遮罩颜色',
                name: 'themeCss.dialogMaskClassName.background',
                labelMode: 'input'
              })
            ]
          },
          {
            title: '标题区',
            body: [
              getSchemaTpl('theme:font', {
                label: '文字',
                name: 'themeCss.dialogTitleClassName.font',
                hasVertical: false
              }),
              getSchemaTpl('theme:paddingAndMargin', {
                name: 'themeCss.dialogHeaderClassName.padding-and-margin',
                label: '间距'
              }),
              getSchemaTpl('theme:colorPicker', {
                label: '背景',
                name: 'themeCss.dialogHeaderClassName.background',
                labelMode: 'input'
              })
            ]
          },
          {
            title: '内容区',
            body: [
              getSchemaTpl('theme:border', {
                name: 'themeCss.dialogBodyClassName.border'
              }),
              getSchemaTpl('theme:radius', {
                name: 'themeCss.dialogBodyClassName.radius'
              }),
              getSchemaTpl('theme:paddingAndMargin', {
                name: 'themeCss.dialogBodyClassName.padding-and-margin',
                label: '间距'
              }),
              getSchemaTpl('theme:colorPicker', {
                label: '背景',
                name: 'themeCss.dialogBodyClassName.background',
                labelMode: 'input'
              })
            ]
          },
          {
            title: '底部区',
            body: [
              getSchemaTpl('theme:paddingAndMargin', {
                name: 'themeCss.dialogFooterClassName.padding-and-margin',
                label: '间距'
              }),
              getSchemaTpl('theme:colorPicker', {
                label: '背景',
                name: 'themeCss.dialogFooterClassName.background',
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

  afterUpdate(event: PluginEvent<ChangeEventContext>) {
    const context = event.context;

    // 当弹出方式改变的时候，切换渲染器类型
    if (
      context.info.renderer.type &&
      ['dialog', 'drawer'].includes(context.info.renderer.type) &&
      context.diff?.some(change => change.path?.join('.') === 'actionType')
    ) {
      const change: any = find(
        context.diff,
        change => change.path?.join('.') === 'actionType'
      )!;

      let value = change?.rhs;
      const newType = value === 'drawer' ? 'drawer' : 'dialog';

      if (
        newType !== context.schema.type &&
        this.manager.replaceChild(context.id, {
          ...context.schema,
          type: value === 'drawer' ? 'drawer' : 'dialog'
        })
      ) {
        setTimeout(() => {
          this.manager.rebuild();
        }, 4);
      }
    }
  }

  buildSubRenderers() {}

  /**
   * dialog 高亮区域应该是里面的内容
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
      // TODO 数据链
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
      $id: 'dialog',
      type: 'object',
      ...inputParams,
      title: node.schema?.label || node.schema?.name,
      properties: dataSchema
    };
  }

  /**
   * 为了让 dialog 的按钮可以点击编辑
   */
  patchSchema(schema: Schema, info: RendererConfig, props?: any) {
    if (Array.isArray(schema.actions)) {
      return;
    }

    return {
      ...schema,
      actions: [
        {
          type: 'button',
          actionType: 'cancel',
          label: '取消'
        },

        props?.confirm
          ? {
              type: 'button',
              actionType: 'confirm',
              label: '确定',
              primary: true
            }
          : null
      ].filter((item: any) => item)
    };
  }

  buildEditorPanel(
    context: BuildPanelEventContext,
    panels: Array<BasicPanelItem>
  ) {
    if (
      this.manager.store.isSubEditor &&
      ['dialog', 'drawer'].includes(this.manager.store.schema?.type)
    ) {
      panels.push({
        key: 'modal-setting',
        icon: '', // 'fa fa-code',
        title: (
          <span
            className="editor-tab-icon editor-tab-s-icon"
            editor-tooltip="弹窗参数"
          >
            <Icon icon="modal-setting" />
          </span>
        ),
        position: 'left',
        component: ModalSettingPanel,
        order: -99999
      });
    }
    super.buildEditorPanel(context, panels);
  }
}

registerEditorPlugin(DialogPlugin);

export class InlineModal extends React.Component<InlineModalProps, any> {
  componentDidMount() {}

  render() {
    let {
      type,
      children,
      dialogType,
      cancelText,
      confirmText,
      cancelBtnLevel,
      confirmBtnLevel,
      editorDialogMountNode
    } = this.props;
    const Container = type === 'drawer' ? Drawer : Modal;

    if (dialogType === 'confirm') {
      children = children.filter((item: any) => item?.key !== 'actions');
      return (
        <Modal {...this.props} container={editorDialogMountNode}>
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
        </Modal>
      );
    }
    return (
      <Container {...this.props} container={editorDialogMountNode}>
        {children}
      </Container>
    );
  }
}
