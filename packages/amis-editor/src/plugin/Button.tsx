import {registerEditorPlugin} from 'amis-editor-core';
import {
  BaseEventContext,
  BasePlugin,
  BasicRendererInfo,
  PluginInterface,
  RendererInfoResolveEventContext,
  tipedLabel
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {BUTTON_DEFAULT_ACTION} from '../component/BaseControl';
import {getEventControlConfig} from '../renderer/event-control/helper';
import {RendererPluginAction, RendererPluginEvent} from 'amis-editor-core';
import type {SchemaObject} from 'amis';
import {getOldActionSchema} from '../renderer/event-control/helper';
import {buttonStateFunc} from '../renderer/style-control/helper';
import {InlineEditableElement} from 'amis-editor-core';

export class ButtonPlugin extends BasePlugin {
  static id = 'ButtonPlugin';
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'button';
  $schema = '/schemas/ActionSchema.json';

  order = -400;

  // 组件名称
  name = '按钮';
  isBaseComponent = true;
  description =
    '用来展示一个按钮，你可以配置不同的展示样式，配置不同的点击行为。';
  docLink = '/amis/zh-CN/components/button';
  tags = ['功能'];
  icon = 'fa fa-square';
  pluginIcon = 'button-plugin';
  scaffold: SchemaObject = {
    type: 'button',
    label: '按钮',
    ...BUTTON_DEFAULT_ACTION
  };
  previewSchema: any = {
    type: 'button',
    label: '按钮'
  };

  panelTitle = '按钮';

  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'click',
      eventLabel: '点击',
      description: '点击时触发',
      defaultShow: true,
      dataSchema: [
        {
          type: 'object',
          properties: {
            context: {
              type: 'object',
              title: '上下文',
              properties: {
                nativeEvent: {
                  type: 'object',
                  title: '鼠标事件对象'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'mouseenter',
      eventLabel: '鼠标移入',
      description: '鼠标移入时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            context: {
              type: 'object',
              title: '上下文',
              properties: {
                nativeEvent: {
                  type: 'object',
                  title: '鼠标事件对象'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'mouseleave',
      eventLabel: '鼠标移出',
      description: '鼠标移出时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            context: {
              type: 'object',
              title: '上下文',
              properties: {
                nativeEvent: {
                  type: 'object',
                  title: '鼠标事件对象'
                }
              }
            }
          }
        }
      ]
    }
    // {
    //   eventName: 'doubleClick',
    //   eventLabel: '双击',
    //   description: '鼠标双击事件'
    // }
  ];

  // 定义可以内联编辑的元素
  inlineEditableElements: Array<InlineEditableElement> = [
    {
      match: ':scope>span',
      key: 'label'
    }
  ];

  // 动作定义
  actions: RendererPluginAction[] = [];

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    const isInDialog = /(?:\/|^)dialog\/.+$/.test(context.path);
    const isInDrawer = /(?:\/|^)drawer\/.+$/.test(context.path);

    // TODO: 旧方法无法判断，context 中没有 dropdown-button 的信息，临时实现
    // const isInDropdown = /(?:\/|^)dropdown-button\/.+$/.test(context.path);
    const isInDropdown = /^button-group\/.+$/.test(context.path);

    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              getSchemaTpl('label', {
                label: '名称'
              }),
              {
                label: '类型',
                type: 'button-group-select',
                name: 'type',
                size: 'sm',
                visibleOn: 'type === "submit" || type === "reset" ',
                options: [
                  {
                    label: '按钮',
                    value: 'button'
                  },

                  {
                    label: '提交',
                    value: 'submit'
                  },

                  {
                    label: '重置',
                    value: 'reset'
                  }
                ]
              },

              getSchemaTpl('switch', {
                name: 'close',
                label: '是否关闭',
                clearValueOnHidden: true,
                labelRemark: `指定此次操作完后关闭当前 ${
                  isInDialog ? 'dialog' : 'drawer'
                }`,
                hidden: !isInDialog && !isInDrawer,
                pipeIn: defaultValue(false)
              }),

              {
                type: 'ae-switch-more',
                mode: 'normal',
                formType: 'extend',
                label: tipedLabel(
                  '二次确认',
                  '点击后先询问用户，由手动确认后再执行动作，避免误触。可从数据域变量中取值。'
                ),
                form: {
                  body: [
                    getSchemaTpl('textareaFormulaControl', {
                      label: '确认内容',
                      mode: 'normal',
                      name: 'confirmText'
                    })
                  ]
                }
              },

              {
                type: 'ae-switch-more',
                formType: 'extend',
                mode: 'normal',
                label: '气泡提示',
                id: 'button-tooltip', //便于扩充定位
                hidden: isInDropdown,
                form: {
                  body: [
                    getSchemaTpl('textareaFormulaControl', {
                      name: 'tooltip',
                      mode: 'normal',
                      label: tipedLabel(
                        '正常提示',
                        '正常状态下的提示内容，不填则不弹出提示。可从数据域变量中取值。'
                      )
                    }),
                    getSchemaTpl('textareaFormulaControl', {
                      name: 'disabledTip',
                      mode: 'normal',
                      label: tipedLabel(
                        '禁用提示',
                        '禁用状态下的提示内容，不填则弹出正常提示。可从数据域变量中取值。'
                      ),
                      clearValueOnHidden: true,
                      visibleOn: 'this.tooltipTrigger !== "focus"'
                    }),
                    {
                      type: 'button-group-select',
                      name: 'tooltipTrigger',
                      label: '触发方式',
                      // visibleOn: 'this.tooltip || this.disabledTip',
                      size: 'sm',
                      options: [
                        {
                          label: '鼠标悬浮',
                          value: 'hover'
                        },
                        {
                          label: '聚焦',
                          value: 'focus'
                        }
                      ],
                      pipeIn: defaultValue('hover')
                    },
                    {
                      type: 'button-group-select',
                      name: 'tooltipPlacement',
                      // visibleOn: 'this.tooltip || this.disabledTip',
                      label: '提示位置',
                      size: 'sm',
                      options: [
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
                        },
                        {
                          label: '左',
                          value: 'left'
                        }
                      ],
                      pipeIn: defaultValue('bottom')
                    }
                  ]
                }
              },

              getSchemaTpl('icon', {
                label: '左侧图标'
              }),

              getSchemaTpl('icon', {
                name: 'rightIcon',
                label: '右侧图标'
              }),
              getSchemaTpl('badge'),
              getSchemaTpl('switch', {
                name: 'disabledOnAction',
                label: '动作完成前禁用',
                value: false
              })
            ]
          },
          getSchemaTpl('status', {
            disabled: true
          })
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              getSchemaTpl('buttonLevel', {
                label: '样式',
                name: 'level',
                hidden: isInDropdown
              }),

              getSchemaTpl('buttonLevel', {
                label: '高亮样式',
                name: 'activeLevel',
                hidden: isInDropdown,
                visibleOn: 'this.active'
              }),

              getSchemaTpl('switch', {
                name: 'block',
                label: '块状显示',
                hidden: isInDropdown
              }),

              getSchemaTpl('size', {
                label: '尺寸',
                hidden: isInDropdown
              })
            ]
          },
          {
            title: '基本样式',
            body: [
              {
                type: 'select',
                name: '__editorState',
                label: '状态',
                selectFirst: true,
                options: [
                  {
                    label: '常规',
                    value: 'default'
                  },
                  {
                    label: '悬浮',
                    value: 'hover'
                  },
                  {
                    label: '点击',
                    value: 'active'
                  }
                ]
              },
              ...buttonStateFunc(
                "${__editorState == 'default' || !__editorState}",
                'default'
              ),
              ...buttonStateFunc("${__editorState == 'hover'}", 'hover'),
              ...buttonStateFunc("${__editorState == 'active'}", 'active')
            ]
          },
          getSchemaTpl('theme:singleCssCode', {
            selectors: [
              {
                label: '按钮基本样式',
                isRoot: true,
                selector: '.cxd-Button'
              },
              {
                label: '按钮内容样式',
                selector: 'span'
              }
            ]
          })
        ])
      },
      {
        title: '事件',
        className: 'p-none',
        body:
          !!context.schema.actionType ||
          ['submit', 'reset'].includes(context.schema.type)
            ? [
                getSchemaTpl('eventControl', {
                  name: 'onEvent',
                  ...getEventControlConfig(this.manager, context),
                  rawType: 'button'
                }),
                getOldActionSchema(this.manager, context)
              ]
            : [
                getSchemaTpl('eventControl', {
                  name: 'onEvent',
                  ...getEventControlConfig(this.manager, context),
                  rawType: 'button'
                })
              ]
      }
    ]);
  };

  /**
   * 如果禁用了没办法编辑
   */
  filterProps(props: any) {
    props.disabled = false;
    return props;
  }

  /**
   * 如果配置里面有 rendererName 自动返回渲染器信息。
   * @param renderer
   */
  getRendererInfo({
    renderer,
    schema
  }: RendererInfoResolveEventContext): BasicRendererInfo | void {
    const plugin: PluginInterface = this;

    if (
      schema.$$id &&
      plugin.name &&
      plugin.rendererName &&
      plugin.rendererName === renderer.name
    ) {
      // 复制部分信息出去
      return {
        name: schema.label ? schema.label : plugin.name,
        regions: plugin.regions,
        patchContainers: plugin.patchContainers,
        // wrapper: plugin.wrapper,
        vRendererConfig: plugin.vRendererConfig,
        wrapperProps: plugin.wrapperProps,
        wrapperResolve: plugin.wrapperResolve,
        filterProps: plugin.filterProps,
        $schema: plugin.$schema,
        renderRenderer: plugin.renderRenderer,
        inlineEditableElements: plugin.inlineEditableElements
      };
    }
  }
}

registerEditorPlugin(ButtonPlugin);
