import React from 'react';
import {Icon} from 'amis';
import {registerEditorPlugin} from '../manager';
import {
  BuildPanelEventContext,
  BasePlugin,
  BasicPanelItem,
  RendererJSONSchemaResolveEventContext
} from '../plugin';
import WidthDraggableContainer from '../component/base/WidthDraggableContainer';
import CodeEditorPanel from '../component/Panel/CodeEditorPanel';

/**
 * 添加源码编辑功能
 */
export class CodePlugin extends BasePlugin {
  order = -9999;

  buildJSONSchema({info}: RendererJSONSchemaResolveEventContext) {
    return info.$schema;
  }

  buildEditorPanel(
    {info, selections}: BuildPanelEventContext,
    panels: Array<BasicPanelItem>
  ) {
    if (this.manager.store.jsonSchemaUri && !selections.length) {
      panels.push({
        key: 'code',
        icon: 'png-icon code-png', // 'fa fa-code',
        title: (
          <span className="editor-tab-icon" editor-tooltip="代码">
            <Icon icon="editor-code" />
          </span>
        ),
        position: 'left',
        component: WidthDraggableContainer(CodeEditorPanel),
        order: 5000
      });
    }
  }
}

registerEditorPlugin(CodePlugin);
