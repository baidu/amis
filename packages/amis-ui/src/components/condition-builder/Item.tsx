import React from 'react';
import {findDOMNode} from 'react-dom';
import {
  ConditionBuilderFields,
  ConditionRule,
  ConditionBuilderFuncs,
  ExpressionFunc,
  ConditionFieldFunc,
  ConditionBuilderField,
  FieldSimple,
  ExpressionField,
  OperatorType,
  ExpressionComplex
} from './types';
import {
  ThemeProps,
  themeable,
  autobind,
  localeable,
  LocaleProps,
  findTree,
  noop
} from 'amis-core';
import {Icon} from '../icons';

import Expression from './Expression';
import {ConditionBuilderConfig, OperationMap} from './config';
import PopOverContainer from '../PopOverContainer';
import GroupedSelection from '../GroupedSelection';
import ResultBox from '../ResultBox';

import {FormulaPickerProps} from '../formula/Picker';
import type {PlainObject} from 'amis-core';

const option2value = (item: any) => item.value;

export interface ConditionItemProps extends ThemeProps, LocaleProps {
  config: ConditionBuilderConfig;
  fields: ConditionBuilderFields;
  funcs?: ConditionBuilderFuncs;
  index?: number;
  value: ConditionRule;
  data?: any;
  disabled?: boolean;
  searchable?: boolean;
  onChange: (value: ConditionRule, index?: number) => void;
  fieldClassName?: string;
  formula?: FormulaPickerProps;
  popOverContainer?: any;
  renderEtrValue?: any;
}

export class ConditionItem extends React.Component<ConditionItemProps> {
  @autobind
  handleLeftFieldSelect(field: any) {
    const value = {...this.props.value};
    const onChange = this.props.onChange;
    value.left = field;
    onChange(value, this.props.index);
  }

  @autobind
  handleLeftInputTypeChange(type: 'func' | 'field') {
    const value = {...this.props.value};
    const onChange = this.props.onChange;

    if (type === 'func') {
      value.left = {type: 'func'};
    } else {
      value.left = '';
    }

    onChange(value, this.props.index);
  }

  @autobind
  handleLeftChange(leftValue: any) {
    const value = {
      ...this.props.value,
      left: leftValue,
      op: undefined,
      right: undefined
    };
    const onChange = this.props.onChange;

    onChange(value, this.props.index);
  }

  @autobind
  handleOperatorChange(op: OperatorType) {
    const value = {...this.props.value, op: op, right: undefined};
    this.props.onChange(value, this.props.index);
  }

  @autobind
  handleRightChange(rightValue: any) {
    const value = {...this.props.value, right: rightValue};
    const onChange = this.props.onChange;

    onChange(value, this.props.index);
  }

  handleRightSubChange(
    isCustom: boolean,
    index: number | string,
    rightValue: any
  ) {
    let origin;
    if (isCustom) {
      origin = Object.assign({}, this.props.value?.right) as PlainObject;
      origin[index] = rightValue;
    } else {
      origin = Array.isArray(this.props.value?.right)
        ? this.props.value.right.concat()
        : [];
      origin[index as number] = rightValue;
    }

    const value = {...this.props.value, right: origin};
    const onChange = this.props.onChange;

    onChange(value, this.props.index);
  }

  renderLeft() {
    const {
      value,
      fields,
      funcs,
      config,
      disabled,
      fieldClassName,
      searchable,
      popOverContainer
    } = this.props;
    return (
      <Expression
        config={config}
        funcs={funcs}
        value={value.left}
        fieldClassName={fieldClassName}
        onChange={this.handleLeftChange}
        fields={fields}
        disabled={disabled}
        searchable={searchable}
        popOverContainer={popOverContainer}
        allowedTypes={
          ['field', 'func'].filter(
            type => type === 'field' || type === 'func'
          ) as any
        }
      />
    );
  }

  renderOperator() {
    const {
      funcs,
      config,
      fields,
      value,
      classnames: cx,
      disabled,
      popOverContainer
    } = this.props;
    const left = value?.left;
    let operators: any[] = [];

    if ((left as ExpressionFunc)?.type === 'func') {
      const func: ConditionFieldFunc = findTree(
        funcs!,
        (i: ConditionFieldFunc) => i.type === (left as ExpressionFunc).func
      ) as ConditionFieldFunc;

      if (func) {
        operators = config.types[func.returnType]?.operators;
      }
    } else if ((left as ExpressionField)?.type === 'field') {
      const field: FieldSimple = findTree(
        fields,
        (i: FieldSimple) => i.name === (left as ExpressionField).field
      ) as FieldSimple;

      if (field) {
        operators = field.operators || config.types[field.type]?.operators;
      }
    }

    if (Array.isArray(operators) && operators.length) {
      const __ = this.props.translate;
      const options = operators.map(operator => {
        if (typeof operator === 'string') {
          return {
            label: __(OperationMap[operator as keyof typeof OperationMap]),
            value: operator
          };
        } else {
          return operator;
        }
      });
      return (
        <PopOverContainer
          popOverContainer={popOverContainer || (() => findDOMNode(this))}
          popOverRender={({onClose}) => (
            <GroupedSelection
              onClick={onClose}
              option2value={option2value}
              onChange={this.handleOperatorChange}
              options={options}
              value={value.op}
              multiple={false}
            />
          )}
        >
          {({onClick, isOpened, ref}) => (
            <div className={cx('CBGroup-operator')}>
              <ResultBox
                className={cx(
                  'CBGroup-operatorInput',
                  isOpened ? 'is-active' : ''
                )}
                ref={ref}
                allowInput={false}
                result={
                  __(OperationMap[value?.op as keyof typeof OperationMap]) ||
                  options.find(option => option.value === value.op)?.label
                }
                onResultChange={noop}
                onResultClick={onClick}
                disabled={disabled}
                placeholder={__('Condition.cond_placeholder')}
              >
                <span className={cx('CBGroup-operatorCaret')}>
                  <Icon icon="caret" className="icon" />
                </span>
              </ResultBox>
            </div>
          )}
        </PopOverContainer>
      );
    }

    return null;
  }

