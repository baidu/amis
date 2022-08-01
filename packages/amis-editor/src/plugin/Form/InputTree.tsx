import React from 'react';
import {RendererPluginAction, RendererPluginEvent} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {BaseEventContext, BasePlugin} from 'amis-editor-core';
import {
  getArgsWrapper,
  getEventControlConfig
} from '../../renderer/event-control/helper';

export class TreeControlPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'input-tree';
  $schema = '/schemas/TreeControlSchema.json';

  // 组件名称
  name = '树选择框';
  isBaseComponent = true;
  icon = 'fa fa-list-alt';
  pluginIcon = 'input-tree-plugin';
  description = `树型结构来选择，可通过<code>options</code>来配置选项，也可通过<code>source</code>拉取选项`;
  docLink = '/amis/zh-CN/components/form/input-tree';
  tags = ['表单项'];
  scaffold = {
    type: 'input-tree',
    label: '树选择框',
    name: 'tree',
    options: [
      {
        label: '选项A',
        value: 'A',
        children: [
          {
            label: '选项C',
            value: 'C'
          },
          {
            label: '选项D',
            value: 'D'
          }
        ]
      },

      {
        label: '选项B',
        value: 'B'
      }
    ]
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: {
      ...this.scaffold
    }
  };

  notRenderFormZone = true;

  panelTitle = '树选择';

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
            'event.data.value': {
              type: 'string',
              title: '选中节点的值'
            }
          }
        }
      ]
    },
    {
      eventName: 'add',
      eventLabel: '新增选项',
      description: '新增节点提交时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.value': {
              type: 'object',
              title: '新增的节点信息'
            },
            'event.data.options': {
              type: 'array',
              title: '选项集合'
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
            'event.data.value': {
              type: 'object',
              title: '编辑的节点信息'
            },
            'event.data.options': {
              type: 'array',
              title: '选项集合'
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
            'event.data.value': {
              type: 'object',
              title: '删除的节点信息'
            },
            'event.data.options': {
              type: 'array',
              title: '选项集合'
            }
          }
        }
      ]
    },
    {
      eventName: 'loadFinished',
      eventLabel: '懒加载完成',
      description: '懒加载接口远程请求成功时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.value': {
              type: 'object',
              title: 'deferApi 懒加载远程请求成功后返回的数据'
            }
          }
        }
      ]
    }
  ];

  // 动作定义
  actions: RendererPluginAction[] = [
    {
      actionType: 'expand',
      actionLabel: '展开',
      description: '展开指定层级',
      innerArgs: ['openLevel'],
      descDetail: (info: any) => {
        return (
          <div>
            <span className="variable-right">{info?.__rendererLabel}</span>
            展开到第
            <span className="variable-left variable-right">
              {info?.args?.openLevel}
            </span>
            层
          </div>
        );
      },
      schema: getArgsWrapper({
        type: 'input-formula',
        variables: '${variables}',
        evalMode: false,
        variableMode: 'tabs',
        label: '展开层级',
        size: 'lg',
        name: 'openLevel',
        mode: 'horizontal'
      })
    },
    {
      actionType: 'collapse',
      actionLabel: '收起',
      description: '收起树节点'
    },
    {
      actionType: 'clear',
      actionLabel: '清空',
      description: '清除数据'
    },
    {
      actionType: 'reset',
      actionLabel: '重置',
      description: '重置数据'
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
  panelBodyCreator = (context: BaseEventContext) =>
    getSchemaTpl('tabs', [
      {
        title: '常规',
        body: [
          /*
          getSchemaTpl('switchDefaultValue'),
          {
            type: 'input-text',
            name: 'value',
            label: '默认值',
            visibleOn: 'typeof this.value !== "undefined"'
          },
          */
          getSchemaTpl('valueFormula', {
            rendererSchema: {
              ...context?.schema,
              type: 'tree-select' // 改用树形输入框，避免占用太多空间
            },
            mode: 'vertical' // 改成上下展示模式
          }),
          getSchemaTpl('fieldSet', {
            title: '选项',
            body: [
              {
                $ref: 'options',
                name: 'options'
              },
              getSchemaTpl('source', {
                sampleBuilder: () =>
                  JSON.stringify(
                    {
                      status: 0,
                      msg: '',
                      data: {
                        options: [
                          {
                            label: '选项A',
                            value: 'a',
                            children: [
                              {
                                label: '子选项',
                                value: 'c'
                              }
                            ]
                          },

                          {
                            label: '选项B',
                            value: 'b'
                          }
                        ]
                      }
                    },
                    null,
                    2
                  )
              }),

              getSchemaTpl('switch', {
                label: '隐藏顶级',
                name: 'hideRoot'
              }),

              getSchemaTpl('switch', {
                name: 'showIcon',
                label: '是否显示图标',
                pipeIn: defaultValue(true)
              }),

              getSchemaTpl('multiple'),

              getSchemaTpl('switch', {
                name: 'cascade',
                label: '不自动选中子节点',
                visibleOn: 'data.multiple',
                description: '选中父级时，孩子节点是否自动选中'
              }),

              getSchemaTpl('switch', {
                name: 'withChildren',
                label: '数值是否携带子节点',
                visibleOn: 'data.cascade !== true && data.multiple',
                disabledOn: 'data.onlyChildren'
              }),

              getSchemaTpl('switch', {
                name: 'onlyChildren',
                label: '数值是否只包含子节点',
                visibleOn: 'data.cascade !== true && data.multiple',
                disabledOn: 'data.withChildren'
              }),

              getSchemaTpl('joinValues'),
              getSchemaTpl('delimiter'),
              getSchemaTpl('extractValue'),
              getSchemaTpl('autoFill')
            ]
          })
        ]
      },
      {
        title: '外观',
        body: [
          {
            label: '顶级文字',
            name: 'rootLabel',
            type: 'input-text',
            pipeIn: defaultValue('顶级'),
            visibleOn: 'data.hideRoot !== true'
          },

          getSchemaTpl('switch', {
            name: 'showIcon',
            label: '是否显示图标',
            pipeIn: defaultValue(true)
          }),

          getSchemaTpl('switch', {
            label: '是否显示单选按钮',
            name: 'showRadio',
            visibleOn: '!data.multiple'
          })
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
}

registerEditorPlugin(TreeControlPlugin);
