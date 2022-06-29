/**
 * @file Flex 常见布局 二拖一布局
 */
import {registerEditorPlugin} from 'amis-editor-core';
import {FlexPluginBase} from './FlexPluginBase';

export class Layout2_1_v2 extends FlexPluginBase {
  name = '二拖一';
  isBaseComponent = false; // 在自定义组件面板中展示
  pluginIcon = 'flex-container-plugin';
  description = '常见布局：一拖二（布局容器 是基于 CSS Flex 实现的布局容器）。';
  tags = ['常见布局'];
  order = 305;
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
          flex: '0 0 auto',
          flexBasis: '100px',
        },
        alignItems: 'stretch'
      },
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
          flexBasis: '200px',
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
    direction: 'column',
    justify: 'center',
    alignItems: 'stretch',
    isFixedHeight: true
  };
  previewSchema = {
    ...this.scaffold
  };
}

registerEditorPlugin(Layout2_1_v2);
