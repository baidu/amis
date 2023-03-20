/**
 * @file Flex 常见布局 二拖一布局
 */
import {FlexPluginBase} from '../../../src/plugin/Layout/FlexPluginBase';

export default class Layout2_1_v2 extends FlexPluginBase {
  name = '二拖一';
  isBaseComponent = false; // 在自定义组件面板中展示
  pluginIcon = 'layout-2with1-plugin';
  description = '常见布局：二拖一布局（基于 CSS Flex 实现的布局容器）。';
  tags = ['常见布局'];
  order = 305;
  scaffold: any = {
    type: 'flex',
    className: 'p-1',
    items: [
      {
        type: 'flex',
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
        style: {
          flex: '0 0 auto',
          flexBasis: '100px'
        },
        alignItems: 'stretch'
      },
      {
        type: 'wrapper',
        size: 'xs',
        body: [],
        style: {
          flex: '1 1 auto',
          flexBasis: '200px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch'
        }
      }
    ],
    style: {
      overflowX: 'auto',
      margin: '0',
      maxWidth: 'auto',
      height: '350px',
      overflowY: 'auto'
    },
    direction: 'column',
    justify: 'center',
    alignItems: 'stretch',
    isFixedHeight: true
  };
}
