import {getSchemaTpl} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin, BaseEventContext} from 'amis-editor-core';

import {formItemControl} from '../../component/BaseControl';
import {RendererPluginAction, RendererPluginEvent} from 'amis-editor-core';

export class ListControlPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'list-select';
  $schema = '/schemas/ListControlSchema.json';

  order = -430;

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
            getSchemaTpl('multiple'),
            getSchemaTpl('extractValue'),
            getSchemaTpl('valueFormula', {
              rendererSchema: context?.schema,
              useSelectMode: true, // 改用 Select 设置模式
              visibleOn: 'this.options && this.options.length > 0'
            })
          ]
        },
        option: {
          body: [
            getSchemaTpl('optionControlV2', {
              description: '设置选项后，输入时会下拉这些选项供用户参考。'
            })
          ]
        },
        status: {}
      },
      context
    );
  };
}

registerEditorPlugin(ListControlPlugin);
