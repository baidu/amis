import React from 'react';

import {BaseSelection, BaseSelectionProps} from './Selection';
import {themeable} from '../theme';
import {uncontrollable} from 'uncontrollable';
import Checkbox from './Checkbox';
import {Option} from './Select';
import {resolveVariable} from '../utils/tpl-builtin';
import {localeable} from '../locale';
import {CloseIcon} from './icons';

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

  removeable: boolean;

  onRemove?: (option: Option) => void;
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
    ) => <span>{resolveVariable(column.name, option)}</span>,
    removeable: false
  };

  getColumns() {
    let columns = this.props.columns;

    if (!Array.isArray(columns) || !columns.length) {
      columns = [{label: 'Label', name: 'label'}];
    }
    return columns;
  }

  // 关闭表格最后一项
  handleCloseItem(option: Option) {
    const {onRemove} = this.props;
    onRemove && onRemove(option);
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
      itemClassName,
      removeable
    } = this.props;
    const columns = this.getColumns();
    let valueArray = BaseSelection.value2array(value, options, option2value);

    return (
      <tbody>
        {Array.isArray(options) && options.length ? (
          options.map((option, rowIndex) => {
            const checked = valueArray.indexOf(option) !== -1;

            if (removeable && !checked) {
              return null;
            }

            return (
              <tr
                key={rowIndex}
                onClick={e => {
                  // 是关闭面板时，点击不触发关闭
                  if (removeable) {
                    return;
                  }
                  e.defaultPrevented;
                  this.toggleOption(option);
                }}
                className={cx(
                  itemClassName,
                  option.className,
                  disabled || option.disabled ? 'is-disabled' : '',
                  !!~valueArray.indexOf(option) && !removeable
                    ? 'is-active'
                    : ''
                )}
              >
                {multiple ? (
                  <td className={cx('Table-checkCell')} key="checkbox">
                    <Checkbox size="sm" checked={checked} disabled={disabled} />
                  </td>
                ) : null}
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={cx(removeable ? 'Table-close' : '')}
                  >
                    {cellRender(column, option, colIndex, rowIndex)}
                    {removeable && colIndex === columns.length - 1 ? (
                      <span
                        className={cx('Table-close-btn')}
                        onClick={(e: React.SyntheticEvent<HTMLElement>) => {
                          e.stopPropagation();
                          this.handleCloseItem(option);
                        }}
                      >
                        <CloseIcon />
                      </span>
                    ) : null}
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
    const {className, classnames: cx} = this.props;

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
