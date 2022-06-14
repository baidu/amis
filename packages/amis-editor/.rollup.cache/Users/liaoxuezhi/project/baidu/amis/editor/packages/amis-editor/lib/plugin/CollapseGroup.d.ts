import { BasePlugin, RegionConfig, BaseEventContext } from 'amis-editor-core';
export declare class CollapseGroupPlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    name: string;
    isBaseComponent: boolean;
    description: string;
    tags: string[];
    icon: string;
    scaffold: {
        type: string;
        activeKey: string[];
        body: ({
            type: string;
            key: string;
            active: boolean;
            header: string;
            body: {
                type: string;
                tpl: string;
                inline: boolean;
            }[];
        } | {
            type: string;
            key: string;
            header: string;
            body: {
                type: string;
                tpl: string;
                inline: boolean;
            }[];
            active?: undefined;
        })[];
    };
    previewSchema: {
        type: string;
        activeKey: string[];
        body: ({
            type: string;
            key: string;
            active: boolean;
            header: string;
            body: {
                type: string;
                tpl: string;
                inline: boolean;
            }[];
        } | {
            type: string;
            key: string;
            header: string;
            body: {
                type: string;
                tpl: string;
                inline: boolean;
            }[];
            active?: undefined;
        })[];
    };
    activeKeyData: any;
    panelTitle: string;
    panelJustify: boolean;
    panelBodyCreator: (context: BaseEventContext) => any[];
    regions: Array<RegionConfig>;
}
