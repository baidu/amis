import { BaseEventContext, BasePlugin, BasicToolbarItem, VRendererConfig } from 'amis-editor-core';
import { RendererAction, RendererEvent } from 'amis-editor-comp/dist/renderers/event-action';
export declare class WizardPlugin extends BasePlugin {
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
        steps: {
            title: string;
            body: {
                type: string;
                label: string;
                name: string;
            }[];
        }[];
    };
    previewSchema: {
        type: string;
        className: string;
        steps: {
            title: string;
            body: {
                type: string;
                label: string;
                name: string;
            }[];
        }[];
    };
    events: RendererEvent[];
    actions: RendererAction[];
    panelTitle: string;
    panelBodyCreator: (context: BaseEventContext) => any[];
    /**
     * 补充切换的 toolbar
     * @param context
     * @param toolbars
     */
    buildEditorToolbar(context: BaseEventContext, toolbars: Array<BasicToolbarItem>): void;
    filterProps(props: any): any;
    patchContainers: string[];
    vRendererConfig: VRendererConfig;
    wizardWrapperResolve: (dom: HTMLElement) => any;
    overrides: {
        renderWizard: (this: any) => any;
        renderFooter: (this: any) => any;
    };
}
