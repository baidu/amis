import React from 'react';
import {Fields, ConditionRule, ConditionGroupValue, Funcs} from './types';
import {ClassNamesFn} from '../../theme';
import {Icon} from '../icons';
import Select from '../Select';
import {autobind} from '../../utils/helper';
import PopOverContainer from '../PopOverContainer';
import InputBox from '../InputBox';
import ListRadios from '../ListRadios';
import ResultBox from '../ResultBox';
import ConditionField from './Field';
import InputSwitch from './InputSwitch';

export interface ConditionItemProps {
  fields: Fields;
  funcs?: Funcs;
  index?: number;
  value: ConditionRule;
  classnames: ClassNamesFn;
  onChange: (value: ConditionRule, index?: number) => void;
}

const leftInputOptions = [
  {
    label: '字段',
    value: 'field'
  },
  {
    label: '函数',
    value: 'func'
  }
];

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

  renderLeft() {
    const {value, fields, classnames: cx, funcs} = this.props;
    const inputType =
      value.left && (value.left as any).type === 'func' ? 'func' : 'field';

    return (
      <>
        {Array.isArray(funcs) ? (
          <InputSwitch
            classnames={cx}
            onChange={this.handleLeftInputTypeChange}
            options={leftInputOptions}
            value={inputType}
          />
        ) : null}

        {inputType === 'field' ? (
          <ConditionField
            classnames={cx}
            options={fields}
            value={value.left}
            onChange={this.handleLeftFieldSelect}
          />
        ) : null}
      </>
    );
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
          {this.renderItem()}
        </div>
      </div>
    );
  }
}
