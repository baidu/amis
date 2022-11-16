/**
 * @file input-excel 组件的素项目部
 */
import {defaultValue, getSchemaTpl, valuePipeOut} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {
  BasePlugin,
  BaseEventContext,
  BasicSubRenderInfo,
  RendererEventContext,
  SubRendererInfo
} from 'amis-editor-core';
import {formItemControl} from '../../component/BaseControl';
import {RendererPluginAction, RendererPluginEvent} from 'amis-editor-core';

export class ExcelControlPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'input-excel';
  $schema = '/schemas/ExcelControlSchema.json';

  // 组件名称
  name = '上传 Excel';
  isBaseComponent = true;
  icon = 'fa fa-eyedropper';
  pluginIcon = 'input-excel-plugin';
  description = '自动解析 Excel';
  docLink = '/amis/zh-CN/components/form/input-excel';
  tags = ['表单项'];
  scaffold = {
    type: 'input-excel',
    label: 'Excel',
    name: 'excel'
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
  panelTitle = '上传 Excel';

  notRenderFormZone = true;

  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: '值变化',
      description: 'excel 上传解析完成后触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.value': {
              type: 'string',
              title: 'excel 解析后的数据'
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
      actionType: 'setValue',
      actionLabel: '赋值',
      description: '触发组件数据更新'
    }
  ];
  panelBodyCreator = (context: BaseEventContext) => {
    return formItemControl(
      {
        common: {
          body: [
            {
              label: '解析模式',
              name: 'parseMode',
              type: 'select',
              options: [
                {
                  label: '对象',
                  value: 'object'
                },
                {label: '数组', value: 'array'}
              ]
            },
            getSchemaTpl('switch', {
              name: 'allSheets',
              label: '是否解析所有 Sheet'
            }),

            getSchemaTpl('switch', {
              name: 'plainText',
              label: '是否解析为纯文本',
              pipeIn: defaultValue(true)
            }),

            getSchemaTpl('switch', {
              name: 'includeEmpty',
              label: '是否包含空内容',
              visibleOn: 'data.parseMode === "array"'
            })
          ]
        }
      },
      context
    );
  };
}

registerEditorPlugin(ExcelControlPlugin);
