import {isObject} from 'amis';
import type {IFormStore, IFormItemStore} from 'amis-core';
import {
  BasePlugin,
  defaultValue,
  getSchemaTpl,
  tipedLabel,
  registerEditorPlugin
} from 'amis-editor-core';
import type {
  EditorNodeType,
  RendererPluginAction,
  RendererPluginEvent,
  BaseEventContext,
  EditorManager
} from 'amis-editor-core';
import {ValidatorTag} from '../../validator';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';

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
      dataSchema: (manager: EditorManager) => {
        const node = manager.store.getNodeById(manager.store.activeId);
        const schemas = manager.dataSchema.current.schemas;
        const dataSchema = schemas.find(
          item => item.properties?.[node!.schema.name]
        );

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: '数据',
                properties: {
                  value: {
                    type: 'number',
                    ...((dataSchema?.properties?.[node!.schema.name] as any) ??
                      {}),
                    title: '当前滑块值'
                  }
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'focus',
      eventLabel: '获取焦点',
      description: '当设置 showInput 为 true 时，输入框获取焦点时触发',
      dataSchema: (manager: EditorManager) => {
        const node = manager.store.getNodeById(manager.store.activeId);
        const schemas = manager.dataSchema.current.schemas;
        const dataSchema = schemas.find(
          item => item.properties?.[node!.schema.name]
        );

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: '数据',
                properties: {
                  value: {
                    type: 'number',
                    ...((dataSchema?.properties?.[node!.schema.name] as any) ??
                      {}),
                    title: '当前数值'
                  }
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'blur',
      eventLabel: '失去焦点',
      description: '当设置 showInput 为 true 时，输入框失去焦点时触发',
      dataSchema: (manager: EditorManager) => {
        const node = manager.store.getNodeById(manager.store.activeId);
        const schemas = manager.dataSchema.current.schemas;
        const dataSchema = schemas.find(
          item => item.properties?.[node!.schema.name]
        );

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: '数据',
                properties: {
                  value: {
                    type: 'number',
                    ...((dataSchema?.properties?.[node!.schema.name] as any) ??
                      {}),
                    title: '当前数值'
                  }
                }
              }
            }
          }
        ];
      }
    }
  ];

  // 动作定义
  actions: RendererPluginAction[] = [
    {
      actionType: 'clear',
      actionLabel: '清空',
      description: '清除输入框',
      ...getActionCommonProps('clear')
    },
    {
      actionType: 'reset',
      actionLabel: '重置',
      description: '将值重置为初始值',
      ...getActionCommonProps('reset')
    },
    {
      actionType: 'setValue',
      actionLabel: '赋值',
      description: '触发组件数据更新',
      ...getActionCommonProps('setValue')
    }
  ];

  panelTitle = '滑块';

  panelJustify = true;

  filterProps(props: Record<string, any>, node: EditorNodeType) {
    if (
      props.marks &&
      isObject(props.marks) &&
      props.marks.hasOwnProperty('$$id')
    ) {
      delete props.marks.$$id;
    }

    return props;
  }

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
                visibleOn: 'this.multiple',
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
                visibleOn: 'this.multiple',
                precision: '${precision}'
              },

              getSchemaTpl('valueFormula', {
                name: 'value',
                rendererSchema: {
                  ...context?.schema,
                  type: 'input-number'
                },
                valueType: 'number', // 期望数值类型
                visibleOn: '!this.multiple',
                pipeIn: defaultValue(0),
                precision: '${precision}'
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
                valueType: 'number',
                precision: '${precision}'
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
                valueType: 'number',
                precision: '${precision}'
              }),
              {
                label: '步长',
                name: 'step',
                type: 'input-number',
                value: 1,
                precision: '${precision}',
                pipeOut: (value?: number) => {
                  return value || 1;
                }
              },
              {
                type: 'input-number',
                name: 'precision',
                label: tipedLabel(
                  '小数位数',
                  '根据四舍五入精确保留设置的小数位数'
                ),
                min: 1,
                max: 100
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
                visibleOn: 'this.tooltipVisible === undefined',
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
                visibleOn: '!!this.showInput'
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
            getSchemaTpl('theme:formItem'),
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
    if (node.schema?.multiple && node.schema?.joinValues === false) {
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
