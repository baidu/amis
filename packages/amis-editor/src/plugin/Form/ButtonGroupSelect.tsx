import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin, BaseEventContext} from 'amis-editor-core';

import {
  RendererPluginAction,
  RendererPluginEvent,
  tipedLabel
} from 'amis-editor-core';
import {getSchemaTpl, defaultValue} from 'amis-editor-core';
import {getEventControlConfig} from '../../renderer/event-control/helper';

export class ButtonGroupControlPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'button-group-select';
  $schema = '/schemas/ButtonGroupControlSchema.json';

  // 组件名称
  name = '按钮点选';
  isBaseComponent = true;
  icon = 'fa fa-object-group';
  pluginIcon = 'btn-select-plugin';
  description =
    '用来展示多个按钮，视觉上会作为一个整体呈现，同时可以作为表单项选项选择器来用。';
  docLink = '/amis/zh-CN/components/button-group';
  tags = ['按钮'];
  scaffold = {
    type: 'button-group-select',
    name: 'a',
    inline: false,
    options: [
      {
        label: '选项1',
        value: 'a'
      },
      {
        label: '选项2',
        value: 'b'
      }
    ]
  };
  previewSchema: any = {
    type: 'form',
    wrapWithPanel: false,
    mode: 'horizontal',
    body: {
      ...this.scaffold,
      value: 'a',
      label: '按钮点选',
      description: '按钮点选可以当选项用。'
    }
  };

  notRenderFormZone = true;

  panelTitle = '按钮点选';

  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: '值变化',
      description: '选中值变化时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.value': {
              type: 'string',
              title: '选中值'
            }
          }
        }
      ]
    }
  ];

  // 动作定义
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
      actionType: 'reload',
      actionLabel: '重新加载',
      description: '触发组件数据刷新并重新渲染'
    },
    {
      actionType: 'setValue',
      actionLabel: '赋值',
      description: '触发组件数据更新'
    }
  ];

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: [
          getSchemaTpl('collapseGroup', [
            {
              title: '基本',
              body: [
                getSchemaTpl('formItemName', {
                  required: true
                }),
                getSchemaTpl('label'),
                getSchemaTpl('multiple'),
                getSchemaTpl('valueFormula', {
                  rendererSchema: context?.schema,
                  useSelectMode: true, // 改用 Select 设置模式
                  visibleOn: 'this.options && this.options.length > 0'
                })
              ]
            },
            {
              title: '按钮管理',
              body: [getSchemaTpl('optionControlV2')]
            },
            getSchemaTpl('status', {
              isFormItem: true
            })
          ])
        ]
      },
      {
        title: '外观',
        body: [
          getSchemaTpl('collapseGroup', [
            {
              title: '基本',
              body: [
                getSchemaTpl('formItemMode'),
                getSchemaTpl('horizontal', {
                  label: '',
                  visibleOn:
                    'data.mode == "horizontal" && data.label !== false && data.horizontal'
                }),
                getSchemaTpl('switch', {
                  name: 'tiled',
                  label: tipedLabel(
                    '平铺模式',
                    '使按钮宽度占满父容器，各按钮宽度自适应'
                  ),
                  pipeIn: defaultValue(false),
                  visibleOn: 'data.mode !== "inline"'
                }),
                getSchemaTpl('size'),
                getSchemaTpl('buttonLevel', {
                  label: '按钮样式',
                  name: 'btnLevel'
                }),
                getSchemaTpl('buttonLevel', {
                  label: '按钮选中样式',
                  name: 'btnActiveLevel'
                })
              ]
            },
            getSchemaTpl('style:classNames', {
              isFormItem: true,
              schema: [
                getSchemaTpl('className', {
                  label: '按钮',
                  name: 'btnClassName'
                })
              ]
            })
          ])
        ]
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
}

registerEditorPlugin(ButtonGroupControlPlugin);
