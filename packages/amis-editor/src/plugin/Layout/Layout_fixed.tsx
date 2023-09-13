import {registerEditorPlugin} from 'amis-editor-core';
import {FlexPluginBase} from './FlexPluginBase';

export default class Layout_fixed extends FlexPluginBase {
  static id = 'Layout_fixed';
  static scene = ['layout'];

  name = '悬浮容器';
  isBaseComponent = true;
  pluginIcon = 'layout-fixed-plugin';
  description = '悬浮容器: 基于 CSS Flex 实现的特殊布局容器。';
  order = 0;
  scaffold: any = {
    type: 'container',
    size: 'xs',
    body: [],
    style: {
      position: 'fixed',
      inset: 'auto 50px 50px auto',
      zIndex: 10,
      minWidth: '80px',
      minHeight: '80px',
      display: 'block'
    },
    wrapperBody: false,
    originPosition: 'right-bottom'
  };
  panelTitle = '悬浮容器';
}

registerEditorPlugin(Layout_fixed);
