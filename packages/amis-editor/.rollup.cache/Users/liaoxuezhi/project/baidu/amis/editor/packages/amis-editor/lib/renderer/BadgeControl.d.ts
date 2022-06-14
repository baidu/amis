/**
 * @file 角标控件
 */
/// <reference types="lodash" />
import React from 'react';
import type { FormControlProps } from 'amis-core';
import type { SchemaExpression } from 'amis/lib/Schema';
export interface BadgeControlProps extends FormControlProps {
    /**
     * 角标类型
     */
    mode?: 'text' | 'dot' | 'ribbon';
    /**
     * 文本内容
     */
    text?: string | number;
    /**
     * 角标大小
     */
    size?: any;
    /**
     * 角标位置，优先级大于position
     */
    offset?: [number | string, number | string];
    /**
     * 角标位置
     */
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    /**
     * 封顶的数字值
     */
    overflowCount?: number;
    /**
     * 动态控制是否显示
     */
    visibleOn?: SchemaExpression;
    /**
     * 是否显示动画
     */
    animation?: boolean;
    /**
     * 角标的自定义样式
     */
    style?: {
        [propName: string]: any;
    };
    /**
     * 提示类型
     */
    level?: 'info' | 'warning' | 'success' | 'danger' | SchemaExpression;
}
interface BadgeControlState {
    checked: boolean;
}
interface BadgeForm extends Partial<Pick<BadgeControlProps, 'mode' | 'text' | 'size' | 'position' | 'overflowCount' | 'visibleOn' | 'animation' | 'style' | 'level'>> {
    offset: {
        x: number;
        y: number;
    };
}
export default class BadgeControl extends React.Component<BadgeControlProps, BadgeControlState> {
    static defaultProps: {
        mode: string;
        overflowCount: number;
        position: string;
        level: string;
        animation: boolean;
    };
    constructor(props: BadgeControlProps);
    componentDidUpdate(prevProps: BadgeControlProps): void;
    transformBadgeValue(): BadgeForm;
    normalizeBadgeValue(form: BadgeForm): {
        style: import("lodash").Dictionary<any>;
        offset: number[];
        text?: string | number | undefined;
        size?: any;
        level?: string | undefined;
        visibleOn?: string | undefined;
        mode?: "text" | "dot" | "ribbon" | undefined;
        animation?: boolean | undefined;
        position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | undefined;
        overflowCount?: number | undefined;
    } | {
        style?: {
            [propName: string]: any;
        } | undefined;
        offset: number[];
        text?: string | number | undefined;
        size?: any;
        level?: string | undefined;
        visibleOn?: string | undefined;
        mode?: "text" | "dot" | "ribbon" | undefined;
        animation?: boolean | undefined;
        position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | undefined;
        overflowCount?: number | undefined;
    } | {
        style: import("lodash").Dictionary<any>;
        offset: {
            x: number;
            y: number;
        };
        text?: string | number | undefined;
        size?: any;
        level?: string | undefined;
        visibleOn?: string | undefined;
        mode?: "text" | "dot" | "ribbon" | undefined;
        animation?: boolean | undefined;
        position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | undefined;
        overflowCount?: number | undefined;
    } | {
        style?: {
            [propName: string]: any;
        } | undefined;
        offset: {
            x: number;
            y: number;
        };
        text?: string | number | undefined;
        size?: any;
        level?: string | undefined;
        visibleOn?: string | undefined;
        mode?: "text" | "dot" | "ribbon" | undefined;
        animation?: boolean | undefined;
        position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | undefined;
        overflowCount?: number | undefined;
    };
    handleSwitchChange(checked: boolean): void;
    handleSubmit(form: BadgeForm, action: any): void;
    renderBody(): JSX.Element;
    render(): JSX.Element;
}
export declare class BadgeControlRenderer extends BadgeControl {
}
export {};
