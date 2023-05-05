import {FlexPluginBase} from '../../../src/plugin/Layout/FlexPluginBase';

export default class Layout1_2_v3 extends FlexPluginBase {
  name = '左一右二';
  isBaseComponent = false;
  pluginIcon = 'layout-1-2-plugin';
  description = '常见布局：左一右二布局（基于 CSS Flex 实现的布局容器）。';
  tags = ['常见布局'];
  order = 304;
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
          flexBasis: '250px',
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
          margin: '0'
        },
        alignItems: 'stretch',
        direction: 'column',
        justify: 'center'
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
