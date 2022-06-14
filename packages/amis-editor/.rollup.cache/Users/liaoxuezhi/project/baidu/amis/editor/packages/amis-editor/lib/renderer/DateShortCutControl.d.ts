/**
 * @file 时间选择器的快捷键
 */
import React from 'react';
import Sortable from 'sortablejs';
import type { FormControlProps } from 'amis-core';
import type { BaseEventContext } from 'amis-editor-core';
declare type RangesType = Array<string | {
    label: string;
    range: any;
}>;
declare type DropDownOption = {
    [key: string]: string;
};
export interface DateShortCutControlProps extends FormControlProps {
    className?: string;
    /**
     * 编辑器上下文数据，用于获取字段所在Form的其他字段
     */
    context: BaseEventContext;
    dropDownOption: DropDownOption;
}
interface OptionsType {
    label: string;
    type: string;
    inputValue: string;
}
interface DateShortCutControlState {
    options: Array<OptionsType>;
}
export declare class DateShortCutControl extends React.PureComponent<DateShortCutControlProps, DateShortCutControlState> {
    sortable?: Sortable;
    drag?: HTMLElement | null;
    target: HTMLElement | null;
    dropDownOptionArr: Array<{
        label: string;
        value: string;
    }>;
    static defaultProps: Partial<DateShortCutControlProps>;
    constructor(props: DateShortCutControlProps);
    initOptions(ranges: RangesType): void;
    /**
     * 添加
     */
    addItem(item: {
        label: string;
        value: string;
    }): void;
    dragRef(ref: any): void;
    scrollToBottom(): void;
    /**
     * 初始化拖动
     */
    initDragging(): void;
    /**
     * 拖动的销毁
     */
    destroyDragging(): void;
    /**
     * 生成内容体
     */
    renderContent(): JSX.Element;
    /**
     * 生成选项
     */
    renderOption(option: OptionsType, index: number): JSX.Element;
    /**
     * 输入框的改变
     */
    onInputChange(index: number, value: string, key: 'inputValue' | 'label'): void;
    /**
     * 删除选项
     */
    handleDelete(index: number, e: React.UIEvent<any>): void;
    /**
     * 更新options字段的统一出口
     */
    onChangeOptions(): void;
    render(): JSX.Element;
}
export declare class DateShortCutControlRender extends DateShortCutControl {
}
export {};
