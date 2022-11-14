import {registerEditorPlugin} from 'amis-editor-core';
import {FlexPluginBase} from './FlexPluginBase';

export default class Layout_scroll_y extends FlexPluginBase {
  name = 'y轴滚动容器';
  isBaseComponent = true;
  pluginIcon = 'layout-3row-plugin';
  description = '常见布局：y轴滚动容器（基于 CSS Flex 实现的布局容器）。';
  tags = ['常见布局'];
  order = 504;
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
          flexBasis: '60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          minWidth: 'auto',
          minHeight: 'auto'
        }
      },
      {
        type: 'wrapper',
        size: 'xs',
        body: [],
        style: {
          flex: '0 0 auto',
          flexBasis: '60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          position: 'static',
          minWidth: 'auto',
          minHeight: 'auto'
        }
      },
      {
        type: 'wrapper',
        size: 'xs',
        body: [],
        style: {
          flex: '0 0 auto',
          flexBasis: '60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          position: 'static',
          minWidth: 'auto',
          minHeight: 'auto'
        }
      },
      {
        type: 'wrapper',
        size: 'xs',
        body: [],
        style: {
          flex: '0 0 auto',
          flexBasis: '60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          position: 'static',
          minWidth: 'auto',
          minHeight: 'auto'
        }
      },
      {
        type: 'wrapper',
        size: 'xs',
        body: [],
        style: {
          flex: '0 0 auto',
          flexBasis: '60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          position: 'static',
          minWidth: 'auto',
          minHeight: 'auto'
        }
      },
      {
        type: 'wrapper',
        size: 'xs',
        body: [],
        style: {
          flex: '0 0 auto',
          flexBasis: '60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
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

registerEditorPlugin(Layout_scroll_y);