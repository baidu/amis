import {
  RendererPluginAction,
  RendererPluginEvent
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {BaseEventContext, BasePlugin} from 'amis-editor-core';
import {getEventControlConfig} from '../../util';

export class TreeSelectControlPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'tree-select';
  $schema = '/schemas/TreeSelectControlSchema.json';

  // 组件名称
  name = '树下拉框';
  isBaseComponent = true;
  icon = 'fa fa-chevron-down';
  description = `点击输入框，弹出树型选择框进行选择`;
  docLink = '/amis/zh-CN/components/form/treeselect';
  tags = ['表单项'];
  scaffold = {
    type: 'tree-select',
    label: '树下拉框',
    name: 'tree-select',
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

  panelTitle = '树下拉';

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
      description: '新增选项提交时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.value': {
              type: 'object',
              title: '新增的选项信息'
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
      description: '编辑选项提交时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.value': {
              type: 'object',
              title: '编辑的选项信息'
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
      eventLabel: '删除节点',
      description: '删除选项提交时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.value': {
              type: 'object',
              title: '删除的选项信息'
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
              type: 'string',
              title: 'deferApi 懒加载远程请求成功后返回的数据'
            }
          }
        }
      ]
    },
    {
      eventName: 'focus',
      eventLabel: '获取焦点',
      description: '输入框获取焦点时触发',
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
      eventName: 'blur',
      eventLabel: '失去焦点',
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
    }
  ];

  // 动作定义
  actions: RendererPluginAction[] = [
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

  panelBodyCreator = (context: BaseEventContext) => {
    return [
      getSchemaTpl('tabs', [
        {
          title: '常规',
          body: [
            getSchemaTpl('valueFormula', {
              rendererSchema: context?.schema,
              mode: 'vertical' // 改成上下展示模式
            }),

            getSchemaTpl('clearable'),

            getSchemaTpl('hideNodePathLabel'),

            getSchemaTpl('fieldSet', {
              title: '选项',
              body: [
                {
                  $ref: 'options',
                  name: 'options'
                },

                getSchemaTpl('source', {
                  sampleBuilder: (schema: any) =>
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

                getSchemaTpl('api', {
                  name: 'autoComplete',
                  label: '自动完成接口',
                  description:
                    '每次输入新内容后，将调用接口，根据接口返回更新选项。当前用户输入值在 `\\${term}` 中。<code>请不要与获取选项接口同时设置。</code>'
                }),

                getSchemaTpl('switch', {
                  name: 'initiallyOpen',
                  label: '是否默认展开子选项',
                  pipeIn: defaultValue(true)
                }),

                {
                  type: 'input-text',
                  name: 'unfoldedLevel',
                  label: '选项默认展开级数',
                  visibleOn:
                    'typeof this.initiallyOpen !== "undefined" || !this.initiallyOpen'
                },

                getSchemaTpl('switch', {
                  name: 'showIcon',
                  label: '是否显示图标',
                  pipeIn: defaultValue(true)
                }),

                getSchemaTpl('searchable'),

                getSchemaTpl('switch', {
                  label: '是否显示单选按钮',
                  name: 'showRadio',
                  visibleOn: '!data.multiple'
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
                  visibleOn: 'data.cascade !== true && data.multiple'
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
                getSchemaTpl('autoFill'),

                getSchemaTpl('creatable'),
                getSchemaTpl('api', {
                  label: '新增选项接口',
                  name: 'addApi'
                }),

                getSchemaTpl('editable'),
                getSchemaTpl('api', {
                  label: '编辑选项接口',
                  name: 'editApi'
                }),

                getSchemaTpl('removable'),
                getSchemaTpl('api', {
                  label: '删除选项接口',
                  name: 'deleteApi'
                })
              ]
            })
          ]
        },
        {
          title: '事件',
          body: [
            getSchemaTpl('eventControl', {
              name: 'onEvent',
              ...getEventControlConfig(this.manager, context)
            })
          ]
        }
      ])
    ];
  };
}

registerEditorPlugin(TreeSelectControlPlugin);
