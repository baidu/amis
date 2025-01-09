import React from 'react';
import {Icon} from 'amis';
import {registerEditorPlugin} from '../manager';
import {AvailableRenderersPanel} from '../component/Panel/AvailableRenderersPanel';
import {BuildPanelEventContext, BasePlugin, BasicPanelItem} from '../plugin';

/**
 * 添加源码编辑功能
 */
export class AvailableRenderersPlugin extends BasePlugin {
  static scene = ['layout'];
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
        icon: <Icon icon="editor-renderer" />,
        tooltip: '组件',
        component: AvailableRenderersPanel,
        position: 'left',
        order: -9999
      });
    }
  }
}

registerEditorPlugin(AvailableRenderersPlugin);
