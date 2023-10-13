import React from 'react';
import {Button} from 'amis';
import omit from 'lodash/omit';
import {
  EditorNodeType,
  getSchemaTpl,
  RendererPluginAction,
  RendererPluginEvent
} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {
  BaseEventContext,
  BasePlugin,
  BasicToolbarItem,
  ContextMenuEventContext,
  ContextMenuItem
} from 'amis-editor-core';
import {diff} from 'amis-editor-core';
import {getEventControlConfig} from '../../renderer/event-control/helper';
import {resolveOptionType} from '../../util';

export class PickerControlPlugin extends BasePlugin {
  static id = 'PickerControlPlugin';
  // 关联渲染器名字
  rendererName = 'picker';
  $schema = '/schemas/PickerControlSchema.json';

  // 组件名称
  name = '列表选取';
  isBaseComponent = true;
  icon = 'fa fa-window-restore';
  pluginIcon = 'picker-plugin';
  description =
    '通过 pickerSchema 配置可供选取的数据源进行选择需要的数据，支持多选';
  docLink = '/amis/zh-CN/components/form/picker';
  tags = ['表单项'];
  scaffold = {
    type: 'picker',
    label: '列表选取',
    name: 'picker',
    options: [
      {
        label: '选项A',
        value: 'A'
      },

      {
        label: '选项B',
        value: 'B'
      }
    ],
    modalClassName: 'app-popover'
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

  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: '值变化',
      description: '选中状态变化时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                value: {
                  type: 'string',
                  title: '选中的值'
                },
                selectedItems: {
                  type: 'string',
                  title: '选中的行记录'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'itemClick',
      eventLabel: '点击选项',
      description: '选项被点击时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                item: {
                  type: 'object',
                  title: '所点击的选项'
                }
              }
            }
          }
        }
      ]
    }
  ];

  panelTitle = '列表选取';
  panelBodyCreator = (context: BaseEventContext) => {
    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: [
          getSchemaTpl('layout:originPosition', {value: 'left-top'}),
          getSchemaTpl('switch', {
            name: 'embed',
            label: '开启内嵌模式'
          }),

          getSchemaTpl('switchDefaultValue'),

          {
            type: 'input-text',
            name: 'value',
            label: '默认值',
            visibleOn: 'typeof this.value !== "undefined"'
          },

          getSchemaTpl('fieldSet', {
            title: '选项',
            body: [
              getSchemaTpl('options'),
              getSchemaTpl('api', {
                name: 'source',
                label: '获取选项接口'
              }),

              {
                children: (
                  <Button
                    size="sm"
                    level="danger"
                    className="m-b"
                    onClick={this.editDetail.bind(this, context.id)}
                    block
                  >
                    配置选框详情
                  </Button>
                )
              },

              {
                label: 'labelTpl',
                type: 'textarea',
                name: 'labelTpl',
                labelRemark: '已选定数据的展示样式',
                description:
                  '支持使用 <code>\\${xxx}</code> 来获取变量，或者用 lodash.template 语法来写模板逻辑。<a target="_blank" href="/amis/zh-CN/docs/concepts/template">详情</a>'
              },

              {
                type: 'button-group-select',
                name: 'modalMode',
                label: '选框类型',
                value: 'dialog',
                size: 'xs',
                options: [
                  {
                    label: '弹框',
                    value: 'dialog'
                  },

                  {
                    label: '抽出式弹框',
                    value: 'drawer'
                  }
                ]
              },

              getSchemaTpl('strictMode'),
              getSchemaTpl('multiple'),
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

  buildEditorToolbar(
    {id, info}: BaseEventContext,
    toolbars: Array<BasicToolbarItem>
  ) {
    if (info.renderer.name === this.rendererName) {
      toolbars.push({
        icon: 'fa fa-expand',
        order: 100,
        tooltip: '配置选框详情',
        onClick: this.editDetail.bind(this, id)
      });
    }
  }

  buildEditorContextMenu(
    {id, schema, region, info}: ContextMenuEventContext,
    menus: Array<ContextMenuItem>
  ) {
    if (info.renderer.name === this.rendererName) {
      menus.push('|', {
        label: '配置选框详情',
        onSelect: this.editDetail.bind(this, id)
      });
    }
  }

  editDetail(id: string) {
    const manager = this.manager;
    const store = manager.store;
    const node = store.getNodeById(id)!;
    const value = store.getValueOf(id);

    if (!node || !value) {
      return;
    }

    const component = node.getComponent();

    const schema = {
      type: 'crud',
      mode: 'list',
      ...(value.pickerSchema || {
        listItem: {
          title: '${label}'
        }
      }),
      api: value.source,
      pickerMode: true,
      multiple: value.multiple
    };

    this.manager.openSubEditor({
      title: '配置选框详情',
      value: schema,
      data: {options: component.props.options},
      onChange: newValue => {
        newValue = {
          ...value,
          pickerSchema: {...newValue},
          source: newValue.api
        };

        delete newValue.pickerSchema.api;
        delete newValue.pickerSchema.type;
        delete newValue.pickerSchema.pickerMode;
        delete newValue.pickerSchema.multiple;

        manager.panelChangeValue(newValue, diff(value, newValue));
      }
    });
  }

  buildDataSchemas(node: EditorNodeType, region: EditorNodeType) {
    const type = resolveOptionType(node.schema?.options);
    // todo:异步数据case
    let dataSchema: any = {
      type,
      title: node.schema?.label || node.schema?.name,
      originalValue: node.schema?.value // 记录原始值，循环引用检测需要
    };

    if (node.schema?.joinValues === false) {
      dataSchema = {
        ...dataSchema,
        type: 'object',
        title: node.schema?.label || node.schema?.name,
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
      };
    }

    if (node.schema?.multiple) {
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
            properties: dataSchema.properties
          },
          originalValue: dataSchema.originalValue
        };
      }
    }

    return dataSchema;
  }
}

registerEditorPlugin(PickerControlPlugin);
