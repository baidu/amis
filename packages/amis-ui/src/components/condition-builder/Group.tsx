import React from 'react';
import {
  ConditionBuilderFields,
  ConditionGroupValue,
  ConditionBuilderFuncs
} from './types';
import {
  ThemeProps,
  themeable,
  autobind,
  utils,
  localeable,
  LocaleProps,
  guid
} from 'amis-core';
import Button from '../Button';
import GroupOrItem from './GroupOrItem';
import {ConditionBuilderConfig} from './config';
import {FormulaPickerProps} from '../formula/Picker';
import Select from '../Select';

import {DownArrowBoldIcon} from '../icons';

interface ConditionGroupState {
  isCollapsed: boolean;
}

export interface ConditionGroupProps extends ThemeProps, LocaleProps {
  builderMode?: 'simple' | 'full';
  config: ConditionBuilderConfig;
  value?: ConditionGroupValue;
  fields: ConditionBuilderFields;
  funcs?: ConditionBuilderFuncs;
  showNot?: boolean;
  showANDOR?: boolean;
  data?: any;
  disabled?: boolean;
  searchable?: boolean;
  onChange: (value: ConditionGroupValue) => void;
  removeable?: boolean;
  onRemove?: (e: React.MouseEvent) => void;
  draggable?: boolean;
  onDragStart?: (e: React.MouseEvent) => void;
  fieldClassName?: string;
  formula?: FormulaPickerProps;
  popOverContainer?: any;
  renderEtrValue?: any;
  selectMode?: 'list' | 'tree';
}

export class ConditionGroup extends React.Component<
  ConditionGroupProps,
  ConditionGroupState
> {
  constructor(props: ConditionGroupProps) {
    super(props);

    this.state = {
      isCollapsed: false
    };
  }

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

  @autobind
  toggleCollapse() {
    this.setState(state => {
      return {
        isCollapsed: !state.isCollapsed
      };
    });
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
      selectMode,
      renderEtrValue,
      draggable
    } = this.props;
    const {isCollapsed} = this.state;

    const body =
      Array.isArray(value?.children) && value!.children.length
        ? isCollapsed
          ? value!.children.slice(0, 1)
          : value!.children
        : null;

    return (
      <div className={cx('CBGroup')} data-group-id={value?.id}>
        {builderMode === 'simple' && showANDOR === false ? null : (
          <div
            className={cx('CBGroup-toolbarCondition')}
            draggable={draggable}
            onDragStart={onDragStart}
          >
            {Array.isArray(value?.children) && value!.children.length > 1 ? (
              <div
                className={cx('CBGroup-toolbarCondition-arrow', {
                  'is-collapse': isCollapsed
                })}
                onClick={this.toggleCollapse}
              >
                <DownArrowBoldIcon />
              </div>
            ) : null}
            {showNot ? (
              <Button
                onClick={this.handleNotClick}
                className="m-b-sm z-10"
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
        <div className={cx('CBGroup-body-wrapper')}>
          <div className={cx('CBGroup-body')}>
            {body ? (
              body.map((item, index) => (
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
                  selectMode={selectMode}
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
            {isCollapsed ? (
              <div className={cx('CBGroup-body-collapse')}>
                <span onClick={this.toggleCollapse}>
                  {__('Condition.collapse')} <DownArrowBoldIcon />
                </span>
              </div>
            ) : null}
          </div>

          {isCollapsed ? null : (
            <div
              className={cx('CBGroup-toolbar')}
              draggable={draggable}
              onDragStart={onDragStart}
            >
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
                  {removeable ? (
                    <Button
                      onClick={onRemove}
                      size="xs"
                      disabled={disabled}
                      level="link"
                    >
                      {__('Condition.delete_cond_group')}
                    </Button>
                  ) : null}
                </div>
              </div>
              {/* {removeable ? (
              <a className={cx('CBDelete')} onClick={onRemove}>
                {__('Condition.delete_cond_group')}
              </a>
            ) : null} */}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default themeable(localeable(ConditionGroup));
