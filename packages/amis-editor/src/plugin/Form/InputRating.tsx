import {
  EditorNodeType,
  defaultValue,
  getI18nEnabled,
  getSchemaTpl,
  isObject,
  undefinedPipeOut,
  RendererPluginAction,
  RendererPluginEvent,
  registerEditorPlugin,
  BasePlugin,
  BaseEventContext,
  tipedLabel
} from 'amis-editor-core';
import {ValidatorTag} from '../../validator';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';

export class RateControlPlugin extends BasePlugin {
  static id = 'RateControlPlugin';
  // 关联渲染器名字
  rendererName = 'input-rating';
  $schema = '/schemas/RatingControlSchema.json';

  // 组件名称
  name = '评分';
  isBaseComponent = true;
  icon = 'fa fa-star-o';
  pluginIcon = 'input-rating-plugin';
  description = '支持只读、半星选择';
  docLink = '/amis/zh-CN/components/form/input-rating';
  tags = ['表单项'];
  scaffold = {
    type: 'input-rating',
    label: '评分',
    name: 'rating'
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold,
        value: 3
      }
    ]
  };
  notRenderFormZone = true;

  panelTitle = '评分';

  count = 5;

  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: '值变化',
      description: '评分值变化时触发',
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
                  title: '当前分值'
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
      description: '清空评分值',
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

  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    const i18nEnabled = getI18nEnabled();
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

              getSchemaTpl('label', {
                label: 'Label'
              }),

              getSchemaTpl('valueFormula', {
                rendererSchema: {
                  ...context?.schema,
                  type: 'input-number'
                },
                valueType: 'number', // 期望数值类型
                visibleOn: '!data.multiple'
              }),
              // 评分组件没有 min、max 属性，有 count 属性
              getSchemaTpl('valueFormula', {
                name: 'count',
                rendererSchema: {
                  ...context?.schema,
                  type: 'input-number',
                  max: 10,
                  min: 1,
                  step: 1,
                  precision: 0
                },
                needDeleteProps: ['count'], // 避免自我限制
                label: '最大值',
                valueType: 'number'
              }),

              getSchemaTpl('switch', {
                name: 'allowClear',
                label: tipedLabel('可清除', '是否允许再次点击后清除'),
                value: false
              }),

              getSchemaTpl('switch', {
                name: 'half',
                label: '允许半星',
                value: false
              }),

              getSchemaTpl('labelRemark'),

              getSchemaTpl('remark'),
              getSchemaTpl('combo-container', {
                type: 'combo',
                label: '描述',
                mode: 'normal',
                name: 'texts',
                items: [
                  {
                    placeholder: 'Key',
                    type: 'input-number',
                    unique: true,
                    name: 'key',
                    columnClassName: 'w-xs flex-none',
                    min: 0,
                    step: 1,
                    max: 10,
                    precision: 0
                  },
                  {
                    placeholder: '描述内容',
                    type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                    name: 'value'
                  }
                ],
                draggable: false,
                multiple: true,
                pipeIn: (value: any) => {
                  if (!isObject(value)) {
                    return Array.isArray(value) ? value : [];
                  }

                  const res = Object.keys(value).map((item: any) => {
                    return {
                      key: item || 0,
                      value: value[item] || ''
                    };
                  }); //.filter((item: any) => item.key <= this.count);

                  return res;
                },
                pipeOut: (value: any[]) => {
                  if (!value.length) {
                    return undefined;
                  }

                  const res: any = {};
                  const findMinCanUsedKey = (
                    keys: string[],
                    max: number
                  ): void | number => {
                    for (let i = 1; i <= max; i++) {
                      if (!keys.includes(String(i))) {
                        return i;
                      }
                    }
                  };

                  value.forEach(item => {
                    const key =
                      item.key !== undefined
                        ? Number(item.key)
                        : findMinCanUsedKey(Object.keys(res), this.count);

                    // && key <= this.count
                    if (key) {
                      res[key] = item?.value || '';
                    }
                  });
                  return res;
                }
              }),
              getSchemaTpl('autoFillApi')
            ]
          },
          getSchemaTpl('status', {isFormItem: true, readonly: true}),
          getSchemaTpl('validation', {
            tag: ValidatorTag.Check
          })
        ])
      },
      {
        title: '外观',
        body: [
          getSchemaTpl('collapseGroup', [
            getSchemaTpl('theme:formItem'),
            {
              title: '图标',
              body: [
                {
                  type: 'ae-switch-more',
                  label: '自定义',
                  mode: 'normal',
                  formType: 'extend',
                  form: {
                    body: [
                      {
                        type: 'input-text',
                        label: '字符',
                        name: 'char'
                      }
                    ]
                  }
                },

                {
                  type: 'input-color',
                  label: tipedLabel('未选中色值', '默认未选中色值为 #e7e7e8'),
                  name: 'inactiveColor',
                  pipeIn: defaultValue('#e7e7e8'),
                  pipeOut: undefinedPipeOut
                },

                getSchemaTpl('combo-container', {
                  type: 'combo',
                  label: '选中色值',
                  mode: 'normal',
                  name: 'colors',
                  items: [
                    {
                      placeholder: 'Key',
                      type: 'input-number',
                      unique: true,
                      name: 'key',
                      columnClassName: 'w-xs flex-none',
                      min: 0,
                      max: 10,
                      step: 1,
                      precision: 0
                    },

                    {
                      placeholder: 'Value',
                      type: 'input-color',
                      name: 'value'
                    }
                  ],
                  value: {
                    2: '#abadb1',
                    3: '#787b81',
                    5: '#ffa900'
                  },
                  draggable: false,
                  multiple: true,
                  pipeIn: (value: any) => {
                    if (!isObject(value)) {
                      return Array.isArray(value) ? value : [];
                    }

                    const res = Object.keys(value).map((item: any) => {
                      return {
                        key: item,
                        value: value[item] || ''
                      };
                    }); //.filter((item: any) => item.key <= this.count);

                    return res;
                  },
                  pipeOut: (value: any[]) => {
                    if (!value.length) {
                      return undefined;
                    }

                    const res: any = {};
                    const findMinCanUsedKey = (
                      keys: string[],
                      max: number
                    ): void | number => {
                      for (let i = 1; i <= max; i++) {
                        if (!keys.includes(String(i))) {
                          return i;
                        }
                      }
                    };

                    value.forEach(item => {
                      const key =
                        item.key !== undefined
                          ? Number(item.key)
                          : findMinCanUsedKey(Object.keys(res), this.count);

                      if (key) {
                        res[key] = item?.value || '';
                      }
                    });

                    return res;
                  }
                })
              ]
            },
            {
              title: '描述',
              body: [
                getSchemaTpl('horizontal-align', {
                  name: 'textPosition',
                  pipeIn: defaultValue('right')
                })
              ]
            },
            getSchemaTpl('style:classNames', {
              schema: [
                getSchemaTpl('className', {
                  label: '图标',
                  name: 'charClassName'
                }),

                getSchemaTpl('className', {
                  label: '评分描述',
                  name: 'textClassName'
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
    return {
      type: 'number',
      title: node.schema?.label || node.schema?.name,
      originalValue: node.schema?.value // 记录原始值，循环引用检测需要
    };
  }
}

registerEditorPlugin(RateControlPlugin);
