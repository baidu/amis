import { BaseEventContext, BasePlugin, ContextMenuEventContext, ContextMenuItem, PluginEvent, RendererJSONSchemaResolveEventContext, VRendererConfig, ResizeMoveEventContext } from 'amis-editor-core';
import { EditorNodeType } from 'amis-editor-core';
import { Schema } from 'amis/lib/types';
export declare class HBoxPlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    disabledRendererPlugin: boolean;
    name: string;
    isBaseComponent: boolean;
    icon: string;
    description: string;
    docLink: string;
    tags: string[];
    scaffold: {
        type: string;
        gap: string;
        columns: {
            body: never[];
        }[];
    };
    previewSchema: {
        type: string;
        columns: {
            type: string;
            tpl: string;
            columnClassName: string;
        }[];
    };
    panelTitle: string;
    panelBodyCreator: (context: BaseEventContext) => any[];
    vRendererConfig: VRendererConfig;
    vWrapperResolve: (dom: HTMLElement) => HTMLElement;
    overrides: {
        renderColumn: (this: any, node: Schema, index: number) => any;
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
