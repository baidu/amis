import { BaseEventContext, BasePlugin } from 'amis-editor-core';
export declare class JsonPlugin extends BasePlugin {
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
    };
    previewSchema: {
        name: string;
        value: {
            a: number;
            b: {
                c: number;
            };
        };
        type: string;
    };
    panelTitle: string;
    panelBodyCreator: (context: BaseEventContext) => any[];
}
