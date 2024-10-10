/**
 * @file Flex 常见布局 上下布局
 */
import {FlexPluginBase} from '../../../src/plugin/Layout/FlexPluginBase';

export default class Layout1_1_v2 extends FlexPluginBase {
  name = '上下布局';
  isBaseComponent = false;
  pluginIcon = 'layout-2row-plugin';
  description = '常见布局：上下布局（基于 CSS Flex 实现的布局容器）。';
  tags = ['常见布局'];
  order = 203;
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
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch'
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
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch'
        }
      }
    ],
    direction: 'column',
    justify: 'center',
    alignItems: 'stretch'
  };
}
