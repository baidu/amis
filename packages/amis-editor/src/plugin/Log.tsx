/**
 * @file 日志组件
 */
import {registerEditorPlugin} from 'amis-editor-core';
import {BaseEventContext, BasePlugin} from 'amis-editor-core';
import {getSchemaTpl} from 'amis-editor-core';

export class LogPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'log';
  $schema = '/schemas/LogSchema.json';

  // 组件名称
  name = '日志';
  isBaseComponent = true;
  icon = 'fa fa-file-text-o';
  pluginIcon = 'log-plugin';
  description = '用来实时显示日志';
  docLink = '/amis/zh-CN/components/log';
  tags = ['展示'];
  previewSchema = {
    type: 'log',
    height: 120
  };
  scaffold: any = {
    type: 'log'
  };

  panelTitle = '日志';
  panelBodyCreator = (context: BaseEventContext) => {
    return getSchemaTpl('tabs', [
      {
        title: '常规',
        body: [
          getSchemaTpl('api', {
            label: '日志数据源',
            name: 'source'
          })
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

registerEditorPlugin(LogPlugin);
