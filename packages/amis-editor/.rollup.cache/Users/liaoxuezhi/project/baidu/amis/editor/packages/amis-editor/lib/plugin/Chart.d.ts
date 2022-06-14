import { BaseEventContext, BasePlugin } from 'amis-editor-core';
import { RendererAction } from 'amis-editor-comp/dist/renderers/event-action';
export declare class ChartPlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    name: string;
    isBaseComponent: boolean;
    description: string;
    docLink: string;
    tags: string[];
    icon: string;
    scaffold: {
        type: string;
        config: {
            xAxis: {
                type: string;
                data: string[];
            };
            yAxis: {
                type: string;
            };
            series: {
                data: number[];
                type: string;
            }[];
        };
        replaceChartOption: boolean;
    };
    previewSchema: {
        type: string;
        config: {
            xAxis: {
                type: string;
                data: string[];
            };
            yAxis: {
                type: string;
            };
            series: {
                data: number[];
                type: string;
            }[];
        };
        replaceChartOption: boolean;
    };
    actions: RendererAction[];
    panelTitle: string;
    panelBodyCreator: (context: BaseEventContext) => any[];
    editDrillDown(id: string): void;
}
