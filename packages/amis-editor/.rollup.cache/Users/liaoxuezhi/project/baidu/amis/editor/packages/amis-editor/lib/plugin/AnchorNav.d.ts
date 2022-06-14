import { BasePlugin, VRendererConfig } from 'amis-editor-core';
export declare class AnchorNavPlugin extends BasePlugin {
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
        links: {
            title: string;
            href: string;
            body: {
                type: string;
                tpl: string;
                inline: boolean;
            }[];
        }[];
    };
    previewSchema: {
        type: string;
        links: {
            title: string;
            href: string;
            body: {
                type: string;
                tpl: string;
                inline: boolean;
            }[];
        }[];
    };
    panelTitle: string;
    panelJustify: boolean;
    panelBody: any[];
    patchContainers: string[];
    vRendererConfig: VRendererConfig;
    wrapperProps: {
        unmountOnExit: boolean;
        mountOnEnter: boolean;
    };
    sectionWrapperResolve: (dom: HTMLElement) => HTMLElement;
    overrides: {
        render(this: any): any;
    };
}
