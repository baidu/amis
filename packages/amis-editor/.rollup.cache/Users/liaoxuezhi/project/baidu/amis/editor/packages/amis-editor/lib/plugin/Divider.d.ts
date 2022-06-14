import { BasePlugin } from 'amis-editor-core';
export declare class DividerPlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    name: string;
    isBaseComponent: boolean;
    icon: string;
    description: string;
    scaffold: {
        type: string;
    };
    previewSchema: any;
    panelTitle: string;
    panelBody: any;
}
