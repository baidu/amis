import {defaultValue, getSchemaTpl, valuePipeOut} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {
  BasePlugin,
  BasicSubRenderInfo,
  RendererEventContext,
  SubRendererInfo,
  BaseEventContext
} from 'amis-editor-core';
import cloneDeep from 'lodash/cloneDeep';

import {formItemControl} from '../../component/BaseControl';
import {RendererPluginAction, RendererPluginEvent} from 'amis-editor-core';
import {ValidatorTag} from '../../validator';
import {getEventControlConfig} from '../../renderer/event-control/helper';

export class CityControlPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'input-city';
  $schema = '/schemas/CityControlSchema.json';

  // 组件名称
  name = '城市选择';
  isBaseComponent = true;
  icon = 'fa fa-building-o';
  pluginIcon = 'input-city-plugin';
  description = '可配置是否选择区域或者城市';
  docLink = '/amis/zh-CN/components/form/input-city';
  tags = ['表单项'];
  scaffold = {
    type: 'input-city',
    label: '城市选择',
    name: 'city',
    allowCity: true,
    allowDistrict: true,
    extractValue: true
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    wrapWithPanel: false,
    mode: 'horizontal',
    body: [
      {
        ...this.scaffold
      }
    ]
  };

  notRenderFormZone = true;

  panelTitle = '城市选择';

  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: '值变化',
      description: '选中值变化',
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
      description: '重置为默认值'
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
                rendererWrapper: true,
                mode: 'vertical' // 改成上下展示模式
              }),
              {
                name: 'extractValue',
                label: '值格式',
                type: 'button-group-select',
                size: 'sm',
                options: [
                  {label: '行政编码', value: true},
                  {label: '对象结构', value: false}
                ]
              },

              getSchemaTpl('switch', {
                name: 'allowCity',
                label: '可选城市',
                pipeIn: defaultValue(true),
                onChange: (value: string, oldValue: string, item: any, form: any) => {
                  if (!value) {
                    const schema = cloneDeep(form.data);
                    form.setValueByName('allowDistrict', undefined);
                    form.setValueByName('value', schema.extractValue ? '' : {});
                  }
                }
              }),

              getSchemaTpl('switch', {
                name: 'allowDistrict',
                label: '可选区域',
                visibleOn: 'data.allowCity',
                pipeIn: defaultValue(true),
                onChange: (value: string, oldValue: string, item: any, form: any) => {
                  if (!value) {
                    const schema = cloneDeep(form.data);
                    form.setValueByName('value', schema.extractValue ? '' : {});
                  }
                }
              }),

              getSchemaTpl('switch', {
                name: 'searchable',
                label: '可搜索',
                pipeIn: defaultValue(false)
              }),

              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('description'),
              getSchemaTpl('autoFillApi')
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
}

registerEditorPlugin(CityControlPlugin);
