import { DateRangeControlPlugin } from './InputDateRange';
export declare class YearRangeControlPlugin extends DateRangeControlPlugin {
    rendererName: string;
    $schema: string;
    order: number;
    icon: string;
    name: string;
    isBaseComponent: boolean;
    description: string;
    docLink: string;
    tags: string[];
    scaffold: {
        type: string;
        label: string;
        name: string;
    };
    previewSchema: any;
    disabledRendererPlugin: boolean;
    notRenderFormZone: boolean;
}
