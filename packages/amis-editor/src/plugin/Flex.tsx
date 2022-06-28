/**
 * @file Flex 布局
 */
import {registerEditorPlugin} from 'amis-editor-core';
import {
  BasePlugin,
  PluginEvent
} from 'amis-editor-core';
import {getSchemaTpl} from 'amis-editor-core';
import type {
  BaseEventContext,
  EditorNodeType,
  RegionConfig,
  RendererJSONSchemaResolveEventContext
} from 'amis-editor-core';
import {tipedLabel} from '../component/BaseControl';
import {FlexPluginBase} from './Layout/FlexPluginBase';

export class FlexPlugin extends FlexPluginBase {
  name = '布局容器';
  pluginIcon = 'flex-container-plugin';
  description = '布局容器 是基于 CSS Flex 实现的布局效果，它比 Grid 和 HBox 对子节点位置的可控性更强，比用 CSS 类的方式更易用';
}

registerEditorPlugin(FlexPlugin);
