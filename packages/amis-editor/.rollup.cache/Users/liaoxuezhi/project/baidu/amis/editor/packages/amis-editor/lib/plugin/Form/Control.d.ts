import { BasePlugin, RegionConfig, BaseEventContext } from 'amis-editor-core';
export declare class ControlPlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    name: string;
    isBaseComponent: boolean;
    icon: string;
    description: string;
    docLink: string;
    tags: string[];
    /**
     * 组件选择面板中隐藏，和Container合并
     */
    disabledRendererPlugin: boolean;
    scaffold: {
        type: string;
        label: string;
        body: {
            type: string;
            tpl: string;
        }[];
    };
    previewSchema: any;
    regions: Array<RegionConfig>;
    panelTitle: string;
    panelBodyCreator: (context: BaseEventContext) => any[];
}
