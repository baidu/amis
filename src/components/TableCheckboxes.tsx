import {Checkboxes, CheckboxesProps} from './Checkboxes';
import {themeable} from '../theme';
import React from 'react';
import uncontrollable from 'uncontrollable';
import Checkbox from './Checkbox';
import {Option} from './Select';
import {resolveVariable} from '../utils/tpl-builtin';

export interface TableCheckboxesProps extends CheckboxesProps {
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
    option: Option
  ) => JSX.Element;
}

export class TableCheckboxes extends Checkboxes<TableCheckboxesProps> {
  static defaultProps = {
    ...Checkboxes.defaultProps,
    cellRender: (
      column: {
        name: string;
        label: string;
        [propName: string]: any;
      },
      option: Option
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
    const {options, classnames: cx, value, option2value} = this.props;
    let columns = this.getColumns();
    let valueArray = Checkboxes.value2array(value, options, option2value);
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
          {Array.isArray(options) && options.length ? (
            <th className={cx('Table-checkCell')}>
              <Checkbox
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
      option2value
    } = this.props;
    const columns = this.getColumns();
    let valueArray = Checkboxes.value2array(value, options, option2value);

    return (
      <tbody>
        {Array.isArray(options) && options.length ? (
          options.map((option, rowIndex) => {
            const checked = valueArray.indexOf(option) !== -1;

            return (
              <tr key={rowIndex} onClick={() => this.toggleOption(option)}>
                <td className={cx('Table-checkCell')}>
                  <Checkbox checked={checked} />
                </td>
                {columns.map((column, colIndex) => (
                  <td key={colIndex}>{cellRender(column, option)}</td>
                ))}
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={columns.length}>{placeholder}</td>
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
      itemRender
    } = this.props;

    let valueArray = Checkboxes.value2array(value, options, option2value);
    let body: Array<React.ReactNode> = [];

    if (Array.isArray(options) && options.length) {
      body = options.map((option, key) => (
        <div
          key={key}
          className={cx(
            'TableCheckboxes-item',
            itemClassName,
            option.className,
            disabled || option.disabled ? 'is-disabled' : ''
          )}
          onClick={() => this.toggleOption(option)}
        >
          <div className={cx('TableCheckboxes-itemLabel')}>
            {itemRender(option)}
          </div>

          <Checkbox
            checked={!!~valueArray.indexOf(option)}
            disabled={disabled || option.disabled}
            labelClassName={labelClassName}
            description={option.description}
          />
        </div>
      ));
    }

    return (
      <div className={cx('TableCheckboxes', className)}>
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
  uncontrollable(TableCheckboxes, {
    value: 'onChange'
  })
);
