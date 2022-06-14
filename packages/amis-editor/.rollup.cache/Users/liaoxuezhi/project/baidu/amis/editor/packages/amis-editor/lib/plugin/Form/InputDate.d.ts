import { BasePlugin, BaseEventContext } from 'amis-editor-core';
import { RendererAction, RendererEvent } from 'amis-editor-comp/dist/renderers/event-action';
export declare class DateControlPlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    order: number;
    icon: string;
    name: string;
    isBaseComponent: boolean;
    searchKeywords: string;
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
    events: RendererEvent[];
    actions: RendererAction[];
    panelJustify: boolean;
    panelBodyCreator: (context: BaseEventContext) => any;
}
