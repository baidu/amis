/**
 * @file Flex 常见布局 1:2:3
 */
import {registerEditorPlugin} from 'amis-editor-core';
import {FlexPluginBase} from './FlexPluginBase';

export class Layout1_2_3 extends FlexPluginBase {
  name = '1:2:3 三栏';
  isBaseComponent = false;
  pluginIcon = 'layout-3cols-plugin';
  description = '常见布局：1:2:3 三栏布局（基于 CSS Flex 实现的布局容器）。';
  tags = ['常见布局'];
  order = 301;
  scaffold: any = {
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
          backgroundColor: 'rgba(181, 242, 167, 1)'
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
          flexGrow: 2,
          display: 'block',
          backgroundColor: 'rgba(245, 166, 35, 0.48)'
        }
      },
      {
        type: 'wrapper',
        body: [
          {
            type: 'tpl',
            tpl: '第三列',
            inline: false
          }
        ],
        style: {
          flex: '1 1 auto',
          display: 'block',
          flexBasis: 'auto',
          flexGrow: 3,
          backgroundColor: 'rgba(242, 54, 54, 0.51)'
        }
      }
    ]
  };
  previewSchema = {
    ...this.scaffold
  };
}

registerEditorPlugin(Layout1_2_3);
