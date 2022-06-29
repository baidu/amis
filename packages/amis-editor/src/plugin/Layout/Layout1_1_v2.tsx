/**
 * @file Flex 常见布局 上下布局
 */
import {registerEditorPlugin} from 'amis-editor-core';
import {FlexPluginBase} from './FlexPluginBase';

export class Layout1_1_v2 extends FlexPluginBase {
  name = '上下布局';
  isBaseComponent = false;
  pluginIcon = 'layout-2row-plugin';
  description = '常见布局：上下布局（基于 CSS Flex 实现的布局容器）。';
  tags = ['常见布局'];
  order = 203;
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
          flex: '1 1 auto',
          flexBasis: 'auto',
          flexGrow: 1,
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
            type: 'tpl',
            tpl: '第二行',
            inline: false
          }
        ],
        style: {
          flex: '1 1 auto',
          flexBasis: 'auto',
          flexGrow: 1,
          backgroundColor: 'rgba(245, 166, 35, 0.48)',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'stretch'
        }
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

registerEditorPlugin(Layout1_1_v2);
