import { BasePlugin } from 'amis-editor-core';
export declare class PropertyPlugin extends BasePlugin {
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
        title: string;
        items: ({
            label: string;
            content: string;
            span?: undefined;
        } | {
            label: string;
            content: string;
            span: number;
        })[];
    };
    previewSchema: any;
    panelTitle: string;
    panelBody: any[];
}
