import React from 'react';
import {Icon} from 'amis';
import {AvailableRenderersPanel} from '../../component/Panel/AvailableRenderersPanel';
import {registerEditorPlugin} from '../../manager';
import {BasePlugin, BasicPanelItem, BuildPanelEventContext} from '../../plugin';

/**
 * 添加源码编辑功能
 */
export class AvailableRenderersPlugin extends BasePlugin {
  order = -9999;

  buildEditorPanel(
    context: BuildPanelEventContext,
    panels: Array<BasicPanelItem>
  ) {
    const store = this.manager.store;

    // 多选时不显示
    if (context.selections.length) {
      return;
    }

    if (store.subRenderers.length) {
      panels.push({
        key: 'renderers',
        icon: 'png-icon renderers-png', // 'fa fa-cube',
        title: (
          <span className="editor-tab-icon" editor-tooltip="组件">
            <Icon icon="editor-renderer" />
          </span>
        ),
        component: AvailableRenderersPanel,
        position: 'left',
        order: -9999
      });
    }
  }
}

registerEditorPlugin(AvailableRenderersPlugin);
