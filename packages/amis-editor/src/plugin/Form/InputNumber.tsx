import {
  EditorNodeType,
  getI18nEnabled,
  RAW_TYPE_MAP,
  RendererPluginAction,
  RendererPluginEvent,
  BasePlugin,
  BaseEventContext,
  registerEditorPlugin,
  defaultValue,
  getSchemaTpl,
  tipedLabel
} from 'amis-editor-core';
import {Schema} from 'amis-core';
import type {SchemaType} from 'amis';
import {ValidatorTag} from '../../validator';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';
import {inputStateTpl} from '../../renderer/style-control/helper';

export class NumberControlPlugin extends BasePlugin {
  static id = 'NumberControlPlugin';
  // 关联渲染器名字
  rendererName = 'input-number';
  $schema = '/schemas/NumberControlSchema.json';

  // 组件名称
  name = '数字框';
  isBaseComponent = true;
  icon = 'fa fa-sort-numeric-asc';
  pluginIcon = 'input-number-plugin';
  description = '支持设定最大值和最小值，以及步长与精度';
  searchKeywords = '数字输入框';
  docLink = '/amis/zh-CN/components/form/input-number';
  tags = ['表单项'];
  scaffold = {
    type: 'input-number',
    label: '数字',
    name: 'number',
    showSteps: true,
    keyboard: true,
    kilobitSeparator: true
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold,
        value: 88
      }
    ]
  };

  notRenderFormZone = true;

  panelTitle = '数字框';
  panelJustify = true;

  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: '值变化',
      description: '数值变化',
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
      eventName: 'focus',
      eventLabel: '获取焦点',
      description: '数字框获取焦点',
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
      description: '数字框失去焦点',
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
      description: '清空数字框内容',
      ...getActionCommonProps('clear')
    },
    {
      actionType: 'reset',
      actionLabel: '重置',
      description: '重置为默认值',
      ...getActionCommonProps('reset')
    },
    {
      actionType: 'setValue',
      actionLabel: '赋值',
      description: '触发组件数据更新',
      ...getActionCommonProps('setValue')
    }
  ];

  panelBodyCreator = (context: BaseEventContext) => {
    const i18nEnabled = getI18nEnabled();
    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl(
          'collapseGroup',
          [
            {
              title: '基本',
              body: [
                getSchemaTpl('layout:originPosition', {value: 'left-top'}),
                getSchemaTpl('formItemName', {
                  required: true
                }),
                getSchemaTpl('label'),
                {
                  type: 'switch',
                  label: tipedLabel(
                    '键盘事件',
                    '通过键盘上下方向键来加减数据值'
                  ),
                  name: 'keyboard',
                  value: true,
                  inputClassName: 'is-inline'
                },
                getSchemaTpl('kilobitSeparator'),

                getSchemaTpl('valueFormula', {
                  rendererSchema: (schema: Schema) => ({
                    ...schema,
                    displayMode: 'base'
                  }),
                  valueType: 'number' // 期望数值类型
                }),

                getSchemaTpl('valueFormula', {
                  name: 'min',
                  rendererSchema: (schema: Schema) => ({
                    ...schema,
                    value: context?.schema.min,
                    displayMode: 'base'
                  }),
                  needDeleteProps: ['min'], // 避免自我限制
                  label: '最小值',
                  valueType: 'number'
                }),

                getSchemaTpl('valueFormula', {
                  name: 'max',
                  rendererSchema: (schema: Schema) => ({
                    ...schema,
                    value: context?.schema.max,
                    displayMode: 'base'
                  }),
                  needDeleteProps: ['max'], // 避免自我限制
                  label: '最大值',
                  valueType: 'number'
                }),
                {
                  type: 'switch',
                  label: '显示上下按钮',
                  name: 'showSteps',
                  value: true,
                  inputClassName: 'is-inline'
                },
                {
                  type: 'input-number',
                  name: 'step',
                  label: '步长',
                  min: 0,
                  value: 1,
                  precision: '${precision}',
                  visibleOn: '${showSteps}',
                  strictMode: false
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
                getSchemaTpl('prefix'),
                getSchemaTpl('suffix'),
                getSchemaTpl('combo-container', {
                  type: 'combo',
                  label: '单位选项',
                  mode: 'normal',
                  name: 'unitOptions',
                  items: [
                    {
                      placeholder: '文本',
                      type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                      name: 'label'
                    },
                    {
                      placeholder: '值',
                      type: 'input-text',
                      name: 'value'
                    }
                  ],
                  draggable: false,
                  multiple: true,
                  pipeIn: (value: any) => {
                    if (Array.isArray(value)) {
                      return value.map(item =>
                        typeof item === 'string'
                          ? {
                              label: item,
                              value: item
                            }
                          : item
                      );
                    }
                    return [];
                  },
                  pipeOut: (value: any[]) => {
                    if (!value.length) {
                      return undefined;
                    }
                    return value.map(item =>
                      item.value ? item : {label: item.label, value: item.label}
                    );
                  }
                }),
                getSchemaTpl('labelRemark'),
                getSchemaTpl('remark'),
                getSchemaTpl('placeholder'),
                getSchemaTpl('description'),
                getSchemaTpl('autoFillApi')
              ]
            },
            getSchemaTpl('status', {isFormItem: true}),
            getSchemaTpl('validation', {tag: ValidatorTag.MultiSelect})
          ],
          {...context?.schema, configTitle: 'props'}
        )
      },
      {
        title: '外观',
        body: [
          getSchemaTpl(
            'collapseGroup',
            [
              getSchemaTpl('theme:formItem', {
                schema: [
                  {
                    label: '快捷编辑',
                    name: 'displayMode',
                    type: 'select',
                    pipeIn: defaultValue('base'),
                    options: [
                      {
                        label: '单侧按钮',
                        value: 'base'
                      },
                      {
                        label: '两侧按钮',
                        value: 'enhance'
                      }
                    ]
                  }
                ]
              }),
              getSchemaTpl('theme:form-label'),
              getSchemaTpl('theme:form-description'),
              {
                title: '数字输入框样式',
                body: [
                  ...inputStateTpl(
                    'themeCss.inputControlClassName',
                    '--inputNumber-${displayMode || "base"}'
                  )
                ]
              },
              getSchemaTpl('theme:singleCssCode', {
                selectors: [
                  {
                    label: '表单项基本样式',
                    isRoot: true,
                    selector: '.cxd-from-item'
                  },
                  {
                    label: '标题样式',
                    selector: '.cxd-Form-label'
                  },
                  {
                    label: '数字框基本样式',
                    selector: '.cxd-Number'
                  },
                  {
                    label: '输入框样式',
                    selector: '.cxd-Number-input'
                  }
                ]
              })
            ],
            {...context?.schema, configTitle: 'style'}
          )
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
    return {
      type: 'number',
      title: node.schema?.label || node.schema?.name,
      rawType: RAW_TYPE_MAP[node.schema.type as SchemaType] || 'string',
      originalValue: node.schema?.value // 记录原始值，循环引用检测需要
    };
  }
}

registerEditorPlugin(NumberControlPlugin);
