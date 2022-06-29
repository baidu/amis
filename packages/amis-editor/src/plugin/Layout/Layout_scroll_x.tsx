import {registerEditorPlugin} from 'amis-editor-core';
import {FlexPluginBase} from './FlexPluginBase';

export class Layout_scroll_x extends FlexPluginBase {
  name = 'x轴滚动容器';
  isBaseComponent = false;
  pluginIcon = 'layout-3cols-plugin';
  description = '常见布局：x轴滚动容器（基于 CSS Flex 实现的布局容器）。';
  tags = ['常见布局'];
  order = 505;
  scaffold: any = {
    type: 'flex',
    items: [
      {
        type: 'wrapper',
        body: [
          {
            type: 'tpl',
            tpl: 'x轴滚动容器：第一列',
            inline: false
          }
        ],
        style: {
          flex: '0 0 auto',
          flexBasis: '200px',
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
            tpl: '第二列',
            inline: false
          }
        ],
        style: {
          flex: '0 0 auto',
          flexBasis: '200px',
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
            tpl: '第三列',
            inline: false
          }
        ],
        style: {
          flex: '0 0 auto',
          backgroundColor: 'rgba(74, 144, 226, 1)',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          position: 'static',
          minWidth: 'auto',
          minHeight: 'auto',
          flexBasis: '200px'
        }
      },
      {
        type: 'wrapper',
        body: [
          {
            type: 'tpl',
            tpl: '第四列',
            inline: false
          }
        ],
        style: {
          flex: '0 0 auto',
          flexBasis: '200px',
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
            tpl: '第五列',
            inline: false
          }
        ],
        style: {
          flex: '0 0 auto',
          flexBasis: '200px',
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
            tpl: '第六列',
            inline: false
          }
        ],
        style: {
          flex: '0 0 auto',
          flexBasis: '200px',
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
            tpl: '第七列',
            inline: false
          }
        ],
        style: {
          flex: '0 0 auto',
          flexBasis: '200px',
          backgroundColor: 'rgba(228, 114, 221, 1)',
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
    direction: 'row',
    justify: 'flex-start',
    alignItems: 'stretch',
    style: {
      position: 'static',
      minHeight: 'auto',
      maxWidth: '1080px',
      minWidth: 'auto',
      height: '200px',
      overflowX: 'scroll',
      overflowY: 'scroll',
      margin: '0 auto'
    },
    isFixedHeight: true,
    isFixedWidth: false
  };
  previewSchema = {
    ...this.scaffold,
    style: {
      position: 'static'
    }
  };
}

registerEditorPlugin(Layout_scroll_x);
