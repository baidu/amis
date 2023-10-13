import {EditorNodeType, getSchemaTpl} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {
  BasePlugin,
  BasicSubRenderInfo,
  RendererEventContext,
  SubRendererInfo,
  BaseEventContext
} from 'amis-editor-core';

import {formItemControl} from '../../component/BaseControl';
import {RendererPluginAction, RendererPluginEvent} from 'amis-editor-core';
import {resolveOptionType} from '../../util';
import type {Schema} from 'amis';

export class TagControlPlugin extends BasePlugin {
  static id = 'TagControlPlugin';
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'input-tag';
  $schema = '/schemas/TagControlSchema.json';

  // 组件名称
  name = '标签选择';
  isBaseComponent = true;
  icon = 'fa fa-tag';
  pluginIcon = 'input-tag-plugin';
  description = '配置 options 可以实现选择选项';
  docLink = '/amis/zh-CN/components/form/input-tag';
  tags = ['表单项'];
  scaffold = {
    type: 'input-tag',
    label: '标签',
    name: 'tag',
    options: [
      {label: '红色', value: 'red'},
      {label: '绿色', value: 'green'},
      {label: '蓝色', value: 'blue'}
    ]
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: {
      ...this.scaffold,
      value: 'red'
    }
  };

  notRenderFormZone = true;

  panelTitle = '标签';
  panelJustify = true;

  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: '值变化',
      description: '选中值变化',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                value: {
                  type: 'array',
                  title: '当前标签值'
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
      description: '获取焦点',
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
                  title: '当前标签值'
                },
                selectedItems: {
                  type: 'array',
                  title: '选中的标签'
                },
                items: {
                  type: 'array',
                  title: '标签列表'
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
      description: '失去焦点',
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
                  title: '当前标签值'
                },
                selectedItems: {
                  type: 'array',
                  title: '选中的标签'
                },
                items: {
                  type: 'array',
                  title: '标签列表'
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
      description: '重置为默认值'
    },
    {
      actionType: 'setValue',
      actionLabel: '赋值',
      description: '触发组件数据更新'
    }
  ];

  panelBodyCreator = (context: BaseEventContext) => {
    return formItemControl(
      {
        common: {
          replace: true,
          body: [
            getSchemaTpl('layout:originPosition', {value: 'left-top'}),
            getSchemaTpl('formItemName', {
              required: true
            }),
            getSchemaTpl('label'),
            getSchemaTpl('clearable'),
            getSchemaTpl('optionsTip'),
            getSchemaTpl('valueFormula', {
              rendererSchema: (schema: Schema) => schema,
              mode: 'vertical' // 改成上下展示模式
            }),
            getSchemaTpl('joinValues'),
            getSchemaTpl('delimiter'),
            getSchemaTpl('extractValue'),
            getSchemaTpl('autoFillApi', {
              visibleOn:
                '!this.autoFill || this.autoFill.scene && this.autoFill.action'
            }),
            getSchemaTpl('autoFill', {
              visibleOn:
                '!this.autoFill || !this.autoFill.scene && !this.autoFill.action'
            })
          ]
        },
        option: {
          body: [
            getSchemaTpl('optionControlV2', {
              description: '设置选项后，输入时会下拉这些选项供用户参考。'
            })
          ]
        },
        status: {}
      },
      context
    );
  };

  buildDataSchemas(node: EditorNodeType, region: EditorNodeType) {
    const type = resolveOptionType(node.schema?.options);
    // todo:异步数据case
    let dataSchema: any = {
      type,
      title: node.schema?.label || node.schema?.name,
      originalValue: node.schema?.value // 记录原始值，循环引用检测需要
    };

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
        },
        originalValue: dataSchema.originalValue
      };
    }

    return dataSchema;
  }
}

registerEditorPlugin(TagControlPlugin);