  renderRight() {
    const {value, funcs, fields} = this.props;

    if (!value?.op) {
      return null;
    }

    const left = value?.left;
    let leftType = '';

    if ((left as ExpressionFunc)?.type === 'func') {
      const func: ConditionFieldFunc = findTree(
        funcs!,
        (i: ConditionFieldFunc) => i.type === (left as ExpressionFunc).func
      ) as ConditionFieldFunc;

      if (func) {
        leftType = func.returnType;
      }
    } else if ((left as ExpressionField)?.type === 'field') {
      const field: FieldSimple = findTree(
        fields,
        (i: FieldSimple) => i.name === (left as ExpressionField).field
      ) as FieldSimple;

      if (field) {
        leftType = field.type;
      }
    }

    if (leftType) {
      return this.renderRightWidgets(leftType, value.op!);
    }

    return null;
  }

  renderRightWidgets(type: string, op: OperatorType) {
    const {
      funcs,
      value,
      data,
      fields,
      config,
      classnames: cx,
      disabled,
      formula,
      popOverContainer,
      renderEtrValue
    } = this.props;
    let field = {
      ...config.types[type],
      type
    } as FieldSimple;

    let option;

    if ((value?.left as ExpressionField)?.type === 'field') {
      const leftField: FieldSimple = findTree(
        fields,
        (i: FieldSimple) => i.name === (value?.left as ExpressionField).field
      ) as FieldSimple;

      if (leftField) {
        field = {
          ...field,
          ...leftField
        };
        option = field.operators?.find(
          option => typeof option !== 'string' && option?.value === op
        );
      }
    }

    if (op === 'is_empty' || op === 'is_not_empty') {
      return null;
    } else if (op === 'between' || op === 'not_between') {
      return (
        <>
          <Expression
            config={config}
            funcs={funcs}
            valueField={field}
            value={(value.right as Array<ExpressionComplex>)?.[0]}
            data={data}
            onChange={this.handleRightSubChange.bind(this, false, 0)}
            fields={fields}
            allowedTypes={
              field?.valueTypes ||
              config.valueTypes || ['value', 'field', 'func', 'formula']
            }
            disabled={disabled}
            formula={formula}
            popOverContainer={popOverContainer}
            renderEtrValue={renderEtrValue}
          />

          <span className={cx('CBSeprator')}>~</span>

          <Expression
            config={config}
            funcs={funcs}
            valueField={field}
            value={(value.right as Array<ExpressionComplex>)?.[1]}
            data={data}
            onChange={this.handleRightSubChange.bind(this, false, 1)}
            fields={fields}
            allowedTypes={
              field?.valueTypes ||
              config.valueTypes || ['value', 'field', 'func', 'formula']
            }
            disabled={disabled}
            formula={formula}
            popOverContainer={popOverContainer}
            renderEtrValue={renderEtrValue}
          />
        </>
      );
    } else if (option && typeof option !== 'string' && option.values) {
      return option.values.map((schema, i) => {
        return (
          <span key={i}>
            <Expression
              config={config}
              op={op}
              funcs={funcs}
              valueField={schema}
              value={value.right}
              data={data}
              onChange={this.handleRightSubChange.bind(this, true, schema.name)}
              fields={fields}
              allowedTypes={
                field?.valueTypes ||
                config.valueTypes || ['value', 'field', 'func', 'formula']
              }
              disabled={disabled}
              formula={formula}
              popOverContainer={popOverContainer}
              renderEtrValue={renderEtrValue}
            />
          </span>
        );
      });
    }
    return (
      <Expression
        config={config}
        op={op}
        funcs={funcs}
        valueField={field}
        value={value.right}
        data={data}
        onChange={this.handleRightChange}
        fields={fields}
        allowedTypes={
          field?.valueTypes ||
          config.valueTypes || ['value', 'field', 'func', 'formula']
        }
        disabled={disabled}
        formula={formula}
        popOverContainer={popOverContainer}
        renderEtrValue={renderEtrValue}
      />
    );
  }

  render() {
    const {classnames: cx} = this.props;

    return (
      <div className={cx('CBItem')}>
        {this.renderLeft()}
        {this.renderOperator()}
        {this.renderRight()}
      </div>
    );
  }
}

export default themeable(localeable(ConditionItem));
