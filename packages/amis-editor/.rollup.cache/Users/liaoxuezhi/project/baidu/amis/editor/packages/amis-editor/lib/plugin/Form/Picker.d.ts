import { BaseEventContext, BasePlugin, BasicToolbarItem, ContextMenuEventContext, ContextMenuItem } from 'amis-editor-core';
export declare class PickerControlPlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    name: string;
    isBaseComponent: boolean;
    icon: string;
    description: string;
    docLink: string;
    tags: string[];
    scaffold: {
        type: string;
        label: string;
        name: string;
        options: {
            label: string;
            value: string;
        }[];
    };
    previewSchema: any;
    panelTitle: string;
    panelBodyCreator: (context: BaseEventContext) => any[];
    buildEditorToolbar({ id, info }: BaseEventContext, toolbars: Array<BasicToolbarItem>): void;
    buildEditorContextMenu({ id, schema, region, info }: ContextMenuEventContext, menus: Array<ContextMenuItem>): void;
    editDetail(id: string): void;
}
