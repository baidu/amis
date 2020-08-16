import React from 'react';
import {Fields, ConditionGroupValue, Funcs} from './types';
import {ClassNamesFn} from '../../theme';
import Button from '../Button';
import {ConditionItem} from './Item';
import {autobind, guid} from '../../utils/helper';
import {Config} from './config';

export interface ConditionGroupProps {
  config: Config;
  value?: ConditionGroupValue;
  fields: Fields;
  funcs?: Funcs;
  index?: number;
  onChange: (value: ConditionGroupValue, index?: number) => void;
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

    onChange(value, this.props.index);
  }

  @autobind
  handleConjunctionClick() {
    const onChange = this.props.onChange;
    let value = this.getValue();
    value.conjunction = value.conjunction === 'and' ? 'or' : 'and';
    onChange(value, this.props.index);
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
    onChange(value, this.props.index);
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
    onChange(value, this.props.index);
  }

  @autobind
  handleItemChange(item: any, index?: number) {
    const onChange = this.props.onChange;
    let value = this.getValue();

    value.children = Array.isArray(value.children)
      ? value.children.concat()
      : [];

    value.children.splice(index!, 1, item);
    onChange(value, this.props.index);
  }

  render() {
    const {classnames: cx, value, fields, funcs, config} = this.props;

    return (
      <div className={cx('CBGroup')}>
        <div className={cx('CBGroup-toolbar')}>
          <div className={cx('CBGroup-toolbarLeft')}>
            <Button onClick={this.handleNotClick} size="sm" active={value?.not}>
              非
            </Button>
            <div className={cx('ButtonGroup m-l-xs')}>
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
          </div>
          <div className={cx('CBGroup-toolbarRight')}>
            <Button onClick={this.handleAdd} size="sm">
              添加条件
            </Button>
            <Button onClick={this.handleAddGroup} size="sm" className="m-l-xs">
              添加条件组
            </Button>
          </div>
        </div>

        {Array.isArray(value?.children)
          ? value!.children.map((item, index) =>
              (item as ConditionGroupValue).conjunction ? (
                <ConditionGroup
                  config={config}
                  key={item.id}
                  fields={fields}
                  value={item as ConditionGroupValue}
                  classnames={cx}
                  index={index}
                  onChange={this.handleItemChange}
                  funcs={funcs}
                />
              ) : (
                <ConditionItem
                  config={config}
                  key={item.id}
                  fields={fields}
                  value={item}
                  classnames={cx}
                  index={index}
                  onChange={this.handleItemChange}
                  funcs={funcs}
                />
              )
            )
          : null}
      </div>
    );
  }
}
