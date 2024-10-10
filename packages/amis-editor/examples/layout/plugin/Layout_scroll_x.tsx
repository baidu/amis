import {FlexPluginBase} from '../../../src/plugin/Layout/FlexPluginBase';

export default class Layout_scroll_x extends FlexPluginBase {
  name = 'x轴滚动容器';
  isBaseComponent = false;
  pluginIcon = 'layout-3cols-plugin';
  description = 'x轴滚动容器: 基于 CSS Flex 实现的布局容器。';
  order = 505;
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
          flexBasis: '200px',
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
          flexBasis: '200px',
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
          display: 'block',
          position: 'static',
          minWidth: 'auto',
          minHeight: 'auto',
          flexBasis: '200px'
        }
      },
      {
        type: 'container',
        wrapperBody: false,
        size: 'xs',
        body: [],
        style: {
          flex: '0 0 auto',
          flexBasis: '200px',
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
          flexBasis: '200px',
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
          flexBasis: '200px',
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
          flexBasis: '200px',
          display: 'block',
          position: 'static',
          minWidth: 'auto',
          minHeight: 'auto'
        }
      }
    ],
    direction: 'row',
    justify: 'flex-start',
    alignItems: 'stretch',
    style: {
      position: 'static',
      minHeight: 'auto',
      maxWidth: '1080px',
      minWidth: 'auto',
      height: '200px',
      overflowX: 'scroll',
      overflowY: 'scroll',
      margin: '0 auto'
    },
    isFixedHeight: true,
    isFixedWidth: false
  };

  onPreview2editor(event: any) {
    console.log('onPreview2editor-event:', event);
  }
}
