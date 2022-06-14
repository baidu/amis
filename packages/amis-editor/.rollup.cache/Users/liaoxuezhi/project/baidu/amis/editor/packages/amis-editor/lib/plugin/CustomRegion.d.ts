/**
 * @file 自定义代码
 */
import { BasePlugin, BasicRendererInfo, RendererInfoResolveEventContext, RegionConfig } from 'amis-editor-core';
export declare class CustomPlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    name: string;
    isBaseComponent: boolean;
    disabledRendererPlugin: boolean;
    description: string;
    docLink: string;
    tags: string[];
    icon: string;
    scaffold: {
        type: string;
        html: string;
        onMount: string;
        body: {
            type: string;
            tpl: string;
        }[];
    };
    previewSchema: {
        type: string;
        html: string;
        onMount: string;
        body: {
            type: string;
            tpl: string;
        }[];
    };
    regions: Array<RegionConfig>;
    panelTitle: string;
    panelBody: any[];
    /**
     * 备注: 根据当前custom组件的schema中是否有body元素来启动容器模式，用于实现custom组件实现自定义容器类型
     */
    getRendererInfo(context: RendererInfoResolveEventContext): BasicRendererInfo | void;
}
