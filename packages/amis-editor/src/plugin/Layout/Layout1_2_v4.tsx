import {registerEditorPlugin} from 'amis-editor-core';
import {FlexPluginBase} from './FlexPluginBase';

export class Layout1_2_v4 extends FlexPluginBase {
  name = '经典布局';
  isBaseComponent = false;
  pluginIcon = 'layout-3-1-plugin';
  description = '常见布局：经典布局（基于 CSS Flex 实现的布局容器）。';
  tags = ['常见布局'];
  order = 307;
  scaffold: any = {
    type: 'flex',
    items: [
      {
        type: 'wrapper',
        body: [
          {
            type: 'tpl',
            tpl: '第一行',
            inline: false
          }
        ],
        style: {
          flex: '0 0 auto',
          backgroundColor: 'rgba(74, 144, 226, 1)',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'stretch'
        }
      },
      {
        type: 'flex',
        items: [
          {
            type: 'wrapper',
            body: [
              {
                type: 'tpl',
                tpl: '第一列',
                inline: false
              }
            ],
            style: {
              flex: '0 0 auto',
              flexBasis: '250px',
              backgroundColor: 'rgba(181, 242, 167, 1)',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'stretch'
            }
          },
          {
            type: 'wrapper',
            body: [
              {
                type: 'flex',
                items: [
                  {
                    type: 'wrapper',
                    body: [
                      {
                        type: 'tpl',
                        tpl: '第一行',
                        inline: false
                      }
                    ],
                    style: {
                      flex: '1 1 auto',
                      flexBasis: 'auto',
                      flexGrow: 1,
                      display: 'block',
                      backgroundColor: 'rgba(71, 92, 233, 0.68)'
                    }
                  },
                  {
                    type: 'wrapper',
                    body: [
                      {
                        type: 'tpl',
                        tpl: '第二行',
                        inline: false
                      }
                    ],
                    style: {
                      flex: '1 1 auto',
                      flexBasis: 'auto',
                      flexGrow: 1,
                      display: 'block',
                      backgroundColor: 'rgba(245, 166, 35, 0.48)'
                    }
                  }
                ],
                style: {
                  height: '100%',
                  position: 'static',
                  maxHeight: 'auto',
                  maxWidth: 'auto',
                  width: 'auto',
                  overflowX: 'auto',
                  overflowY: 'auto',
                  margin: '0'
                },
                alignItems: 'stretch',
                direction: 'column',
                justify: 'center'
              }
            ],
            style: {
              flex: '1 1 auto',
              padding: 0
            }
          }
        ],
        style: {
          flex: '1 1 auto',
          flexBasis: 'auto',
          flexGrow: 1,
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
        justify: 'center',
        alignItems: 'stretch',
        isFixedHeight: false,
        isFixedWidth: 'false'
      }
    ],
    direction: 'column',
    justify: 'center',
    alignItems: 'stretch'
  };
  previewSchema = {
    ...this.scaffold
  };
}

registerEditorPlugin(Layout1_2_v4);
