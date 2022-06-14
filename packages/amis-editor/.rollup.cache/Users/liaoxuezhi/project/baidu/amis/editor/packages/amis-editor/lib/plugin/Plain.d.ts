import { BaseEventContext, BasePlugin } from 'amis-editor-core';
export declare class PlainPlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    disabledRendererPlugin: boolean;
    name: string;
    isBaseComponent: boolean;
    icon: string;
    description: string;
    docLink: string;
    tags: string[];
    previewSchema: {
        type: string;
        text: string;
        className: string;
        inline: boolean;
    };
    scaffold: any;
    panelTitle: string;
    panelBodyCreator: (context: BaseEventContext) => any;
}
