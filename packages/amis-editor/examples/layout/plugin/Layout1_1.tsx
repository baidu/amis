/**
 * @file Flex 常见布局 1:1 左右均分
 */
import {FlexPluginBase} from '../../../src/plugin/Layout/FlexPluginBase';

export default class Layout1_1 extends FlexPluginBase {
  name = '左右均分';
  isBaseComponent = false;
  pluginIcon = 'layout-2cols-plugin';
  description = '常见布局：左右均分布局（基于 CSS Flex 实现的布局容器）。';
  tags = ['常见布局'];
  order = 200;
  scaffold: any = {
    type: 'flex',
    className: 'p-1',
    items: [
      {
        type: 'wrapper',
        size: 'xs',
        body: [],
        style: {
          flex: '1 1 auto',
          flexBasis: 'auto',
          flexGrow: 1,
          display: 'block'
        }
      },
      {
        type: 'wrapper',
        size: 'xs',
        body: [],
        style: {
          flex: '1 1 auto',
          flexBasis: 'auto',
          flexGrow: 1,
          display: 'block'
        }
      }
    ],
    alignItems: 'stretch'
  };
}
