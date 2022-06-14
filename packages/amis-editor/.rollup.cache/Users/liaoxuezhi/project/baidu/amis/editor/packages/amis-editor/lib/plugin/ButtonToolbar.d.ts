import { BasePlugin } from 'amis-editor-core';
export declare class ButtonToolbarPlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    name: string;
    isBaseComponent: boolean;
    description: string;
    tags: string[];
    icon: string;
    /**
     * 组件选择面板中隐藏，和ButtonGroup合并
     */
    disabledRendererPlugin: boolean;
    scaffold: {
        type: string;
        buttons: {
            type: string;
            label: string;
        }[];
    };
    previewSchema: {
        type: string;
        buttons: {
            type: string;
            label: string;
        }[];
    };
    panelTitle: string;
    panelBody: any[];
}
