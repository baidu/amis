import { ActiveEventContext, BaseEventContext, BasePlugin, PluginEvent, ResizeMoveEventContext } from 'amis-editor-core';
export declare class ImagePlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    name: string;
    isBaseComponent: boolean;
    description: string;
    tags: string[];
    icon: string;
    scaffold: {
        type: string;
    };
    previewSchema: {
        thumbMode: string;
        value: string | string[];
        type: string;
    };
    panelTitle: string;
    panelBodyCreator: (context: BaseEventContext) => any[];
    onActive(event: PluginEvent<ActiveEventContext>): void;
    onWidthChangeStart(event: PluginEvent<ResizeMoveEventContext, {
        onMove(e: MouseEvent): void;
        onEnd(e: MouseEvent): void;
    }>): void;
    onHeightChangeStart(event: PluginEvent<ResizeMoveEventContext, {
        onMove(e: MouseEvent): void;
        onEnd(e: MouseEvent): void;
    }>): void;
    onSizeChangeStart(event: PluginEvent<ResizeMoveEventContext, {
        onMove(e: MouseEvent): void;
        onEnd(e: MouseEvent): void;
    }>, direction?: 'both' | 'vertical' | 'horizontal'): void;
}
