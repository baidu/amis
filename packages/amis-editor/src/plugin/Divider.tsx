import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin} from 'amis-editor-core';
import {getSchemaTpl} from 'amis-editor-core';

export class DividerPlugin extends BasePlugin {
  static id = 'DividerPlugin';
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'divider';
  $schema = '/schemas/DividerSchema.json';

  // 组件名称
  name = '分隔线';
  isBaseComponent = true;
  icon = 'fa fa-minus';
  pluginIcon = 'divider-plugin';
  description = '用来展示一个分割线，可用来做视觉上的隔离。';
  scaffold = {
    type: 'divider'
  };
  previewSchema: any = {
    type: 'divider',
    className: 'm-t-none m-b-none'
  };

  panelTitle = '分隔线';
  panelJustify = true;
  tags = ['展示'];

  panelBody = getSchemaTpl('tabs', [
    {
      title: '外观',
      body: [
        getSchemaTpl('layout:originPosition', {value: 'left-top'}),
        getSchemaTpl('layout:width:v2', {
          visibleOn:
            'data.style && data.style.position && (data.style.position === "fixed" || data.style.position === "absolute")'
        }),
        getSchemaTpl('className')
      ]
    },
    {
      title: '显隐',
      body: [getSchemaTpl('ref'), getSchemaTpl('visible')]
    }
  ]);
}

registerEditorPlugin(DividerPlugin);
