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

const option2value = (item: any) => item.value;

export interface ConditionItemProps extends ThemeProps {
  config: Config;
  fields: Fields;
  funcs?: Funcs;
  index?: number;
  value: ConditionRule;
  onChange: (value: ConditionRule, index?: number) => void;
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
    const {value, fields, funcs, config} = this.props;

    return (
      <Expression
        funcs={funcs}
        value={value.left}
        onChange={this.handleLeftChange}
        fields={fields}
        defaultType="field"
        allowedTypes={(config.valueTypes || ['field', 'func']).filter(
          type => type === 'field' || type === 'func'
        )}
      />
    );
  }

  renderOperator() {
    const {funcs, config, fields, value, classnames: cx} = this.props;
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
      return (
        <PopOverContainer
          popOverRender={({onClose}) => (
            <ListRadios
              onClick={onClose}
              option2value={option2value}
              onChange={this.handleOperatorChange}
              options={operators.map(operator => ({
                label: OperationMap[operator as keyof typeof OperationMap],
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
                result={OperationMap[value?.op as keyof typeof OperationMap]}
                onResultChange={noop}
                onResultClick={onClick}
                placeholder="请选择操作"
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
    const {funcs, value, fields, config, classnames: cx} = this.props;
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
            funcs={funcs}
            valueField={field}
            value={(value.right as Array<ExpressionComplex>)?.[0]}
            onChange={this.handleRightSubChange.bind(this, 0)}
            fields={fields}
            defaultType="value"
            allowedTypes={
              field?.valueTypes ||
              config.valueTypes || ['value', 'field', 'func', 'raw']
            }
          />

          <span className={cx('CBSeprator')}>~</span>

          <Expression
            funcs={funcs}
            valueField={field}
            value={(value.right as Array<ExpressionComplex>)?.[1]}
            onChange={this.handleRightSubChange.bind(this, 1)}
            fields={fields}
            defaultType="value"
            allowedTypes={
              field?.valueTypes ||
              config.valueTypes || ['value', 'field', 'func', 'raw']
            }
          />
        </>
      );
    }

    return (
      <Expression
        op={op}
        funcs={funcs}
        valueField={field}
        value={value.right}
        onChange={this.handleRightChange}
        fields={fields}
        defaultType="value"
        allowedTypes={
          field?.valueTypes ||
          config.valueTypes || ['value', 'field', 'func', 'raw']
        }
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

export default themeable(ConditionItem);
