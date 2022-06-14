import { BaseEventContext, BasePlugin, BasicSubRenderInfo, RendererEventContext, ScaffoldForm, SubRendererInfo } from 'amis-editor-core';
export declare class ConditionBilderPlugin extends BasePlugin {
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
        description: string;
        fields: ({
            label: string;
            type: string;
            name: string;
            options?: undefined;
        } | {
            label: string;
            type: string;
            name: string;
            options: {
                label: string;
                value: string;
            }[];
        })[];
    };
    scaffoldForm: ScaffoldForm;
    previewSchema: any;
    panelTitle: string;
    panelBodyCreator: (context: BaseEventContext) => any[];
    buildSubRenderers(context: RendererEventContext, renderers: Array<SubRendererInfo>): BasicSubRenderInfo | Array<BasicSubRenderInfo> | void;
}
