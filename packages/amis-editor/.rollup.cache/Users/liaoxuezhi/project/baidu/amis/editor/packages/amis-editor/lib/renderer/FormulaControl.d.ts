/**
 * @file 表达式控件
 */
/// <reference types="lodash" />
import React from 'react';
import type { VariableItem, FuncGroup } from 'amis-ui/lib/components/formula/Editor';
import type { FormControlProps } from 'amis-core';
import type { BaseEventContext } from 'amis-editor-core';
import { EditorManager } from 'amis-editor-core';
export interface FormulaControlProps extends FormControlProps {
    /**
     * evalMode 即直接就是表达式，否则
     * 需要 ${这里面才是表达式}
     * 默认为 true，即默认不会将表达式用 ${} 包裹
     */
    evalMode?: boolean;
    manager?: EditorManager;
    /**
     * 用于提示的变量集合，默认为空
     */
    variables?: Array<VariableItem>;
    /**
     * 变量展现模式，可选值：'tabs' ｜ 'tree'
     */
    variableMode?: 'tabs' | 'tree';
    /**
     * 函数集合，默认不需要传，即  amis-formula 里面那个函数
     * 如果有扩充，则需要传。
     */
    functions: Array<FuncGroup>;
    /**
     * 顶部标题，默认为表达式
     */
    header: string;
    /**
     * 编辑器上下文数据，用于获取字段所在Form的其他字段
     */
    context: BaseEventContext;
    /**
     * simple 简易模式
     * 备注: 为 true 时，仅显示 公式编辑器 icon 按钮
     */
    simple?: boolean;
    /**
     * 自定义渲染器:
     * 备注: 可用于设置指定组件类型编辑默认值
     */
    rendererSchema?: any;
    /**
     * 自定义渲染器 是否需要浅色边框包裹，默认不包裹
     */
    rendererWrapper?: boolean;
    /**
     * 是否需要剔除默认值
     */
    needDeleteValue?: boolean;
    /**
     * 期望的value类型，可用于校验公式运算结果类型是否匹配
     * 备注1: 当前支持识别的类型有 int、boolean、date、object、array、string；
     * 备注2: 开关组件可以设置 true 和 false 对应的值，如果设置了就不是普通的 boolean 类型；
     * 备注3: 默认都是字符串类型；
     */
    valueType?: string;
}
interface FormulaControlState {
    /** 变量数据 */
    variables: any;
    variableMode?: 'tree' | 'tabs';
    evalMode?: boolean;
}
export default class FormulaControl extends React.Component<FormulaControlProps, FormulaControlState> {
    static defaultProps: Partial<FormulaControlProps>;
    isUnmount: boolean;
    constructor(props: FormulaControlProps);
    componentDidUpdate(prevProps: FormulaControlProps): void;
    componentWillUnmount(): void;
    normalizeVariables(variables: any): any[];
    /**
     * 将 ${xx}（非 \${xx}）替换成 \${xx}
     * 备注: 手动编辑时，自动处理掉 ${xx}，避免识别成 公式表达式
     */
    replaceExpression(expression: any): any;
    isLoopExpression(expression: any, selfName: string): boolean;
    isExpectType(value: any): boolean;
    resolveVariablesFromScope(): Promise<any[]>;
    handleConfirm(value: any): void;
    handleSimpleInputChange: import("lodash").DebouncedFunc<(value: any) => void>;
    handleInputChange: (value: any) => void;
    filterCustomRendererProps(rendererSchema: any): any;
    renderFormulaValue(item: any): JSX.Element;
    getContextData(): any;
    render(): JSX.Element;
}
export declare class FormulaControlRenderer extends FormulaControl {
}
export {};
