import { BasePlugin, BasicPanelItem, BuildPanelEventContext } from 'amis-editor-core';
/**
 * 大纲面板
 */
export declare class OutlinePlugin extends BasePlugin {
    order: number;
    buildEditorPanel(context: BuildPanelEventContext, panels: Array<BasicPanelItem>): void;
}
