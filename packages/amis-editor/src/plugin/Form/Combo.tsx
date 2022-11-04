import {
  BaseEventContext,
  BasePlugin,
  registerEditorPlugin,
  defaultValue,
  getSchemaTpl,
  RendererPluginEvent,
  RendererPluginAction,
  tipedLabel,
  mockValue,
  RegionConfig
} from 'amis-editor-core';
import {setVariable} from 'amis-core';

import {ValidatorTag} from '../../validator';
import {getEventControlConfig} from '../../renderer/event-control/helper';

export class ComboControlPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'combo';
  $schema = '/schemas/ComboControlSchema.json';

  // 组件名称
  name = '组合输入';
  isBaseComponent = true;
  icon = 'fa fa-group';
  pluginIcon = 'combo-plugin';
  description = '多个表单项的组合，可配置是否增加和删除初始设定的模板';
  docLink = '/amis/zh-CN/components/form/combo';
  tags = ['表单项'];
  scaffold = {
    type: 'combo',
    label: '组合输入',
    name: 'combo',
    multiple: true,
    items: [
      {
        type: 'input-text',
        name: 'input-text',
        placeholder: '文本'
      },

      {
        type: 'select',
        name: 'select',
        placeholder: '选项',
        options: [
          {
            label: 'A',
            value: 'a'
          },
          {
            label: 'B',
            value: 'b'
          }
        ]
      }
    ]
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold,
        value: [{text: 'Row 1', select: 'a'}, {}]
      }
    ]
  };

  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'add',
      eventLabel: '添加',
      description: '添加组合项时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.value': {
              type: 'object',
              title: '当前组合项的值'
            }
          }
        }
      ]
    },
    {
      eventName: 'delete',
      eventLabel: '删除',
      description: '删除组合项',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.key': {
              type: 'string',
              title: '删除项的索引'
            },
            'event.data.value': {
              type: 'string',
              title: '现有组合项的值'
            },
            'event.data.item': {
              type: 'object',
              title: '被删除的项'
            }
          }
        }
      ]
    },
    {
      eventName: 'tabsChange',
      eventLabel: '切换tab',
      description: '当设置 tabsMode 为 true 时，切换选项卡时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.key': {
              type: 'string',
              title: '选项卡索引'
            },
            'event.data.value': {
              type: 'string',
              title: '现有组合项的值'
            },
            'event.data.item': {
              type: 'object',
              title: '被激活的项'
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
      actionType: 'setValue',
      actionLabel: '赋值',
      description: '触发组件数据更新'
    }
  ];

  panelTitle = '组合输入';

  notRenderFormZone = true;

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {

    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: [
          getSchemaTpl('collapseGroup', [
            {
              className: 'p-none',
              title: '常用',
              body: [
                getSchemaTpl('formItemName', {
                  required: true
                }),
                getSchemaTpl('label'),

                // 多选模式和条数绑定了，所以设定了多选，条数开启
                getSchemaTpl('multiple', {
                  body: [
                    {
                      label: '最多条数',
                      name: 'maxLength',
                      type: 'input-number',
                      visibleOn: 'data.multiple',
                    },
                    {
                      label: '最少条数',
                      name: 'minLength',
                      type: 'input-number',
                      visibleOn: 'data.multiple',
                    }
                  ]
                }),

                // 可排序，排序和新增无关，和多选模式有关
                getSchemaTpl('switch', {
                  name: 'draggable',
                  label: '可排序',
                  pipeIn: defaultValue(false),
                  visibleOn: 'data.multiple'
                }),
                
                // 可新增
                getSchemaTpl('switch', {
                  name: 'addable',
                  label: '可新增',
                  visibleOn: 'data.multiple',
                  pipeIn: defaultValue(false)
                }),
                {
                  type: 'container',
                  className: 'ae-ExtendMore mb-3',
                  visibleOn: 'data.addable',
                  body: [
                    {
                      label: '按钮文案',
                      name: 'addBtn',
                      type: 'input-text'
                    }
                  ]
                },

                // 可删除
                getSchemaTpl('switch', {
                  name: 'removable',
                  label: '可删除',
                  pipeIn: defaultValue(false),
                    visibleOn: 'data.multiple',
                }),

                {
                  type: 'container',
                  className: 'ae-ExtendMore mb-3',
                  visibleOn: 'data.removable',
                  body: [
                    {
                      label: '按钮文案',
                      name: 'deleteBtn',
                      type: 'input-text'
                    },
                    getSchemaTpl('apiControl', {
                      name: 'deleteApi',
                      label: '删除',
                      mode: 'normal'
                    }),
                    {
                      label: tipedLabel(
                        '确认文案',
                        '删除确认文案，当配置删除接口生效'
                      ),
                      name: 'deleteConfirmText',
                      type: 'input-text',
                      pipeIn: defaultValue('确认要删除吗？')
                    }
                  ]
                },
                
                getSchemaTpl('labelRemark'),
                getSchemaTpl('remark'),

                getSchemaTpl('placeholder'),
                getSchemaTpl('description'),

                {
                  type: 'container',
                  className: 'ae-ExtendMore mb-3',
                  visibleOn: 'data.tabsMode',
                  body: [
                    {
                      type: 'ae-formulaControl',
                      name: 'tabsLabelTpl',
                      label: '标题模版'
                    }
                  ]
                },
              ]
            },
            getSchemaTpl('collapseGroup', [
              {
                className: 'p-none',
                title: '高级',
                body: [
                  getSchemaTpl('switch', {
                    name: 'canAccessSuperData',
                    label: '自动填充父级变量',
                    pipeIn: defaultValue(false)
                  }),

                  getSchemaTpl('switch', {
                    name: 'strictMode',
                    label: tipedLabel(
                      '严格模式',
                      '如果你希望环境变量的值实时透传到 Combo 中，请关闭此选项。'
                    ),
                    value: true
                  }),

                  getSchemaTpl('combo-container', {
                    name: 'syncFields',
                    visibleOn: '!data.strictMode',
                    label: tipedLabel(
                      '同步字段',
                      '如果 Combo 层级比较深，底层的获取外层的数据可能不同步。但是给 combo 配置这个属性就能同步下来。'
                    ),
                    type: 'combo',
                    mode: 'normal',
                    multiple: true,
                    canAccessSuperData: true,
                    items: [
                      {
                        name: 'field',
                        type: 'input-text'
                      }
                    ],
                    value: [],
                    pipeIn(value?: Array<string>) {
                      return (value ?? []).map(item => ({field: item}));
                    },
                    pipeOut(value?: Array<{field: string}>) {
                      return (value ?? [])
                        .map(item => {
                          const keys = Object.keys(item);
                          return keys.length > 0 ? item.field : '';
                        });
                    }
                  }),

                  getSchemaTpl('switch', {
                    name: 'lazyLoad',
                    label: tipedLabel(
                      '懒加载',
                      '如果数据比较多，比较卡顿时，可开启此配置项'
                    ),
                    pipeIn: defaultValue(false),
                    visibleOn: 'data.multiple && !data.tabsMode',
                  })
                ]
              }]
            ),
            getSchemaTpl('status', {
              isFormItem: true,
              readonly: true
            }),
            getSchemaTpl('validation', {tag: ValidatorTag.MultiSelect})
          ])
        ]
      },
      {
        title: '外观',
        className: 'p-none',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              // 展示形式
              {
                name: 'tabsMode',
                label: '展示形式',
                type: 'button-group-select',
                inputClassName: 'items-center',
                options: [
                  {label: '表单', value: false},
                  {label: '选项卡', value: true}
                ],
                pipeIn: defaultValue(false),
                onChange: (value: any, oldValue: any, model: any, form: any) => {
                  if (value) {
                    form.setValueByName('lazyLoad', undefined);
                  }
                },
              }
            ]
          },
          getSchemaTpl('style:formItem', {renderer: context.info.renderer}),
          {
            title: '子表单项',
            body: [
              // 表单多行展示
              getSchemaTpl('switch', {
                name: 'multiLine',
                label: '多行展示',
                pipeIn: defaultValue(false)
              }),
              {
                type: 'container',
                className: 'ae-ExtendMore mb-3',
                visibleOn: 'data.multiLine',
                body: [
                  getSchemaTpl('switch', {
                    name: 'noBorder',
                    label: '去掉边框',
                    pipeIn: defaultValue(false)
                  })
                ]
              }
            ]
          },
          getSchemaTpl('style:classNames'),
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
    // 至少显示一个成员，否则啥都不显示。
    if (props.multiple && !props.value && !props.$ref) {
      const mockedData = {};
      if (Array.isArray(props.items)) {
        props.items.forEach((control: any) => {
          control.name &&
            setVariable(mockedData, control.name, mockValue(control));
        });
      }
      props.value = [mockedData];
      return props;
    }
    return props;
  }

  // 容器配置
  regions: Array<RegionConfig> = [
    {
      key: 'items',
      label: '内容区',
      preferTag: '内容区',
      renderMethod: 'renderItems'
    }
  ];
}

registerEditorPlugin(ComboControlPlugin);
