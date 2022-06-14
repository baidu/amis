import { BaseEventContext } from 'amis-editor-core';
import { DatePlugin } from './Date';
export declare class TimePlugin extends DatePlugin {
    rendererName: string;
    name: string;
    isBaseComponent: boolean;
    scaffold: {
        type: string;
        value: number;
    };
    previewSchema: {
        format: string;
        value: number;
        type: string;
    };
    panelBodyCreator: (context: BaseEventContext) => any[];
}
