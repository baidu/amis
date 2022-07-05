import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin, RegionConfig, RendererInfo} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {tipedLabel} from '../component/BaseControl';
import {ValidatorTag} from '../validator';
import {getEventControlConfig} from '../util';
import {
  RendererPluginAction,
  RendererPluginEvent
} from 'amis-editor-core';

export class LinkPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'link';
  $schema = '/schemas/LinkSchema.json';

  // 组件名称
  name = '链接';
  isBaseComponent = true;
  description = '用来展示文字链接';
  tags = ['展示'];
  icon = 'fa fa-link';
  pluginIcon = 'url-plugin';
  scaffold = {
    type: 'link',
    value: 'http://www.baidu.com/'
  };
  previewSchema = {
    ...this.scaffold,
    label: this.name
  };

  panelTitle = '链接';
  panelJustify = true;
  panelBody = [
    getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              {
                name: 'href',
                type: 'input-text',
                label: tipedLabel(
                  '目标地址',
                  '支持取变量，如果已绑定字段名，可以不用设置'
                )
              },
              {
                name: 'body',
                type: 'input-text',
                label: tipedLabel('内容', '不填写时，自动使用目标地址值')
              },
              getSchemaTpl('switch', {
                name: 'blank',
                label: '在新窗口打开'
              }),
              {
                label: '图标位置',
                type: 'button-group-select',
                name: 'position',
                pipeIn: defaultValue('rightIcon'),
                size: 'sm',
                options: [
                  {
                  label: '左侧',
                  value: 'icon'
                  },

                  {
                  label: '右侧',
                  value: 'rightIcon'
                  }
                ]
              },

              getSchemaTpl('iconLink', {
                name: 'icon',
                visibleOn: 'this.position == "icon"'
              }),

              getSchemaTpl('iconLink', {
                name: 'rightIcon',
                visibleOn: 'this.position == "rightIcon"'
              }),
            ]
          },
          getSchemaTpl('status', {
            disabled: true
          }),
          getSchemaTpl('collapseGroup', [
            {
              title: '高级设置',
              body: [
                {
                  name: 'htmlTarget',
                  type: 'input-text',
                  label: tipedLabel(
                    '锚点',
                    'HTML &lt;a&gt; 元素的target属性，该属性指定在何处显示链接的资源'
                  )
                }
              ]
            }
          ])
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          getSchemaTpl('style:classNames', {
            isFormItem: false,
            schema: [
              getSchemaTpl('className', {
                name: 'iconClassName',
                label: '左侧图标',
                visibleOn: 'this.icon'
              }),
              getSchemaTpl('className', {
                name: 'rightIconClassName',
                label: '右侧图标',
                visibleOn: 'this.rightIcon'
              })
            ]
          })
        ])
      }
    ])
  ];
}

registerEditorPlugin(LinkPlugin);
