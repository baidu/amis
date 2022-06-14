import { BasePlugin, BasicPanelItem, RendererJSONSchemaResolveEventContext, BuildPanelEventContext } from 'amis-editor-core';
/**
 * 添加源码编辑功能
 */
export declare class CodePlugin extends BasePlugin {
    order: number;
    buildJSONSchema({ info }: RendererJSONSchemaResolveEventContext): string | undefined;
    buildEditorPanel({ info, selections }: BuildPanelEventContext, panels: Array<BasicPanelItem>): void;
}
