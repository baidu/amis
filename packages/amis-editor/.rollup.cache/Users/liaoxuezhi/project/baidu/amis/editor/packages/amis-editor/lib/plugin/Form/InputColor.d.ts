import { BasePlugin, BaseEventContext } from 'amis-editor-core';
export declare class ColorControlPlugin extends BasePlugin {
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
        label: string;
        name: string;
    };
    previewSchema: any;
    panelTitle: string;
    notRenderFormZone: boolean;
    events: {
        eventName: string;
        eventLabel: string;
        description: string;
    }[];
    actions: {
        actionType: string;
        actionLabel: string;
        description: string;
    }[];
    panelJustify: boolean;
    getConditionalColorPanel(format: string): {
        label: string;
        name: string;
        type: string;
        format: string;
        clearable: boolean;
        visibleOn: string;
        presetColors: string[];
    };
    getConditionalColorComb(format: string): any;
    panelBodyCreator: (context: BaseEventContext) => any;
}
