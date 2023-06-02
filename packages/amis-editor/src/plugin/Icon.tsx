import {registerEditorPlugin, RendererPluginEvent} from 'amis-editor-core';
import {BaseEventContext, BasePlugin} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {getEventControlConfig} from '../renderer/event-control';

export class IconPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'icon';
  $schema = '/schemas/Icon.json';

  // 组件名称
  name = '图标';
  isBaseComponent = true;
  icon = 'fa fa-calendar';

  panelTitle = '图标';

  description = '用来展示一个图标，你可以配置不同的图标样式。';
  docLink = '/amis/zh-CN/components/icon';
  tags = ['展示'];

  pluginIcon = 'button-plugin';

  scaffold = {
    type: 'icon',
    icon: 'fa fa-spotify',
    vendor: ''
  };
  previewSchema: any = {
    type: 'icon',
    icon: 'fa fa-spotify',
    vendor: ''
  };

  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'click',
      eventLabel: '点击',
      description: '点击时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            nativeEvent: {
              type: 'object',
              title: '鼠标事件对象'
            }
          }
        }
      ]
    },
    {
      eventName: 'mouseenter',
      eventLabel: '鼠标移入',
      description: '鼠标移入时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            nativeEvent: {
              type: 'object',
              title: '鼠标事件对象'
            }
          }
        }
      ]
    },
    {
      eventName: 'mouseleave',
      eventLabel: '鼠标移出',
      description: '鼠标移出时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            nativeEvent: {
              type: 'object',
              title: '鼠标事件对象'
            }
          }
        }
      ]
    }
  ];

  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    return [
      getSchemaTpl('tabs', [
        {
          title: '属性',
          body: getSchemaTpl('collapseGroup', [
            {
              title: '基本',
              body: [
                getSchemaTpl('icon', {
                  label: '图标'
                })
              ]
            },
            getSchemaTpl('status')
          ])
        },

        {
          title: '外观',
          body: getSchemaTpl('collapseGroup', [
            {
              title: '自定义样式',
              body: [
                getSchemaTpl('theme:size', {
                  label: '尺寸',
                  name: 'themeCss.className.font.fontSize'
                }),
                getSchemaTpl('theme:colorPicker', {
                  label: '颜色',
                  name: `themeCss.className.font.color`,
                  labelMode: 'input'
                }),
                getSchemaTpl('theme:paddingAndMargin', {
                  label: '边距'
                })
              ]
            }
          ])
        }

        // {
        //   title: '事件',
        //   className: 'p-none',
        //   body: [
        //     getSchemaTpl('eventControl', {
        //       name: 'onEvent',
        //       ...getEventControlConfig(this.manager, context)
        //     })
        //   ]
        // }
      ])
    ];
  };
}

registerEditorPlugin(IconPlugin);
