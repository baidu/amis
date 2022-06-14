import { BasePlugin, BaseEventContext, BasicPanelItem, RegionConfig, BuildPanelEventContext } from 'amis-editor-core';
export declare class PanelPlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    name: string;
    isBaseComponent: boolean;
    icon: string;
    description: string;
    docLink: string;
    tags: string;
    scaffold: {
        type: string;
        title: string;
        body: string;
    };
    previewSchema: {
        type: string;
        title: string;
        body: string;
        className: string;
        actions: {
            label: string;
            type: string;
        }[];
    };
    regions: Array<RegionConfig>;
    panelTitle: string;
    panelBodyCreator: (context: BaseEventContext) => any[];
    buildEditorPanel(context: BuildPanelEventContext, panels: Array<BasicPanelItem>): void;
}
