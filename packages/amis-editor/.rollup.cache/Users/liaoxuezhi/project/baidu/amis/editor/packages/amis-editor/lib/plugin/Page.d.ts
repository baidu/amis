import { ContainerWrapper } from 'amis-editor-core';
import { BaseEventContext, BasePlugin } from 'amis-editor-core';
import { RendererAction, RendererEvent } from 'amis-editor-comp/dist/renderers/event-action';
import type { SchemaObject } from 'amis/lib/Schema';
export declare class PagePlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    name: string;
    isBaseComponent: boolean;
    docLink: string;
    tags: string;
    icon: string;
    scaffold: SchemaObject;
    previewSchema: SchemaObject;
    events: RendererEvent[];
    actions: RendererAction[];
    regions: ({
        key: string;
        label: string;
        preferTag: string;
        placeholder?: undefined;
    } | {
        key: string;
        label: string;
        placeholder: string;
        preferTag?: undefined;
    })[];
    wrapper: typeof ContainerWrapper;
    panelTitle: string;
    panelBodyCreator: (context: BaseEventContext) => any[];
}
