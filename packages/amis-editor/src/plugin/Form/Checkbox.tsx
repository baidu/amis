import {
  defaultValue,
  setSchemaTpl,
  getSchemaTpl,
  valuePipeOut,
  undefinedPipeOut,
  EditorNodeType,
  EditorManager
} from 'amis-editor-core';
import {isPureVariable} from 'amis';
import {registerEditorPlugin} from 'amis-editor-core';
import {
  BasePlugin,
  BasicSubRenderInfo,
  RendererEventContext,
  SubRendererInfo,
  BaseEventContext,
  tipedLabel
} from 'amis-editor-core';
import {ValidatorTag} from '../../validator';
import {RendererPluginAction, RendererPluginEvent} from 'amis-editor-core';
import {getEventControlConfig} from '../../renderer/event-control/helper';
import omit from 'lodash/omit';

setSchemaTpl('option', {
  name: 'option',
  type: 'input-text',
  label: tipedLabel('说明', '选项说明')
});
export class CheckboxControlPlugin extends BasePlugin {
  static id = 'CheckboxControlPlugin';
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'checkbox';
  $schema = '/schemas/CheckboxControlSchema.json';

  // 组件名称
  name = '勾选框';
  isBaseComponent = true;
  icon = 'fa fa-check-square-o';
  pluginIcon = 'checkbox-plugin';
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
  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: '值变化',
      description: '选中状态变化时触发',
      dataSchema: (manager: EditorManager) => {
        const node = manager.store.getNodeById(manager.store.activeId);
        const schemas = manager.dataSchema.current.schemas;
        const dataSchema = schemas.find(
          item => item.properties?.[node!.schema.name]
        );

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: '数据',
                properties: {
                  value: {
                    type: 'string',
                    ...((dataSchema?.properties?.[node!.schema.name] as any) ??
                      {}),
                    title: '状态值'
                  }
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
      description: '清除选中值'
    },
    {
      actionType: 'reset',
      actionLabel: '重置',
      description: '将值重置为初始值'
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
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              getSchemaTpl('formItemName', {
                required: true
              }),
              getSchemaTpl('label'),
              getSchemaTpl('option'),
              {
                type: 'ae-switch-more',
                hiddenOnDefault: false,
                mode: 'normal',
                label: '值格式',
                formType: 'extend',
                form: {
                  body: [
                    {
                      type: 'ae-valueFormat',
                      name: 'trueValue',
                      label: '勾选值',
                      pipeIn: defaultValue(true),
                      pipeOut: undefinedPipeOut,
                      onChange: (
                        value: any,
                        oldValue: any,
                        model: any,
                        form: any
                      ) => {
                        const {value: defaultValue, trueValue} =
                          form?.data || {};
                        if (isPureVariable(defaultValue)) {
                          return;
                        }
                        if (trueValue === defaultValue && trueValue !== value) {
                          form.setValues({value});
                        }
                      }
                    },
                    {
                      type: 'ae-valueFormat',
                      name: 'falseValue',
                      label: '未勾选值',
                      pipeIn: defaultValue(false),
                      pipeOut: undefinedPipeOut,
                      onChange: (
                        value: any,
                        oldValue: any,
                        model: any,
                        form: any
                      ) => {
                        const {value: defaultValue, falseValue} =
                          form?.data || {};
                        if (isPureVariable(defaultValue)) {
                          return;
                        }
                        if (
                          falseValue === defaultValue &&
                          falseValue !== value
                        ) {
                          form.setValues({value});
                        }
                      }
                    }
                  ]
                }
              },
              getSchemaTpl('valueFormula', {
                rendererSchema: {
                  ...omit(context?.schema, ['trueValue', 'falseValue']),
                  type: 'switch'
                },
                needDeleteProps: ['option'],
                label: '默认勾选',
                rendererWrapper: true, // 浅色线框包裹一下，增加边界感
                valueType: 'boolean',
                pipeIn: (value: any, data: any) => {
                  if (isPureVariable(value)) {
                    return value;
                  }
                  return value === (data?.data?.trueValue ?? true);
                },
                pipeOut: (value: any, origin: any, data: any) => {
                  if (isPureVariable(value)) {
                    return value;
                  }
                  const {trueValue = true, falseValue = false} = data;
                  return value ? trueValue : falseValue;
                }
              }),
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('description'),
              getSchemaTpl('autoFillApi', {
                trigger: 'change'
              })
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
  };

  buildDataSchemas(node: EditorNodeType, region: EditorNodeType) {
    // 默认trueValue和falseValue是同类型
    return {
      type: node.schema?.trueValue ? typeof node.schema?.trueValue : 'boolean',
      title: node.schema?.label || node.schema?.name,
      originalValue: node.schema?.value // 记录原始值，循环引用检测需要
    };
  }
}

registerEditorPlugin(CheckboxControlPlugin);
