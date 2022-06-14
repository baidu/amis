import { BaseEventContext, BasePlugin, RegionConfig } from 'amis-editor-core';
export declare class ContainerPlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    name: string;
    isBaseComponent: boolean;
    description: string;
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
    panelJustify: boolean;
    panelBodyCreator: (context: BaseEventContext) => any;
}
