import { BaseEventContext, BasePlugin, RegionConfig } from 'amis-editor-core';
import { InlineModal } from './Dialog';
export declare class DrawerPlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    name: string;
    isBaseComponent: boolean;
    wrapperProps: {
        wrapperComponent: typeof InlineModal;
        onClose: typeof import("amis-core").noop;
        resizable: boolean;
        show: boolean;
    };
    regions: Array<RegionConfig>;
    events: {
        eventName: string;
        eventLabel: string;
        description: string;
    }[];
    actions: {
        actionType: string;
        actionLabel: string;
        description: string;
    }[];
    panelTitle: string;
    panelBodyCreator: (context: BaseEventContext) => any;
    buildSubRenderers(): void;
}
