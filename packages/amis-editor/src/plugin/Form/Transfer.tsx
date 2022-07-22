import {getSchemaTpl} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin, BaseEventContext} from 'amis-editor-core';
import {getEventControlConfig} from '../../renderer/event-control/helper';
import {
  RendererPluginAction,
  RendererPluginEvent
} from 'amis-editor-core';

import {ValidatorTag} from '../../validator';
import {tipedLabel} from '../../component/BaseControl';

export class TransferPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'transfer';
  $schema = '/schemas/TransferControlSchema.json';

  // 组件名称
  name = '穿梭器';
  isBaseComponent = true;
  icon = 'fa fa-th-list';
  pluginIcon = 'transfer-plugin';
  description = `穿梭器组件`;
  docLink = '/amis/zh-CN/components/form/transfer';
  tags = ['表单项'];
  scaffold = {
    label: '分组',
    type: 'transfer',
    name: 'transfer',
    options: [
      {
        label: '诸葛亮',
        value: 'zhugeliang'
      },
      {
        label: '曹操',
        value: 'caocao'
      },
      {
        label: '钟无艳',
        value: 'zhongwuyan'
      },
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

  events: RendererPluginEvent[] = [
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

  notRenderFormZone = true;

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
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('placeholder'),
              getSchemaTpl('description'),
              getSchemaTpl('switch', {
                label: '统计数据',
                name: 'statistics'
              })
            ]
          },
          {
            title: '左侧选项面板',
            body: [

              {
                label: '展示形式',
                name: 'selectMode',
                type: 'select',
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
                    label: '树形形式',
                    value: 'tree'
                  }
                ],
                onChange: (value: any, origin: any, item: any, form: any) => {
                  form.setValueByName('options', undefined);
                }
              },

              getSchemaTpl('optionControl', {
                visibleOn: 'data.selectMode === "list"',
                multiple: true
              }),

              {
                type: 'ae-transferTableControl',
                name: 'options',
                label: '数据',
                visibleOn: 'data.selectMode === "table"',
                mode: 'normal'
              },

              getSchemaTpl('treeOptionControl', {
                visibleOn: 'data.selectMode === "tree"',
              }),

              getSchemaTpl('switch', {
                label: '可检索',
                name: 'searchable'
              }),

              getSchemaTpl('menuTpl', {
                label: tipedLabel('模板', '左侧选项渲染模板，支持JSX，变量使用\\${xx}')
              }),

              getSchemaTpl('formulaControl', {
                label: '标题',
                name: 'selectTitle',
                type: 'input-text',
                inputClassName: 'is-inline '
              })
            ],
          },
          {
            title: '右侧结果面板',
            body: [
              {
                type: 'button-group-select',
                label: '展示形式',
                name: 'resultListModeFollowSelect',
                inputClassName: 'items-center',
                options: [
                  {label: '列表形式', value: false},
                  {label: '跟随左侧', value: true},
                ],
              },

              getSchemaTpl('switch', {
                label: tipedLabel(
                  '可检索',
                  '查询功能目前只支持根据名称或值来模糊匹配查询'
                ),
                name: 'resultSearchable'
              }),
          
              getSchemaTpl('sortable', {
                label: '支持排序',
                mode: 'horizontal',
                horizontal: {
                  justify: true,
                  left: 8
                },
                inputClassName: 'is-inline',
                visibleOn: 'data.selectMode === "list" && !data.resultListModeFollowSelect',
              }),

              getSchemaTpl('menuTpl', {
                name: 'valueTpl',
                label: tipedLabel('模板', '结果选项渲染模板，支持JSX，变量使用\\${xx}')
              }),

              getSchemaTpl('formulaControl', {
                label: '标题',
                name: 'resultTitle',
                type: 'input-text',
                inputClassName: 'is-inline '
              })
            ]
          },
          getSchemaTpl('status', {isFormItem: true}),
          getSchemaTpl('validation', {tag: ValidatorTag.MultiSelect})
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          getSchemaTpl('style:formItem', renderer),
          getSchemaTpl('style:classNames', [
            getSchemaTpl('className', {
              label: '描述',
              name: 'descriptionClassName',
              visibleOn: 'this.description'
            }),
            getSchemaTpl('className', {
              name: 'addOn.className',
              label: 'AddOn',
              visibleOn: 'this.addOn && this.addOn.type === "text"'
            })
          ])
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
