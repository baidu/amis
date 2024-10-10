import {FlexPluginBase} from '../../../src/plugin/Layout/FlexPluginBase';

export default class Layout_fixed extends FlexPluginBase {
  name = '悬浮容器';
  isBaseComponent = false;
  pluginIcon = 'layout-fixed-plugin';
  description = '常见布局：悬浮容器（基于 CSS Flex 实现的布局容器）。';
  tags = ['常见布局'];
  order = -1;
  scaffold: any = {
    type: 'container',
    size: 'xs',
    body: [],
    style: {
      position: 'fixed',
      inset: 'auto 50px 50px auto',
      zIndex: 10,
      minWidth: '80px',
      minHeight: '80px'
    },
    originPosition: 'right-bottom'
  };
}
