import {
  ConditionBuilderField,
  ConditionBuilderFuncs,
  ConditionFieldFunc,
  FieldSimple
} from './types';
import React from 'react';
import ConditionField from './Field';
import {
  autobind,
  utils,
  ThemeProps,
  themeable,
  localeable,
  LocaleProps,
  findTree,
  filterTree
} from 'amis-core';
import Value from './Value';
import InputSwitch from './InputSwitch';
import ConditionFunc from './Func';
import {ConditionBuilderConfig} from './config';
import Formula from './Formula';
import {FormulaPickerProps} from '../formula/Picker';
import type {ExpressionComplex, OperatorType, ExpressionFunc} from 'amis-core';

/**
 * 支持4中表达式设置方式
 *
 * 1. 直接就是值，由用户直接填写。
 * 2. 选择字段，让用户选一个字段。
 * 3. 选择一个函数，然后会参数里面的输入情况是个递归。
 * 4. 粗暴点，函数让用户自己书写。
 */

export interface ExpressionProps extends ThemeProps, LocaleProps {
  value: ExpressionComplex;
  data?: any;
  index?: number;
  onChange: (value: ExpressionComplex, index?: number) => void;
  valueField?: FieldSimple;
  fields?: ConditionBuilderField[];
  funcs?: ConditionBuilderFuncs;
  allowedTypes?: Array<'value' | 'field' | 'func'>;
  op?: OperatorType;
  config: ConditionBuilderConfig;
  disabled?: boolean;
  searchable?: boolean;
  fieldClassName?: string;
  formula?: FormulaPickerProps;
  popOverContainer?: any;
  renderEtrValue?: any;
  selectMode?: 'list' | 'tree' | 'chained';
}

const fieldMap = {
  value: '值',
  field: '字段',
  func: '函数'
};

export class Expression extends React.Component<ExpressionProps> {
  @autobind
  handleInputTypeChange(type: 'value' | 'field' | 'func') {
    let value = this.props.value;
    const onChange = this.props.onChange;

    if (type === 'value') {
      value = '';
    } else if (type === 'func') {
      value = {
        type: 'func',
        func: (
          findTree(
            this.props.funcs!,
            item => (item as ConditionFieldFunc).type
          ) as ConditionFieldFunc
        )?.type,
        args: []
      };
    } else if (type === 'field') {
      value = {
        type: 'field',
        field: ''
      };
    }
    onChange(value, this.props.index);
  }

  @autobind
  handleValueChange(data: any) {
    this.props.onChange(data, this.props.index);
  }

  @autobind
  handleFieldChange(field: string) {
    let value = this.props.value;
    const onChange = this.props.onChange;
    value = {
      type: 'field',
      field
    };
    onChange(value, this.props.index);
  }

  @autobind
  handleFuncChange(func: any) {
    let value = this.props.value;
    const onChange = this.props.onChange;
    value = {
      ...func,
      type: 'func'
    };
    onChange(value, this.props.index);
  }

  render() {
    const {
      value,
      valueField,
      allowedTypes,
      funcs,
      fields,
      op,
      classnames: cx,
      fieldClassName,
      config,
      data,
      disabled,
      searchable,
      formula,
      popOverContainer,
      selectMode,
      renderEtrValue
    } = this.props;
    const inputType =
      ((value as any)?.type === 'field'
        ? 'field'
        : (value as any)?.type === 'func'
        ? 'func'
        : value !== undefined
        ? 'value'
        : undefined) ||
      allowedTypes?.[0] ||
      'value';
    const types = allowedTypes || ['value', 'field', 'func'];

    if ((!Array.isArray(funcs) || !funcs.length) && ~types.indexOf('func')) {
      types.splice(types.indexOf('func'), 1);
    }

    return (
      <>
        {inputType === 'value' ? (
          <Value
            field={valueField!}
            value={value}
            onChange={this.handleValueChange}
            op={op}
            data={data}
            disabled={disabled}
            formula={formula}
            popOverContainer={popOverContainer}
            renderEtrValue={renderEtrValue}
          />
        ) : null}

        {inputType === 'field' ? (
          <ConditionField
            value={(value as any)?.field}
            onChange={this.handleFieldChange}
            fieldClassName={fieldClassName}
            disabled={disabled}
            searchable={searchable}
            popOverContainer={popOverContainer}
            selectMode={selectMode}
            options={
              valueField
                ? filterTree(
                    fields!,
                    item =>
                      (item as any).children ||
                      (item as FieldSimple).type === valueField.type
                  )
                : fields!
            }
          />
        ) : null}

        {inputType === 'func' ? (
          <ConditionFunc
            config={config}
            value={value as ExpressionFunc}
            onChange={this.handleFuncChange}
            fieldClassName={fieldClassName}
            funcs={funcs}
            fields={fields}
            allowedTypes={allowedTypes}
            disabled={disabled}
          />
        ) : null}

        {types.length > 1 ? (
          <InputSwitch
            disabled={disabled}
            value={inputType}
            popOverContainer={popOverContainer}
            onChange={this.handleInputTypeChange}
            options={types.map(item => ({
              label: fieldMap[item],
              value: item
            }))}
          />
        ) : null}
      </>
    );
  }
}

export default themeable(localeable(Expression));
