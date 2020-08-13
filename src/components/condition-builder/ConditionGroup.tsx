import React from 'react';
import {Fields, ConditionGroupValue} from './types';
import {ClassNamesFn} from '../../theme';
import Button from '../Button';
import {ConditionItem} from './ConditionItem';
import {autobind, guid} from '../../utils/helper';

export interface ConditionGroupProps {
  value?: ConditionGroupValue;
  fields: Fields;
  onChange: (value: ConditionGroupValue) => void;
  classnames: ClassNamesFn;
  removeable?: boolean;
}

export class ConditionGroup extends React.Component<ConditionGroupProps> {
  getValue() {
    return {
      conjunction: 'and' as 'and',
      ...this.props.value
    } as ConditionGroupValue;
  }

  @autobind
  handleNotClick() {
    const onChange = this.props.onChange;
    let value = this.getValue();
    value.not = !value.not;

    onChange(value);
  }

  @autobind
  handleConjunctionClick() {
    const onChange = this.props.onChange;
    let value = this.getValue();
    value.conjunction = value.conjunction === 'and' ? 'or' : 'and';
    onChange(value);
  }

  @autobind
  handleAdd() {
    const onChange = this.props.onChange;
    let value = this.getValue();

    value.children = Array.isArray(value.children)
      ? value.children.concat()
      : [];

    value.children.push({
      id: guid()
    });
    onChange(value);
  }

  @autobind
  handleAddGroup() {
    const onChange = this.props.onChange;
    let value = this.getValue();

    value.children = Array.isArray(value.children)
      ? value.children.concat()
      : [];

    value.children.push({
      id: guid(),
      conjunction: 'and'
    });
    onChange(value);
  }

  render() {
    const {classnames: cx, value, fields, onChange} = this.props;

    return (
      <div className={cx('CBGroup')}>
        <div className={cx('CBGroup-toolbar')}>
          <div className={cx('CBGroup-toolbarLeft')}>
            <Button onClick={this.handleNotClick} size="sm" active={value?.not}>
              取反
            </Button>
            <Button
              size="sm"
              onClick={this.handleConjunctionClick}
              active={value?.conjunction !== 'or'}
            >
              并且
            </Button>
            <Button
              size="sm"
              onClick={this.handleConjunctionClick}
              active={value?.conjunction === 'or'}
            >
              或者
            </Button>
          </div>
          <div className={cx('CBGroup-toolbarRight')}>
            <Button onClick={this.handleAdd} size="sm">
              添加条件
            </Button>
            <Button onClick={this.handleAddGroup} size="sm">
              添加条件组
            </Button>
          </div>
        </div>

        {Array.isArray(value?.children)
          ? value!.children.map(item =>
              (item as ConditionGroupValue).conjunction ? (
                <ConditionGroup
                  key={item.id}
                  fields={fields}
                  value={item as ConditionGroupValue}
                  classnames={cx}
                  onChange={onChange}
                />
              ) : (
                <ConditionItem
                  key={item.id}
                  fields={fields}
                  value={item}
                  classnames={cx}
                  onChange={onChange}
                />
              )
            )
          : null}
      </div>
    );
  }
}
