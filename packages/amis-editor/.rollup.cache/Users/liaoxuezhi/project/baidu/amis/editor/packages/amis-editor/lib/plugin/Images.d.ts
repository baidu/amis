import { BaseEventContext, BasePlugin } from 'amis-editor-core';
export declare class ImagesPlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    name: string;
    isBaseComponent: boolean;
    description: string;
    tags: string[];
    icon: string;
    scaffold: {
        type: string;
    };
    previewSchema: {
        listClassName: string;
        thumbMode: string;
        value: {
            title: string;
            image: string | string[];
            src: string | string[];
        }[];
        type: string;
    };
    panelTitle: string;
    panelBodyCreator: (context: BaseEventContext) => any[];
}
