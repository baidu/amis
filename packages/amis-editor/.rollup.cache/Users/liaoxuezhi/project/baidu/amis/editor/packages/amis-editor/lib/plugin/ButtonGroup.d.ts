import { BasePlugin, RegionConfig, BaseEventContext } from 'amis-editor-core';
export declare class ButtonGroupPlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    name: string;
    isBaseComponent: boolean;
    description: string;
    tags: string[];
    icon: string;
    docLink: string;
    scaffold: {
        type: string;
        buttons: {
            onEvent: {
                click: {
                    actions: never[];
                };
            };
            type: string;
            label: string;
        }[];
    };
    previewSchema: {
        type: string;
        buttons: {
            onEvent: {
                click: {
                    actions: never[];
                };
            };
            type: string;
            label: string;
        }[];
    };
    panelTitle: string;
    panelJustify: boolean;
    panelBodyCreator: (context: BaseEventContext) => any;
    regions: Array<RegionConfig>;
}
