import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin, BaseEventContext} from 'amis-editor-core';

import {ValidatorTag} from '../../validator';
import {getEventControlConfig} from '../../util';
import {RendererPluginAction, RendererPluginEvent} from 'amis-editor-core';

export class RadiosControlPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'radios';
  $schema = '/schemas/RadiosControlSchema.json';

  order = -460;

  // 组件名称
  name = '单选框';
  isBaseComponent = true;
  icon = 'fa fa-dot-circle-o';
  pluginIcon = 'radios-plugin';
  description = `通过<code>options</code>配置选项，可通过<code>source</code>拉取选项`;
  docLink = '/amis/zh-CN/components/form/radios';
  tags = ['表单项'];
  scaffold = {
    type: 'radios',
    label: '单选框',
    name: 'radios',
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

  panelTitle = '单选框';

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
                useSelectMode: true, // 改用 Select 设置模式
                visibleOn:
                  'this.options && this.options.length > 0 && this.selectFirst !== true'
              }),
              // getSchemaTpl('autoFill')
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('autoFillApi')
            ]
          },
          {
            title: '选项',
            body: [
              getSchemaTpl('optionControlV2'),
              getSchemaTpl('switch', {
                label: '默认选择第一个',
                name: 'selectFirst',
                horizontal: {justify: true, left: 5},
                visibleOn: '!this.options'
              })
            ]
          },
          getSchemaTpl('status', {isFormItem: true}),
          getSchemaTpl('validation', {
            tag: ValidatorTag.All
          })
        ])
      },
      {
        title: '外观',
        body: [
          getSchemaTpl('collapseGroup', [
            getSchemaTpl('style:formItem', {
              renderer: context.info.renderer,
              schema: [
                getSchemaTpl('switch', {
                  label: '一行选项显示',
                  name: 'inline',
                  hiddenOn: 'data.mode === "inline"',
                  pipeIn: defaultValue(true)
                }),
                {
                  label: '每行选项个数',
                  name: 'columnsCount',
                  hiddenOn: 'data.mode === "inline" || data.inline !== false',
                  type: 'input-range',
                  min: 1,
                  max: 6,
                  pipeIn: defaultValue(1)
                }
              ]
            }),
            getSchemaTpl('style:classNames', {
              schema: [
                getSchemaTpl('className', {
                  label: '单个选项',
                  name: 'itemClassName'
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

registerEditorPlugin(RadiosControlPlugin);
