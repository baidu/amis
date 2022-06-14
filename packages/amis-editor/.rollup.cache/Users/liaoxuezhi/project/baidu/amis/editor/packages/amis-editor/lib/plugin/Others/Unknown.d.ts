import { BasePlugin, BasicRendererInfo, RendererInfoResolveEventContext } from 'amis-editor-core';
export declare class UnkownRendererPlugin extends BasePlugin {
    order: number;
    getRendererInfo({ renderer, schema, path }: RendererInfoResolveEventContext): BasicRendererInfo | void;
}
