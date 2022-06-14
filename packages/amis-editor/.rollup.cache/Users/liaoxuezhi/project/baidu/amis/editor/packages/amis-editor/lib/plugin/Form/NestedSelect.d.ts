import { RendererAction, RendererEvent } from 'amis-editor-comp/dist/renderers/event-action';
import { BasePlugin, BaseEventContext } from 'amis-editor-core';
export declare class NestedSelectControlPlugin extends BasePlugin {
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
        onlyChildren: boolean;
        options: ({
            label: string;
            value: string;
            children?: undefined;
        } | {
            label: string;
            value: string;
            children: {
                label: string;
                value: string;
            }[];
        })[];
    };
    previewSchema: any;
    panelTitle: string;
    notRenderFormZone: boolean;
    panelDefinitions: {
        options: {
            label: string;
            name: string;
            type: string;
            multiple: boolean;
            multiLine: boolean;
            draggable: boolean;
            addButtonText: string;
            scaffold: {
                label: string;
                value: string;
            };
            items: ({
                type: string;
                body: ({
                    type: string;
                    name: string;
                    placeholder: string;
                    required: boolean;
                    unique?: undefined;
                } | {
                    type: string;
                    name: string;
                    placeholder: string;
                    unique: boolean;
                    required?: undefined;
                })[];
                $ref?: undefined;
                label?: undefined;
                name?: undefined;
                addButtonText?: undefined;
            } | {
                $ref: string;
                label: string;
                name: string;
                addButtonText: string;
                type?: undefined;
                body?: undefined;
            })[];
        };
    };
    panelJustify: boolean;
    events: RendererEvent[];
    actions: RendererAction[];
    panelBodyCreator: (context: BaseEventContext) => any;
}
