import React from 'react';
import {Fields, ConditionGroupValue, Funcs} from './types';
import {ThemeProps, themeable} from '../../theme';
import Button from '../Button';
import GroupOrItem from './GroupOrItem';
import {autobind, guid} from '../../utils/helper';
import {Config} from './config';
import {Icon} from '../icons';

export interface ConditionGroupProps extends ThemeProps {
  config: Config;
  value?: ConditionGroupValue;
  fields: Fields;
  funcs?: Funcs;
  showNot?: boolean;
  data?: any;
  onChange: (value: ConditionGroupValue) => void;
  removeable?: boolean;
  onRemove?: (e: React.MouseEvent) => void;
  onDragStart?: (e: React.MouseEvent) => void;
}

export class ConditionGroup extends React.Component<ConditionGroupProps> {
  getValue() {
    return {
      id: guid(),
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
      conjunction: 'and',
      children: [
        {
          id: guid()
        }
      ]
    });
    onChange(value);
  }

  @autobind
  handleItemChange(item: any, index: number) {
    const onChange = this.props.onChange;
    let value = this.getValue();

    value.children = Array.isArray(value.children)
      ? value.children.concat()
      : [];

    value.children.splice(index!, 1, item);
    onChange(value);
  }

  @autobind
  handleItemRemove(index: number) {
    const onChange = this.props.onChange;
    let value = this.getValue();

    value.children = Array.isArray(value.children)
      ? value.children.concat()
      : [];

    value.children.splice(index, 1);
    onChange(value);
  }

  render() {
    const {
      classnames: cx,
      value,
      data,
      fields,
      funcs,
      config,
      removeable,
      onRemove,
      onDragStart,
      showNot
    } = this.props;

    return (
      <div className={cx('CBGroup')} data-group-id={value?.id}>
        <div className={cx('CBGroup-toolbar')}>
          <div className={cx('CBGroup-toolbarCondition')}>
            {showNot ? (
              <Button
                onClick={this.handleNotClick}
                className="m-r-xs"
                size="xs"
                active={value?.not}
                level={value?.not ? 'info' : 'default'}
              >
                非
              </Button>
            ) : null}
            <div className={cx('ButtonGroup')}>
              <Button
                size="xs"
                onClick={this.handleConjunctionClick}
                active={value?.conjunction !== 'or'}
                level={value?.conjunction !== 'or' ? 'info' : 'default'}
              >
                并且
              </Button>
              <Button
                size="xs"
                onClick={this.handleConjunctionClick}
                active={value?.conjunction === 'or'}
                level={value?.conjunction === 'or' ? 'info' : 'default'}
              >
                或者
              </Button>
            </div>
          </div>
          <div className={cx('CBGroup-toolbarConditionAdd')}>
            <div className={cx('ButtonGroup')}>
              <Button onClick={this.handleAdd} size="xs">
                <Icon icon="plus" className="icon" />
                添加条件
              </Button>
              <Button onClick={this.handleAddGroup} size="xs">
                <Icon icon="plus-cicle" className="icon" />
                添加条件组
              </Button>
            </div>
          </div>
          {removeable ? (
            <a className={cx('CBDelete')} onClick={onRemove}>
              <Icon icon="close" className="icon" />
            </a>
          ) : null}
        </div>

        <div className={cx('CBGroup-body')}>
          {Array.isArray(value?.children) && value!.children.length ? (
            value!.children.map((item, index) => (
              <GroupOrItem
                draggable={value!.children!.length > 1}
                onDragStart={onDragStart}
                config={config}
                key={item.id}
                fields={fields}
                value={item as ConditionGroupValue}
                index={index}
                onChange={this.handleItemChange}
                funcs={funcs}
                onRemove={this.handleItemRemove}
                data={data}
              />
            ))
          ) : (
            <div className={cx('CBGroup-placeholder')}>空</div>
          )}
        </div>
      </div>
    );
  }
}

export default themeable(ConditionGroup);
