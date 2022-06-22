import {getSchemaTpl} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {
  BasePlugin,
  BasicSubRenderInfo,
  RendererEventContext,
  SubRendererInfo,
  BaseEventContext
} from 'amis-editor-core';

import {formItemControl} from '../../component/BaseControl';
import {
  RendererPluginAction,
  RendererPluginEvent
} from 'amis-editor-core';

export class TagControlPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'input-tag';
  $schema = '/schemas/TagControlSchema.json';

  order = -420;

  // 组件名称
  name = '标签';
  isBaseComponent = true;
  icon = 'fa fa-tag';
  pluginIcon = 'input-tag-plugin';
  description = `配置<code>options</code>可以实现选择选项`;
  docLink = '/amis/zh-CN/components/form/input-tag';
  tags = ['表单项'];
  scaffold = {
    type: 'input-tag',
    label: '标签',
    name: 'tag',
    options: ['红色', '绿色', '蓝色']
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: {
      ...this.scaffold,
      value: '红色'
    }
  };

  notRenderFormZone = true;

  panelTitle = '标签';

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
    },
    {
      eventName: 'focus',
      eventLabel: '获取焦点',
      description: '获取焦点',
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
    },
    {
      eventName: 'blur',
      eventLabel: '失去焦点',
      description: '失去焦点',
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
            getSchemaTpl('clearable'),
            {
              type: 'input-text',
              name: 'optionsTip',
              label: '选项提示',
              value: '最近您使用的标签'
            },
            getSchemaTpl('valueFormula', {
              rendererSchema: context?.schema,
              mode: 'vertical' // 改成上下展示模式
            }),
            getSchemaTpl('joinValues'),
            getSchemaTpl('delimiter'),
            getSchemaTpl('extractValue')
          ]
        },
        option: {
          body: [
            getSchemaTpl('optionControlV2', {
              description: '设置选项后，输入时会下拉这些选项供用户参考。'
            }),
            getSchemaTpl('autoFill')
          ]
        },
        status: {}
      },
      context
    );
  };
}

registerEditorPlugin(TagControlPlugin);
