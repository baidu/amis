import { BasePlugin, BaseEventContext } from 'amis-editor-core';
import { RendererAction, RendererEvent } from 'amis-editor-comp/dist/renderers/event-action';
export declare class MatrixControlPlugin extends BasePlugin {
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
        rowLabel: string;
        columns: {
            label: string;
        }[];
        rows: {
            label: string;
        }[];
    };
    previewSchema: any;
    notRenderFormZone: boolean;
    panelTitle: string;
    panelJustify: boolean;
    events: RendererEvent[];
    actions: RendererAction[];
    panelBodyCreator: (context: BaseEventContext) => any;
}
