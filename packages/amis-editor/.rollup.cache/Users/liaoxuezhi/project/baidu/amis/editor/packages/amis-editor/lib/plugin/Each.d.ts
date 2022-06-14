import { BaseEventContext, BasePlugin, BasicToolbarItem, ContextMenuEventContext, ContextMenuItem } from 'amis-editor-core';
export declare class EachPlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    name: string;
    isBaseComponent: boolean;
    description: string;
    tags: string[];
    icon: string;
    scaffold: {
        type: string;
        name: string;
        items: {
            type: string;
            tpl: string;
            inline: boolean;
        };
    };
    previewSchema: {
        value: string[];
        type: string;
        name: string;
        items: {
            type: string;
            tpl: string;
            inline: boolean;
        };
    };
    panelTitle: string;
    panelBodyCreator: (context: BaseEventContext) => any[];
    filterProps(props: any): any;
    buildEditorToolbar({ id, info }: BaseEventContext, toolbars: Array<BasicToolbarItem>): void;
    buildEditorContextMenu({ id, schema, region, info, selections }: ContextMenuEventContext, menus: Array<ContextMenuItem>): void;
    editDetail(id: string): void;
}
