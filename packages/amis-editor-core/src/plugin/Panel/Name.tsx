import {TargetNamePanel} from '../../component/Panel/TargetNamePanel';
import {registerEditorPlugin} from '../../manager';
import {BasePlugin, BasicPanelItem, BuildPanelEventContext} from '../../plugin';

/**
 * 添加名字面板，方便根据组件名字定位节点
 */
export class NamePlugin extends BasePlugin {
  order = -9999;

  buildEditorPanel(
    {info, selections}: BuildPanelEventContext,
    panels: Array<BasicPanelItem>
  ) {
    // panels.push({
    //   position: 'left',
    //   key: 'name-list',
    //   icon: 'fa fa-list',
    //   title: '名字',
    //   component: TargetNamePanel,
    //   order: 4000
    // });
  }
}
// PM端：名字tab 使用有点奇怪，暂时去掉
// registerEditorPlugin(NamePlugin);
