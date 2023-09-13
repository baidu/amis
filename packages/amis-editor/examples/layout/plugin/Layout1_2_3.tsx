/**
 * @file Flex 常见布局 1:2:3
 */
import {FlexPluginBase} from '../../../src/plugin/Layout/FlexPluginBase';

export default class Layout1_2_3 extends FlexPluginBase {
  name = '1:2:3 三栏';
  isBaseComponent = false;
  pluginIcon = 'layout-3cols-plugin';
  description = '常见布局：1:2:3 三栏布局（基于 CSS Flex 实现的布局容器）。';
  tags = ['常见布局'];
  order = 301;
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
          flexGrow: 2,
          display: 'block'
        }
      },
      {
        type: 'wrapper',
        size: 'xs',
        body: [],
        style: {
          flex: '1 1 auto',
          display: 'block',
          flexBasis: 'auto',
          flexGrow: 3
        }
      }
    ],
    alignItems: 'stretch'
  };
}
