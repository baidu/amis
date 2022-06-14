/**
 * @file tableview 相关的可视化编辑，拖动行高等
 */
import React from 'react';
import { TableViewSchema } from 'amis/lib/renderers/TableView';
import { EditorManager } from 'amis-editor-core';
import { EditorStoreType } from 'amis-editor-core';
interface TableViewEditorProps {
    schema: TableViewSchema;
    manager: EditorManager;
}
interface TableViewEditorState {
    trIds: string[];
    tdIds: string[];
    displayMergeCell: boolean;
}
export declare class TableViewEditor extends React.Component<TableViewEditorProps, TableViewEditorState> {
    tableViewWrapperRef: React.RefObject<HTMLDivElement>;
    draggingId: string;
    draggingElement: HTMLElement;
    draggingElementTop: number;
    draggingElementLeft: number;
    startX: number;
    startY: number;
    maxChildTrIndex: number;
    store: EditorStoreType;
    isSelectionCell: boolean;
    selectedCell: {
        [cellId: string]: any;
    };
    preventTableClick: boolean;
    constructor(props: TableViewEditorProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    syncLineState(): void;
    removeListenTdSelection(): void;
    listenTdSelection(): void;
    handleCellMouseDown(e: MouseEvent): void;
    handleCellMouseMove(e: MouseEvent): void;
    findFirstAndLastCell(): {
        minRow: number;
        minCol: number;
        maxRow: number;
        maxCol: number;
        firstCell: any;
        lastCell: null;
    };
    /**
     * 选择 td 主要是为了单元格合并，它要求是必须是矩形，比如下面的例子
     *		┌───┬───┬───┬───┐
     *		│ a │ b │ c │ d │
     *		├───┴───┼───┤   │
     *		│ e     │ f │   │
     *		│       ├───┼───┤
     *		│       │ g │ h │
     *		└───────┴───┴───┘
     * 直接选 a 和 c 是不行的，无法进行单元格合并，所以需要补上 b
     * 如果选择了 e 和 f，需要自动选择 g 来让整体变成矩形
     * 这个函数的主要作用就是将矩形补充完整
     */
    markSelectingCell(): void;
    removeAllSelectionMark(): void;
    handleCellMouseUp(e: MouseEvent): void;
    handleCellMouseClick(e: MouseEvent): void;
    handleMergeCell(): void;
    syncLinePos(): void;
    componentDidUpdate(prevProps: TableViewEditorProps): void;
    lineMouseDownCommon(e: React.MouseEvent<HTMLElement>): void;
    handleRowMouseDown(e: React.MouseEvent<HTMLElement>): void;
    handleRowMouseMove(e: MouseEvent): void;
    handleRowMouseUp(e: MouseEvent): void;
    handleColMouseDown(e: React.MouseEvent<HTMLElement>): void;
    handleColMouseMove(e: MouseEvent): void;
    handleColMouseUp(e: MouseEvent): void;
    handleLineClick(e: MouseEvent): void;
    renderMergeIcon(): JSX.Element | null;
    render(): JSX.Element;
}
export {};
