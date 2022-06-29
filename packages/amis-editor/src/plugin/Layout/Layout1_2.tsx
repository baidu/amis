/**
 * @file Flex 常见布局 1:2
 */
import {registerEditorPlugin} from 'amis-editor-core';
import {FlexPluginBase} from './FlexPluginBase';

export class Layout1_2 extends FlexPluginBase {
  name = '1:2 布局';
  isBaseComponent = false; // 在自定义组件面板中展示
  pluginIcon = 'flex-container-plugin';
  description = '常见布局：1:2 布局（基于 CSS Flex 实现的布局容器）。';
  tags = ['常见布局'];
  order = 201;
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
      }
    ]
  };
  previewSchema = {
    ...this.scaffold
  };
}

registerEditorPlugin(Layout1_2);
