import {registerEditorPlugin} from 'amis-editor-core';
import {FlexPluginBase} from './FlexPluginBase';

export default class Layout_fixed_bottom extends FlexPluginBase {
  name = '吸底容器';
  isBaseComponent = true;
  pluginIcon = 'flex-container-plugin';
  description = '常见布局：吸底容器（基于 CSS Flex 实现的布局容器）。';
  tags = ['常见布局'];
  order = 501;
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
    style: {
      position: 'fixed',
      inset: 'auto auto 0 0',
      zIndex: 2,
      width: '100%',
      overflowX: 'auto',
      margin: '0',
      overflowY: 'auto',
      height: 'auto'
    },
    isFixedWidth: true,
    direction: 'row',
    justify: 'center',
    alignItems: 'stretch',
    isFixedHeight: false,
    originPosition: 'right-bottom'
  };
}

registerEditorPlugin(Layout_fixed_bottom);