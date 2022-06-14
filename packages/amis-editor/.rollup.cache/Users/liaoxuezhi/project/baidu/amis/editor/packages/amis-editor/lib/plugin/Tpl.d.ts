import { BaseEventContext, BasePlugin } from 'amis-editor-core';
export declare class TplPlugin extends BasePlugin {
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
        tpl: string;
    };
    scaffold: any;
    panelTitle: string;
    panelJustify: boolean;
    panelBodyCreator: (context: BaseEventContext) => any;
    popOverBody: any[];
}
