import React from 'react';
import {Icon} from 'amis';
import {
  BuildPanelEventContext,
  BasePlugin,
  BasicPanelItem,
  registerEditorPlugin
} from 'amis-editor-core';
import {GlobalVarManagerPanel} from '../renderer/global-var-control/GlobalVarManagerPanel';

/**
 * 添加源码编辑功能
 */
export class GlobalVarPlugin extends BasePlugin {
  onInit() {
    this.manager.initGlobalVariables();
  }

  buildEditorPanel(
    context: BuildPanelEventContext,
    panels: Array<BasicPanelItem>
  ) {
    // 如果没有配置全局变量初始化函数，则不显示全局变量管理面板
    if (!this.manager.config.onGlobalVariableInit) {
      return;
    }

    panels.push({
      key: 'global-var',
      icon: '', // 'fa fa-code',
      title: (
        <span
          className="editor-tab-icon editor-tab-s-icon"
          editor-tooltip="全局变量"
        >
          <Icon icon="global-var" />
        </span>
      ),
      position: 'left',
      component: GlobalVarManagerPanel
    });
  }
}

registerEditorPlugin(GlobalVarPlugin);
