import {registerEditorPlugin} from 'amis-editor-core';
import {
  BasePlugin,
  BaseEventContext,
  BasicSubRenderInfo,
  RendererEventContext,
  SubRendererInfo
} from 'amis-editor-core';
import {getSchemaTpl, defaultValue} from 'amis-editor-core';
import {ValidatorTag} from '../../validator';
import {tipedLabel} from '../../component/BaseControl';
import {getEventControlConfig} from '../../util';
import {
  RendererPluginAction,
  RendererPluginEvent
} from 'amis-editor-core';

export class ChainedSelectControlPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'chained-select';
  $schema = '/schemas/ChainedSelectControlSchema.json';

  // 组件名称
  name = '级联下拉框';
  isBaseComponent = true;
  icon = 'fa fa-th-list';
  description =
    '通过<code>source</code>拉取选项，只要有返回结果，就可以无限级别增加';
  docLink = '/amis/zh-CN/components/form/chain-select';
  tags = ['表单项'];
  scaffold = {
    type: 'chained-select',
    label: '级联下拉框',
    name: 'chained-select',
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
      description: '清除选中值'
    },
    {
      actionType: 'reset',
      actionLabel: '重置',
      description: '将值重置为resetValue，若没有配置resetValue，则清空'
    },
    {
      actionType: 'reload',
      actionLabel: '重新加载',
      description: '触发组件数据刷新并重新渲染'
    },
    {
      actionType: 'setValue',
      actionLabel: '赋值',
      description: '触发组件数据更新'
    }
  ];

  panelTitle = '级联选择';

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
              getSchemaTpl('formItemName', {
                required: true
              }),
              getSchemaTpl('label'),

              getSchemaTpl('valueFormula', {
                rendererSchema: context?.schema,
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
                visibleOn: 'data.joinValues !== false',
                clearValueOnHidden: true
              }),

              getSchemaTpl('extractValue', {
                visibleOn: 'data.joinValues === false',
                clearValueOnHidden: true
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
              getSchemaTpl('apiControl', {
                name: 'source',
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
            getSchemaTpl('style:formItem', {renderer: context.info.renderer}),
            getSchemaTpl('style:classNames', {
              schema: [
                getSchemaTpl('className', {
                  name: 'descriptionClassName',
                  label: '描述'
                })
              ]
            })
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
}

registerEditorPlugin(ChainedSelectControlPlugin);
