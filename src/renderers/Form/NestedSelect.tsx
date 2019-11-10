import React from 'react';
import xorBy = require('lodash/xorBy');
import unionBy = require('lodash/unionBy');
import Overlay from '../../components/Overlay';
import Checkbox from '../../components/Checkbox';
import PopOver from '../../components/PopOver';
import {RootCloseWrapper} from 'react-overlays';
import {Icon} from '../../components/icons';
import {autobind, flattenTree, isEmpty} from '../../utils/helper';
import {dataMapping} from '../../utils/tpl-builtin';

import {OptionsControl, OptionsControlProps, Option} from '../Form/Options';

export interface NestedSelectProps extends OptionsControlProps {
  cascade?: boolean;
  withChildren?: boolean;
}

export interface NestedSelectState {
  isOpened?: boolean;
}

export default class NestedSelectControl extends React.Component<
  NestedSelectProps,
  NestedSelectState
> {
  static defaultProps: Partial<NestedSelectProps> = {
    cascade: false,
    withChildren: false
  };
  target: any;
  alteredOptions: any;
  state = {
    isOpened: false
  };

  @autobind
  domRef(ref: any) {
    this.target = ref;
  }

  @autobind
  open() {
    if (!this.props.disabled) {
      this.setState({
        isOpened: true
      });
    }
  }

  @autobind
  close() {
    this.setState({
      isOpened: false
    });
  }

  renderValue() {
    const {multiple, classnames: cx, selectedOptions, labelField} = this.props;
    const len = Array.isArray(selectedOptions) ? selectedOptions.length : 0;
    return (
      <div className={cx('NestedSelect-valueWrap')} onClick={this.open}>
        {len > 0 ? (
          <div className={cx('NestedSelect-value')}>
            {multiple
              ? `已选择 ${len} 项`
              : selectedOptions[0][labelField || 'label']}
          </div>
        ) : null}
      </div>
    );
  }

  renderClear() {
    const {clearable, value, disabled, classnames: cx} = this.props;

    return clearable &&
      !disabled &&
      (Array.isArray(value) ? value.length : value) ? (
      <a onClick={this.clearValue} className={cx('NestedSelect-clear')}>
        <Icon icon="close" className="icon" />
      </a>
    ) : null;
  }

  @autobind
  clearValue() {
    const {onChange, resetValue} = this.props;

    onChange(typeof resetValue === 'undefined' ? '' : resetValue);
  }

  handleOptionClick(option: Option, e: React.MouseEvent<HTMLElement>) {
    const {
      multiple,
      onChange,
      joinValues,
      extractValue,
      valueField,
      autoFill,
      onBulkChange
    } = this.props;

    e.stopPropagation();

    const sendTo =
      !multiple &&
      autoFill &&
      !isEmpty(autoFill) &&
      dataMapping(autoFill, option);
    sendTo && onBulkChange(sendTo);

    onChange(
      joinValues
        ? option[valueField || 'value']
        : extractValue
        ? option[valueField || 'value']
        : option
    );
    !multiple && this.close();
  }

  handleCheck(option: any | Array<any>) {
    const {
      onChange,
      selectedOptions,
      joinValues,
      valueField,
      delimiter,
      extractValue,
      withChildren,
      cascade
    } = this.props;

    const items = selectedOptions.concat();
    let newValue;

    // 三种情况：
    // 1.全选，option为数组
    // 2.单个选中，且有children
    // 3.单个选中，没有children

    if (Array.isArray(option)) {
      option = withChildren ? flattenTree(option) : option;
      newValue = items.length === option.length ? [] : option;
    } else if (Array.isArray(option.children)) {
      if (cascade) {
        newValue = xorBy(items, [option], valueField || 'value');
      } else if (withChildren) {
        option = flattenTree([option]);
        const fn = option.every((opt: any) => !!~items.indexOf(opt))
          ? xorBy
          : unionBy;
        newValue = fn(items, option, valueField || 'value');
      } else {
        newValue = items.filter(item => !~flattenTree([option]).indexOf(item));
        !~items.indexOf(option) && newValue.push(option);
      }
    } else {
      newValue = xorBy(items, [option], valueField || 'value');
    }

    if (joinValues) {
      newValue = newValue
        .map((item: any) => item[valueField || 'value'])
        .join(delimiter || ',');
    } else if (extractValue) {
      newValue = newValue.map((item: any) => item[valueField || 'value']);
    }

    onChange(newValue);
  }

  allChecked(options: Array<any>): boolean {
    return options.every((option: any) => {
      if (option.children) {
        return this.allChecked(option.children);
      }
      return this.props.selectedOptions.some(
        selectedOption => selectedOption.value == option.value
      );
    });
  }

  partialChecked(options: Array<any>): boolean {
    return options.some((option: any) => {
      if (option.children) {
        return this.partialChecked(option.children);
      }
      return this.props.selectedOptions.some(
        selectedOption => selectedOption.value == option.value
      );
    });
  }

  reload() {
    const reload = this.props.reloadOptions;
    reload && reload();
  }

  renderOptions(
    newOptions: Array<any>,
    isChildren: boolean,
    uncheckable: boolean
  ): any {
    const {
      multiple,
      selectedOptions,
      classnames: cx,
      value,
      options,
      disabled,
      cascade
    } = this.props;

    if (multiple) {
      let partialChecked = this.partialChecked(options);
      let allChecked = this.allChecked(options);

      return (
        <div className={cx({'NestedSelect-childrenOuter': isChildren})}>
          {!isChildren ? (
            <div className={cx('NestedSelect-option', 'checkall')}>
              <Checkbox
                onChange={this.handleCheck.bind(this, options)}
                checked={partialChecked}
                partial={partialChecked && !allChecked}
              >
                全选
              </Checkbox>
            </div>
          ) : null}
          {newOptions.map((option, idx) => {
            const checked = selectedOptions.some(o => o.value == option.value);
            const selfChecked = !!uncheckable || checked;
            let nodeDisabled = !!uncheckable || !!disabled;

            return (
              <div className={cx('NestedSelect-option')} key={idx}>
                <Checkbox
                  onChange={this.handleCheck.bind(this, option)}
                  trueValue={option.value}
                  checked={selfChecked}
                  disabled={nodeDisabled}
                >
                  {option.label}
                </Checkbox>
                {option.children ? (
                  <div className={cx('NestedSelect-optionArrowRight')}>
                    <Icon icon="right-arrow" className="icon" />
                  </div>
                ) : null}
                {option.children && option.children.length
                  ? this.renderOptions(
                      option.children,
                      true,
                      cascade ? false : uncheckable || (multiple && checked)
                    )
                  : null}
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className={cx({'NestedSelect-childrenOuter': isChildren})}>
        {newOptions.map((option, idx) => (
          <div
            key={idx}
            className={cx('NestedSelect-option', {
              'is-active': value && value === option.value
            })}
            onClick={this.handleOptionClick.bind(this, option)}
          >
            <span>{option.label}</span>
            {option.children ? (
              <div className={cx('NestedSelect-optionArrowRight')}>
                <Icon icon="right-arrow" className="icon" />
              </div>
            ) : null}
            {option.children && option.children.length
              ? this.renderOptions(option.children, true, false)
              : null}
          </div>
        ))}
      </div>
    );
  }

  renderOuter() {
    const {popOverContainer, options, classnames: cx} = this.props;

    let body = (
      <RootCloseWrapper
        disabled={!this.state.isOpened}
        onRootClose={this.close}
      >
        <div
          className={cx('NestedSelect-menuOuter')}
          style={{minWidth: this.target.offsetWidth}}
        >
          {this.renderOptions(options, false, false)}
        </div>
      </RootCloseWrapper>
    );

    if (popOverContainer) {
      return (
        <Overlay container={popOverContainer} target={() => this.target} show>
          <PopOver
            className={cx('NestedSelect-popover')}
            style={{minWidth: this.target.offsetWidth}}
          >
            {body}
          </PopOver>
        </Overlay>
      );
    }
    return body;
  }

  render() {
    const {
      className,
      disabled,
      placeholder,
      selectedOptions,
      classnames: cx
    } = this.props;

    return (
      <div className={cx('NestedSelectControl')}>
        <div
          className={cx(
            'NestedSelect',
            {
              'is-opened': this.state.isOpened,
              'is-disabled': disabled
            },
            className
          )}
          onClick={this.open}
          ref={this.domRef}
        >
          {!(selectedOptions && selectedOptions.length > 0) ? (
            <div className={cx('NestedSelect-placeholder')}>{placeholder}</div>
          ) : null}

          {this.renderValue()}
          {this.renderClear()}

          <span className={cx('Select-arrow')} />
        </div>

        {this.state.isOpened ? this.renderOuter() : null}
      </div>
    );
  }
}

@OptionsControl({
  type: 'nested-select'
})
export class NestedSelectControlRenderer extends NestedSelectControl {}
