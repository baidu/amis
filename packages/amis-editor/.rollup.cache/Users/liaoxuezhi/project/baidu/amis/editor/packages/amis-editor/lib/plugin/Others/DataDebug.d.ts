/// <reference types="react" />
import { BaseEventContext, BasePlugin, BasicToolbarItem } from 'amis-editor-core';
/**
 * 添加调试功能
 */
export declare class DataDebugPlugin extends BasePlugin {
    buildEditorToolbar({ id, schema, node }: BaseEventContext, toolbars: Array<BasicToolbarItem>): void;
    dataViewer: {
        type: string;
        name: string;
        asFormItem: boolean;
        className: string;
        component: ({ value, onChange, readOnly }: {
            value: any;
            onChange: (value: any) => void;
            readOnly?: boolean | undefined;
        }) => JSX.Element;
    };
    openDebugForm(data: any, callback?: (values: any) => void): Promise<void>;
}
