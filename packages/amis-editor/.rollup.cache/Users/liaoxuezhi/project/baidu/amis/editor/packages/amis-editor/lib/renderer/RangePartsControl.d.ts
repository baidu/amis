/**
 * @file 组件选项组件的可视化编辑控件
 */
import React from 'react';
import type { FormControlProps } from 'amis-core';
import type { Option } from 'amis';
export declare type PartsOptionControlItem = Option & {
    number: number;
};
export declare type MarksOptionControlItem = Option & {
    number: number;
    label: any;
};
export interface PartsControlProps extends FormControlProps {
    className?: string;
}
export interface PartsControlState {
    options: Array<PartsOptionControlItem>;
    source: string;
    parts: number;
}
export interface MarksControlProps extends FormControlProps {
    className?: string;
}
export interface MarksControlState {
    options: Array<MarksOptionControlItem>;
    source: string;
}
/**
 * 分块
 */
export declare class PartsControl extends React.Component<PartsControlProps, PartsControlState> {
    constructor(props: PartsControlProps);
    transformOptionValue(source: string, parts: number | number[]): {
        number: number;
    }[];
    /**
     * 更新数据
     */
    onChange(): void;
    /**
     * 切换选项类型
     */
    handleSourceChange(source: string): void;
    /**
     * 自定义分块数据更新
     * @param value
     */
    handleOptionsChange(value?: {
        number: number;
    }[]): void;
    renderHeader(): JSX.Element;
    renderContent(source: string): JSX.Element;
    handlePartsChange(value: number): void;
    render(): JSX.Element;
}
/**
 * 下标
 */
export declare class MarksControl extends React.Component<MarksControlProps, MarksControlState> {
    constructor(props: MarksControlProps);
    componentDidUpdate(prevProps: MarksControlProps): void;
    /**
     * 配置拿到的marks数据转换为options
     * @param marks
     * @returns
     */
    transformOptionValue(marks: any): {
        number: number;
        label: any;
    }[];
    /**
     * 更新数据
     */
    onChange(): void;
    /**
     * 不同分块方式 => 不同下标数据
     */
    onSynchronismParts(): void;
    /**
     * 下标方式变化
     * @param source
     */
    handleSourceChange(source: any): void;
    renderHeader(): JSX.Element;
    render(): JSX.Element;
}
export declare class PartsControlRenderer extends PartsControl {
}
export declare class OptionControlRenderer extends MarksControl {
}
