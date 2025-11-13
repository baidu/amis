import React from 'react';
import {findDomCompat as findDOMNode} from 'amis-core';
import {
  ConditionBuilderFields,
  ConditionBuilderFuncs,
  ConditionFieldFunc,
  ConditionBuilderField,
  FieldSimple,
  CustomField
} from './types';
import {
  ThemeProps,
  themeable,
  autobind,
  localeable,
  LocaleProps,
  findTree,
  noop,
  getVariable
} from 'amis-core';
import {Icon} from '../icons';

import Expression from './Expression';
import {ConditionBuilderConfig, OperationMap} from './config';
import PopOverContainer from '../PopOverContainer';
import GroupedSelection from '../GroupedSelection';
import ResultBox from '../ResultBox';

import {FormulaPickerProps} from '../formula/Picker';
import type {
  PlainObject,
  AMISConditionRule,
  AMISOperatorType,
  AMISExpressionFunc,
  AMISExpressionField,
  AMISExpressionComplex,
  TestIdBuilder
} from 'amis-core';

const option2value = (item: any) => item.value;

export interface ConditionItemProps extends ThemeProps, LocaleProps {
  config: ConditionBuilderConfig;
  fields: ConditionBuilderFields;
  funcs?: ConditionBuilderFuncs;
  index?: number;
  value: AMISConditionRule;
  data?: any;
  disabled?: boolean;
  searchable?: boolean;
  onChange: (value: AMISConditionRule, index?: number) => void;
  fieldClassName?: string;
  formula?: FormulaPickerProps;
  popOverContainer?: any;
  renderEtrValue?: any;
  selectMode?: 'list' | 'tree' | 'chained';
  testIdBuilder?: TestIdBuilder;
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
    const {fields, config} = this.props;
    // 获取默认Op
    const field: any = findTree(fields, (f: any) => f.name === leftValue.field);
    const value = {
      ...this.props.value,
      left: leftValue,
      op:
        field?.defaultOp ??
        (Array.isArray(field?.operators) && field.operators.length === 1
          ? field.operators[0].value || field.operators[0]
          : undefined) ??
        config.types[field?.type]?.defaultOp ??
        undefined,
      right: field?.defaultValue ?? undefined
    };
    const onChange = this.props.onChange;

