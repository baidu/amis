import {registerEditorPlugin} from 'amis-editor-core';
import {BaseEventContext, BasePlugin} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';

export class MarkdownPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'markdown';
  $schema = '/schemas/MarkdownSchema.json';

  // 组件名称
  name = 'Markdown';
  isBaseComponent = true;
  description = '展示 markdown 内容';
  docLink = '/amis/zh-CN/components/markdown';
  tags = ['展示'];
  icon = 'fa fa-file-text';
  pluginIcon = 'markdown-plugin';
  scaffold = {
    type: 'markdown',
    value: '## 这是标题'
  };
  previewSchema = {
    ...this.scaffold
  };

  panelTitle = 'MD';
  panelBodyCreator = (context: BaseEventContext) => {
    const isUnderField = /\/field\/\w+$/.test(context.path as string);
    return [
      getSchemaTpl('tabs', [
        {
          title: '常规',
          body: [getSchemaTpl('markdownBody')]
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
  };
}

registerEditorPlugin(MarkdownPlugin);
