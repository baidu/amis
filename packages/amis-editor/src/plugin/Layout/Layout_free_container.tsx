import type {BaseEventContext} from 'amis-editor-core';
import {registerEditorPlugin, getSchemaTpl} from 'amis-editor-core';
import {ContainerPlugin} from '../Container';

export default class Layout_free_container extends ContainerPlugin {
  name = '自由容器';
  isBaseComponent = true;
  pluginIcon = 'layout-fixed-plugin';
  description = '自由容器: 其直接子元素支持拖拽调整位置。';
  order = -1;
  tags = ['布局'];
  scaffold: any = {
    type: 'container',
    isFreeContainer: true,
    size: 'xs',
    body: [],
    wrapperBody: false,
    style: {
      position: 'relative',
      minHeight: '200px'
    },
  };

  panelTitle = '自由容器';
}

registerEditorPlugin(Layout_free_container);