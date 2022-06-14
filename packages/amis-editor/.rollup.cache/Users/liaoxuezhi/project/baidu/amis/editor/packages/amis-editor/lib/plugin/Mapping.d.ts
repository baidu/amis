import { BaseEventContext, BasePlugin } from 'amis-editor-core';
export declare class MappingPlugin extends BasePlugin {
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
        value: number;
        map: {
            0: string;
            1: string;
            2: string;
            3: string;
            4: string;
            '*': string;
        };
    };
    previewSchema: {
        type: string;
        value: number;
        map: {
            0: string;
            1: string;
            2: string;
            3: string;
            4: string;
            '*': string;
        };
    };
    panelTitle: string;
    panelBodyCreator: (context: BaseEventContext) => any[];
}
