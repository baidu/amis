import { BasePlugin, BasicPanelItem, BuildPanelEventContext } from 'amis-editor-core';
/**
 * 添加源码编辑功能
 */
export declare class AvailableRenderersPlugin extends BasePlugin {
    order: number;
    buildEditorPanel(context: BuildPanelEventContext, panels: Array<BasicPanelItem>): void;
}
