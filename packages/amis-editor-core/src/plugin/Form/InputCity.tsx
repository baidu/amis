import {
  defaultValue,
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

import {formItemControl} from '../../component/control/BaseControl';
import { RendererAction, RendererEvent } from 'amis-editor-comp/dist/renderers/event-action';

export class CityControlPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'input-city';
  $schema = '/schemas/CityControlSchema.json';

  // 组件名称
  name = '城市选择';
  isBaseComponent = true;
  icon = 'fa fa-building-o';
  description = '可配置是否选择区域或者城市';
  docLink = '/amis/zh-CN/components/form/input-city';
  tags = ['表单项'];
  scaffold = {
    type: 'input-city',
    label: '城市选择',
    name: 'city'
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
  events: RendererEvent[] = [
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
  actions: RendererAction[] = [
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

  panelBodyCreator = (context: BaseEventContext) => {
    return formItemControl(
      {
        common: {
          replace: true,
          body: [
            getSchemaTpl('formItemName', {
              required: true
            }),
            getSchemaTpl('label'),
            // getSchemaTpl('switchDefaultValue'),

            /*
            {
              name: 'value',
              type: 'input-city',
              label: '默认值',
              visibleOn: 'typeof data.value !== "undefined"',
              validations: 'isNumeric',
              labelRemark: {
                trigger: 'click',
                className: 'm-l-xs',
                rootClose: true,
                content: '城市编码',
                placement: 'left'
              }
            },
            */

            getSchemaTpl('valueFormula', {
              rendererSchema: context?.schema,
              rendererWrapper: true,
              mode: 'vertical', // 改成上下展示模式
            }),

            getSchemaTpl('switch', {
              name: 'allowDistrict',
              label: '允许选择区域',
              pipeIn: defaultValue(true)
            }),

            getSchemaTpl('switch', {
              name: 'allowCity',
              label: '允许选择城市',
              pipeIn: defaultValue(true)
            }),

            getSchemaTpl('switch', {
              name: 'searchable',
              label: '是否出搜索框',
              pipeIn: defaultValue(false)
            }),

            getSchemaTpl('extractValue')
          ]
        },
        status: {}
      },
      context
    );
  };
}

registerEditorPlugin(CityControlPlugin);