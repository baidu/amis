import { BaseEventContext, BasePlugin } from 'amis-editor-core';
export declare class AvatarPlugin extends BasePlugin {
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
        showtype: string;
        icon: string;
        fit: string;
        style: {
            width: number;
            height: number;
            borderRadius: number;
        };
    };
    previewSchema: any;
    notRenderFormZone: boolean;
    panelJustify: boolean;
    panelTitle: string;
    panelBodyCreator: (context: BaseEventContext) => any;
}
