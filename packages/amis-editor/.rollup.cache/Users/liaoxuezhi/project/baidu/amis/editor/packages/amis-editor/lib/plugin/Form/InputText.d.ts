import { BasePlugin, BaseEventContext } from 'amis-editor-core';
export declare class TextControlPlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    order: number;
    searchKeywords: string;
    name: string;
    isBaseComponent: boolean;
    icon: string;
    description: string;
    docLink: string;
    tags: string[];
    scaffold: {
        type: string;
        label: string;
        name: string;
    };
    previewSchema: any;
    notRenderFormZone: boolean;
    panelTitle: string;
    events: {
        eventName: string;
        eventLabel: string;
        description: string;
        dataSchema: {
            type: string;
            properties: {
                'event.data.value': {
                    type: string;
                    title: string;
                };
            };
        }[];
    }[];
    actions: {
        actionType: string;
        actionLabel: string;
        description: string;
    }[];
    panelJustify: boolean;
    panelBodyCreator: (context: BaseEventContext) => any;
}
