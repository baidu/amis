import { BaseEventContext, BasePlugin, BasicToolbarItem } from 'amis-editor-core';
export declare class CarouselPlugin extends BasePlugin {
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
        options: ({
            image: string | string[];
            html?: undefined;
        } | {
            html: string;
            image?: undefined;
        })[];
    };
    previewSchema: {
        type: string;
        options: ({
            image: string | string[];
            html?: undefined;
        } | {
            html: string;
            image?: undefined;
        })[];
    };
    panelTitle: string;
    panelBodyCreator: (context: BaseEventContext) => any[];
    filterProps(props: any): any;
    /**
     * 补充切换的 toolbar
     * @param context
     * @param toolbars
     */
    buildEditorToolbar(context: BaseEventContext, toolbars: Array<BasicToolbarItem>): void;
}
