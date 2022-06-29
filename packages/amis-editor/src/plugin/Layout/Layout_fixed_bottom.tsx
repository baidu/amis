import {registerEditorPlugin} from 'amis-editor-core';
import {FlexPluginBase} from './FlexPluginBase';

export class Layout_fixed_bottom extends FlexPluginBase {
  name = '吸底容器';
  isBaseComponent = false;
  pluginIcon = 'flex-container-plugin';
  description = '常见布局：吸底容器（基于 CSS Flex 实现的布局容器）。';
  tags = ['常见布局'];
  order = 501;
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
          flexGrow: 1,
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
          flexGrow: 1,
          backgroundColor: 'rgba(242, 54, 54, 0.51)'
        }
      }
    ],
    style: {
      position: 'fixed',
      inset: 'auto auto 0 0',
      zIndex: 2,
      width: '100%',
      overflowX: 'auto',
      margin: '0',
      overflowY: 'auto',
      height: 'auto'
    },
    isFixedWidth: true,
    direction: 'row',
    justify: 'center',
    alignItems: 'stretch',
    isFixedHeight: 'false'
  };
  previewSchema = {
    ...this.scaffold,
    style: {
      position: 'static'
    }
  };
}

registerEditorPlugin(Layout_fixed_bottom);
