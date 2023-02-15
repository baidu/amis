import {registerEditorPlugin} from 'amis-editor-core';
import {BaseEventContext, BasePlugin} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {
  tipedLabel,
  RendererPluginEvent,
  RendererPluginAction
} from 'amis-editor-core';
import {ValidatorTag} from '../validator';
import {getEventControlConfig} from '../renderer/event-control/helper';

export class SearchBoxPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'search-box';
  $schema = '/schemas/SearchBoxSchema.json';

  // 组件名称
  name = '搜索框';
  searchKeywords = '搜索框、searchbox';
  isBaseComponent = true;
  description = '用于展示一个简单搜索框，通常需要搭配其他组件使用';

  docLink = '/amis/zh-CN/components/search-box';
  tags = ['展示'];
  icon = 'fa fa-search';
  pluginIcon = 'search-box-plugin';
  scaffold = {
    type: 'search-box',
    name: 'keyword'
  };
  previewSchema = {
    ...this.scaffold
  };

  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'search',
      eventLabel: '搜索',
      description: '搜索时触发'
    },
    {
      eventName: 'change',
      eventLabel: '值变化',
      description: '输入框值变化时触发'
    },
    {
      eventName: 'focus',
      eventLabel: '获取焦点',
      description: '输入框获取焦点时触发'
    },
    {
      eventName: 'blur',
      eventLabel: '失去焦点',
      description: '输入框失去焦点时触发'
    }
  ];

  // 动作定义
  actions: RendererPluginAction[] = [
    {
      actionType: 'clear',
      actionLabel: '清空',
      description: '清空输入框'
    },
    {
      actionType: 'setValue',
      actionLabel: '更新数据',
      description: '更新数据'
    }
  ];

  panelTitle = '搜索框';

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    const isFormItem = !!context?.info.renderer.isFormItem;
    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              {
                type: 'input-text',
                name: 'name',
                label: '关键字'
              },
              getSchemaTpl('switch', {
                name: 'mini',
                label: '迷你模式'
              }),
              getSchemaTpl('switch', {
                name: 'searchImediately',
                label: '立即搜索'
              }),
              getSchemaTpl('clearable'),
              getSchemaTpl('placeholder')
            ]
          },
          getSchemaTpl('status', {isFormItem: false})
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              getSchemaTpl('switch', {
                name: 'enhance',
                label: '加强模式'
              })
            ]
          },
          getSchemaTpl('style:classNames', {
            isFormItem: false
          })
        ])
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

registerEditorPlugin(SearchBoxPlugin);
