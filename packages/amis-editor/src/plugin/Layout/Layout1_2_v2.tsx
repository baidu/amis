import {registerEditorPlugin} from 'amis-editor-core';
import {FlexPluginBase} from './FlexPluginBase';

export class Layout1_2_v2 extends FlexPluginBase {
  name = '一拖二';
  isBaseComponent = false;
  pluginIcon = 'layout-1with2-plugin';
  description = '常见布局：一拖二布局（基于 CSS Flex 实现的布局容器）。';
  tags = ['常见布局'];
  order = 303;
  scaffold: any = {
    type: 'flex',
    items: [
      {
        type: 'wrapper',
        body: [
          {
            type: 'tpl',
            tpl: '一拖二布局：第一行',
            inline: false
          }
        ],
        style: {
          flex: '0 0 auto',
          flexBasis: '100px',
          backgroundColor: 'rgba(181, 242, 167, 1)',
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
                tpl: '第二列',
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
  previewSchema = {
    ...this.scaffold
  };
}

registerEditorPlugin(Layout1_2_v2);
