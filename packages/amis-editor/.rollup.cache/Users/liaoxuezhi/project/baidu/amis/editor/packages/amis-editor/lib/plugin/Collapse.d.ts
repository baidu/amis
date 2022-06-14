import { BasePlugin, RegionConfig, BaseEventContext } from 'amis-editor-core';
export declare class CollapsePlugin extends BasePlugin {
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
        header: string;
        body: {
            type: string;
            tpl: string;
            inline: boolean;
        }[];
    };
    previewSchema: {
        type: string;
        header: string;
        body: {
            type: string;
            tpl: string;
            inline: boolean;
        }[];
    };
    panelTitle: string;
    panelJustify: boolean;
    panelBodyCreator: (context: BaseEventContext) => any;
    regions: Array<RegionConfig>;
}
