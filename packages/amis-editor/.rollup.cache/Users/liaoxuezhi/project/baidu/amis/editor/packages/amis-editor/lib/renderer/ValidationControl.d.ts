/**
 * @file 表单项校验配置
 */
import React from 'react';
import { ValidatorData } from './ValidationItem';
import type { FormControlProps } from 'amis-core';
import { Validator, ValidatorTag } from '../validator';
export declare type ValidatorFilter = string[] | ((ctx: any) => string[]);
export interface ValidationControlProps extends FormControlProps {
    /**
     * 匹配验证器标签进行默认和顶部可选的验证器展示
     */
    tag: ValidatorTag | ((ctx: any) => ValidatorTag);
}
interface ValidationControlState {
    avaliableValids: {
        moreValidators: Record<string, Validator>;
        defaultValidators: Record<string, Validator>;
        builtInValidators: Record<string, Validator>;
    };
}
export default class ValidationControl extends React.Component<ValidationControlProps, ValidationControlState> {
    constructor(props: ValidationControlProps);
    componentWillReceiveProps(nextProps: ValidationControlProps): void;
    getAvaliableValids(props: ValidationControlProps): {
        defaultValidators: Record<string, Validator>;
        moreValidators: Record<string, Validator>;
        builtInValidators: Record<string, Validator>;
    };
    transformValid(data: any): ValidatorData[];
    /**
     * 统一更新校验相关字段
     */
    updateValidation(validators: ValidatorData[]): void;
    /**
     * 添加规则
     *
     * @param {Validator} valid 校验规则配置
     */
    handleAddValidator(valid: Validator): void;
    /**
     * 更新校验规则
     */
    handleEditRule(data: ValidatorData): void;
    /**
     * 删除校验规则
     */
    handleRemoveRule(valid: string): void;
    /**
     * 开关默认规则
     */
    handleSwitchRule(checked: boolean, data: ValidatorData): void;
    /**
     * 添加规则下拉框
     */
    renderDropdown(): JSX.Element;
    /**
     * 规则列表
     */
    renderValidaton(): JSX.Element;
    render(): JSX.Element;
}
export declare class ValidationControlRenderer extends ValidationControl {
}
export {};
