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
  ExpressionField
} from './types';
import {ClassNamesFn} from '../../theme';
import {Icon} from '../icons';
import {autobind, findTree, noop} from '../../utils/helper';
import Expression from './Expression';
import {Config, OperationMap} from './config';
import PopOverContainer from '../PopOverContainer';
import ListRadios from '../ListRadios';
import ResultBox from '../ResultBox';

const option2value = (item: any) => item.value;

export interface ConditionItemProps {
  config: Config;
  fields: Fields;
  funcs?: Funcs;
  index?: number;
  value: ConditionRule;
  classnames: ClassNamesFn;
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
    const value = {...this.props.value, left: leftValue};
    const onChange = this.props.onChange;

    onChange(value, this.props.index);
  }

  @autobind
  handleOperatorChange() {}

  renderLeft() {
    const {value, fields, funcs} = this.props;

    return (
      <Expression
        funcs={funcs}
        value={value.left}
        onChange={this.handleLeftChange}
        fields={fields}
        defaultType="field"
        allowedTypes={['field', 'func']}
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
        (i: Func) => i.type === (left as ExpressionFunc).type
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
        operators = field.operators || config.types[field.type].operators;
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

  renderItem() {
    return null;
  }

  render() {
    const {classnames: cx} = this.props;

    return (
      <div className={cx('CBItem')}>
        <a className={cx('CBItem-dragbar')}>
          <Icon icon="drag-bar" className="icon" />
        </a>

        <div className={cx('CBItem-itemBody')}>
          {this.renderLeft()}
          {this.renderOperator()}
          {this.renderItem()}
        </div>
      </div>
    );
  }
}
