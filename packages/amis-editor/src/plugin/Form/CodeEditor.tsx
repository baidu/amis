import {EditorAvailableLanguages as availableLanguages} from 'amis';
import {defaultValue, getSchemaTpl, undefinedPipeOut} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin} from 'amis-editor-core';

import type {BaseEventContext} from 'amis-editor-core';
import {ValidatorTag} from '../../validator';
import {RendererPluginEvent, RendererPluginAction} from 'amis-editor-core';
import {getEventControlConfig} from '../../renderer/event-control/helper';

export class CodeEditorControlPlugin extends BasePlugin {
  static id = 'CodeEditorControlPlugin';
  // 关联渲染器名字
  rendererName = 'editor';
  $schema = '/schemas/EditorControlSchema.json';

  // 组件名称
  name = '代码编辑器';
  isBaseComponent = true;
  icon = 'fa fa-code';
  pluginIcon = 'editor-plugin';
  description = `代码编辑器，采用 monaco-editor 支持：${availableLanguages
    .slice(0, 10)
    .join('，')}等等`;
  docLink = '/amis/zh-CN/components/form/editor';
  tags = ['表单项'];
  scaffold = {
    type: 'editor',
    label: '代码编辑器',
    name: 'editor'
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold,
        value: 'console.log("Hello world.");'
      }
    ]
  };

  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: '代码变化',
      description: '代码变化时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                value: {
                  type: 'string',
                  title: '当前代码内容'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'focus',
      eventLabel: '获取焦点',
      description: '输入框获取焦点时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                value: {
                  type: 'string',
                  title: '当前代码内容'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'blur',
      eventLabel: '失去焦点',
      description: '输入框失去焦点时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                value: {
                  type: 'string',
                  title: '当前代码内容'
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
      actionType: 'clear',
      actionLabel: '清空',
      description: '清除选中值'
    },
    {
      actionType: 'reset',
      actionLabel: '重置',
      description: '将值重置为resetValue，若没有配置resetValue，则清空'
    },
    {
      actionType: 'focus',
      actionLabel: '获取焦点',
      description: '输入框获取焦点'
    },
    {
      actionType: 'setValue',
      actionLabel: '赋值',
      description: '触发组件数据更新'
    }
  ];

  notRenderFormZone = true;

  panelTitle = 'Editor';

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              getSchemaTpl('formItemName', {
                required: true
              }),
              getSchemaTpl('label'),
              {
                label: '语言',
                name: 'language',
                type: 'select',
                value: 'javascript',
                searchable: true,
                options: availableLanguages.concat()
              },

              getSchemaTpl('valueFormula', {
                rendererSchema: {
                  type: 'textarea'
                },
                mode: 'vertical' // 改成上下展示模式
              }),
              getSchemaTpl('switch', {
                label: '可全屏',
                name: 'allowFullscreen',
                pipeIn: defaultValue(true)
              }),
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('description'),
              getSchemaTpl('autoFillApi')
            ]
          },
          getSchemaTpl('status', {
            isFormItem: true,
            unsupportStatic: true
          }),
          getSchemaTpl('validation', {
            tag: ValidatorTag.Code
          })
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          getSchemaTpl('style:formItem', {
            renderer: context.info.renderer,
            schema: [
              {
                name: 'size',
                type: 'select',
                pipeIn: defaultValue(''),
                pipeOut: undefinedPipeOut,
                label: '控件尺寸',
                options: [
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
                    label: '特大',
                    value: 'xl'
                  },

                  {
                    label: '超大',
                    value: 'xxl'
                  }
                ]
              }
            ]
          }),
          getSchemaTpl('style:classNames', {
            unsupportStatic: true
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

  filterProps(props: any) {
    props.disabled = true;
    return props;
  }
}

registerEditorPlugin(CodeEditorControlPlugin);
