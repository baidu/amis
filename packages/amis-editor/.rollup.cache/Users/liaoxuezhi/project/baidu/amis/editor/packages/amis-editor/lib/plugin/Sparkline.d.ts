/**
 * @file 走势图
 */
import { BasePlugin } from 'amis-editor-core';
export declare class SparklinePlugin extends BasePlugin {
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
        height: number;
        value: number[];
    };
    previewSchema: {
        type: string;
        height: number;
        value: number[];
    };
    panelTitle: string;
    panelBody: {
        name: string;
        type: string;
        label: string;
    }[];
}
