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
import {SchemaObject} from 'amis/lib/Schema';
import {getOldActionSchema} from '../renderer/event-control/helper';

export class ButtonPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'button';
  $schema = '/schemas/ActionSchema.json';

  // 组件名称
  name = '按钮';
  isBaseComponent = true;
  description =
    '用来展示一个按钮，你可以配置不同的展示样式，配置不同的点击行为。';
  docLink = '/amis/zh-CN/components/button';
  tags = ['按钮'];
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
      defaultShow: true
    },
    {
      eventName: 'mouseenter',
      eventLabel: '鼠标移入',
      description: '鼠标移入时触发'
    },
    {
      eventName: 'mouseleave',
      eventLabel: '鼠标移出',
      description: '鼠标移出时触发'
    }
    // {
    //   eventName: 'doubleClick',
    //   eventLabel: '双击',
    //   description: '鼠标双击事件'
    // }
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

    const buttonStateFunc = (visibleOn: string, state: string) => {
      return [
        {
          mode: 'default',
          type: 'amis-theme-color-picker',
          label: '文字颜色',
          name: `css.className.color:${state}`,
          labelMode: 'input',
          needCustom: true,
          visibleOn: visibleOn
        },
        {
          mode: 'default',
          type: 'amis-theme-color-picker',
          label: '背景颜色',
          name: `css.className.background-color:${state}`,
          labelMode: 'input',
          needCustom: true,
          visibleOn: visibleOn
        },
        // {
        //   type: 'amis-theme-shadow-editor',
        //   name: `css.className.shadow:${state}`,
        //   label: '阴影'
        // },
        {
          mode: 'default',
          label: '边框',
          type: 'amis-theme-border',
          name: `css.className.border:${state}`,
          needColorCustom: true,
          visibleOn: visibleOn
        }
      ];
    };

    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              {
                label: '名称',
                type: 'input-text',
                name: 'label'
              },

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
                  '点击后先询问用户，由手动确认后再执行动作，避免误触。可用<code>\\${xxx}</code>取值。'
                ),
                form: {
                  body: [
                    {
                      name: 'confirmText',
                      type: 'input-text',
                      label: '确认内容'
                    }
                  ]
                }
              },

              {
                type: 'ae-switch-more',
                formType: 'extend',
                mode: 'normal',
                label: '气泡提示',
                hidden: isInDropdown,
                form: {
                  body: [
                    {
                      type: 'input-text',
                      name: 'tooltip',
                      label: tipedLabel(
                        '正常提示',
                        '正常状态下的提示内容，不填则不弹出提示。可用<code>\\${xxx}</code>取值。'
                      )
                    },
                    {
                      type: 'input-text',
                      name: 'disabledTip',
                      label: tipedLabel(
                        '禁用提示',
                        '禁用状态下的提示内容，不填则弹出正常提示。可用<code>\\${xxx}</code>取值。'
                      ),
                      clearValueOnHidden: true,
                      visibleOn: 'data.tooltipTrigger !== "focus"'
                    },
                    {
                      type: 'button-group-select',
                      name: 'tooltipTrigger',
                      label: '触发方式',
                      // visibleOn: 'data.tooltip || data.disabledTip',
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
                      // visibleOn: 'data.tooltip || data.disabledTip',
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
                visibleOn: 'data.active'
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
            title: '样式参数',
            body: [
              {
                type: 'select',
                name: 'state',
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
                  },
                  {
                    label: '禁用',
                    value: 'disabled'
                  }
                ]
              },
              ...buttonStateFunc("${state == 'default' || !state}", 'default'),
              ...buttonStateFunc("${state == 'hover'}", 'hover'),
              ...buttonStateFunc("${state == 'active'}", 'active'),
              ...buttonStateFunc("${state == 'disabled'}", 'disabled')
            ]
          },
          {
            title: '尺寸参数',
            body: [
              {
                mode: 'default',
                label: '尺寸',
                type: 'amis-theme-size-editor',
                name: `css.className.size`,
                hideWidth: true
              },
              {
                mode: 'default',
                type: 'amis-theme-font-editor',
                label: '文字',
                name: `css.className.font`
              },
              {
                mode: 'default',
                type: 'amis-theme-radius',
                label: '圆角',
                name: `css.className.radius`
              },
              {
                mode: 'default',
                type: 'amis-theme-padding-and-margin',
                label: '边距',
                name: `css.className.radipadding-and-margin`
              }
            ]
          },
          getSchemaTpl('style:classNames', {
            isFormItem: false,
            schema: [
              getSchemaTpl('className', {
                name: 'iconClassName',
                label: '左侧图标',
                visibleOn: 'this.icon'
              }),
              getSchemaTpl('className', {
                name: 'rightIconClassName',
                label: '右侧图标',
                visibleOn: 'this.rightIcon'
              })
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
                  ...getEventControlConfig(this.manager, context)
                }),
                getOldActionSchema(this.manager, context)
              ]
            : [
                getSchemaTpl('eventControl', {
                  name: 'onEvent',
                  ...getEventControlConfig(this.manager, context)
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
        renderRenderer: plugin.renderRenderer
      };
    }
  }
}

registerEditorPlugin(ButtonPlugin);
