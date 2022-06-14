import { BaseEventContext, BasePlugin, BasicRendererInfo, BasicToolbarItem, ContextMenuEventContext, ContextMenuItem, RendererInfoResolveEventContext } from 'amis-editor-core';
export declare class CardsPlugin extends BasePlugin {
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
        data: {
            items: {
                a: number;
                b: number;
            }[];
        };
        columnsCount: number;
        card: {
            type: string;
            className: string;
            header: {
                title: string;
                subTitle: string;
            };
            body: {
                name: string;
                label: string;
            }[];
            actions: {
                label: string;
                type: string;
            }[];
        };
    };
    previewSchema: {
        className: string;
        type: string;
        data: {
            items: {
                a: number;
                b: number;
            }[];
        };
        columnsCount: number;
        card: {
            type: string;
            className: string;
            header: {
                title: string;
                subTitle: string;
            };
            body: {
                name: string;
                label: string;
            }[];
            actions: {
                label: string;
                type: string;
            }[];
        };
    };
    panelTitle: string;
    panelBodyCreator: (context: BaseEventContext) => any[];
    editDetail(id: string): void;
    buildEditorToolbar({ id, info, schema }: BaseEventContext, toolbars: Array<BasicToolbarItem>): void;
    buildEditorContextMenu({ id, schema, region, info, selections }: ContextMenuEventContext, menus: Array<ContextMenuItem>): void;
    filterProps(props: any): any;
    getRendererInfo(context: RendererInfoResolveEventContext): BasicRendererInfo | void;
}
