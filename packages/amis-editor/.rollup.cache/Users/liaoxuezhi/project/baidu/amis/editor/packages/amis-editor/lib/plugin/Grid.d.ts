import { BaseEventContext, BasePlugin, ContextMenuEventContext, ContextMenuItem, PluginEvent, ResizeMoveEventContext, RendererJSONSchemaResolveEventContext, VRendererConfig } from 'amis-editor-core';
import { EditorNodeType } from 'amis-editor-core';
import { Schema } from 'amis/lib/types';
export declare class GridPlugin extends BasePlugin {
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
        columns: {
            body: never[];
        }[];
    };
    previewSchema: {
        type: string;
        columns: {
            body: {
                type: string;
                tpl: string;
                inline: boolean;
                className: string;
            }[];
        }[];
    };
    panelTitle: string;
    panelWithOutOthers: boolean;
    panelBodyCreator(context: BaseEventContext): any[];
    vRendererConfig: VRendererConfig;
    vWrapperResolve: (dom: HTMLElement) => HTMLElement;
    overrides: {
        renderColumn: (this: any, node: Schema, index: number, length: number) => any;
    };
    afterResolveJsonSchema(event: PluginEvent<RendererJSONSchemaResolveEventContext>): void;
    buildEditorContextMenu(context: ContextMenuEventContext, menus: Array<ContextMenuItem>): void;
    onWidthChangeStart(event: PluginEvent<ResizeMoveEventContext, {
        onMove(e: MouseEvent): void;
        onEnd(e: MouseEvent): void;
    }>): void;
    insertRowAfter(node: EditorNodeType): void;
    insertRowBefore(node: EditorNodeType): void;
    insertColumnBefore(context: BaseEventContext): void;
    insertColumnAfter(context: BaseEventContext): void;
}
