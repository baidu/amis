import {RendererAction, RendererEvent} from 'amis-editor-comp/dist/renderers/event-action';
import {defaultValue, getSchemaTpl} from '../../component/schemaTpl';
import {registerEditorPlugin} from '../../manager';
import {BasePlugin, BaseEventContext} from '../../plugin';
import {getEventControlConfig}  from '../../util';
import {ValidatorTag} from '../../component/validator';
import {tipedLabel} from '../../component/control/BaseControl';

export class RangeControlPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'input-range';
  $schema = '/schemas/RangeControlSchema.json';

  // 组件名称
  name = '滑块';
  isBaseComponent = true;
  icon = 'fa fa-sliders';
  description = `选择某个值或者某个范围`;
  docLink = '/amis/zh-CN/components/form/input-range';
  tags = ['表单项'];
  scaffold = {
    type: 'input-range',
    label: '滑块',
    name: 'range'
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
  notRenderFormZone = true;

  // 事件定义
  events: RendererEvent[] = [
    {
      eventName: 'change',
      eventLabel: '值变化',
      description: '滑块值变化时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.value': {
              type: 'string',
              title: '当前值'
            }
          }
        }
      ]
    },
    {
      eventName: 'focus',
      eventLabel: '获取焦点',
      description: '当设置 showInput 为 true 时，输入框获取焦点时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.value': {
              type: 'string',
              title: '滑块当前值'
            }
          }
        }
      ]
    },
    {
      eventName: 'blur',
      eventLabel: '失去焦点',
      description: '当设置 showInput 为 true 时，输入框失去焦点时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.value': {
              type: 'string',
              title: '滑块当前值'
            }
          }
        }
      ]
    }
  ];

  // 动作定义
  actions: RendererAction[] = [
    {
      actionType: 'clear',
      actionLabel: '清空',
      description: '清除输入框'
    },
    {
      actionType: 'reset',
      actionLabel: '重置',
      description: '将值重置为resetValue，若没有配置resetValue，则清空'
    },
    {
      actionType: 'setValue',
      actionLabel: '赋值',
      description: '触发组件数据更新'
    }
  ];

  panelTitle = '滑块';

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

              {
                label: 'Label',
                name: 'label',
                type: 'input-text'
              },

              {
                label: '方式',
                name: 'multiple',
                type: 'select',
                value: false,
                options: [
                  {
                    label: '单滑块',
                    value: false
                  },
                  {
                    label: '双滑块',
                    value: true
                  }
                ]
              },

              getSchemaTpl('valueFormula', {
                rendererSchema: {
                  ...context?.schema,
                  type: 'input-number',
                },
                valueType: 'number', // 期望数值类型
                visibleOn: '!data.multiple',
              }),

              getSchemaTpl('valueFormula', {
                name: 'min',
                rendererSchema: {
                  ...context?.schema,
                  value: context?.schema.min,
                  type: 'input-number',
                },
                needDeleteProps: ['min'], // 避免自我限制
                label: tipedLabel(
                  '最小值',
                  '请输入数字或使用 <code>\\${xxx}</code> 来获取变量，否则该配置不生效'
                ),
                valueType: 'number',
              }),

              getSchemaTpl('valueFormula', {
                name: 'max',
                rendererSchema: {
                  ...context?.schema,
                  value: context?.schema.max,
                  type: 'input-number',
                },
                needDeleteProps: ['max'], // 避免自我限制
                label: tipedLabel(
                  '最大值',
                  '请输入数字或使用 <code>\\${xxx}</code> 来获取变量，否则该配置不生效'
                ),
                valueType: 'number',
              }),

              {
                label: '默认值',
                type: 'input-group',
                name: 'value',
                visibleOn: 'data.multiple',
                className: 'inputGroup-addOn-no-border',
                body: [
                  {
                    type: 'input-number',
                    validations: 'isNumeric',
                    name: 'min',
                    value: 0
                  },
                  {
                    type: 'tpl',
                    tpl: '-'
                  },
                  {
                    type: 'input-number',
                    validations: 'isNumeric',
                    name: 'max',
                    value: 100
                  }
                ]
              },

              {
                label: '步长',
                name: 'step',
                type: 'input-number',
                value: 1
              },

              {
                type: 'input-text',
                name: 'unit',
                label: '单位',
                value: ''
              },

              // tooltipVisible 为true时，会一直显示，为undefined时，才会鼠标移入显示
              getSchemaTpl('switch', {
                name: 'tooltipVisible',
                label: '值标签',
                value: undefined,
                pipeOut: (value?: boolean) => {
                  return !!value ? undefined : false;
                },
                pipeIn: (value?: boolean) => {
                  return (value === undefined || value === true) ? true : false;
                }
              }),

              {
                type: 'container',
                className: 'ae-ExtendMore mb-2',
                visibleOn: 'data.tooltipVisible === undefined',
                body: [
                  {
                    type: 'select',
                    name: 'tooltipPlacement',
                    label: '方向',
                    value: 'auto',
                    options: [
                      {label: '自动', value: 'auto'},
                      {label: '上', value: 'top'},
                      {label: '下', value: 'bottom'},
                      {label: '左', value: 'left'},
                      {label: '右', value: 'right'},
                    ]
                  }
                ]
              },

              getSchemaTpl('switch', {
                name: 'showInput',
                label: '可输入',
                value: false
              }),

              getSchemaTpl('switch', {
                name: 'clearable',
                label: '可重置',
                value: false,
                visibleOn: '!!data.showInput'
              })
            ]
          },
          {
            title: '轨道',
            body: [
              {
                type: 'ae-partsControl',
                mode: 'normal',
                name: 'partsSource'
              },
              {
                type: 'ae-marksControl',
                mode: 'normal',
                name: 'markSource'
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
            getSchemaTpl('style:classNames')
          ])
        ]
      },
      {
        title: '事件',
        className: 'p-none',
        body: [
          getSchemaTpl('eventControl',{
            name: 'onEvent',
            ...getEventControlConfig(this.manager, context)
          })
        ]
      }
    ]);
  };
}

registerEditorPlugin(RangeControlPlugin);
