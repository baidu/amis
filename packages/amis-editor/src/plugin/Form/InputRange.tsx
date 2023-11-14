import {
  EditorNodeType,
  RendererPluginAction,
  RendererPluginEvent
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl, tipedLabel} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin, BaseEventContext} from 'amis-editor-core';
import {ValidatorTag} from '../../validator';
import {getEventControlConfig} from '../../renderer/event-control/helper';

import type {IFormStore, IFormItemStore} from 'amis-core';

export class RangeControlPlugin extends BasePlugin {
  static id = 'RangeControlPlugin';
  // 关联渲染器名字
  rendererName = 'input-range';
  $schema = '/schemas/RangeControlSchema.json';

  // 组件名称
  name = '滑块';
  isBaseComponent = true;
  icon = 'fa fa-sliders';
  pluginIcon = 'input-range-plugin';
  description = '选择某个值或者某个范围';
  docLink = '/amis/zh-CN/components/form/input-range';
  tags = ['表单项'];
  scaffold = {
    type: 'input-range',
    label: '滑块',
    name: 'range'
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
  notRenderFormZone = true;

  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: '值变化',
      description: '滑块值变化时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                value: {
                  type: 'number',
                  title: '当前滑块值'
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
      description: '当设置 showInput 为 true 时，输入框获取焦点时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                value: {
                  type: 'number',
                  title: '当前数值'
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
      description: '当设置 showInput 为 true 时，输入框失去焦点时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                value: {
                  type: 'number',
                  title: '当前数值'
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
      description: '清除输入框'
    },
    {
      actionType: 'reset',
      actionLabel: '重置',
      description: '将值重置为resetValue，若没有配置resetValue，则清空'
    },
    {
      actionType: 'setValue',
      actionLabel: '赋值',
      description: '触发组件数据更新'
    }
  ];

  panelTitle = '滑块';

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
              getSchemaTpl('switch', {
                label: '双滑块',
                name: 'multiple'
              }),
              {
                type: 'container',
                className: 'ae-sub-content',
                visibleOn: 'data.multiple',
                body: [
                  getSchemaTpl('joinValues', {
                    onChange: (
                      value: boolean,
                      oldValue: boolean,
                      model: IFormItemStore,
                      form: IFormStore
                    ) => {
                      form.deleteValueByName('value');
                    }
                  }),
                  getSchemaTpl('delimiter', {
                    onChange: (
                      value: string,
                      oldValue: string,
                      model: IFormItemStore,
                      form: IFormStore
                    ) => {
                      form.deleteValueByName('value');
                    }
                  })
                ]
              },
              {
                type: 'ae-input-range-value',
                name: 'value',
                label: '默认值',
                visibleOn: 'data.multiple'
              },

              getSchemaTpl('valueFormula', {
                name: 'value',
                rendererSchema: {
                  ...context?.schema,
                  type: 'input-number'
                },
                valueType: 'number', // 期望数值类型
                visibleOn: '!data.multiple',
                pipeIn: defaultValue(0)
              }),

              getSchemaTpl('valueFormula', {
                name: 'min',
                rendererSchema: {
                  ...context?.schema,
                  type: 'input-number'
                },
                pipeIn: defaultValue(0),
                needDeleteProps: ['min'], // 避免自我限制
                label: '最小值',
                valueType: 'number'
              }),
              getSchemaTpl('valueFormula', {
                name: 'max',
                rendererSchema: {
                  ...context?.schema,
                  type: 'input-number'
                },
                pipeIn: defaultValue(100),
                needDeleteProps: ['max'], // 避免自我限制
                label: '最大值',
                valueType: 'number'
              }),
              {
                label: '步长',
                name: 'step',
                type: 'input-number',
                value: 1,
                pipeOut: (value?: number) => {
                  return value || 1;
                }
              },

              getSchemaTpl('unit'),

              // tooltipVisible 为true时，会一直显示，为undefined时，才会鼠标移入显示
              getSchemaTpl('switch', {
                name: 'tooltipVisible',
                label: '值标签',
                value: undefined,
                pipeOut: (value?: boolean) => {
                  return !!value ? undefined : false;
                },
                pipeIn: (value?: boolean) => {
                  return value === undefined || value === true ? true : false;
                }
              }),

              {
                type: 'container',
                className: 'ae-ExtendMore mb-2',
                visibleOn: 'data.tooltipVisible === undefined',
                body: [
                  {
                    type: 'select',
                    name: 'tooltipPlacement',
                    label: '方向',
                    value: 'auto',
                    options: [
                      {label: '自动', value: 'auto'},
                      {label: '上', value: 'top'},
                      {label: '下', value: 'bottom'},
                      {label: '左', value: 'left'},
                      {label: '右', value: 'right'}
                    ]
                  }
                ]
              },

              getSchemaTpl('switch', {
                name: 'showInput',
                label: '可输入',
                value: false
              }),

              getSchemaTpl('switch', {
                name: 'clearable',
                label: '可重置',
                value: false,
                visibleOn: '!!data.showInput'
              }),
              getSchemaTpl('autoFillApi')
            ]
          },
          {
            title: '轨道',
            body: [
              {
                type: 'ae-partsControl',
                mode: 'normal'
              },
              {
                type: 'ae-marksControl',
                mode: 'normal',
                name: 'marks'
              }
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
    if (node.schema?.multiple) {
      return {
        type: 'object',
        title: node.schema?.label || node.schema?.name,
        properties: {
          max: {
            type: 'number',
            title: '最大值'
          },
          min: {
            type: 'number',
            title: '最小值'
          }
        },
        originalValue: node.schema?.value // 记录原始值，循环引用检测需要
      };
    }

    return {
      type: 'number',
      title: node.schema?.label || node.schema?.name,
      originalValue: node.schema?.value // 记录原始值，循环引用检测需要
    };
  }
}

registerEditorPlugin(RangeControlPlugin);
