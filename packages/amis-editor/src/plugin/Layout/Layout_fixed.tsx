import {registerEditorPlugin} from 'amis-editor-core';
import {FlexPluginBase} from './FlexPluginBase';

export class Layout_fixed extends FlexPluginBase {
  name = '悬浮容器';
  isBaseComponent = false;
  pluginIcon = 'layout-fixed-plugin';
  description = '常见布局：悬浮容器（基于 CSS Flex 实现的布局容器）。';
  tags = ['常见布局'];
  order = 503;
  scaffold: any = {
    type: 'wrapper',
    body: [
      {
        type: 'tpl',
        tpl: '悬浮容器',
        inline: false
      }
    ],
    style: {
      backgroundColor: 'rgba(71, 92, 233, 0.68)',
      position: 'fixed',
      inset: 'auto 50px 50px auto',
      zIndex: 10,
      display: 'flex',
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
      borderBottomLeftRadius: 50,
      borderBottomRightRadius: 50,
      minWidth: '80px',
      minHeight: '80px',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'stretch'
    }
  };
  previewSchema = {
    ...this.scaffold,
    style: {
      position: 'static'
    }
  };
}

registerEditorPlugin(Layout_fixed);
