import {registerEditorPlugin} from 'amis-editor-core';
import {FlexPluginBase, defaultFlexColumnSchema} from './FlexPluginBase';

export default class Layout_fixed_top extends FlexPluginBase {
  name = '吸顶容器';
  isBaseComponent = true;
  pluginIcon = 'flex-container-plugin';
  description = '吸顶容器: 基于 CSS Flex 实现的布局容器。';
  order = 502;
  scaffold: any = {
    type: 'flex',
    title: '吸顶容器',
    className: 'p-1',
    items: [
      defaultFlexColumnSchema(),
      defaultFlexColumnSchema(),
      defaultFlexColumnSchema(),
    ],
    style: {
      position: 'fixed',
      inset: '0 auto auto 0',
      zIndex: 10,
      width: '100%',
      overflowX: 'auto',
      margin: '0',
      overflowY: 'auto'
    },
    isFixedWidth: true,
    direction: 'row',
    justify: 'center',
    alignItems: 'stretch',
    isFixedHeight: false,
    originPosition: 'right-bottom'
  };
  panelTitle = '吸顶容器';
}

registerEditorPlugin(Layout_fixed_top);
