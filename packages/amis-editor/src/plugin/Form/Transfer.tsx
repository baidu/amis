import {getSchemaTpl} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin, BaseEventContext} from 'amis-editor-core';
import {getEventControlConfig} from '../../util';
import {
  RendererAction,
  RendererEvent
} from 'amis-editor-comp/dist/renderers/event-action';

export class TransferPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'transfer';
  $schema = '/schemas/TransferControlSchema.json';

  // 组件名称
  name = '穿梭器';
  isBaseComponent = true;
  icon = 'fa fa-th-list';
  description = `穿梭器组件`;
  docLink = '/amis/zh-CN/components/form/transfer';
  tags = ['表单项'];
  scaffold = {
    label: '分组',
    type: 'transfer',
    name: 'transfer',
    options: [
      {
        label: '法师',
        children: [
          {
            label: '诸葛亮',
            value: 'zhugeliang'
          }
        ]
      },
      {
        label: '战士',
        children: [
          {
            label: '曹操',
            value: 'caocao'
          },
          {
            label: '钟无艳',
            value: 'zhongwuyan'
          }
        ]
      },
      {
        label: '打野',
        children: [
          {
            label: '李白',
            value: 'libai'
          },
          {
            label: '韩信',
            value: 'hanxin'
          },
          {
            label: '云中君',
            value: 'yunzhongjun'
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
        ...this.scaffold
      }
    ]
  };

  panelTitle = '穿梭器';

  events: RendererEvent[] = [
    {
      eventName: 'change',
      eventLabel: '值变化',
      description: '输入框失去焦点时触发',
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
    },
    {
      eventName: 'selectAll',
      eventLabel: '全选',
      description: '选中所有选项',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data': {
              type: 'array',
              title: '选中值'
            }
          }
        }
      ]
    }
  ];

  // 动作定义
  actions: RendererAction[] = [
    {
      actionType: 'clear',
      actionLabel: '清空',
      description: '清空选中内容'
    },
    {
      actionType: 'reset',
      actionLabel: '重置',
      description: '重置选择的内容'
    },
    {
      actionType: 'selectAll',
      actionLabel: '全选',
      description: '选中所有选项'
    },
    {
      actionType: 'setValue',
      actionLabel: '赋值',
      description: '触发组件数据更新，多值用“,”分隔'
    }
  ];

  panelDefinitions = {
    options: {
      label: '选项 Options',
      name: 'options',
      type: 'combo',
      multiple: true,
      multiLine: true,
      draggable: true,
      addButtonText: '新增选项',
      scaffold: {
        label: '',
        value: ''
      },
      items: [
        {
          type: 'group',
          body: [
            {
              type: 'input-text',
              name: 'label',
              placeholder: '名称',
              required: true
            },

            {
              type: 'input-text',
              name: 'value',
              placeholder: '值',
              unique: true
            }
          ]
        },
        {
          $ref: 'options',
          label: '子选项',
          name: 'children',
          addButtonText: '新增子选项'
        }
      ]
    }
  };

  // notRenderFormZone = true;

  panelBodyCreator = (context: BaseEventContext) => {
    const renderer: any = context.info.renderer;

    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          getSchemaTpl('switchDefaultValue'),

          {
            type: 'select',
            name: 'value',
            label: '默认值',
            source: '${options}',
            visibleOn: '!data.multiple && typeof this.value !== "undefined"'
          },

          {
            type: 'select',
            name: 'value',
            label: '默认值',
            source: '${options}',
            multiple: true,
            visibleOn: ' data.multiple && typeof this.value !== "undefined"'
          },

          {
            label: '勾选展示模式',
            name: 'selectMode',
            type: 'select',
            mode: 'inline',
            className: 'w-full',
            options: [
              {
                label: '列表形式',
                value: 'list'
              },
              {
                label: '表格形式',
                value: 'table'
              },
              {
                label: '树形选择形式',
                value: 'tree'
              },
              {
                label: '级联选择形式',
                value: 'chained'
              },
              {
                label: '关联选择形式',
                value: 'associated'
              }
            ]
          },

          {
            name: 'columns',
            type: 'combo',
            multiple: true,
            label: false,
            strictMode: false,
            addButtonText: '新增一列',
            draggable: false,
            visibleOn: 'data.selectMode === "table"',
            items: [
              {
                type: 'input-text',
                name: 'label',
                placeholder: '标题'
              },
              {
                type: 'input-text',
                name: 'name',
                placeholder: '绑定字段名'
              },
              {
                type: 'select',
                name: 'type',
                placeholder: '类型',
                value: 'input-text',
                options: [
                  {
                    value: 'text',
                    label: '纯文本'
                  },
                  {
                    value: 'tpl',
                    label: '模板'
                  },
                  {
                    value: 'image',
                    label: '图片'
                  },
                  {
                    value: 'date',
                    label: '日期'
                  },
                  {
                    value: 'progress',
                    label: '进度'
                  },
                  {
                    value: 'status',
                    label: '状态'
                  },
                  {
                    value: 'mapping',
                    label: '映射'
                  },
                  {
                    value: 'operation',
                    label: '操作栏'
                  }
                ]
              }
            ]
          },

          {
            $ref: 'options',
            label: '左边的选项集',
            name: 'leftOptions',
            visibleOn: 'data.selectMode === "associated"'
          },

          {
            label: '左侧选择形式',
            name: 'leftMode',
            type: 'select',
            mode: 'inline',
            className: 'w-full',
            visibleOn: 'data.selectMode === "associated"',
            options: [
              {
                label: '列表形式',
                value: 'list'
              },
              {
                label: '树形选择形式',
                value: 'tree'
              }
            ]
          },

          {
            label: '右侧选择形式',
            name: 'rightMode',
            type: 'select',
            mode: 'inline',
            className: 'w-full',
            visibleOn: 'data.selectMode === "associated"',
            options: [
              {
                label: '列表形式',
                value: 'list'
              },
              {
                label: '树形选择形式',
                value: 'tree'
              }
            ]
          },

          getSchemaTpl('searchable'),

          getSchemaTpl('api', {
            label: '检索接口',
            name: 'searchApi'
          }),

          {
            label: '查询时勾选展示模式',
            name: 'searchResultMode',
            type: 'select',
            mode: 'inline',
            className: 'w-full',
            options: [
              {
                label: '列表形式',
                value: 'list'
              },
              {
                label: '表格形式',
                value: 'table'
              },
              {
                label: '树形选择形式',
                value: 'tree'
              },
              {
                label: '级联选择形式',
                value: 'chained'
              }
            ]
          },

          getSchemaTpl('sortable'),

          getSchemaTpl('selectFirst'),

          getSchemaTpl('switch', {
            label: '是否显示统计数据',
            name: 'statistics'
          }),

          {
            label: '左侧的标题文字',
            name: 'selectTitle',
            type: 'input-text'
          },

          {
            label: '右侧结果的标题文字',
            name: 'resultTitle',
            type: 'input-text'
          },

          getSchemaTpl('fieldSet', {
            title: '选项',
            body: [
              {
                $ref: 'options',
                name: 'options'
              },
              getSchemaTpl('source'),
              getSchemaTpl('joinValues'),
              getSchemaTpl('delimiter'),
              getSchemaTpl('extractValue'),
              getSchemaTpl('autoFill')
            ]
          })
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
}

registerEditorPlugin(TransferPlugin);
