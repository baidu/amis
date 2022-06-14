import { BasePlugin, PluginEvent, RegionConfig, RendererJSONSchemaResolveEventContext } from 'amis-editor-core';
export declare class FlexPlugin extends BasePlugin {
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
        items: {
            type: string;
            body: string;
        }[];
    };
    previewSchema: {
        type: string;
        items: {
            type: string;
            body: string;
        }[];
    };
    panelTitle: string;
    panelBody: any[];
    regions: Array<RegionConfig>;
    afterResolveJsonSchema(event: PluginEvent<RendererJSONSchemaResolveEventContext>): void;
}
