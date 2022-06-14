import {
  defaultValue,
  setSchemaTpl,
  getSchemaTpl,
  valuePipeOut
} from '../../component/schemaTpl';
import {registerEditorPlugin} from '../../manager';
import {
  BasePlugin,
  BasicSubRenderInfo,
  RendererEventContext,
  SubRendererInfo,
  BaseEventContext
} from '../../plugin';
import { ValidatorTag } from '../../component/validator';
import {tipedLabel} from '../../component/control/BaseControl';
import { getEventControlConfig } from '../../util';
import { RendererAction, RendererEvent } from 'amis-editor-comp/dist/renderers/event-action';

setSchemaTpl('option', {
  name: 'option',
  type: 'input-text',
  label: tipedLabel('说明', '选项说明')
});
export class CheckboxControlPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'checkbox';
  $schema = '/schemas/CheckboxControlSchema.json';

  // 组件名称
  name = '勾选框';
  isBaseComponent = true;
  icon = 'fa fa-check-square-o';
  description = '勾选框';
  docLink = '/amis/zh-CN/components/form/checkbox';
  tags = ['表单项'];
  scaffold = {
    type: 'checkbox',
    option: '勾选框',
    name: 'checkbox'
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    wrapWithPanel: false,
    mode: 'horizontal',
    body: [
      {
        value: true,
        ...this.scaffold,
        label: '勾选表单'
      }
    ]
  };
  notRenderFormZone = true;
  panelTitle = '勾选框';
  panelJustify = true;
  // 事件定义
  events: RendererEvent[] = [
    {
      eventName: 'change',
      eventLabel: '值变化',
      description: '选中状态变化时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.value': {
              type: 'string',
              title: '选中状态'
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
      description: '清除选中值'
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
              getSchemaTpl('option'),
              {
                type: 'ae-Switch-More',
                hiddenOnDefault: false,
                mode: 'normal',
                label: '值格式',
                formType: 'extend',
                form: {
                  body: [
                    {
                      type: 'input-text',
                      label: '勾选值',
                      name: 'trueValue',
                      pipeIn: defaultValue(true),
                      pipeOut: valuePipeOut
                    },
                    {
                      type: 'input-text',
                      label: '未勾选值',
                      name: 'falseValue',
                      pipeIn: defaultValue(false),
                      pipeOut: valuePipeOut
                    }
                  ]
                }
              },
              getSchemaTpl('valueFormula', {
                rendererSchema: {
                  ...context?.schema,
                  type: 'switch',
                },
                label: '默认勾选',
                rendererWrapper: true, // 浅色线框包裹一下，增加边界感
                valueType: 'boolean',
                pipeIn: (value: any, data: any) => {
                  return value === (data?.data?.trueValue ?? true);
                },
                pipeOut: (value: any, origin: any, data: any) => {
                  const {trueValue = true, falseValue = false} = data;
                  return value ? trueValue : falseValue;
                }
              }),
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('description')
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
          getSchemaTpl('eventControl', {
            name: 'onEvent',
            ...getEventControlConfig(this.manager, context)
          })
        ]
      }
    ]);
  }
}

registerEditorPlugin(CheckboxControlPlugin);
