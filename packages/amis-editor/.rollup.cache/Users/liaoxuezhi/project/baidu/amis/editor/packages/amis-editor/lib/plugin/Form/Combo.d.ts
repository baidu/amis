import { BaseEventContext, BasePlugin, BasicToolbarItem, ContextMenuEventContext, ContextMenuItem } from 'amis-editor-core';
import { RendererEvent, RendererAction } from 'amis-editor-comp/dist/renderers/event-action';
export declare class ComboControlPlugin extends BasePlugin {
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
        multiple: boolean;
        items: ({
            type: string;
            name: string;
            placeholder: string;
            options?: undefined;
        } | {
            type: string;
            name: string;
            placeholder: string;
            options: {
                label: string;
                value: string;
            }[];
        })[];
    };
    previewSchema: any;
    events: RendererEvent[];
    actions: RendererAction[];
    panelTitle: string;
    panelBodyCreator: (context: BaseEventContext) => any[];
    filterProps(props: any): any;
    buildEditorToolbar({ id, info, schema }: BaseEventContext, toolbars: Array<BasicToolbarItem>): void;
    buildEditorContextMenu({ id, schema, region, info }: ContextMenuEventContext, menus: Array<ContextMenuItem>): void;
    editDetail(id: string): void;
}
