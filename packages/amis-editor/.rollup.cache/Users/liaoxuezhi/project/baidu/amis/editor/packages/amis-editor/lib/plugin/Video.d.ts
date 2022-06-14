import { BasePlugin } from 'amis-editor-core';
export declare class VideoPlugin extends BasePlugin {
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
        autoPlay: boolean;
        src: string;
        poster: string | string[];
    };
    previewSchema: {
        type: string;
        autoPlay: boolean;
        src: string;
        poster: string | string[];
    };
    panelTitle: string;
    panelBody: any[];
    filterProps(props: any): any;
}
