import React from 'react';
import omit from 'lodash/omit';
import {findObjectsWithKey} from 'amis-core';
import {Button, Icon} from 'amis-ui';
import {
  registerEditorPlugin,
  getSchemaTpl,
  BasePlugin,
  tipedLabel,
  JSONPipeOut
} from 'amis-editor-core';

import {ValidatorTag} from '../../validator';
import {getEventControlConfig} from '../../renderer/event-control/helper';
import {resolveOptionType} from '../../util';

import type {Schema} from 'amis';
import type {
  EditorNodeType,
  RendererPluginAction,
  RendererPluginEvent,
  BaseEventContext
} from 'amis-editor-core';

export class SelectControlPlugin extends BasePlugin {
  static id = 'SelectControlPlugin';

  static scene = ['layout'];

  name = '下拉框';

  panelTitle = '下拉框';

  rendererName = 'select';

  icon = 'fa fa-th-list';

  panelIcon = 'fa fa-th-list';

  pluginIcon = 'select-plugin';

  isBaseComponent = true;

  panelJustify = true;

  notRenderFormZone = true;

  $schema = '/schemas/SelectControlSchema.json';

  description = '支持多选，输入提示，可使用 source 获取选项';

  searchKeywords = '选择器';

  docLink = '/amis/zh-CN/components/form/select';

  tags = ['表单项'];

  scaffold = {
    type: 'select',
    label: '选项',
    name: 'select',
    options: [
      {label: '选项A', value: 'A'},
      {label: '选项B', value: 'B'}
    ]
  };

  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold
      }
    ]
  };

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
                },
                selectedItems: {
                  type: 'object',
                  title: '选中的项'
                },
                items: {
                  type: 'array',
                  title: '选项列表'
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
                  title: '选中的值'
                },
                items: {
                  type: 'array',
                  title: '选项列表'
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
                  title: '选中的值'
                },
                items: {
                  type: 'array',
                  title: '选项列表'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'add',
      eventLabel: '新增选项',
      description: '新增选项',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                value: {
                  type: 'object',
                  title: '新增的选项'
                },
                items: {
                  type: 'array',
                  title: '选项列表'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'edit',
      eventLabel: '编辑选项',
      description: '编辑选项',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                value: {
                  type: 'object',
                  title: '编辑的选项'
                },
                items: {
                  type: 'array',
                  title: '选项列表'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'delete',
      eventLabel: '删除选项',
      description: '删除选项',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                value: {
                  type: 'object',
                  title: '删除的选项'
                },
                items: {
                  type: 'array',
                  title: '选项列表'
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
              getSchemaTpl('clearable'),
              getSchemaTpl('searchable'),
              getSchemaTpl('multiple', {
                body: [
                  getSchemaTpl('switch', {
                    label: '单行显示选中值',
                    name: 'valuesNoWrap'
                  }),
                  {
                    type: 'input-number',
                    name: 'maxTagCount',
                    label: tipedLabel(
                      '标签展示数',
                      '标签的最大展示数量，超出数量后以收纳浮层的方式展示，默认全展示'
                    )
                  }
                ]
              }),
              getSchemaTpl('checkAll'),
              getSchemaTpl('valueFormula', {
                rendererSchema: (schema: Schema) => schema
              }),
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('placeholder'),
              getSchemaTpl('description')
            ]
          },
          {
            title: '选项',
            body: [
              getSchemaTpl('optionControlV2'),
              getSchemaTpl('selectFirst'),
              getSchemaTpl(
                'loadingConfig',
                {
                  visibleOn: 'this.source || !this.options'
                },
                {context}
              ),
              // 模板
              getSchemaTpl('optionsMenuTpl', {
                manager: this.manager,
                onChange: (value: any) => {}
              }),
              /** 新增选项 */
              getSchemaTpl('optionAddControl', {
                manager: this.manager
              }),
              /** 编辑选项 */
              getSchemaTpl('optionEditControl', {
                manager: this.manager
              }),
              /** 删除选项 */
              getSchemaTpl('optionDeleteControl')
            ]
          },
          {
            title: '高级',
            body: [
              getSchemaTpl('switch', {
                label: tipedLabel(
                  '选项值检查',
                  '开启后，当选项值未匹配到当前options中的选项时，选项文本飘红'
                ),
                name: 'showInvalidMatch'
              }),
              getSchemaTpl('virtualThreshold'),
              getSchemaTpl('virtualItemHeight')
            ]
          },
          getSchemaTpl('status', {isFormItem: true}),
          getSchemaTpl('validation', {tag: ValidatorTag.MultiSelect})
        ])
      },
      {
        title: '外观',
        body: [
          getSchemaTpl('collapseGroup', [
            getSchemaTpl('style:formItem', {renderer: context.info.renderer}),
            getSchemaTpl('style:classNames')
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

registerEditorPlugin(SelectControlPlugin);
