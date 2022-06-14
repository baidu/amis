import { BaseEventContext, BasePlugin } from 'amis-editor-core';
export declare class DatePlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    name: string;
    isBaseComponent: boolean;
    description: string;
    tags: string[];
    icon: string;
    scaffold: {
        type: string;
        value: number;
    };
    previewSchema: {
        format: string;
        value: number;
        type: string;
    };
    panelTitle: string;
    panelBodyCreator: (context: BaseEventContext) => any[];
}
