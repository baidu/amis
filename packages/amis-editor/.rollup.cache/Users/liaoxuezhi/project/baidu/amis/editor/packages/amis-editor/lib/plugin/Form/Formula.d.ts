/// <reference types="react" />
import { BasePlugin } from 'amis-editor-core';
export declare class FormulaControlPlugin extends BasePlugin {
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
    };
    previewSchema: any;
    panelTitle: string;
    panelBody: any[];
    renderRenderer(props: any): import("react").DetailedReactHTMLElement<{
        key: any;
        className: string;
        children: import("react").DetailedReactHTMLElement<{
            className: string;
            children: string;
        }, HTMLElement>;
    }, HTMLElement>;
}
