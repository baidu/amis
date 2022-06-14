import { BaseEventContext, BasePlugin, BasicRendererInfo, RendererInfoResolveEventContext } from 'amis-editor-core';
import { RendererAction, RendererEvent } from 'amis-editor-comp/dist/renderers/event-action';
import { SchemaObject } from 'amis/lib/Schema';
export declare class ButtonPlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    name: string;
    isBaseComponent: boolean;
    description: string;
    docLink: string;
    tags: string[];
    icon: string;
    scaffold: SchemaObject;
    previewSchema: any;
    panelTitle: string;
    events: RendererEvent[];
    actions: RendererAction[];
    panelJustify: boolean;
    panelBodyCreator: (context: BaseEventContext) => any;
    /**
     * 如果禁用了没办法编辑
     */
    filterProps(props: any): any;
    /**
     * 如果配置里面有 rendererName 自动返回渲染器信息。
     * @param renderer
     */
    getRendererInfo({ renderer, schema }: RendererInfoResolveEventContext): BasicRendererInfo | void;
}
