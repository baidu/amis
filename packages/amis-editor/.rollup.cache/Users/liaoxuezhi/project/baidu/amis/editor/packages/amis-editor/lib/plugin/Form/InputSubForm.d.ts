/// <reference types="react" />
import { BaseEventContext, BasePlugin, BasicToolbarItem, ContextMenuEventContext, ContextMenuItem } from 'amis-editor-core';
export declare class SubFormControlPlugin extends BasePlugin {
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
        form: {
            title: string;
            body: {
                type: string;
                label: string;
                name: string;
            }[];
        };
    };
    previewSchema: any;
    panelTitle: string;
    panelBodyCreator: (context: BaseEventContext) => ({
        children: ({ value, onChange }: any) => JSX.Element;
        name?: undefined;
        type?: undefined;
        value?: undefined;
        label?: undefined;
        description?: undefined;
        visibleOn?: undefined;
    } | {
        name: string;
        type: string;
        value: string;
        label: string;
        description: string;
        children?: undefined;
        visibleOn?: undefined;
    } | {
        name: string;
        label: string;
        value: string;
        type: string;
        children?: undefined;
        description?: undefined;
        visibleOn?: undefined;
    } | {
        name: string;
        visibleOn: string;
        label: string;
        type: string;
        children?: undefined;
        value?: undefined;
        description?: undefined;
    })[];
    filterProps(props: any): any;
    buildEditorToolbar({ id, info }: BaseEventContext, toolbars: Array<BasicToolbarItem>): void;
    buildEditorContextMenu({ id, schema, region, info }: ContextMenuEventContext, menus: Array<ContextMenuItem>): void;
    editDetail(id: string): void;
}
