import {
  EditorManager,
  EditorNodeType,
  registerEditorPlugin,
  BasePlugin,
  BaseEventContext,
  RendererPluginAction,
  RendererPluginEvent,
  tipedLabel,
  getSchemaTpl,
  defaultValue
} from 'amis-editor-core';
import type {Schema} from 'amis';
import {ValidatorTag} from '../../validator';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';
import {resolveOptionEventDataSchame} from '../../util';
import {inputStateTpl} from '../../renderer/style-control/helper';

export class ChainedSelectControlPlugin extends BasePlugin {
  static id = 'ChainedSelectControlPlugin';
  // 关联渲染器名字
  rendererName = 'chained-select';
  $schema = '/schemas/ChainedSelectControlSchema.json';

  // 组件名称
  name = '链式下拉框';
  isBaseComponent = true;
  icon = 'fa fa-th-list';
  pluginIcon = 'chained-select-plugin';
  description =
    '通过<code>source</code>拉取选项，只要有返回结果，就可以无限级别增加';
  docLink = '/amis/zh-CN/components/form/chain-select';
  tags = ['表单项'];
  scaffold = {
    type: 'chained-select',
    label: '链式下拉',
    name: 'chainedSelect',
    joinValues: true
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    wrapWithPanel: false,
    mode: 'horizontal',
    body: {
      ...this.scaffold
    }
  };

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

  panelTitle = '链式下拉';

  notRenderFormZone = true;
  panelJustify = true;
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

              getSchemaTpl('valueFormula', {
                rendererSchema: (schema: Schema) => schema,
                mode: 'vertical', // 改成上下展示模式
                rendererWrapper: true,
                label: tipedLabel('默认值', '请填入选项 Options 中 value 值')
              }),

              getSchemaTpl('switch', {
                label: tipedLabel(
                  '拼接值',
                  '开启后将选中的选项 value 的值用连接符拼接起来，作为当前表单项的值'
                ),
                name: 'joinValues',
                pipeIn: defaultValue(true)
              }),

              getSchemaTpl('delimiter', {
                visibleOn: 'this.joinValues !== false',
                clearValueOnHidden: true
              }),

              getSchemaTpl('extractValue', {
                visibleOn: 'this.joinValues === false',
                clearValueOnHidden: true
              }),

              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('placeholder'),
              getSchemaTpl('description'),
              getSchemaTpl('autoFillApi')
            ]
          },
          {
            title: '选项',
            body: [
              getSchemaTpl('apiControl', {
                name: 'source',
                mode: 'normal',
                label: tipedLabel(
                  '获取选项接口',
                  `<div>可用变量说明</div><ul>
                      <li><code>value</code>当前值</li>
                      <li><code>level</code>拉取级别，从 <code>1</code>开始。</li>
                      <li><code>parentId</code>上一层选中的 <code>value</code> 值</li>
                      <li><code>parent</code>上一层选中选项，包含 <code>label</code> 和 <code>value</code> 的值。</li>
                  </ul>`,
                  {
                    maxWidth: 'unset'
                  }
                )
              }),

              getSchemaTpl(
                'loadingConfig',
                {
                  visibleOn: 'this.source || !this.options'
                },
                {context}
              ),

              {
                type: 'input-text',
                name: 'labelField',
                label: tipedLabel(
                  '选项标签字段',
                  '默认渲染选项组，会获取每一项中的label变量作为展示文本'
                ),
                pipeIn: defaultValue('label')
              },

              {
                type: 'input-text',
                name: 'valueField',
                label: tipedLabel(
                  '选项值字段',
                  '默认渲染选项组，会获取每一项中的value变量作为表单项值'
                ),
                pipeIn: defaultValue('value')
              }
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
            getSchemaTpl('theme:form-label'),
            getSchemaTpl('theme:form-description'),
            {
              title: '选择框样式',
              body: [
                ...inputStateTpl(
                  'themeCss.chainedSelectControlClassName',
                  '--select-base'
                )
              ]
            },
            {
              title: '下拉框样式',
              body: [
                ...inputStateTpl(
                  'themeCss.chainedSelectPopoverClassName',
                  '--select-base-${state}-option',
                  {
                    state: [
                      {label: '常规', value: 'default'},
                      {label: '悬浮', value: 'hover'},
                      {label: '选中', value: 'focused'}
                    ]
                  }
                )
              ]
            },
            getSchemaTpl('theme:cssCode'),
            getSchemaTpl('style:classNames')
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
    // 默认文本，todo:异步数据case
    const type = 'string';
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

registerEditorPlugin(ChainedSelectControlPlugin);
