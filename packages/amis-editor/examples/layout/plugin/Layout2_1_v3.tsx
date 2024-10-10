import {FlexPluginBase} from '../../../src/plugin/Layout/FlexPluginBase';

export default class Layout2_1_v3 extends FlexPluginBase {
  name = '左二右一';
  isBaseComponent = false; // 在自定义组件面板中展示
  pluginIcon = 'layout-2-1-plugin';
  description = '常见布局：左二右一布局（基于 CSS Flex 实现的布局容器）。';
  tags = ['常见布局'];
  order = 306;
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
          flex: '1 1 auto'
        },
        alignItems: 'stretch',
        direction: 'column',
        justify: 'center'
      },
      {
        type: 'wrapper',
        size: 'xs',
        body: [],
        style: {
          flex: '0 0 auto',
          flexBasis: '250px',
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
    direction: 'row',
    justify: 'center',
    alignItems: 'stretch',
    isFixedHeight: true
  };
}
