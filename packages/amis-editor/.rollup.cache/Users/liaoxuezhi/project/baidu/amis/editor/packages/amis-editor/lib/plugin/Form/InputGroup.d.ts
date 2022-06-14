import { BasePlugin } from 'amis-editor-core';
export declare class InputGroupControlPlugin extends BasePlugin {
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
        name: string;
        label: string;
        body: ({
            type: string;
            inputClassName: string;
            name: string;
            label?: undefined;
            level?: undefined;
        } | {
            type: string;
            label: string;
            level: string;
            inputClassName?: undefined;
            name?: undefined;
        })[];
    };
    previewSchema: any;
    panelTitle: string;
    panelBody: any[][];
}
