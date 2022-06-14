import { BasePlugin, BaseEventContext, BasicToolbarItem, ContextMenuItem, ContextMenuEventContext, BasicPanelItem, BuildPanelEventContext, PluginEvent, InsertEventContext } from 'amis-editor-core';
/**
 * 用来给当前选中的元素添加一些基本的工具栏按钮。
 */
export declare class BasicToolbarPlugin extends BasePlugin {
    order: number;
    buildEditorToolbar({ id, schema }: BaseEventContext, toolbars: Array<BasicToolbarItem>): void;
    buildEditorContextMenu({ id, schema, region, selections }: ContextMenuEventContext, menus: Array<ContextMenuItem>): void;
    buildEditorPanel(context: BuildPanelEventContext, panels: Array<BasicPanelItem>): void;
    afterInsert(event: PluginEvent<InsertEventContext>): void;
}
