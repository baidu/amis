import { BaseEventContext } from 'amis-editor-core';
import { DatePlugin } from './Date';
export declare class DatetimePlugin extends DatePlugin {
    rendererName: string;
    scaffold: {
        type: string;
        value: number;
    };
    name: string;
    isBaseComponent: boolean;
    previewSchema: {
        format: string;
        value: number;
        type: string;
    };
    panelBodyCreator: (context: BaseEventContext) => any[];
}
