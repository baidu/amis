import { BasePlugin, RegionConfig, BaseEventContext } from 'amis-editor-core';
import { RendererEvent } from 'amis-editor-comp/dist/renderers/event-action';
export declare class PaginationPlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    name: string;
    isBaseComponent: boolean;
    description: string;
    tags: string[];
    icon: string;
    baseLayoutLIst: {
        text: string;
        value: string;
        checked: boolean;
    }[];
    scaffold: {
        type: string;
        mode: string;
        layout: string[];
        activePage: number;
        lastPage: number;
        total: number;
        hasNext: boolean;
        disabled: boolean;
        showPerPage: boolean;
        perPageAvailable: number[];
        perPage: number;
        maxButton: number;
        showPageInput: boolean;
    };
    previewSchema: {
        type: string;
        mode: string;
        layout: string[];
        activePage: number;
        lastPage: number;
        total: number;
        hasNext: boolean;
        disabled: boolean;
        showPerPage: boolean;
        perPageAvailable: number[];
        perPage: number;
        maxButton: number;
        showPageInput: boolean;
    };
    panelTitle: string;
    events: RendererEvent[];
    panelJustify: boolean;
    panelBodyCreator: (context: BaseEventContext) => any;
    regions: Array<RegionConfig>;
}
