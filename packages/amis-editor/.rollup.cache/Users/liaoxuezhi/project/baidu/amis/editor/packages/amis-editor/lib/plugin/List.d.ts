import { BaseEventContext, BasePlugin, BasicRendererInfo, BasicToolbarItem, ContextMenuEventContext, ContextMenuItem, RendererInfoResolveEventContext } from 'amis-editor-core';
export declare class ListPlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    name: string;
    isBaseComponent: boolean;
    description: string;
    docLink: string;
    tags: string[];
    icon: string;
    scaffold: {
        type: string;
        listItem: {
            body: {
                type: string;
                tpl: string;
            }[];
            actions: {
                icon: string;
                type: string;
            }[];
        };
    };
    previewSchema: {
        items: {
            a: number;
            b: number;
        }[];
        type: string;
        listItem: {
            body: {
                type: string;
                tpl: string;
            }[];
            actions: {
                icon: string;
                type: string;
            }[];
        };
    };
    panelTitle: string;
    panelBodyCreator: (context: BaseEventContext) => any;
    filterProps(props: any): any;
    buildMockData(): {
        id: number;
        title: string;
        description: string;
        a: string;
        b: string;
    };
    editDetail(id: string): void;
    buildEditorToolbar({ id, info, schema }: BaseEventContext, toolbars: Array<BasicToolbarItem>): void;
    buildEditorContextMenu({ id, schema, region, info, selections }: ContextMenuEventContext, menus: Array<ContextMenuItem>): void;
    getRendererInfo(context: RendererInfoResolveEventContext): BasicRendererInfo | void;
}
