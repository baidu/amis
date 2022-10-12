import {availableLanguages} from 'amis/lib/renderers/Form/Editor';
import {
  defaultValue,
  getSchemaTpl,
  undefinedPipeOut,
  valuePipeOut
} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin} from 'amis-editor-core';

import type {BaseEventContext} from 'amis-editor-core';
import {ValidatorTag} from '../../validator';
import {getEventControlConfig} from '../../renderer/event-control/helper';
import {RendererPluginEvent, RendererPluginAction} from 'amis-editor-core';

export class DiffEditorControlPlugin extends BasePlugin {
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
            'event.data.value': {
              type: 'string',
              title: '当前代码'
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
            'event.data.value': {
              type: 'string',
              title: '当前代码'
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
            'event.data.value': {
              type: 'string',
              title: '当前代码'
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
      description: '获取焦点，焦点落在右侧编辑面板'
    },
    {
      actionType: 'setValue',
      actionLabel: '赋值',
      description: '触发组件数据更新'
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
              {
                type: 'textarea',
                name: 'diffValue',
                label: '左侧默认值',
                pipeOut: valuePipeOut,
                placeholder: '支持使用 ${xxx} 来获取变量'
              },
              {
                type: 'textarea',
                name: 'value',
                label: '右侧默认值',
                placeholder: '支持使用 ${xxx} 来获取变量'
              },
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('description'),
              getSchemaTpl('autoFillApi')
            ]
          },
          getSchemaTpl('status', {isFormItem: true}),
          getSchemaTpl('validation', {
            tag: ValidatorTag.All
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
          getSchemaTpl('style:classNames')
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
