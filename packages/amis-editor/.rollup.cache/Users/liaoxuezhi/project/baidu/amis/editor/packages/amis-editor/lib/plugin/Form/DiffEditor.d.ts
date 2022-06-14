import { BasePlugin } from 'amis-editor-core';
import type { BaseEventContext } from 'amis-editor-core';
import { RendererEvent, RendererAction } from 'amis-editor-comp/dist/renderers/event-action';
export declare class DiffEditorControlPlugin extends BasePlugin {
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
    };
    previewSchema: any;
    events: RendererEvent[];
    actions: RendererAction[];
    notRenderFormZone: boolean;
    panelTitle: string;
    panelJustify: boolean;
    panelBodyCreator: (context: BaseEventContext) => any;
}
