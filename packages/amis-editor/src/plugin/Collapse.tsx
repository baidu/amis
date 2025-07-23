import React from 'react';
import {
  RendererPluginAction,
  RendererPluginEvent,
  getI18nEnabled,
  registerEditorPlugin,
  BasePlugin,
  RegionConfig,
  BaseEventContext,
  defaultValue,
  getSchemaTpl,
  PluginEvent,
  PreventClickEventContext
} from 'amis-editor-core';
import {
  buildLinkActionDesc,
  getEventControlConfig
} from '../renderer/event-control/helper';
import {getActionCommonProps} from '../renderer/event-control/helper';
import {generateId} from '../util';

export class CollapsePlugin extends BasePlugin {
  static id = 'CollapsePlugin';
  // 关联渲染器名字
  rendererName = 'collapse';
  useLazyRender = true; // 使用懒渲染
  $schema = '/schemas/CollapseSchema.json';

  // 组件名称
  name = '折叠器';
  isBaseComponent = true;
  description = '折叠器，可以将内容区展开或隐藏，保持页面的整洁';
  docLink = '/amis/zh-CN/components/collapse';
  tags = ['展示'];
  icon = 'fa fa-window-minimize';
  pluginIcon = 'collapse-plugin';
  scaffold = {
    type: 'collapse',
    header: '标题',
    body: [
      {
        type: 'tpl',
        tpl: '内容',
        wrapperComponent: '',
        inline: false,
        id: generateId()
      }
    ]
  };
  previewSchema = {
    ...this.scaffold
  };
  panelTitle = '折叠器';

  panelJustify = true;

  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: '折叠状态改变',
      description: '折叠器折叠状态改变时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                collapsed: {
                  type: 'boolean',
                  title: '折叠器状态'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'expand',
      eventLabel: '折叠器展开',
      description: '折叠器状态变更为展开时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                collapsed: {
                  type: 'boolean',
                  title: '折叠器状态'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'collapse',
      eventLabel: '折叠器收起',
      description: '折叠器状态变更为收起时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                collapsed: {
                  type: 'boolean',
                  title: '折叠器状态'
                }
              }
            }
          }
        }
      ]
    }
  ];

  actions: RendererPluginAction[] = [
    {
      actionType: 'expand',
      actionLabel: '组件展开',
      description: '组件折叠状态变更为展开',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            展开
            {buildLinkActionDesc(props.manager, info)}
          </div>
        );
      }
    },
    {
      actionLabel: '组件收起',
      actionType: 'collapse',
      description: '组件折叠状态变更为收起',
      ...getActionCommonProps('collapse')
    }
  ];

  panelBodyCreator = (context: BaseEventContext) => {
    const i18nEnabled = getI18nEnabled();
    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              getSchemaTpl('title', {
                name: 'header',
                label: '标题',
                pipeIn: defaultValue(
                  context?.schema?.title || context?.schema?.header || ''
                ),
                onChange: (
                  value: any,
                  oldValue: any,
                  model: any,
                  form: any
                ) => {
                  // 转换一下旧版本的title字段
                  form.setValueByName('header', value);
                  form.setValueByName('title', undefined);
                }
              }),
              getSchemaTpl('collapseOpenHeader'),
              {
                name: 'headerPosition',
                label: '标题位置',
                type: 'button-group-select',
                size: 'sm',
                pipeIn: defaultValue('top'),
                options: [
                  {
                    label: '顶部',
                    value: 'top',
                    icon: 'fa fa-arrow-up'
                  },
                  {
                    label: '底部',
                    value: 'bottom',
                    icon: 'fa fa-arrow-down'
                  }
                ]
              },
              {
                name: 'showArrow',
                label: '显示图标',
                mode: 'row',
                inputClassName: 'inline-flex justify-between flex-row-reverse',
                type: 'switch',
                pipeIn: defaultValue(true)
              },

              getSchemaTpl('switch', {
                name: 'collapsable',
                label: '可折叠',
                pipeIn: defaultValue(true)
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
          ...getSchemaTpl('theme:common', {
            exclude: ['layout'],
            hideAnimation: true,
            classname: 'baseControlClassName',
            needState: false,
            baseTitle: '基本样式',
            extra: [
              getSchemaTpl('theme:base', {
                classname: 'headerControlClassName',
                title: '标题区样式',
                state: ['default', 'hover'],
                extra: [
                  getSchemaTpl('theme:font', {
                    label: '文字',
                    name: 'themeCss.headerControlClassName.font'
                  })
                ]
              }),
              getSchemaTpl('theme:base', {
                classname: 'bodyControlClassName',
                needState: false,
                title: '内容区样式'
              })
            ]
          }),
          getSchemaTpl('style:classNames', {
            isFormItem: false,
            schema: [
              getSchemaTpl('className', {
                name: 'headingClassName',
                label: '标题类名'
              }),
              getSchemaTpl('className', {
                name: 'bodyClassName',
                label: '内容类名'
              })
            ]
          })
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

  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: '内容区'
    }
  ];

  onPreventClick(e: PluginEvent<PreventClickEventContext>) {
    const mouseEvent = e.context.data;

    if (mouseEvent.defaultPrevented) {
      return false;
    } else if (
      (mouseEvent.target as HTMLElement).closest(
        `.${this.manager.getThemeClassPrefix()}Collapse-arrow-wrap`
      )
    ) {
      return false;
    }

    return;
  }
}

registerEditorPlugin(CollapsePlugin);
