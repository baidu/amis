import { BasePlugin, BaseEventContext } from 'amis-editor-core';
import { RendererAction, RendererEvent } from 'amis-editor-comp/dist/renderers/event-action';
export declare class ImageControlPlugin extends BasePlugin {
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
        label: string;
        name: string;
        imageClassName: string;
    };
    previewSchema: any;
    notRenderFormZone: boolean;
    events: RendererEvent[];
    actions: RendererAction[];
    panelTitle: string;
    panelBodyCreator: (context: BaseEventContext) => any[];
}
