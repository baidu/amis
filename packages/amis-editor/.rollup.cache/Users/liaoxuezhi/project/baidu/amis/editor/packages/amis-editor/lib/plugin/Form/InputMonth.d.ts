import { DateControlPlugin } from './InputDate';
export declare class MonthControlPlugin extends DateControlPlugin {
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
    };
    disabledRendererPlugin: boolean;
    previewSchema: any;
    panelTitle: string;
}
