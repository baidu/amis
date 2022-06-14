import { BaseEventContext, BasePlugin, InsertEventContext, PluginEvent, ScaffoldForm, RegionConfig } from 'amis-editor-core';
export declare class TableControlPlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    name: string;
    isBaseComponent: boolean;
    icon: string;
    description: string;
    docLink: string;
    tags: string[];
    scaffold: {
        type: string;
        name: string;
        label: string;
        columns: ({
            label: string;
            name: string;
            quickEdit: {
                type: string;
                mode?: undefined;
            };
        } | {
            label: string;
            name: string;
            quickEdit: {
                type: string;
                mode: string;
            };
        })[];
        strictMode: boolean;
    };
    regions: Array<RegionConfig>;
    previewSchema: any;
    scaffoldForm: ScaffoldForm;
    panelTitle: string;
    panelBodyCreator: (context: BaseEventContext) => any;
    filterProps(props: any): any;
    beforeInsert(event: PluginEvent<InsertEventContext>): void;
}
