/**
 * @file input-kv 组件的素项目部
 */
import { RendererAction, RendererEvent } from 'amis-editor-comp/dist/renderers/event-action';
import { BasePlugin } from 'amis-editor-core';
export declare class KVControlPlugin extends BasePlugin {
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
        label: string;
        name: string;
    };
    previewSchema: any;
    events: RendererEvent[];
    actions: RendererAction[];
    panelTitle: string;
    panelBody: ({
        type: string;
        name: string;
        label: string;
        pipeIn: (value: any) => any;
    } | {
        type: string;
        name: string;
        label: string;
        pipeIn?: undefined;
    })[];
}
