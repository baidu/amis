import {BaseSelection, BaseSelectionProps} from './Selection';
import {themeable} from '../theme';
import React from 'react';
import {uncontrollable} from 'uncontrollable';
import Checkbox from './Checkbox';
import {Option} from './Select';
import {resolveVariable} from '../utils/tpl-builtin';
import {localeable} from '../locale';

export interface TableSelectionProps extends BaseSelectionProps {
  columns: Array<{
    name: string;
    label: string;
    [propName: string]: any;
  }>;
  cellRender: (
    column: {
      name: string;
      label: string;
      [propName: string]: any;
    },
    option: Option,
    colIndex: number,
    rowIndex: number
  ) => JSX.Element;
}

export class TableSelection extends BaseSelection<TableSelectionProps> {
  static defaultProps = {
    ...BaseSelection.defaultProps,
    cellRender: (
      column: {
        name: string;
        label: string;
        [propName: string]: any;
      },
      option: Option,
      colIndex: number,
      rowIndex: number
    ) => <span>{resolveVariable(column.name, option)}</span>
  };

  getColumns() {
    let columns = this.props.columns;

    if (!Array.isArray(columns) || !columns.length) {
      columns = [{label: 'Label', name: 'label'}];
    }
    return columns;
  }

  renderTHead() {
    const {
      options,
      classnames: cx,
      value,
      disabled,
      option2value,
      multiple
    } = this.props;
    let columns = this.getColumns();
    let valueArray = BaseSelection.value2array(value, options, option2value);
    const availableOptions = options.filter(option => !option.disabled);
    let partialChecked = false;
    let allChecked = !!availableOptions.length;

    availableOptions.forEach(option => {
      const isIn = !!~valueArray.indexOf(option);

      if (isIn && !partialChecked) {
        partialChecked = true;
      } else if (!isIn && allChecked) {
        allChecked = false;
      }
    });

    return (
      <thead>
        <tr>
          {multiple && Array.isArray(options) && options.length ? (
            <th className={cx('Table-checkCell')}>
              <Checkbox
                key="checkbox"
                size="sm"
                disabled={disabled}
                onChange={this.toggleAll}
                checked={partialChecked}
                partial={partialChecked && !allChecked}
              />
            </th>
          ) : null}
          {columns.map((column, index) => (
            <th key={index}>{column.label}</th>
          ))}
        </tr>
      </thead>
    );
  }

  renderTBody() {
    const {
      options,
      placeholder,
      classnames: cx,
      cellRender,
      value,
      disabled,
      multiple,
      option2value,
      translate: __,
      itemClassName
    } = this.props;
    const columns = this.getColumns();
    let valueArray = BaseSelection.value2array(value, options, option2value);

    return (
      <tbody>
        {Array.isArray(options) && options.length ? (
          options.map((option, rowIndex) => {
            const checked = valueArray.indexOf(option) !== -1;

            return (
              <tr
                key={rowIndex}
                onClick={e => e.defaultPrevented || this.toggleOption(option)}
                className={cx(
                  itemClassName,
                  option.className,
                  disabled || option.disabled ? 'is-disabled' : '',
                  !!~valueArray.indexOf(option) ? 'is-active' : ''
                )}
              >
                {multiple ? (
                  <td className={cx('Table-checkCell')} key="checkbox">
                    <Checkbox size="sm" checked={checked} disabled={disabled} />
                  </td>
                ) : null}
                {columns.map((column, colIndex) => (
                  <td key={colIndex}>
                    {cellRender(column, option, colIndex, rowIndex)}
                  </td>
                ))}
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={columns.length}>{__(placeholder)}</td>
          </tr>
        )}
      </tbody>
    );
  }

  render() {
    const {
      value,
      options,
      className,
      labelClassName,
      disabled,
      classnames: cx,
      option2value,
      itemClassName,
      itemRender,
      multiple
    } = this.props;

    let valueArray = BaseSelection.value2array(value, options, option2value);
    let body: Array<React.ReactNode> = [];

    if (Array.isArray(options) && options.length) {
      body = options.map((option, key) => (
        <div
          key={key}
          className={cx(
            'TableSelection-item',
            itemClassName,
            option.className,
            disabled || option.disabled ? 'is-disabled' : ''
          )}
          onClick={() => this.toggleOption(option)}
        >
          <div className={cx('TableSelection-itemLabel')}>
            {itemRender(option)}
          </div>

          {multiple ? (
            <Checkbox
              size="sm"
              checked={!!~valueArray.indexOf(option)}
              disabled={disabled || option.disabled}
              labelClassName={labelClassName}
              description={option.description}
            />
          ) : null}
        </div>
      ));
    }

    return (
      <div className={cx('TableSelection', className)}>
        <div className={cx('Table-content')}>
          <table className={cx('Table-table')}>
            {this.renderTHead()}
            {this.renderTBody()}
          </table>
        </div>
      </div>
    );
  }
}

export default themeable(
  localeable(
    uncontrollable(TableSelection, {
      value: 'onChange'
    })
  )
);
