import { TextControlPlugin } from './InputText';
export declare class EmailControlPlugin extends TextControlPlugin {
    rendererName: string;
    $schema: string;
    name: string;
    isBaseComponent: boolean;
    icon: string;
    description: string;
    scaffold: {
        type: string;
        label: string;
        name: string;
    };
    disabledRendererPlugin: boolean;
    previewSchema: {
        type: string;
        className: string;
        mode: string;
        wrapWithPanel: boolean;
        body: {
            type: string;
            label: string;
            name: string;
        };
    };
    panelTitle: string;
}
