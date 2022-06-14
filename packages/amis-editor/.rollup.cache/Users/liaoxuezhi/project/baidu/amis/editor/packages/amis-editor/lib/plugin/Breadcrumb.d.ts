import { BasePlugin } from 'amis-editor-core';
export declare class BreadcrumbPlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    disabledRendererPlugin: boolean;
    name: string;
    isBaseComponent: boolean;
    icon: string;
    description: string;
    docLink: string;
    tags: string[];
    scaffold: {
        type: string;
        items: ({
            label: string;
            href: string;
            icon: string;
        } | {
            label: string;
            href?: undefined;
            icon?: undefined;
        })[];
    };
    previewSchema: any;
    panelTitle: string;
    panelBody: any[];
}
