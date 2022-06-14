import { BasePlugin, BasicRendererInfo, BaseEventContext, RendererInfoResolveEventContext, ReplaceEventContext, PluginEvent } from 'amis-editor-core';
export declare class TableCellPlugin extends BasePlugin {
    panelTitle: string;
    panelIcon: string;
    panelBodyCreator: (context: BaseEventContext) => any[];
    getRendererInfo({ renderer, schema }: RendererInfoResolveEventContext): BasicRendererInfo | void;
    beforeReplace(event: PluginEvent<ReplaceEventContext>): void;
}
