import { BaseEventContext, BasePlugin, InsertEventContext, PluginEvent, RegionConfig, VRendererConfig } from 'amis-editor-core';
export declare class CardPlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    name: string;
    isBaseComponent: boolean;
    description: string;
    docLink: string;
    tags: string[];
    icon: string;
    scaffold: {
        type: string;
        header: {
            title: string;
            subTitle: string;
        };
        body: string;
        actions: {
            type: string;
            label: string;
            actionType: string;
            dialog: {
                title: string;
                body: string;
            };
        }[];
    };
    previewSchema: {
        type: string;
        header: {
            title: string;
            subTitle: string;
        };
        body: string;
        actions: {
            type: string;
            label: string;
            actionType: string;
            dialog: {
                title: string;
                body: string;
            };
        }[];
    };
    regions: Array<RegionConfig>;
    panelTitle: string;
    panelBodyCreator: (context: BaseEventContext) => any[];
    fieldWrapperResolve: (dom: HTMLElement) => HTMLElement;
    overrides: {
        renderFeild: (this: any, region: string, field: any, index: any, props: any) => any;
    };
    vRendererConfig: VRendererConfig;
    beforeInsert(event: PluginEvent<InsertEventContext>): void;
}
