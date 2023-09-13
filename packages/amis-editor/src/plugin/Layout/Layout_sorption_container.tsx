import {registerEditorPlugin} from 'amis-editor-core';
import {FlexPluginBase, defaultFlexColumnSchema} from './FlexPluginBase';

export default class Layout_fixed_top extends FlexPluginBase {
  static id = 'Layout_fixed_top';
  static scene = ['layout'];

  name = '吸附容器';
  isBaseComponent = true;
  pluginIcon = 'layout-fixed-top';
  description = '吸附容器: 可设置成吸顶或者吸顶展示。';
  order = -1;
  scaffold: any = {
    type: 'flex',
    isSorptionContainer: true,
    sorptionPosition: 'top',
    className: 'p-1',
    items: [
      defaultFlexColumnSchema(),
      defaultFlexColumnSchema(),
      defaultFlexColumnSchema(),
      defaultFlexColumnSchema()
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
    isFixedHeight: false,
    originPosition: 'right-bottom'
  };
  panelTitle = '吸附容器';
}

registerEditorPlugin(Layout_fixed_top);
