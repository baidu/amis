/**
 * @file Flex 布局
 */
import {registerEditorPlugin} from 'amis-editor-core';
import {FlexPluginBase} from './Layout/FlexPluginBase';

export class FlexPlugin extends FlexPluginBase {
  name = '布局容器';
  pluginIcon = 'flex-container-plugin';
  description =
    '布局容器主要用于设计复杂布局的容器组件，基于 CSS Flex 实现的布局效果，比 Grid 和 HBox 对子节点位置的可控性更强，比用 CSS 类的方式更简单易用';
}

registerEditorPlugin(FlexPlugin);
