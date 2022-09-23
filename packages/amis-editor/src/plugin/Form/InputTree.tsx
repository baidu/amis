import React from 'react';
import {RendererPluginAction, RendererPluginEvent} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {BaseEventContext, BasePlugin} from 'amis-editor-core';
import {
  getArgsWrapper,
  getEventControlConfig
} from '../../renderer/event-control/helper';
import {tipedLabel} from 'amis-editor-core';
import {ValidatorTag} from '../../validator';

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
  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    const renderer: any = context.info.renderer;
    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              getSchemaTpl('formItemName', {
                required: true
              }),
              getSchemaTpl('label'),
              getSchemaTpl('multiple', {
                body: [
                  {
                    type: 'input-number',
                    label: tipedLabel('节点最小数', '表单校验最少选中的节点数'),
                    name: 'minLength'
                  },
                  {
                    type: 'input-number',
                    label: tipedLabel('节点最大数', '表单校验最多选中的节点数'),
                    name: 'maxLength'
                  }
                ]
              }),
              getSchemaTpl('switch', {
                label: tipedLabel(
                  '子节点自动选',
                  '当选中父节点时级联选择子节点'
                ),
                name: 'autoCheckChildren',
                hiddenOn: '!data.multiple',
                value: true
              }),
              getSchemaTpl('switch', {
                label: tipedLabel(
                  '子节点可反选',
                  '子节点可反选，值包含父子节点'
                ),
                name: 'cascade',
                hiddenOn: '!data.multiple || !data.autoCheckChildren'
              }),
              getSchemaTpl('switch', {
                label: tipedLabel(
                  '值包含父节点',
                  '选中父节点时，值里面将包含父子节点的值，否则只会保留父节点的值'
                ),
                name: 'withChildren',
                hiddenOn:
                  '!data.multiple || !data.autoCheckChildren && data.cascade'
              }),
              getSchemaTpl('switch', {
                label: tipedLabel(
                  '值只含子节点',
                  'ui 行为级联选中子节点，子节点可反选，值只包含子节点的值'
                ),
                name: 'onlyChildren',
                hiddenOn: '!data.multiple || !data.autoCheckChildren'
              }),
              getSchemaTpl('valueFormula', {
                rendererSchema: {
                  ...context?.schema,
                  type: 'tree-select'
                },
                visibleOn: 'this.options && this.options.length > 0'
              }),

              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('placeholder'),
              getSchemaTpl('description')
            ]
          },
          {
            title: '选项',
            body: [
              getSchemaTpl('treeOptionControl', {
                label: '数据',
                showIconField: true
              }),
              getSchemaTpl('switch', {
                label: '只可选择叶子节点',
                name: 'onlyLeaf'
              }),
              getSchemaTpl('creatable', {
                formType: 'extend',
                hiddenOnDefault: true,
                label: '可新增',
                form: {
                  body: [
                    getSchemaTpl('switch', {
                      label: '顶层可新增',
                      value: true,
                      name: 'rootCreatable'
                    }),
                    {
                      type: 'input-text',
                      label: '顶层文案',
                      value: '添加一级节点',
                      name: 'rootCreateTip',
                      hiddenOn: '!data.rootCreatable'
                    },
                    getSchemaTpl('addApi')
                  ]
                }
              }),
              getSchemaTpl('editable', {
                formType: 'extend',
                hiddenOnDefault: true,
                form: {
                  body: [getSchemaTpl('editApi')]
                }
              }),
              getSchemaTpl('removable', {
                formType: 'extend',
                hiddenOnDefault: true,
                form: {
                  body: [getSchemaTpl('deleteApi')]
                }
              })
            ]
          },
          {
            title: '高级',
            body: [
              getSchemaTpl('valueFormula', {
                name: 'highlightTxt',
                label: '高亮节点字符',
                type: 'input-text'
              }),
              {
                type: 'ae-Switch-More',
                mode: 'normal',
                name: 'enableNodePath',
                label: tipedLabel(
                  '选项值包含父节点',
                  '开启后对应节点值会包含父节点'
                ),
                value: false,
                formType: 'extend',
                form: {
                  body: [
                    {
                      type: 'input-text',
                      label: '路径分隔符',
                      value: '/',
                      name: 'pathSeparator'
                    }
                  ]
                }
              },
              {
                type: 'ae-Switch-More',
                mode: 'normal',
                name: 'hideRoot',
                label: '显示顶级节点',
                value: true,
                trueValue: false,
                falseValue: true,
                formType: 'extend',
                form: {
                  body: [
                    {
                      type: 'input-text',
                      label: '节点文案',
                      value: '顶级',
                      name: 'rootLabel'
                    }
                  ]
                }
              },
              getSchemaTpl('switch', {
                label: '显示节点图标',
                name: 'showIcon',
                value: true
              }),
              getSchemaTpl('switch', {
                label: tipedLabel(
                  '显示节点勾选框',
                  '单选情况下，也可显示树节点勾选框'
                ),
                name: 'showRadio',
                hiddenOn: 'data.multiple'
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
              {
                type: 'ae-Switch-More',
                mode: 'normal',
                name: 'initiallyOpen',
                label: tipedLabel(
                  '自定义展开层级',
                  '默认展开所有节点层级，开启后可自定义展开层级数'
                ),
                value: true,
                trueValue: false,
                falseValue: true,
                formType: 'extend',
                form: {
                  body: [
                    {
                      type: 'input-number',
                      label: '设置层级',
                      name: 'unfoldedLevel',
                      value: 1,
                      hiddenOn: 'data.initiallyOpen'
                    }
                  ]
                }
              }
            ]
          },
          getSchemaTpl('status', {
            isFormItem: true,
            readonly: true
          }),
          getSchemaTpl('validation', {tag: ValidatorTag.Tree})
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          getSchemaTpl('style:formItem', {renderer}),
          getSchemaTpl('style:classNames', {
            schema: [
              getSchemaTpl('className', {
                label: '外层容器',
                name: 'treeContainerClassName'
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

registerEditorPlugin(TreeControlPlugin);
