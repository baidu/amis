import { BasePlugin, BaseEventContext } from 'amis-editor-core';
import { RendererAction, RendererEvent } from 'amis-editor-comp/dist/renderers/event-action';
export declare class TransferPlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    name: string;
    isBaseComponent: boolean;
    icon: string;
    description: string;
    docLink: string;
    tags: string[];
    scaffold: {
        label: string;
        type: string;
        name: string;
        options: {
            label: string;
            children: {
                label: string;
                value: string;
            }[];
        }[];
    };
    previewSchema: any;
    panelTitle: string;
    events: RendererEvent[];
    actions: RendererAction[];
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
    panelBodyCreator: (context: BaseEventContext) => any;
}
