import { BasePlugin, RegionConfig } from 'amis-editor-core';
export declare class WrapperPlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    disabledRendererPlugin: boolean;
    name: string;
    isBaseComponent: boolean;
    description: string;
    docLink: string;
    tags: string[];
    icon: string;
    scaffold: {
        type: string;
        body: string;
    };
    previewSchema: {
        type: string;
        body: string;
    };
    regions: Array<RegionConfig>;
    panelTitle: string;
    panelBody: any[];
}
