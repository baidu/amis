import {Config} from './config';
import {Fields, ConditionGroupValue, Funcs, ConditionValue} from './types';
import {ThemeProps, themeable} from '../../theme';
import React from 'react';
import {Icon} from '../icons';
import {autobind} from '../../utils/helper';
import ConditionGroup from './Group';
import ConditionItem from './Item';
import {FormulaPickerProps} from '../formula/Picker';

export interface CBGroupOrItemProps extends ThemeProps {
  builderMode?: 'simple' | 'full';
  config: Config;
  value?: ConditionGroupValue;
  fields: Fields;
  funcs?: Funcs;
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
}

export class CBGroupOrItem extends React.Component<CBGroupOrItemProps> {
  @autobind
  handleItemChange(value: any) {
    this.props.onChange(value, this.props.index);
  }

  @autobind
  handleItemRemove() {
    this.props.onRemove?.(this.props.index);
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
      popOverContainer
    } = this.props;

    return (
      <div
        className={cx(
          `CBGroupOrItem${builderMode === 'simple' ? '-simple' : ''}`
        )}
        data-id={value?.id}
      >
        <div className={cx('CBGroupOrItem-body')}>
          {draggable ? (
            <a
              draggable
              onDragStart={onDragStart}
              className={cx('CBGroupOrItem-dragbar')}
            >
              <Icon icon="drag-bar" className="icon" />
            </a>
          ) : null}

          {value?.conjunction ? (
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
            />
          ) : (
            <>
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
              />
              <a className={cx('CBDelete')} onClick={this.handleItemRemove}>
                <Icon icon="close" className="icon" />
              </a>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default themeable(CBGroupOrItem);
