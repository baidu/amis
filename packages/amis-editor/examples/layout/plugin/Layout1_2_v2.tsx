import {FlexPluginBase} from '../../../src/plugin/Layout/FlexPluginBase';

export default class Layout1_2_v2 extends FlexPluginBase {
  name = '一拖二';
  isBaseComponent = false;
  pluginIcon = 'layout-1with2-plugin';
  description = '常见布局：一拖二布局（基于 CSS Flex 实现的布局容器）。';
  tags = ['常见布局'];
  order = 303;
  scaffold: any = {
    type: 'flex',
    className: 'p-1',
    items: [
      {
        type: 'wrapper',
        size: 'xs',
        body: [],
        style: {
          flex: '0 0 auto',
          flexBasis: '100px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch'
        }
      },
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
          flex: '1 1 auto',
          padding: 0
        },
        alignItems: 'stretch'
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
