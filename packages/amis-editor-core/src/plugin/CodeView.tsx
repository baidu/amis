/**
 * @file 代码高亮显示
 */
import {registerEditorPlugin} from '../manager';
import {BaseEventContext, BasePlugin} from '../plugin';
import {getSchemaTpl} from '../component/schemaTpl';

export class CodeViewPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'code';
  $schema = '/schemas/CodeSchema.json';

  // 组件名称
  name = '代码高亮';
  isBaseComponent = true;
  icon = 'fa fa-code';
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
  panelBody = [
    getSchemaTpl('tabs', [
      {
        title: '常规',
        body: [
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
    ])
  ];
}

registerEditorPlugin(CodeViewPlugin);
