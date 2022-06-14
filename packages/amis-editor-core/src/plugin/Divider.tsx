import {registerEditorPlugin} from '../manager';
import {BasePlugin} from '../plugin';
import {getSchemaTpl} from '../component/schemaTpl';

export class DividerPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'divider';
  $schema = '/schemas/DividerSchema.json';

  // 组件名称
  name = '分隔线';
  isBaseComponent = true;
  icon = 'fa fa-minus';
  description = '用来展示一个分割线，可用来做视觉上的隔离。';
  scaffold = {
    type: 'divider'
  };
  previewSchema: any = {
    type: 'divider',
    className: 'm-t-none m-b-none'
  };

  panelTitle = '分隔线';
  panelBody = getSchemaTpl('tabs', [
    {
      title: '外观',
      body: [getSchemaTpl('className')]
    },
    {
      title: '显隐',
      body: [getSchemaTpl('ref'), getSchemaTpl('visible')]
    }
  ]);
}

registerEditorPlugin(DividerPlugin);
