import {registerEditorPlugin} from 'amis-editor-core';
import {FlexPluginBase} from './FlexPluginBase';

export default class Layout1_2_v4 extends FlexPluginBase {
  name = '经典布局';
  isBaseComponent = true;
  pluginIcon = 'layout-3-1-plugin';
  description = '常见布局：经典布局（基于 CSS Flex 实现的布局容器）。';
  tags = ['常见布局'];
  order = 307;
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
          display: 'block'
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
              flex: '0 0 auto',
              flexBasis: '250px',
              display: 'block'
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
              position: 'static',
              overflowX: 'auto',
              overflowY: 'auto',
              margin: '0',
              flex: '1 1 auto',
              flexGrow: 1,
              flexBasis: 'auto'
            },
            alignItems: 'stretch',
            direction: 'column',
            justify: 'center',
            isFixedHeight: false,
            isFixedWidth: false
          }
        ],
        style: {
          flex: '1 1 auto',
          overflowX: 'auto',
          margin: '0',
          maxWidth: 'auto',
          overflowY: 'auto',
          position: 'static',
          minWidth: 'auto',
          width: 'auto',
          maxHeight: 'auto',
          minHeight: '300px'
        },
        direction: 'row',
        justify: 'flex-start',
        alignItems: 'stretch',
        isFixedHeight: false,
        isFixedWidth: false
      }
    ],
    direction: 'column',
    justify: 'center',
    alignItems: 'stretch'
  };
}

registerEditorPlugin(Layout1_2_v4);
