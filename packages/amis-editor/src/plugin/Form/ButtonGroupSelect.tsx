import {EditorNodeType, registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin, BaseEventContext} from 'amis-editor-core';

import {
  RendererPluginAction,
  RendererPluginEvent,
  tipedLabel
} from 'amis-editor-core';
import {getSchemaTpl, defaultValue} from 'amis-editor-core';
import {getEventControlConfig} from '../../renderer/event-control/helper';
import {ValidatorTag} from '../../validator';
import {resolveOptionType} from '../../util';
import type {Schema} from 'amis';

export class ButtonGroupControlPlugin extends BasePlugin {
  static id = 'ButtonGroupControlPlugin';
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
  tags = ['表单项'];
  scaffold = {
    type: 'button-group-select',
    name: 'buttonGroupSelect',
    label: '按钮点选',
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
            data: {
              type: 'object',
              title: '数据',
              properties: {
                value: {
                  type: 'string',
                  title: '选中的值'
                }
              }
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
                getSchemaTpl('layout:originPosition', {value: 'left-top'}),
                getSchemaTpl('formItemName', {
                  required: true
                }),
                getSchemaTpl('label'),
                getSchemaTpl('multiple'),
                getSchemaTpl('valueFormula', {
                  rendererSchema: (schema: Schema) => schema,
                  useSelectMode: true, // 改用 Select 设置模式
                  visibleOn: 'this.options && this.options.length > 0'
                }),
                getSchemaTpl('description')
              ]
            },
            {
              title: '按钮管理',
              body: [getSchemaTpl('nav-badge'), getSchemaTpl('optionControlV2')]
            },
            getSchemaTpl('status', {
              isFormItem: true
            }),
            getSchemaTpl('validation', {tag: ValidatorTag.MultiSelect})
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
                  name: 'btnActiveLevel',
                  pipeIn: defaultValue('primary')
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

  buildDataSchemas(node: EditorNodeType, region: EditorNodeType) {
    const type = resolveOptionType(node.schema?.options);
    // todo:异步数据case
    let dataSchema: any = {
      type,
      title: node.schema?.label || node.schema?.name,
      originalValue: node.schema?.value // 记录原始值，循环引用检测需要
    };

    if (node.schema?.joinValues === false) {
      dataSchema = {
        ...dataSchema,
        type: 'object',
        title: node.schema?.label || node.schema?.name,
        properties: {
          [node.schema?.labelField || 'label']: {
            type: 'string',
            title: '文本'
          },
          [node.schema?.valueField || 'value']: {
            type,
            title: '值'
          }
        }
      };
    }

    if (node.schema?.multiple) {
      if (node.schema?.extractValue) {
        dataSchema = {
          type: 'array',
          title: node.schema?.label || node.schema?.name
        };
      } else if (node.schema?.joinValues === false) {
        dataSchema = {
          type: 'array',
          title: node.schema?.label || node.schema?.name,
          items: {
            type: 'object',
            title: '成员',
            properties: dataSchema.properties
          },
          originalValue: dataSchema.originalValue
        };
      }
    }

    return dataSchema;
  }
}

registerEditorPlugin(ButtonGroupControlPlugin);
