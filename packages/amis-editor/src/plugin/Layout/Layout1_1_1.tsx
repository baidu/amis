/**
 * @file Flex 常见布局 1:1:1
 */
import {registerEditorPlugin} from 'amis-editor-core';
import {FlexPluginBase} from './FlexPluginBase';

export class Layout1_1_1 extends FlexPluginBase {
  name = '三栏均分';
  isBaseComponent = false; // 在自定义组件面板中展示
  pluginIcon = 'flex-container-plugin';
  description = '常见布局：三栏均分布局（布局容器 是基于 CSS Flex 实现的布局容器）。';
  tags = ['常见布局'];
  order = 300;
  scaffold:any = {
    type: "flex",
    items: [
      {
        type: "wrapper",
        body: [
          {
            type: "tpl",
            tpl: "第一列",
            inline: false,
          }
        ],
        style: {
          flex: "1 1 auto",
          flexBasis: "auto",
          flexGrow: 1,
          display: "block",
          backgroundColor: "rgba(181, 242, 167, 1)"
        }
      },
      {
        type: "wrapper",
        body: [
          {
            type: "tpl",
            tpl: "第二列",
            inline: false,
          }
        ],
        style: {
          flex: "1 1 auto",
          flexBasis: "auto",
          flexGrow: 1,
          display: "block",
          backgroundColor: "rgba(245, 166, 35, 0.48)"
        }
      },
      {
        type: "wrapper",
        body: [
          {
            type: "tpl",
            tpl: "第三列",
            inline: false,
          }
        ],
        style: {
          flex: "1 1 auto",
          display: "block",
          flexBasis: "auto",
          flexGrow: 1,
          backgroundColor: "rgba(242, 54, 54, 0.51)"
        }
      }
    ],
  };
  previewSchema = {
    ...this.scaffold
  };
}

registerEditorPlugin(Layout1_1_1);
