/// <reference types="react" />
import { BasePlugin, BaseEventContext } from 'amis-editor-core';
export declare class IFramePlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    name: string;
    isBaseComponent: boolean;
    description: string;
    tags: string[];
    icon: string;
    scaffold: {
        type: string;
        src: string;
    };
    previewSchema: {
        type: string;
        tpl: string;
    };
    panelTitle: string;
    panelBodyCreator: (context: BaseEventContext) => any[];
    renderRenderer(props: any): import("react").DetailedReactHTMLElement<{
        key: any;
        className: string;
        children: import("react").DetailedReactHTMLElement<{
            className: string;
            children: string;
        }, HTMLElement>;
    }, HTMLElement>;
}
