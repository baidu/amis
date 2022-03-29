import React from 'react';
import {Fields, ConditionGroupValue, Funcs} from './types';
import {ThemeProps, themeable} from '../../theme';
import Button from '../Button';
import GroupOrItem from './GroupOrItem';
import {autobind, guid} from '../../utils/helper';
import {Config} from './config';
import {Icon} from '../icons';
import {localeable, LocaleProps} from '../../locale';
import {FormulaPickerProps} from '../formula/Picker';
import Select from '../Select';

export interface ConditionGroupProps extends ThemeProps, LocaleProps {
  builderMode?: 'simple' | 'full';
  config: Config;
  value?: ConditionGroupValue;
  fields: Fields;
  funcs?: Funcs;
  showNot?: boolean;
  showANDOR?: boolean;
  data?: any;
  disabled?: boolean;
  searchable?: boolean;
  onChange: (value: ConditionGroupValue) => void;
  removeable?: boolean;
  onRemove?: (e: React.MouseEvent) => void;
  onDragStart?: (e: React.MouseEvent) => void;
  fieldClassName?: string;
  formula?: FormulaPickerProps;
  popOverContainer?: any;
  renderEtrValue?: any;
}

export class ConditionGroup extends React.Component<ConditionGroupProps> {
  getValue() {
    return {
      id: guid(),
      conjunction: 'and',
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
  handleConjunctionChange(val: {value: 'or' | 'and'}) {
    const onChange = this.props.onChange;
    let value = this.getValue();
    value.conjunction = val.value;
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
      builderMode,
      classnames: cx,
      fieldClassName,
      value,
      data,
      fields,
      funcs,
      config,
      removeable,
      onRemove,
      onDragStart,
      showNot,
      showANDOR = false,
      disabled,
      searchable,
      translate: __,
      formula,
      popOverContainer,
      renderEtrValue
    } = this.props;
    return (
      <div className={cx('CBGroup')} data-group-id={value?.id}>
        {builderMode === 'simple' && showANDOR === false ? null : (
          <div className={cx('CBGroup-toolbarCondition')}>
            {showNot ? (
              <Button
                onClick={this.handleNotClick}
                className="m-r-xs"
                size="xs"
                active={value?.not}
                disabled={disabled}
              >
                {__('Condition.not')}
              </Button>
            ) : null}
            <Select
              options={[
                {
                  label: __('Condition.and'),
                  value: 'and'
                },
                {
                  label: __('Condition.or'),
                  value: 'or'
                }
              ]}
              value={value?.conjunction || 'and'}
              disabled={disabled}
              onChange={this.handleConjunctionChange}
              clearable={false}
            />
          </div>
        )}
        <div className={cx('CBGroup-body')}>
          {Array.isArray(value?.children) && value!.children.length ? (
            value!.children.map((item, index) => (
              <GroupOrItem
                draggable={value!.children!.length > 1}
                onDragStart={onDragStart}
                config={config}
                key={item.id}
                fields={fields}
                fieldClassName={fieldClassName}
                value={item as ConditionGroupValue}
                index={index}
                onChange={this.handleItemChange}
                funcs={funcs}
                onRemove={this.handleItemRemove}
                data={data}
                disabled={disabled}
                searchable={searchable}
                builderMode={builderMode}
                formula={formula}
                popOverContainer={popOverContainer}
                renderEtrValue={renderEtrValue}
              />
            ))
          ) : (
            <div
              className={cx(
                `CBGroup-placeholder ${
                  builderMode === 'simple' ? 'simple' : ''
                }`
              )}
            >
              {__('Condition.blank')}
            </div>
          )}
        </div>
        <div className={cx('CBGroup-toolbar')}>
          <div
            className={cx(
              `CBGroup-toolbarConditionAdd${
                builderMode === 'simple' ? '-simple' : ''
              }`
            )}
          >
            <div className={cx('ButtonGroup')}>
              <Button
                level="link"
                onClick={this.handleAdd}
                size="xs"
                disabled={disabled}
              >
                {__('Condition.add_cond')}
              </Button>
              {builderMode === 'simple' ? null : (
                <Button
                  onClick={this.handleAddGroup}
                  size="xs"
                  disabled={disabled}
                  level="link"
                >
                  {__('Condition.add_cond_group')}
                </Button>
              )}
            </div>
          </div>
          {removeable ? (
            <a className={cx('CBDelete')} onClick={onRemove}>
              删除组
            </a>
          ) : null}
        </div>
      </div>
    );
  }
}

export default themeable(localeable(ConditionGroup));
