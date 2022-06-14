/**
 * @file 文字提示容器
 */
import { BasePlugin, RegionConfig, BaseEventContext } from 'amis-editor-core';
export declare class TooltipWrapperPlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    isBaseComponent: boolean;
    name: string;
    description: string;
    docLink: string;
    tags: string[];
    icon: string;
    scaffold: {
        type: string;
        tooltip: string;
        body: {
            type: string;
            tpl: string;
        }[];
        enterable: boolean;
        showArrow: boolean;
        offset: number[];
    };
    previewSchema: {
        className: string;
        type: string;
        tooltip: string;
        body: {
            type: string;
            tpl: string;
        }[];
        enterable: boolean;
        showArrow: boolean;
        offset: number[];
    };
    regions: Array<RegionConfig>;
    panelTitle: string;
    panelJustify: boolean;
    panelBodyCreator: (context: BaseEventContext) => any[];
}
