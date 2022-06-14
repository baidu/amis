import { BaseEventContext, BasePlugin } from 'amis-editor-core';
import { EditorNodeType } from 'amis-editor-core';
export declare class StaticControlPlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    order: number;
    name: string;
    isBaseComponent: boolean;
    icon: string;
    description: string;
    docLink: string;
    tags: string[];
    scaffold: {
        type: string;
        label: string;
    };
    previewSchema: any;
    multifactor: boolean;
    notRenderFormZone: boolean;
    panelTitle: string;
    panelBodyCreator: (context: BaseEventContext) => any;
    filterProps(props: any, node: EditorNodeType): any;
}
