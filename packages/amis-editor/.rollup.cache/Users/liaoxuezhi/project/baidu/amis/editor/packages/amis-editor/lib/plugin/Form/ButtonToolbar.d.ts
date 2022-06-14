import { BasePlugin, RegionConfig, BaseEventContext } from 'amis-editor-core';
export declare class ButtonToolbarControlPlugin extends BasePlugin {
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
    previewSchema: any;
    regions: Array<RegionConfig>;
    notRenderFormZone: boolean;
    panelTitle: string;
    panelBodyCreator: (context: BaseEventContext) => any[];
}
