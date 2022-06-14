import { BaseEventContext, BasePlugin, BasicSubRenderInfo, RegionConfig, RendererEventContext, SubRendererInfo } from 'amis-editor-core';
export declare class OperationPlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    name: string;
    isBaseComponent: boolean;
    description: string;
    tags: string[];
    icon: string;
    scaffold: {
        type: string;
        label: string;
        buttons: {
            label: string;
            type: string;
        }[];
    };
    previewSchema: {
        type: string;
        tpl: string;
    };
    regions: Array<RegionConfig>;
    panelTitle: string;
    panelBodyCreator: (context: BaseEventContext) => any[];
    buildSubRenderers(context: RendererEventContext, renderers: Array<SubRendererInfo>): BasicSubRenderInfo | Array<BasicSubRenderInfo> | void;
}
