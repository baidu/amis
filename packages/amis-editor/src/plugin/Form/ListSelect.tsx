import {
  EditorNodeType,
  JSONPipeIn,
  JSONPipeOut,
  getSchemaTpl,
  registerEditorPlugin,
  BasePlugin,
  BaseEventContext,
  diff
} from 'amis-editor-core';
import type {
  EditorManager,
  RendererPluginAction,
  RendererPluginEvent
} from 'amis-editor-core';
import type {Schema} from 'amis';
import {formItemControl} from '../../component/BaseControl';
import {
  resolveOptionEventDataSchame,
  resolveOptionType,
  schemaArrayFormat
} from '../../util';
import {getActionCommonProps} from '../../renderer/event-control/helper';

export class ListControlPlugin extends BasePlugin {
  static id = 'ListControlPlugin';
  // 关联渲染器名字
  rendererName = 'list-select';
  $schema = '/schemas/ListControlSchema.json';

  // 组件名称
  name = '列表选择';
  isBaseComponent = true;
  icon = 'fa fa-ellipsis-h';
  pluginIcon = 'list-select-plugin';
  description =
    '单选或者多选，支持 source 拉取选项，选项可配置图片，也可以自定义 HTML 配置';
  docLink = '/amis/zh-CN/components/form/list-select';
  tags = ['表单项'];
  scaffold = {
    type: 'list-select',
    label: '列表',
    name: 'list',
    options: [
      {
        label: '选项A',
        value: 'A'
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
    body: [
      {
        ...this.scaffold,
        value: 'A'
      }
    ]
  };

  notRenderFormZone = true;

  panelTitle = '列表选择';

  panelJustify = true;

  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: '值变化',
      description: '选中值变化时触发',
      dataSchema: (manager: EditorManager) => {
        const {value} = resolveOptionEventDataSchame(manager);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: '数据',
                properties: {
                  value
                }
              }
            }
          }
        ];
      }
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
      description: '将值重置为初始值',
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

  getSubEditorVariable(schema: any): Array<{label: string; children: any}> {
    let labelField = schema?.labelField || 'label';
    let valueField = schema?.valueField || 'value';

    return [
      {
        label: '当前选项',
        children: [
          {
            label: '选项名称',
            value: labelField
          },
          {
            label: '选项值',
            value: valueField
          }
        ]
      }
    ];
  }

  panelBodyCreator = (context: BaseEventContext) => {
    return formItemControl(
      {
        common: {
          replace: true,
          body: [
            getSchemaTpl('layout:originPosition', {value: 'left-top'}),
            getSchemaTpl('formItemName', {
              required: true
            }),
            getSchemaTpl('label'),
            getSchemaTpl('multiple'),
            getSchemaTpl('extractValue'),
            getSchemaTpl('valueFormula', {
              // 边栏渲染不渲染自定义样式，会干扰css生成
              rendererSchema: (schema: Schema) => ({
                ...(schema || {}),
                itemSchema: null
              }),
              useSelectMode: true, // 改用 Select 设置模式
              visibleOn: 'this.options && this.options.length > 0'
            })
          ]
        },
        option: {
          body: [
            getSchemaTpl('optionControlV2'),
            {
              type: 'ae-switch-more',
              mode: 'normal',
              label: '自定义显示模板',
              formType: 'extend',
              form: {
                body: [
                  {
                    type: 'dropdown-button',
                    label: '配置显示模板',
                    level: 'enhance',
                    buttons: [
                      {
                        type: 'button',
                        block: true,
                        onClick: this.editDetail.bind(
                          this,
                          context.id,
                          'itemSchema'
                        ),
                        label: '配置默认态模板'
                      },
                      {
                        type: 'button',
                        block: true,
                        onClick: this.editDetail.bind(
                          this,
                          context.id,
                          'activeItemSchema'
                        ),
                        label: '配置激活态模板'
                      }
                    ]
                  }
                ]
              },
              pipeIn: (value: any) => {
                return value !== undefined;
              },
              pipeOut: (value: any, originValue: any, data: any) => {
                if (value === true) {
                  return {
                    type: 'container',
                    body: [
                      {
                        type: 'tpl',
                        tpl: `\${${this.getDisplayField(data)}}`,
                        wrapperComponent: '',
                        inline: true
                      }
                    ]
                  };
                }
                return value ? value : undefined;
              }
            }
          ]
        },
        status: {}
      },
      context
    );
  };

  buildDataSchemas(node: EditorNodeType, region: EditorNodeType) {
    const type = resolveOptionType(node.schema);
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

  filterProps(props: any) {
    // 禁止选中子节点
    return JSONPipeOut(props);
  }

  getDisplayField(data: any) {
    return data?.labelField ?? 'label';
  }

  editDetail(id: string, field: string) {
    const manager = this.manager;
    const store = manager.store;
    const node = store.getNodeById(id);
    const value = store.getValueOf(id);
    let defaultItemSchema = {
      type: 'container',
      body: [
        {
          type: 'tpl',
          tpl: `\${${this.getDisplayField(value)}}`,
          inline: true,
          wrapperComponent: ''
        }
      ]
    };

    // 首次编辑激活态样式时自动复制默认态
    if (field !== 'itemSchema' && value?.itemSchema) {
      defaultItemSchema = JSONPipeIn(value.itemSchema, true);
    }

    node &&
      value &&
      this.manager.openSubEditor({
        title: '配置显示模板',
        value: value[field] ?? defaultItemSchema,
        slot: {
          type: 'container',
          body: '$$'
        },
        onChange: (newValue: any) => {
          newValue = {...value, [field]: schemaArrayFormat(newValue)};
          manager.panelChangeValue(newValue, diff(value, newValue));
        },
        data: {
          [value.labelField || 'label']: '选项名',
          [value.valueField || 'value']: '选项值',
          item: '假数据'
        }
      });
  }
}

registerEditorPlugin(ListControlPlugin);