    onChange(value, this.props.index);
  }

  @autobind
  handleOperatorChange(op: AMISOperatorType) {
    const {fields, value, index, onChange, formula} = this.props;
    const useFormulaInput =
      formula?.mode === 'input-group' && formula?.inputSettings;
    const leftFieldSchema: FieldSimple = findTree(
      fields,
      (i: FieldSimple) => i.name === (value?.left as AMISExpressionField)?.field
    ) as FieldSimple;
    const result = {
      ...value,
      op: op,
      /** 使用公式编辑器模式时，因为不同条件下值格式不一致（比如select类型下包含和等于对应的multiple会变化），所以变化条件时需要清空right值 */
      right: useFormulaInput
        ? leftFieldSchema?.defaultValue
        : value.right ?? leftFieldSchema?.defaultValue
    };

    onChange(result, index);
  }

  @autobind
  handleRightChange(rightValue: any) {
    const value = {...this.props.value, right: rightValue};
    const onChange = this.props.onChange;

    onChange(value, this.props.index);
  }

  handleRightSubChange(index: number | string, rightValue: any) {
    let origin;
    if (typeof index === 'string') {
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
      popOverContainer,
      selectMode,
      testIdBuilder
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
        selectMode={selectMode}
        testIdBuilder={testIdBuilder?.getChild('left')}
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
      popOverContainer,
      testIdBuilder,
      mobileUI
    } = this.props;
    const left = value?.left;
    let operators: any[] = [];

    if ((left as AMISExpressionFunc)?.type === 'func') {
      const func: ConditionFieldFunc = findTree(
        funcs!,
        (i: ConditionFieldFunc) => i.type === (left as AMISExpressionFunc).func
      ) as ConditionFieldFunc;

      if (func) {
        operators = config.types[func.returnType]?.operators;
      }
    } else if ((left as AMISExpressionField)?.type === 'field') {
      const field: FieldSimple = findTree(
        fields,
        (i: FieldSimple) => i.name === (left as AMISExpressionField).field
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
          mobileUI={mobileUI}
          disabled={!!(value?.op && operators.length < 2)}
          popOverContainer={popOverContainer || (() => findDOMNode(this))}
          popOverRender={({onClose}) => (
            <GroupedSelection
              onClick={onClose}
              option2value={option2value}
              onChange={this.handleOperatorChange}
              options={options}
              value={value.op}
              multiple={false}
              testIdBuilder={testIdBuilder?.getChild('operator-group')}
            />
          )}
        >
          {({onClick, isOpened, ref, disabled: popOverDisabled}) => (
            <div className={cx('CBGroup-operator')}>
              <ResultBox
                className={cx(
                  'CBGroup-operatorInput',
                  isOpened ? 'is-active' : ''
                )}
                ref={ref}
                allowInput={false}
                result={
                  options.find(option => option.value === value.op)?.label ||
                  __(OperationMap[value?.op as keyof typeof OperationMap])
                }
                onResultChange={noop}
                onResultClick={onClick}
                disabled={disabled}
                placeholder={__('Condition.cond_placeholder')}
                mobileUI={mobileUI}
                testIdBuilder={testIdBuilder?.getChild('operator-resbox')}
              >
                {!mobileUI ? (
                  <span className={cx('CBGroup-operatorCaret')}>
                    <Icon icon="right-arrow-bold" className="icon" />
                  </span>
                ) : null}
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

    if ((left as AMISExpressionFunc)?.type === 'func') {
      const func: ConditionFieldFunc = findTree(
        funcs!,
        (i: ConditionFieldFunc) => i.type === (left as AMISExpressionFunc).func
      ) as ConditionFieldFunc;

      if (func) {
        leftType = func.returnType;
      }
    } else if ((left as AMISExpressionField)?.type === 'field') {
      const field: FieldSimple = findTree(
        fields,
        (i: FieldSimple) => i.name === (left as AMISExpressionField).field
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

  renderRightWidgets(type: string, op: AMISOperatorType) {
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
      renderEtrValue,
      testIdBuilder
    } = this.props;
    let field = {
      ...config.types[type],
      type
    } as FieldSimple;

    let option;

    if ((value?.left as AMISExpressionField)?.type === 'field') {
      const leftField: FieldSimple = findTree(
        fields,
        (i: FieldSimple) =>
          i.name === (value?.left as AMISExpressionField).field
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
            key={`${field.name}-0`}
            config={config}
            funcs={funcs}
            valueField={field}
            value={(value.right as Array<AMISExpressionComplex>)?.[0]}
            data={data}
            onChange={this.handleRightSubChange.bind(this, 0)}
            fields={fields}
            allowedTypes={
              field?.valueTypes ||
              config.valueTypes || ['value', 'field', 'func']
            }
            disabled={disabled}
            formula={formula}
            popOverContainer={popOverContainer}
            renderEtrValue={renderEtrValue}
            testIdBuilder={testIdBuilder?.getChild(
              `right-${op}-${field.name}-exp-0`
            )}
          />

          <span className={cx('CBSeprator')}>~</span>

          <Expression
            key={`${field.name}-1`}
            config={config}
            funcs={funcs}
            valueField={field}
            value={(value.right as Array<AMISExpressionComplex>)?.[1]}
            data={data}
            onChange={this.handleRightSubChange.bind(this, 1)}
            fields={fields}
            allowedTypes={
              field?.valueTypes ||
              config.valueTypes || ['value', 'field', 'func']
            }
            disabled={disabled}
            formula={formula}
            popOverContainer={popOverContainer}
            renderEtrValue={renderEtrValue}
            testIdBuilder={testIdBuilder?.getChild(
              `right-${op}-${field.name}-exp-1`
            )}
          />
        </>
      );
    } else if (option && typeof option !== 'string' && option.values) {
      return option.values.map((schema, i) => {
        return (
          <span key={i}>
            <Expression
              key={`${field.name}-${i}`}
              config={config}
              op={op}
              funcs={funcs}
              valueField={{...field, value: schema} as CustomField}
              value={getVariable(value.right as any, schema.name)}
              data={data}
              onChange={this.handleRightSubChange.bind(this, schema.name)}
              fields={fields}
              allowedTypes={
                field?.valueTypes ||
                config.valueTypes || ['value', 'field', 'func']
              }
              disabled={disabled}
              formula={formula}
              popOverContainer={popOverContainer}
              renderEtrValue={renderEtrValue}
              testIdBuilder={testIdBuilder?.getChild(
                `right-${op}-${field.name}-exp-${i}`
              )}
            />
          </span>
        );
      });
    }
    return (
      <Expression
        key={`${field.name}-0`}
        config={config}
        op={op}
        funcs={funcs}
        valueField={field}
        value={value.right}
        data={data}
        onChange={this.handleRightChange}
        fields={fields}
        allowedTypes={
          field?.valueTypes || config.valueTypes || ['value', 'field', 'func']
        }
        disabled={disabled}
        formula={formula}
        popOverContainer={popOverContainer}
        renderEtrValue={renderEtrValue}
        testIdBuilder={testIdBuilder?.getChild(`right-${op}-${field.name}-exp`)}
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
