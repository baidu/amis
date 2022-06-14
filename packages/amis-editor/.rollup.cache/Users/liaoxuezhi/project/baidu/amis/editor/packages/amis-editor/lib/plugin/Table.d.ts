import { RendererAction, RendererEvent } from 'amis-editor-comp/dist/renderers/event-action';
import { BasePlugin, BaseEventContext, PluginEvent, RegionConfig, RendererInfoResolveEventContext, BasicRendererInfo, InsertEventContext, ScaffoldForm } from 'amis-editor-core';
import { EditorNodeType } from 'amis-editor-core';
import { SchemaObject } from 'amis/lib/Schema';
export declare class TablePlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    name: string;
    isBaseComponent: boolean;
    description: string;
    docLink: string;
    icon: string;
    scaffold: SchemaObject;
    regions: Array<RegionConfig>;
    previewSchema: any;
    scaffoldForm: ScaffoldForm;
    panelTitle: string;
    events: RendererEvent[];
    actions: RendererAction[];
    panelBodyCreator: (context: BaseEventContext) => any;
    filterProps(props: any): any;
    getRendererInfo(context: RendererInfoResolveEventContext): BasicRendererInfo | void;
    beforeInsert(event: PluginEvent<InsertEventContext>): void;
    buildDataSchemas(node: EditorNodeType, region?: EditorNodeType): Promise<any>;
}
