import React from 'react';
import {
  EditorManager,
  EditorNodeType,
  getSchemaTpl,
  tipedLabel,
  BasePlugin,
  BaseEventContext,
  registerEditorPlugin,
  RendererPluginAction,
  RendererPluginEvent
} from 'amis-editor-core';
import {
  getEventControlConfig,
  getActionCommonProps,
  buildLinkActionDesc
} from '../../renderer/event-control/helper';
import {resolveOptionEventDataSchame, resolveOptionType} from '../../util';

export class TabsTransferPlugin extends BasePlugin {
  static id = 'TabsTransferPlugin';
  // 关联渲染器名字
  rendererName = 'tabs-transfer';
  $schema = '/schemas/TransferControlSchema.json';

  // 组件名称
  name = '组合穿梭器';
  isBaseComponent = true;
  icon = 'fa fa-th-list';
  pluginIcon = 'tabs-transfer-plugin';
  description = '组合穿梭器组件';
  docLink = '/amis/zh-CN/components/form/transfer';
  tags = ['表单项'];
  scaffold = {
    label: '组合穿梭器',
    type: 'tabs-transfer',
    name: 'tabsTransfer',
    selectMode: 'tree',
    options: [
      {
        label: '成员',
        children: [
          {
            label: '法师',
            value: 'fashi',
            children: [
              {
                label: '诸葛亮',
                value: 'zhugeliang'
              }
            ]
          },
          {
            label: '战士',
            value: 'zhanshi',
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
            value: 'daye',
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
      },
      {
        label: '用户',
        children: [
          {
            label: '法师',
            value: 'fashi2',
            children: [
              {
                label: '诸葛亮',
                value: 'zhugeliang2'
              }
            ]
          },
          {
            label: '战士',
            value: 'zhanshi2',
            children: [
              {
                label: '曹操',
                value: 'caocao2'
              },
              {
                label: '钟无艳',
                value: 'zhongwuyan2'
              }
            ]
          },
          {
            label: '打野',
            value: 'daye2',
            children: [
              {
                label: '李白',
                value: 'libai2'
              },
              {
                label: '韩信',
                value: 'hanxin2'
              },
              {
                label: '云中君',
                value: 'yunzhongjun2'
              }
            ]
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

  panelTitle = '组合穿梭器';

  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: '值变化',
      description: '选中值变化时触发',
      dataSchema: (manager: EditorManager) => {
        const {value, items} = resolveOptionEventDataSchame(manager, true);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: '数据',
                properties: {
                  value,
                  items
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'tab-change',
      eventLabel: '选项卡切换',
      description: '选项卡切换时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                key: {
                  type: 'string',
                  title: '激活的索引'
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
      description: '清空选中内容',
      ...getActionCommonProps('clear')
    },
    {
      actionType: 'reset',
      actionLabel: '重置',
      description: '重置选择的内容',
      ...getActionCommonProps('reset')
    },
    {
      actionType: 'changeTabKey',
      actionLabel: '修改选中tab',
      description: '修改当前选中tab，来选择其他选项',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            修改
            {buildLinkActionDesc(props.manager, info)}
            选中tab
          </div>
        );
      }
    },
    {
      actionType: 'setValue',
      actionLabel: '赋值',
      description: '触发组件数据更新',
      ...getActionCommonProps('setValue')
    }
  ];

  notRenderFormZone = true;

  panelJustify = true;

  panelDefinitions = {
    options: {
      label: '选项 Options',
      name: 'options',
      type: 'combo',
      multiple: true,
      multiLine: true,
      draggable: true,
      mode: 'normal',
      addButtonText: '新增选项',
      scaffold: {
        label: '',
        value: ''
      },
      items: [
        {
          type: 'group',
          body: [
            getSchemaTpl('label', {
              label: false,
              placeholder: '名称',
              required: true
            }),

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
          {
            title: '基本',
            body: [
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              getSchemaTpl('formItemName', {
                required: true
              }),
              getSchemaTpl('label'),
              {
                label: '左侧选项展示',
                name: 'selectMode',
                type: 'select',
                value: 'tree',
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
              {
                label: '右侧结果标题',
                name: 'resultTitle',
                type: 'input-text',
                inputClassName: 'is-inline ',
                placeholder: '已选项'
              },
              getSchemaTpl('sortable'),
              getSchemaTpl('searchable', {
                onChange: (value: any, origin: any, item: any, form: any) => {
                  if (!value) {
                    form.setValues({
                      searchApi: undefined
                    });
                  }
                }
              }),

              getSchemaTpl('apiControl', {
                label: tipedLabel(
                  '检索接口',
                  '可以通过接口获取检索结果，检索值可以通过变量\\${term}获取，如："https://xxx/search?name=\\${term}"'
                ),
                mode: 'normal',
                name: 'searchApi',
                visibleOn: '!!searchable'
              })
            ]
          },
          {
            title: '选项',
            body: [
              {
                $ref: 'options',
                name: 'options'
              },
              getSchemaTpl('apiControl', {
                label: tipedLabel(
                  '获取选项接口',
                  '可以通过接口获取动态选项，一次拉取全部'
                ),
                mode: 'normal',
                name: 'source'
              }),
              getSchemaTpl(
                'loadingConfig',
                {
                  visibleOn: 'this.source || !this.options'
                },
                {context}
              ),
              getSchemaTpl('joinValues'),
              getSchemaTpl('delimiter'),
              getSchemaTpl('extractValue')
              // getSchemaTpl('autoFillApi', {
              //   visibleOn:
              //     '!this.autoFill || this.autoFill.scene && this.autoFill.action'
              // })
            ]
          },
          {
            title: '高级',
            body: [
              getSchemaTpl('virtualThreshold'),
              getSchemaTpl('virtualItemHeight')
            ]
          },
          getSchemaTpl('status', {isFormItem: true})
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

  buildDataSchemas(node: EditorNodeType, region: EditorNodeType) {
    const type = resolveOptionType(node.schema);
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

registerEditorPlugin(TabsTransferPlugin);
