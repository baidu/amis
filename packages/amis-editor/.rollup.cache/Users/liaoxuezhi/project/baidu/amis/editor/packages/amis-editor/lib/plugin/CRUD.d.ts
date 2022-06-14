/// <reference types="react" />
import { BaseEventContext, BasePlugin, BasicRendererInfo, BasicSubRenderInfo, ChangeEventContext, PluginEvent, RendererEventContext, RendererInfoResolveEventContext, ScaffoldForm, SubRendererInfo } from 'amis-editor-core';
import { EditorNodeType } from 'amis-editor-core';
export declare class CRUDPlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    order: number;
    name: string;
    isBaseComponent: boolean;
    description: string;
    docLink: string;
    tags: string[];
    icon: string;
    scaffold: any;
    sampleBuilder: (schema: any) => string;
    btnSchemas: {
        create: {
            label: string;
            type: string;
            actionType: string;
            level: string;
            dialog: {
                title: string;
                body: {
                    type: string;
                    api: string;
                    body: never[];
                };
            };
        };
        update: {
            label: string;
            type: string;
            actionType: string;
            level: string;
            dialog: {
                title: string;
                body: {
                    type: string;
                    api: string;
                    body: never[];
                };
            };
        };
        view: {
            label: string;
            type: string;
            actionType: string;
            level: string;
            dialog: {
                title: string;
                body: {
                    type: string;
                    api: string;
                    body: never[];
                };
            };
        };
        delete: {
            type: string;
            label: string;
            actionType: string;
            level: string;
            className: string;
            confirmText: string;
            api: string;
        };
        bulkDelete: {
            type: string;
            level: string;
            label: string;
            actionType: string;
            confirmText: string;
            api: string;
        };
        bulkUpdate: {
            type: string;
            label: string;
            actionType: string;
            dialog: {
                title: string;
                size: string;
                body: {
                    type: string;
                    api: string;
                    body: {
                        label: string;
                        text: string;
                        type: string;
                    }[];
                };
            };
        };
        filter: {
            title: string;
            body: {
                type: string;
                name: string;
                label: string;
            }[];
        };
    };
    scaffoldForm: ScaffoldForm;
    addItem(source: any, target: any): void;
    multifactor: boolean;
    previewSchema: any;
    oldFilter?: any;
    panelTitle: string;
    panelBodyCreator: (context: BaseEventContext) => any;
    handleBulkActionEdit(id: string, index: number): void;
    handleItemActionEdit(id: string, index: number): void;
    wrapperProps: {
        affixHeader: boolean;
    };
    /**
     * 默认什么组件都加入的子组件里面，子类里面可以复写这个改变行为。
     * @param context
     * @param renderers
     */
    buildSubRenderers(context: RendererEventContext, renderers: Array<SubRendererInfo>): BasicSubRenderInfo | Array<BasicSubRenderInfo> | void;
    getRendererInfo(context: RendererInfoResolveEventContext): BasicRendererInfo | void;
    renderEditableComponents(props: any): JSX.Element | null;
    renderRenderer(props: any): JSX.Element;
    filterProps(props: any): any;
    afterUpdate(event: PluginEvent<ChangeEventContext>): void;
    buildDataSchemas(node: EditorNodeType, region?: EditorNodeType): Promise<any>;
}
