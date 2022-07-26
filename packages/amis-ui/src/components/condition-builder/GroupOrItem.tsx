import {ConditionBuilderConfig} from './config';
import {
  ConditionBuilderFields,
  ConditionGroupValue,
  ConditionBuilderFuncs,
  ConditionValue
} from './types';
import {ThemeProps, themeable, autobind} from 'amis-core';
import React from 'react';
import {Icon} from '../icons';
import ConditionGroup from './Group';
import ConditionItem from './Item';
import {FormulaPickerProps} from '../formula/Picker';
import Button from '../Button';

export interface CBGroupOrItemProps extends ThemeProps {
  builderMode?: 'simple' | 'full';
  config: ConditionBuilderConfig;
  value?: ConditionGroupValue;
  fields: ConditionBuilderFields;
  funcs?: ConditionBuilderFuncs;
  index: number;
  data?: any;
  draggable?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  onChange: (value: ConditionGroupValue, index: number) => void;
  removeable?: boolean;
  onDragStart?: (e: React.MouseEvent) => void;
  onRemove?: (index: number) => void;
  fieldClassName?: string;
  formula?: FormulaPickerProps;
  popOverContainer?: any;
  renderEtrValue?: any;
}

export class CBGroupOrItem extends React.Component<CBGroupOrItemProps> {
  state = {
    hover: false
  };
  @autobind
  handleItemChange(value: any) {
    this.props.onChange(value, this.props.index);
  }

  @autobind
  handleItemRemove() {
    this.props.onRemove?.(this.props.index);
  }

  @autobind
  handlerHoverIn(e: any) {
    e.stopPropagation();
    this.setState({
      hover: true
    });
  }

  @autobind
  handlerHoverOut(e: any) {
    this.setState({
      hover: false
    });
  }

  render() {
    const {
      builderMode,
      classnames: cx,
      fieldClassName,
      value,
      config,
      fields,
      funcs,
      draggable,
      data,
      disabled,
      searchable,
      onDragStart,
      formula,
      popOverContainer,
      renderEtrValue
    } = this.props;

    return (
      <div
        className={cx(
          `CBGroupOrItem${builderMode === 'simple' ? '-simple' : ''}`
        )}
        data-id={value?.id}
      >
        <div className={cx('CBGroupOrItem-body')}>
          {value?.conjunction ? (
            <div
              className={cx(
                'CBGroupOrItem-body-group',
                this.state.hover && 'CBGroupOrItem-body-group--hover'
              )}
              onMouseOver={this.handlerHoverIn}
              onMouseOut={this.handlerHoverOut}
            >
              {draggable ? (
                <a
                  draggable
                  onDragStart={onDragStart}
                  className={cx('CBGroupOrItem-dragbar')}
                >
                  <Icon icon="drag-bar" className="icon" />
                </a>
              ) : null}
              <ConditionGroup
                disabled={disabled}
                searchable={searchable}
                onDragStart={onDragStart}
                config={config}
                fields={fields}
                value={value as ConditionGroupValue}
                onChange={this.handleItemChange}
                fieldClassName={fieldClassName}
                funcs={funcs}
                removeable
                onRemove={this.handleItemRemove}
                data={data}
                renderEtrValue={renderEtrValue}
              />
            </div>
          ) : (
            <div className={cx('CBGroupOrItem-body-item')}>
              {draggable ? (
                <a
                  draggable
                  onDragStart={onDragStart}
                  className={cx('CBGroupOrItem-dragbar')}
                >
                  <Icon icon="drag-bar" className="icon" />
                </a>
              ) : null}
              <ConditionItem
                disabled={disabled}
                searchable={searchable}
                config={config}
                fields={fields}
                value={value as ConditionValue}
                onChange={this.handleItemChange}
                fieldClassName={fieldClassName}
                funcs={funcs}
                data={data}
                formula={formula}
                popOverContainer={popOverContainer}
                renderEtrValue={renderEtrValue}
              />
              <Button
                className={cx('CBDelete')}
                onClick={this.handleItemRemove}
              >
                <Icon icon="remove" className="icon" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default themeable(CBGroupOrItem);
