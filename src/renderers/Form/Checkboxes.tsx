import React from 'react';
import {OptionsControl, OptionsControlProps, Option} from './Options';
import cx from 'classnames';
import Checkbox from '../../components/Checkbox';
import chunk = require('lodash/chunk');

export interface CheckboxesProps extends OptionsControlProps {
  placeholder?: any;
  itemClassName?: string;
  columnsCount?: number;
  labelClassName?: string;
}

export default class CheckboxesControl extends React.Component<
  CheckboxesProps,
  any
> {
  static defaultProps: Partial<CheckboxesProps> = {
    columnsCount: 1,
    multiple: true,
    placeholder: '暂无选项'
  };

  componentDidMount() {
    const {defaultCheckAll, onToggleAll} = this.props;

    defaultCheckAll && onToggleAll();
  }

  componentDidUpdate(prevProps: OptionsControlProps) {
    let {options: currOptions, onToggleAll, defaultCheckAll} = this.props;
    let {options: prevOptions} = prevProps;

    if (defaultCheckAll && prevOptions != currOptions) {
      onToggleAll();
    }
  }

  reload() {
    const reload = this.props.reloadOptions;
    reload && reload();
  }

  renderGroup(option: Option, index: number) {
    const {classnames: cx} = this.props;

    return (
      <div
        key={index}
        className={cx('CheckboxesControl-group', option.className)}
      >
        <label
          className={cx('CheckboxesControl-groupLabel', option.labelClassName)}
        >
          {option.label}
        </label>

        {option.children && option.children.length
          ? option.children.map((option, index) =>
              this.renderItem(option, index)
            )
          : null}
      </div>
    );
  }

  renderItem(option: Option, index: number) {
    if (option.children) {
      return this.renderGroup(option, index);
    }

    const {
      itemClassName,
      onToggle,
      selectedOptions,
      disabled,
      inline,
      labelClassName
    } = this.props;

    return (
      <Checkbox
        className={itemClassName}
        key={index}
        onChange={() => onToggle(option)}
        checked={!!~selectedOptions.indexOf(option)}
        disabled={disabled || option.disabled}
        inline={inline}
        labelClassName={labelClassName}
      >
        {option.label}
      </Checkbox>
    );
  }

  render() {
    const {
      className,
      disabled,
      placeholder,
      options,
      inline,
      columnsCount,
      selectedOptions,
      onToggle,
      onToggleAll,
      checkAll,
      classnames: cx,
      itemClassName,
      labelClassName
    } = this.props;

    let body: Array<React.ReactNode> = [];

    if (options && options.length) {
      body = options.map((option, key) => this.renderItem(option, key));
    }

    if (checkAll && body.length) {
      body.unshift(
        <Checkbox
          key="checkall"
          className={itemClassName}
          onChange={onToggleAll}
          checked={!!selectedOptions.length}
          partial={
            !!(
              selectedOptions.length &&
              selectedOptions.length !== options.length
            )
          }
          disabled={disabled}
          inline={inline}
          labelClassName={labelClassName}
        >
          全选/不选
        </Checkbox>
      );
    }

    if (!inline && (columnsCount as number) > 1) {
      let weight = 12 / (columnsCount as number);
      let cellClassName = `Grid-col--sm${
        weight === Math.round(weight) ? weight : ''
      }`;
      body = chunk(body, columnsCount).map((group, groupIndex) => (
        <div className={cx('Grid')} key={groupIndex}>
          {Array.from({length: columnsCount as number}).map((_, index) => (
            <div key={index} className={cx(cellClassName)}>
              {group[index]}
            </div>
          ))}
        </div>
      ));
    }

    return (
      <div className={cx(`CheckboxesControl`, className)}>
        {body && body.length ? (
          body
        ) : (
          <span className={`Form-placeholder`}>{placeholder}</span>
        )}
      </div>
    );
  }
}

@OptionsControl({
  type: 'checkboxes',
  sizeMutable: false
})
export class CheckboxesControlRenderer extends CheckboxesControl {}
