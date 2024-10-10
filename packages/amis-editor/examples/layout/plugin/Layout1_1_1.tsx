/**
 * @file Flex 常见布局 1:1:1 三栏均分
 */
import {FlexPluginBase} from '../../../src/plugin/Layout/FlexPluginBase';

export default class Layout1_1_1 extends FlexPluginBase {
  name = '三栏均分';
  isBaseComponent = false;
  pluginIcon = 'layout-3cols-plugin';
  description = '常见布局：三栏均分布局（基于 CSS Flex 实现的布局容器）。';
  tags = ['常见布局'];
  order = 300;
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
      },
      {
        type: 'wrapper',
        size: 'xs',
        body: [],
        style: {
          flex: '1 1 auto',
          display: 'block',
          flexBasis: 'auto',
          flexGrow: 1
        }
      }
    ],
    alignItems: 'stretch'
  };
}
