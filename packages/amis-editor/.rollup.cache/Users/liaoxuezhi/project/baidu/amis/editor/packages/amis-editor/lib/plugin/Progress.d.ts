import { BaseEventContext, BasePlugin } from 'amis-editor-core';
export declare class ProgressPlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    name: string;
    searchKeywords: string;
    isBaseComponent: boolean;
    description: string;
    docLink: string;
    tags: string[];
    icon: string;
    scaffold: {
        type: string;
        value: number;
        strokeWidth: number;
    };
    previewSchema: {
        type: string;
        value: number;
        strokeWidth: number;
    };
    panelTitle: string;
    panelJustify: boolean;
    panelBodyCreator: (context: BaseEventContext) => any;
}
