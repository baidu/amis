import { BasePlugin } from 'amis-editor-core';
export declare class LinkPlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    name: string;
    isBaseComponent: boolean;
    description: string;
    tags: string[];
    icon: string;
    scaffold: {
        type: string;
        value: string;
    };
    previewSchema: {
        label: string;
        type: string;
        value: string;
    };
    panelTitle: string;
    panelJustify: boolean;
    panelBody: any[];
}
