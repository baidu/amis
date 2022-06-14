import { DateControlPlugin } from './InputDate';
export declare class TimeControlPlugin extends DateControlPlugin {
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
        label: string;
        name: string;
    };
    disabledRendererPlugin: boolean;
    previewSchema: any;
    panelTitle: string;
}
