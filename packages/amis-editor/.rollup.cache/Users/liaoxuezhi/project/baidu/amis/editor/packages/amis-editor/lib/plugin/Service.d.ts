import { BaseEventContext, BasePlugin, RegionConfig } from 'amis-editor-core';
import type { RendererAction, RendererEvent } from 'amis-editor-comp/dist/renderers/event-action';
export declare class ServicePlugin extends BasePlugin {
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
        body: {
            type: string;
            tpl: string;
            inline: boolean;
        }[];
    };
    previewSchema: {
        type: string;
        tpl: string;
    };
    regions: Array<RegionConfig>;
    events: RendererEvent[];
    actions: RendererAction[];
    panelTitle: string;
    panelBodyCreator: (context: BaseEventContext) => any;
}
