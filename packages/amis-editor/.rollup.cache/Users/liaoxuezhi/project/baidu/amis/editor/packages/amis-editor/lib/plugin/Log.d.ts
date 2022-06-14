import { BaseEventContext, BasePlugin } from 'amis-editor-core';
export declare class LogPlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    name: string;
    isBaseComponent: boolean;
    icon: string;
    description: string;
    docLink: string;
    tags: string[];
    previewSchema: {
        type: string;
        height: number;
    };
    scaffold: any;
    panelTitle: string;
    panelBodyCreator: (context: BaseEventContext) => any;
}
