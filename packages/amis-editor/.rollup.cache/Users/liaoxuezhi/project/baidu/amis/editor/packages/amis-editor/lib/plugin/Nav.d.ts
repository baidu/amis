import { BasePlugin } from 'amis-editor-core';
export declare class NavPlugin extends BasePlugin {
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
        stacked: boolean;
        links: {
            label: string;
            to: string;
        }[];
    };
    previewSchema: {
        type: string;
        stacked: boolean;
        links: {
            label: string;
            to: string;
        }[];
    };
    panelTitle: string;
    panelDefinitions: {
        links: {
            label: string;
            name: string;
            type: string;
            multiple: boolean;
            draggable: boolean;
            addButtonText: string;
            multiLine: boolean;
            messages: {
                validateFailed: string;
            };
            scaffold: {
                label: string;
                to: string;
            };
            items: any[];
        };
    };
    panelBody: any[];
}
