import {registerEditorPlugin} from 'amis-editor-core';
import {FlexPluginBase} from './FlexPluginBase';

export class Layout2_1_v3 extends FlexPluginBase {
  name = '左二右一';
  isBaseComponent = false; // 在自定义组件面板中展示
  pluginIcon = 'layout-2-1-plugin';
  description = '常见布局：左二右一布局（基于 CSS Flex 实现的布局容器）。';
  tags = ['常见布局'];
  order = 306;
  scaffold: any = {
    type: 'flex',
    items: [
      {
        type: 'flex',
        items: [
          {
            type: 'wrapper',
            body: [
              {
                type: 'tpl',
                tpl: '左二右一布局：第一行',
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
          flex: '1 1 auto'
        },
        alignItems: 'stretch',
        direction: 'column',
        justify: 'center'
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
          flex: '0 0 auto',
          flexBasis: '250px',
          backgroundColor: 'rgba(181, 242, 167, 1)',
          display: 'flex',
          flexDirection: 'row',
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
  previewSchema = {
    ...this.scaffold
  };
}

registerEditorPlugin(Layout2_1_v3);
