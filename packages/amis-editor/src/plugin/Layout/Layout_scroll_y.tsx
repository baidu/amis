import {registerEditorPlugin} from 'amis-editor-core';
import {FlexPluginBase} from './FlexPluginBase';

export class Layout_scroll_y extends FlexPluginBase {
  name = 'y轴滚动容器';
  isBaseComponent = false;
  pluginIcon = 'layout-3row-plugin';
  description = '常见布局：y轴滚动容器（基于 CSS Flex 实现的布局容器）。';
  tags = ['常见布局'];
  order = 504;
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
          flexBasis: '60px',
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
          flex: '0 0 auto',
          flexBasis: '60px',
          backgroundColor: 'rgba(245, 166, 35, 0.48)',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          position: 'static',
          minWidth: 'auto',
          minHeight: 'auto'
        }
      },
      {
        type: 'wrapper',
        body: [
          {
            type: 'tpl',
            tpl: '第三行',
            inline: false
          }
        ],
        style: {
          flex: '0 0 auto',
          flexBasis: '60px',
          backgroundColor: 'rgba(74, 144, 226, 1)',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          position: 'static',
          minWidth: 'auto',
          minHeight: 'auto'
        }
      },
      {
        type: 'wrapper',
        body: [
          {
            type: 'tpl',
            tpl: '第四行',
            inline: false
          }
        ],
        style: {
          flex: '0 0 auto',
          flexBasis: '60px',
          backgroundColor: 'rgba(181, 242, 167, 1)',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          position: 'static',
          minWidth: 'auto',
          minHeight: 'auto'
        }
      },
      {
        type: 'wrapper',
        body: [
          {
            type: 'tpl',
            tpl: '第五行',
            inline: false
          }
        ],
        style: {
          flex: '0 0 auto',
          flexBasis: '60px',
          backgroundColor: 'rgba(245, 166, 35, 0.48)',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          position: 'static',
          minWidth: 'auto',
          minHeight: 'auto'
        }
      },
      {
        type: 'wrapper',
        body: [
          {
            type: 'tpl',
            tpl: '第六行',
            inline: false
          }
        ],
        style: {
          flex: '0 0 auto',
          flexBasis: '60px',
          backgroundColor: 'rgba(74, 144, 226, 1)',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          position: 'static',
          minWidth: 'auto',
          minHeight: 'auto'
        }
      }
    ],
    direction: 'column',
    justify: 'flex-start',
    alignItems: 'stretch',
    style: {
      position: 'static',
      minHeight: 'auto',
      maxWidth: 'auto',
      minWidth: 'auto',
      height: '200px',
      width: 'auto',
      overflowX: 'auto',
      overflowY: 'scroll',
      margin: '0'
    },
    isFixedHeight: true,
    isFixedWidth: 'false'
  };
  previewSchema = {
    ...this.scaffold,
    style: {
      position: 'static'
    }
  };
}

registerEditorPlugin(Layout_scroll_y);
