import { BasePlugin, BasicPanelItem, BuildPanelEventContext } from 'amis-editor-core';
/**
 * 添加名字面板，方便根据组件名字定位节点
 */
export declare class NamePlugin extends BasePlugin {
    order: number;
    buildEditorPanel({ info, selections }: BuildPanelEventContext, panels: Array<BasicPanelItem>): void;
}
