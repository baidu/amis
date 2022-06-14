/**
 * @file table view 组件的可视化编辑
 */
/// <reference types="react" />
import { BaseEventContext, BasePlugin, BasicPanelItem, BasicToolbarItem, BuildPanelEventContext, RegionConfig, VRendererConfig } from 'amis-editor-core';
export declare class TableViewPlugin extends BasePlugin {
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
        trs: ({
            background: string;
            tds: {
                body: {
                    type: string;
                    tpl: string;
                };
            }[];
        } | {
            tds: ({
                rowspan: number;
                body: {
                    type: string;
                    tpl: string;
                };
            } | {
                body: {
                    type: string;
                    tpl: string;
                };
                rowspan?: undefined;
            })[];
            background?: undefined;
        })[];
    };
    previewSchema: {
        type: string;
        trs: ({
            background: string;
            tds: {
                body: {
                    type: string;
                    tpl: string;
                };
            }[];
        } | {
            tds: ({
                rowspan: number;
                body: {
                    type: string;
                    tpl: string;
                };
            } | {
                body: {
                    type: string;
                    tpl: string;
                };
                rowspan?: undefined;
            })[];
            background?: undefined;
        })[];
    };
    regions: Array<RegionConfig>;
    panelTitle: string;
    panelBody: any[];
    fieldWrapperResolve: (dom: HTMLElement) => HTMLElement;
    overrides: {
        renderTd(this: any, td: any, colIndex: number, rowIndex: number): any;
        renderTr(this: any, tr: any, rowIndex: number): any;
    };
    tdVRendererConfig: VRendererConfig;
    trVRendererConfig: VRendererConfig;
    renderRenderer(props: any): JSX.Element;
    buildEditorPanel(context: BuildPanelEventContext, panels: Array<BasicPanelItem>): void;
    /**
     * 插入行，需要处理前面有 rowspan 的情况
     *
     *   +---+---+---+
     *   | a | b | c |
     *   +   +---+---+
     *   |   | d | e |
     *   +   +---+---+
     *   |   | f | g |
     *   +---+---+---+
     *
     * 比如在 d 位置的前面插入行，需要将 a 的 rowspan 加一，然后再插入两个单元格
     */
    insertRow(tdId: string, position: 'above' | 'below'): void;
    /**
     * 插入列
     *
     *		+---+---+---+
     *		| a     | b |
     *		+       +---+
     *		|       | c |
     *		+---+---+---+
     *		| d | e | f |
     *		+---+---+---+
     *
     * 比如在 c 位置左侧插入列，应该将 a 的 colspan 加一，然后在最后一行增加一个单元格
     */
    insertCol(tdId: string, position: 'left' | 'right'): void;
    /**
     * 拆分有跨行或跨列的单元格
     *
     *		+---+---+---+
     *		| a     | b |
     *		+       +---+
     *		|       | c |
     *		+---+---+---+
     *		| d | e | f |
     *		+---+---+---+
     *
     * 比如拆分 a，最后要变成
     *
     *		+---+---+---+
     *		| a | g | b |
     *		+---+---+---+
     *		| h | i | c |
     *		+---+---+---+
     *		| d | e | f |
     *		+---+---+---+
     *
     * 因此要新增 g、h、i 三个单元格
     */
    splitCell(tdId: string): void;
    buildEditorToolbar({ schema, info }: BaseEventContext, toolbars: Array<BasicToolbarItem>): void;
}
