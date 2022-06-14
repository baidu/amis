import { BasePlugin } from 'amis-editor-core';
export declare class TasksPlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    name: string;
    isBaseComponent: boolean;
    description: string;
    docLink: string;
    tags: string[];
    icon: string;
    scaffold: {
        type: string;
        name: string;
        items: ({
            label: string;
            key: string;
            status: number;
            remark: string;
        } | {
            label: string;
            key: string;
            status: number;
            remark?: undefined;
        })[];
    };
    previewSchema: {
        type: string;
        name: string;
        items: ({
            label: string;
            key: string;
            status: number;
            remark: string;
        } | {
            label: string;
            key: string;
            status: number;
            remark?: undefined;
        })[];
    };
    panelTitle: string;
    panelBody: any[];
}
