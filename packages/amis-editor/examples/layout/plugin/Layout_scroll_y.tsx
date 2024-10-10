import {FlexPluginBase} from '../../../src/plugin/Layout/FlexPluginBase';

export default class Layout_scroll_y extends FlexPluginBase {
  name = 'y轴滚动容器';
  isBaseComponent = false;
  pluginIcon = 'layout-3row-plugin';
  description = 'y轴滚动容器: 基于 CSS Flex 实现的布局容器。';
  order = 504;
  scaffold: any = {
    type: 'flex',
    className: 'p-1',
    items: [
      {
        type: 'container',
        size: 'xs',
        body: [],
        wrapperBody: false,
        style: {
          flex: '0 0 auto',
          flexBasis: '60px',
          display: 'block',
          minWidth: 'auto',
          minHeight: 'auto'
        }
      },
      {
        type: 'container',
        size: 'xs',
        body: [],
        wrapperBody: false,
        style: {
          flex: '0 0 auto',
          flexBasis: '60px',
          display: 'block',
          position: 'static',
          minWidth: 'auto',
          minHeight: 'auto'
        }
      },
      {
        type: 'container',
        size: 'xs',
        body: [],
        wrapperBody: false,
        style: {
          flex: '0 0 auto',
          flexBasis: '60px',
          display: 'block',
          position: 'static',
          minWidth: 'auto',
          minHeight: 'auto'
        }
      },
      {
        type: 'container',
        size: 'xs',
        body: [],
        wrapperBody: false,
        style: {
          flex: '0 0 auto',
          flexBasis: '60px',
          display: 'block',
          position: 'static',
          minWidth: 'auto',
          minHeight: 'auto'
        }
      },
      {
        type: 'container',
        size: 'xs',
        body: [],
        wrapperBody: false,
        style: {
          flex: '0 0 auto',
          flexBasis: '60px',
          display: 'block',
          position: 'static',
          minWidth: 'auto',
          minHeight: 'auto'
        }
      },
      {
        type: 'container',
        size: 'xs',
        body: [],
        wrapperBody: false,
        style: {
          flex: '0 0 auto',
          flexBasis: '60px',
          display: 'block',
          position: 'static',
          minWidth: 'auto',
          minHeight: 'auto'
        }
      }
    ],
    direction: 'column',
    justify: 'flex-start',
    alignItems: 'stretch',
    style: {
      position: 'static',
      minHeight: 'auto',
      maxWidth: 'auto',
      minWidth: 'auto',
      height: '200px',
      width: 'auto',
      overflowX: 'auto',
      overflowY: 'scroll',
      margin: '0'
    },
    isFixedHeight: true,
    isFixedWidth: false
  };
}
