import React from 'react';
import {Fields, ConditionGroupValue} from './types';
import {ClassNamesFn} from '../../theme';
import Button from '../Button';
import {ConditionItem} from './ConditionItem';
import {autobind} from '../../utils/helper';

export interface ConditionGroupProps {
  value?: ConditionGroupValue;
  fields: Fields;
  onChange: (value: ConditionGroupValue) => void;
  classnames: ClassNamesFn;
}

export class ConditionGroup extends React.Component<ConditionGroupProps> {
  @autobind
  handleNotClick() {}

  render() {
    const {classnames: cx, value, fields} = this.props;

    return (
      <div className={cx('CBCGroup')}>
        <div className={cx('CBCGroup-toolbar')}>
          <div className={cx('CBCGroup-toolbarLeft')}>
            <Button onClick={this.handleNotClick} size="sm" active={value?.not}>
              取反
            </Button>
            <Button size="sm" active={value?.conjunction !== 'or'}>
              并且
            </Button>
            <Button size="sm" active={value?.conjunction === 'or'}>
              或者
            </Button>
          </div>
          <div className={cx('CBCGroup-toolbarRight')}>
            <Button size="sm">添加条件</Button>
            <Button size="sm">添加条件组</Button>
          </div>
        </div>

        {Array.isArray(value)
          ? value.map(item => <ConditionItem fields={fields} value={item} />)
          : null}
      </div>
    );
  }
}
