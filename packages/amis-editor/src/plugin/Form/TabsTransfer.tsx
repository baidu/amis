import React from 'react';
import {getSchemaTpl} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin, BaseEventContext} from 'amis-editor-core';

import {RendererPluginAction, RendererPluginEvent} from 'amis-editor-core';
import {getEventControlConfig} from '../../renderer/event-control/helper';

export class TabsTransferPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'tabs-transfer';
  $schema = '/schemas/TransferControlSchema.json';

  // 组件名称
  name = '组合穿梭器';
  isBaseComponent = true;
  icon = 'fa fa-th-list';
  pluginIcon = 'tabs-transfer-plugin';
  description = `组合穿梭器组件`;
  docLink = '/amis/zh-CN/components/form/transfer';
  tags = ['表单项'];
  scaffold = {
    label: '组合穿梭器',
    type: 'tabs-transfer',
    name: 'a',
    sortable: true,
    searchable: true,
    options: [
      {
        label: '成员',
        selectMode: 'tree',
        children: [
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
      },
      {
        label: '用户',
        selectMode: 'chained',
        children: [
          {
            label: '法师',
            children: [
              {
                label: '诸葛亮',
                value: 'zhugeliang2'
              }
            ]
          },
          {
            label: '战士',
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
            'event.data.value': {
              type: 'string',
              title: '选中值'
            }
          }
        }
      ]
    },
    {
      eventName: 'tab-change',
      eventLabel: '选项卡切换',
      description: '选项卡切换时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.key': {
              type: 'string',
              title: '当前激活的选项卡索引'
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
      description: '清空选中内容'
    },
    {
      actionType: 'reset',
      actionLabel: '重置',
      description: '重置选择的内容'
    },
    {
      actionType: 'changeTabKey',
      actionLabel: '修改选中tab',
      description: '修改当前选中tab，来选择其他选项',
      descDetail: (info: any) => {
        return (
          <div>
            <span className="variable-right">{info?.__rendererLabel}</span>
            修改选中tab
          </div>
        );
      }
    },
    {
      actionType: 'setValue',
      actionLabel: '赋值',
      description: '触发组件数据更新'
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
            multiple: true,
            visibleOn: 'typeof this.value !== "undefined"'
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
              getSchemaTpl('autoFillApi', {
                visibleOn:
                  '!this.autoFill || this.autoFill.scene && this.autoFill.action'
              }),
              getSchemaTpl('autoFill', {
                visibleOn:
                  '!this.autoFill || !this.autoFill.scene && !this.autoFill.action'
              })
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

registerEditorPlugin(TabsTransferPlugin);
