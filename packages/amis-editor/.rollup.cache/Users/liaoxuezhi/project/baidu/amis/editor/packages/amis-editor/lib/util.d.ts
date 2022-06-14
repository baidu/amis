/// <reference types="react" />
import { BaseEventContext, EditorManager } from 'amis-editor-core';
/**
 * 获取事件动作面板所需属性配置
 */
export declare const getEventControlConfig: (manager: EditorManager, context: BaseEventContext) => {
    actions: import("amis-editor-comp/dist/renderers/event-action").PluginActions;
    events: import("amis-editor-comp/dist/renderers/event-action").PluginEvents;
    getContextSchemas: (id?: string, withoutSuper?: boolean) => Promise<import("json-schema").JSONSchema7[] | import("amis").DataSchema>;
    getComponents: () => any[];
    actionTree: import("amis-editor-comp/dist/renderers/event-action").ActionTypeNode[];
    actionConfigItemsMap: {
        [x: string]: {
            schema?: any;
            config?: string[] | undefined;
            desc?: ((info: any) => string | JSX.Element) | undefined;
            withComponentId?: boolean | undefined;
            supportComponents?: string[] | undefined;
        };
    };
    owner: string;
    addBroadcast: (event: import("amis-editor-comp/dist/renderers/event-action").RendererEvent) => void;
    removeBroadcast: (id: string) => void;
};
