import {EditorAvailableLanguages as availableLanguages} from 'amis';
import {
  defaultValue,
  getSchemaTpl,
  undefinedPipeOut,
  registerEditorPlugin,
  BasePlugin
} from 'amis-editor-core';
import type {BaseEventContext} from 'amis-editor-core';
import {ValidatorTag} from '../../validator';
import {getEventControlConfig} from '../../renderer/event-control/helper';
import {RendererPluginEvent, RendererPluginAction} from 'amis-editor-core';
import {getActionCommonProps} from '../../renderer/event-control/helper';

export class DiffEditorControlPlugin extends BasePlugin {
  static id = 'DiffEditorControlPlugin';
  // 关联渲染器名字
  rendererName = 'diff-editor';
  $schema = '/schemas/DiffEditorControlSchema.json';

  // 组件名称
  name = 'Diff编辑器';
  isBaseComponent = true;
  icon = 'fa fa-columns';
  pluginIcon = 'diff-editor-plugin';
  description = `左右两边的代码做对比，支持的语言包括：${availableLanguages
    .slice(0, 10)
    .join('，')}等等`;
  searchKeywords = '对比编辑器';
  docLink = '/amis/zh-CN/components/form/diff-editor';
  tags = ['表单项'];
  scaffold = {
    type: 'diff-editor',
    label: 'diff编辑器',
    name: 'diff'
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold,
        value: 'Hello World\nLine 1\nNew line\nBla Bla',
        diffValue: 'Hello World\nLine 2'
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
      description: '右侧输入框获取焦点时触发',
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
      description: '右侧输入框失去焦点时触发',
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
      description: '清除选中值',
      ...getActionCommonProps('clear')
    },
    {
      actionType: 'reset',
      actionLabel: '重置',
      description: '将值重置为初始值',
      ...getActionCommonProps('reset')
    },
    {
      actionType: 'focus',
      actionLabel: '获取焦点',
      description: '获取焦点，焦点落在右侧编辑面板',
      ...getActionCommonProps('focus')
    },
    {
      actionType: 'setValue',
      actionLabel: '赋值',
      description: '触发组件数据更新',
      ...getActionCommonProps('setValue')
    }
  ];

  notRenderFormZone = true;

  panelTitle = 'Diff编辑器';

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
                  type: 'textarea',
                  value: context?.schema.diffValue
                },
                label: '左侧默认值',
                name: 'diffValue',
                mode: 'vertical' // 改成上下展示模式
              }),
              getSchemaTpl('valueFormula', {
                rendererSchema: {
                  type: 'textarea',
                  value: context?.schema.value
                },
                label: '右侧默认值',
                mode: 'vertical' // 改成上下展示模式
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
            tag: ValidatorTag.All
          })
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          getSchemaTpl('theme:formItem'),
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

registerEditorPlugin(DiffEditorControlPlugin);
