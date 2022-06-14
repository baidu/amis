import { BasePlugin, BaseEventContext } from 'amis-editor-core';
import type { RendererAction, RendererEvent } from 'amis-editor-comp/dist/renderers/event-action';
export declare class SwitchControlPlugin extends BasePlugin {
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
        option: string;
        name: string;
        falseValue: boolean;
        trueValue: boolean;
    };
    previewSchema: any;
    notRenderFormZone: boolean;
    panelTitle: string;
    events: RendererEvent[];
    actions: RendererAction[];
    panelJustify: boolean;
    panelBodyCreator: (context: BaseEventContext) => any;
}
