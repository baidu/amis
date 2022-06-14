import { BasePlugin, BaseEventContext } from 'amis-editor-core';
export declare class StatusPlugin extends BasePlugin {
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
    };
    previewSchema: {
        type: string;
        value: number;
    };
    panelTitle: string;
    panelBodyCreator: (context: BaseEventContext) => any[];
}
