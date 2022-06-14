import { BasePlugin } from 'amis-editor-core';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';
export declare class WebComponentPlugin extends BasePlugin {
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
        tag: string;
    };
    previewSchema: {
        type: string;
        tag: string;
    };
    panelTitle: string;
    panelBody: {
        type: string;
        label: string;
        name: string;
    }[];
}
