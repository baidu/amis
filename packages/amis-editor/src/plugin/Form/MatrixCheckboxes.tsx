import {
  registerEditorPlugin,
  BasePlugin,
  BaseEventContext,
  RendererPluginAction,
  RendererPluginEvent,
  tipedLabel,
  defaultValue,
  getSchemaTpl,
  EditorNodeType
} from 'amis-editor-core';
import {ValidatorTag} from '../../validator';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';

export class MatrixControlPlugin extends BasePlugin {
  static id = 'MatrixControlPlugin';
  // 关联渲染器名字
  rendererName = 'matrix-checkboxes';
  $schema = '/schemas/MatrixControlSchema.json';

  // 组件名称
  name = '矩阵开关';
  isBaseComponent = true;
  icon = 'fa fa-th-large';
  pluginIcon = 'matrix-checkboxes-plugin';
  description = '可配置行单选，列单选，以及全部选项只能单选或者全部选项多选';
  docLink = '/amis/zh-CN/components/form/matrix-checkboxes';
  tags = ['表单项'];
  scaffold = {
    type: 'matrix-checkboxes',
    name: 'matrix',
    label: '矩阵开关',
    rowLabel: '行标题说明',
    columns: [
      {
        label: '列1'
      },
      {
        label: '列2'
      }
    ],
    rows: [
      {
        label: '行1'
      },
      {
        label: '行2'
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
        ...this.scaffold
      }
    ]
  };

  notRenderFormZone = true;

  panelTitle = '矩阵开关';
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
      description: '清除选中值',
      ...getActionCommonProps('clear')
    },
    {
      actionType: 'reset',
      actionLabel: '重置',
      description: '重置为默认值',
      ...getActionCommonProps('reset')
    },
    {
      actionType: 'reload',
      actionLabel: '重新加载',
      description: '触发组件数据刷新并重新渲染',
      ...getActionCommonProps('reload')
    },
    {
      actionType: 'setValue',
      actionLabel: '赋值',
      description: '触发组件数据更新',
      ...getActionCommonProps('setValue')
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
              getSchemaTpl('switch', {
                name: 'multiple',
                label: '可多选',
                pipeIn: defaultValue(true)
              }),
              {
                label: tipedLabel('模式', '行级、列级或者单个单元单选'),
                name: 'singleSelectMode',
                type: 'button-group-select',
                size: 'sm',
                option: '列级',
                horizontal: {
                  left: 2,
                  justify: true
                },
                visibleOn: '!data.multiple',
                options: [
                  {
                    label: '行级',
                    value: 'row'
                  },
                  {
                    label: '列级',
                    value: 'column'
                  },
                  {
                    label: '单个单元',
                    value: 'cell'
                  }
                ],
                pipeIn: defaultValue('column')
              },
              getSchemaTpl('switch', {
                name: 'yCheckAll',
                label: tipedLabel('列全选', '列级全选功能')
              }),
              getSchemaTpl('switch', {
                name: 'xCheckAll',
                label: tipedLabel('行全选', '行级全选功能')
              }),
              getSchemaTpl('autoFillApi')
            ]
          },
          {
            title: '选项',
            body: [
              [
                getSchemaTpl('combo-container', {
                  label: '列配置',
                  mode: 'normal',
                  name: 'columns',
                  type: 'combo',
                  multiple: true,
                  addButtonText: '添加一列',
                  scaffold: {
                    label: '列说明'
                  },
                  items: [getSchemaTpl('matrixColumnLabel')]
                }),
                getSchemaTpl('matrixRowTitle'),
                getSchemaTpl('combo-container', {
                  label: '行配置',
                  name: 'rows',
                  type: 'combo',
                  mode: 'normal',
                  multiple: true,
                  scaffold: {
                    label: '行说明'
                  },
                  addButtonText: '添加一行',
                  items: [getSchemaTpl('matrixRowLabel')]
                })
              ],
              getSchemaTpl('apiControl', {
                label: tipedLabel('接口', '获取矩阵数据接口'),
                name: 'source',
                mode: 'normal'
              }),
              getSchemaTpl('loadingConfig', {}, {context})
              // getSchemaTpl('value')
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
            getSchemaTpl('style:classNames'),
            {
              label: tipedLabel('对齐方式', '默认当开启全选后居左排列'),
              name: 'textAlign',
              type: 'select',
              options: [
                {
                  label: '居中',
                  value: 'center'
                },
                {
                  label: '居左',
                  value: 'left'
                },
                {
                  label: '居右',
                  value: 'right'
                },
                {
                  label: '两端对齐',
                  value: 'justify'
                }
              ]
            }
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
    // 先简单处理了
    return {
      type: 'array',
      title: node.schema?.label || node.schema?.name,
      riginalValue: node.schema?.value // 记录原始值，循环引用检测需要
    };
  }
}

registerEditorPlugin(MatrixControlPlugin);
