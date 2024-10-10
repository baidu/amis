/**
 * @file 代码高亮显示
 */
import {registerEditorPlugin} from 'amis-editor-core';
import {BaseEventContext, BasePlugin} from 'amis-editor-core';
import {getSchemaTpl} from 'amis-editor-core';

export class CodeViewPlugin extends BasePlugin {
  static id = 'CodeViewPlugin';
  // 关联渲染器名字
  rendererName = 'code';
  $schema = '/schemas/CodeSchema.json';

  // 组件名称
  name = '代码高亮';
  isBaseComponent = true;
  icon = 'fa fa-code';
  pluginIcon = 'code-plugin';
  description = '代码高亮';
  docLink = '/amis/zh-CN/components/code';
  tags = ['展示'];
  scaffold = {
    type: 'code',
    language: 'html',
    value: '<div>html</div>'
  };
  previewSchema: any = {
    ...this.scaffold
  };

  panelTitle = '代码高亮';
  panelBodyCreator = (context: BaseEventContext) => {
    return getSchemaTpl('tabs', [
      {
        title: '常规',
        body: [
          getSchemaTpl('layout:originPosition', {value: 'left-top'}),
          {
            type: 'input-text',
            label: '名称',
            name: 'name'
          },
          {
            type: 'editor',
            label: '固定值',
            allowFullscreen: true,
            name: 'value'
          }
        ]
      },
      {
        title: '外观',
        body: [getSchemaTpl('className')]
      },
      {
        title: '显隐',
        body: [getSchemaTpl('ref'), getSchemaTpl('visible')]
      }
    ]);
  };
}

registerEditorPlugin(CodeViewPlugin);
