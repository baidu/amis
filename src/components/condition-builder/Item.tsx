import React from 'react';
import {
  Fields,
  ConditionRule,
  ConditionGroupValue,
  Funcs,
  ExpressionFunc,
  Func,
  Field,
  FieldSimple,
  ExpressionField,
  OperatorType,
  ExpressionComplex
} from './types';
import {ThemeProps, themeable} from '../../theme';
import {Icon} from '../icons';
import {autobind, findTree, noop} from '../../utils/helper';
import Expression from './Expression';
import {Config, OperationMap} from './config';
import PopOverContainer from '../PopOverContainer';
import ListRadios from '../ListRadios';
import ResultBox from '../ResultBox';
import {localeable, LocaleProps} from '../../locale';

const option2value = (item: any) => item.value;

export interface ConditionItemProps extends ThemeProps, LocaleProps {
  config: Config;
  fields: Fields;
  funcs?: Funcs;
  index?: number;
  value: ConditionRule;
  data?: any;
  disabled?: boolean;
  searchable?: boolean;
  onChange: (value: ConditionRule, index?: number) => void;
  fieldClassName?: string;
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

  handleRightSubChange(index: number, rightValue: any) {
    const origin = Array.isArray(this.props.value?.right)
      ? this.props.value.right.concat()
      : [];

    origin[index] = rightValue;
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
      searchable
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
        allowedTypes={
          ['field', 'func'].filter(
            type => type === 'field' || type === 'func'
          ) as any
        }
      />
    );
  }

  renderOperator() {
    const {funcs, config, fields, value, classnames: cx, disabled} = this.props;
    const left = value?.left;
    let operators: Array<string> = [];

    if ((left as ExpressionFunc)?.type === 'func') {
      const func: Func = findTree(
        funcs!,
        (i: Func) => i.type === (left as ExpressionFunc).func
      ) as Func;

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
      return (
        <PopOverContainer
          popOverRender={({onClose}) => (
            <ListRadios
              onClick={onClose}
              option2value={option2value}
              onChange={this.handleOperatorChange}
              options={operators.map(operator => ({
                label: __(OperationMap[operator as keyof typeof OperationMap]),
                value: operator
              }))}
              value={value.op}
              showRadio={false}
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
                result={__(
                  OperationMap[value?.op as keyof typeof OperationMap]
                )}
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
      const func: Func = findTree(
        funcs!,
        (i: Func) => i.type === (left as ExpressionFunc).func
      ) as Func;

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
      disabled
    } = this.props;
    let field = {
      ...config.types[type],
      type
    } as FieldSimple;

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
            onChange={this.handleRightSubChange.bind(this, 0)}
            fields={fields}
            allowedTypes={
              field?.valueTypes ||
              config.valueTypes || ['value', 'field', 'func', 'formula']
            }
            disabled={disabled}
          />

          <span className={cx('CBSeprator')}>~</span>

          <Expression
            config={config}
            funcs={funcs}
            valueField={field}
            value={(value.right as Array<ExpressionComplex>)?.[1]}
            data={data}
            onChange={this.handleRightSubChange.bind(this, 1)}
            fields={fields}
            allowedTypes={
              field?.valueTypes ||
              config.valueTypes || ['value', 'field', 'func', 'formula']
            }
            disabled={disabled}
          />
        </>
      );
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
