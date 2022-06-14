import { BaseEventContext, BasePlugin, BasicPanelItem, BasicToolbarItem, BuildPanelEventContext } from 'amis-editor-core';
export declare class ActionPlugin extends BasePlugin {
    panelTitle: string;
    panelBodyCreator: (context: BaseEventContext) => {
        type: string;
        className: string;
        body: any[];
    }[];
    buildEditorPanel(context: BuildPanelEventContext, panels: Array<BasicPanelItem>): void;
    buildEditorToolbar({ id, schema, info }: BaseEventContext, toolbars: Array<BasicToolbarItem>): void;
    editDetail(id: string): void;
}
