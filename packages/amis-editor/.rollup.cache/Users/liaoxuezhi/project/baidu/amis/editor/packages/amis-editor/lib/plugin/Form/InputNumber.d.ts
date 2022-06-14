import { RendererAction, RendererEvent } from 'amis-editor-comp/dist/renderers/event-action';
import { BasePlugin, BaseEventContext } from 'amis-editor-core';
export declare class NumberControlPlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    order: number;
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
    notRenderFormZone: boolean;
    panelTitle: string;
    panelJustify: boolean;
    events: RendererEvent[];
    actions: RendererAction[];
    panelBodyCreator: (context: BaseEventContext) => any;
}
