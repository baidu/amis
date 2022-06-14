import { RendererAction, RendererEvent } from 'amis-editor-comp/dist/renderers/event-action';
import { BasePlugin, BaseEventContext } from 'amis-editor-core';
export declare class RangeControlPlugin extends BasePlugin {
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
    notRenderFormZone: boolean;
    events: RendererEvent[];
    actions: RendererAction[];
    panelTitle: string;
    panelJustify: boolean;
    panelBodyCreator: (context: BaseEventContext) => any;
}
