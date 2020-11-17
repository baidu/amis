import React from 'react';
import xorBy from 'lodash/xorBy';
import unionBy from 'lodash/unionBy';
import Overlay from '../../components/Overlay';
import Checkbox from '../../components/Checkbox';
import PopOver from '../../components/PopOver';
import {RootCloseWrapper} from 'react-overlays';
import {Icon} from '../../components/icons';
import {
  autobind,
  flattenTree,
  isEmpty,
  filterTree,
  string2regExp
} from '../../utils/helper';
import {dataMapping} from '../../utils/tpl-builtin';
import {
  FormOptionsControl,
  OptionsControl,
  OptionsControlProps
} from '../Form/Options';
import {Option, Options} from '../../components/Select';
import Input from '../../components/Input';
import {findDOMNode} from 'react-dom';

/**
 * Nested Select
 * 文档：https://baidu.gitee.io/amis/docs/components/form/nested-select
 */
export interface NestedSelectControlSchema extends FormOptionsControl {
  type: 'nested-select';
}

export interface NestedSelectProps extends OptionsControlProps {
  cascade?: boolean;
  withChildren?: boolean;
}

export interface NestedSelectState {
  isOpened?: boolean;
  isFocused?: boolean;
  inputValue?: string;
  stack: Array<Array<Option>>;
}

export default class NestedSelectControl extends React.Component<
  NestedSelectProps,
  NestedSelectState
> {
  static defaultProps: Partial<NestedSelectProps> = {
    cascade: false,
    withChildren: false,
    searchPromptText: '输入内容进行检索',
    checkAll: true,
    checkAllLabel: '全选'
  };
  target: any;
  input: HTMLInputElement;
  state: NestedSelectState = {
    isOpened: false,
    isFocused: false,
    inputValue: '',
    stack: []
  };

  @autobind
  domRef(ref: any) {
    this.target = ref;
  }

  @autobind
  open() {
    const {options, disabled} = this.props;
    if (!disabled) {
      this.setState({
        isOpened: true,
        stack: [options]
      });
    }
  }

  @autobind
  close() {
    this.setState({
      isOpened: false,
      stack: []
    });
  }

  removeItem(index: number, e?: React.MouseEvent<HTMLElement>) {
    let {
      onChange,
      selectedOptions,
      disabled,
      joinValues,
      valueField,
      extractValue,
      delimiter,
      value
    } = this.props;

    if (disabled) {
      return;
    }

    e && e.stopPropagation();

    selectedOptions.splice(index, 1);

    if (joinValues) {
      value = (selectedOptions as Options)
        .map(item => item[valueField || 'value'])
        .join(delimiter || ',');
    } else if (extractValue) {
      value = (selectedOptions as Options).map(
        item => item[valueField || 'value']
      );
    }

    onChange(value);
  }

  renderValue() {
    const {
      multiple,
      classnames: cx,
      selectedOptions,
      labelField,
      placeholder,
      disabled
    } = this.props;

    if (!(selectedOptions && selectedOptions.length > 0)) {
      return (
        <div className={cx('NestedSelect-placeholder')}>{placeholder}</div>
      );
    }

    return selectedOptions.map((item, index) =>
      multiple ? (
        <div className={cx('Select-value')} key={index}>
          <span
            className={cx('Select-valueIcon', {
              'is-disabled': disabled || item.disabled
            })}
            onClick={this.removeItem.bind(this, index)}
          >
            ×
          </span>
          <span className={cx('Select-valueLabel')}>
            {`${item[labelField || 'label']}`}
          </span>
        </div>
      ) : (
        <div className={cx('Select-value')} key={index}>
          {`${item[labelField || 'label']}`}
        </div>
      )
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

    if (multiple) {
      return;
    }

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

  handleCheck(option: Option | Options, index?: number) {
    const {
      onChange,
      selectedOptions,
      joinValues,
      delimiter,
      extractValue,
      withChildren,
      cascade,
      multiple
    } = this.props;
    const {stack} = this.state;

    let valueField = this.props.valueField || 'value';

    if (
      !Array.isArray(option) &&
      option.children &&
      option.children.length &&
      typeof index === 'number'
    ) {
      const checked = selectedOptions.some(
        o => o[valueField] == (option as Option)[valueField]
      );
      const uncheckable = cascade
        ? false
        : option.uncheckable || (multiple && !checked);
      const children = option.children.map(c => ({...c, uncheckable}));
      if (stack[index]) {
        stack.splice(index + 1, 1, children);
      } else {
        stack.push(children);
      }
    }

    const items = selectedOptions.concat();
    let newValue: Option | Options | string;

    // 三种情况：
    // 1.全选，option为数组
    // 2.单个选中，且有children
    // 3.单个选中，没有children

    if (Array.isArray(option)) {
      option = withChildren ? flattenTree(option) : option;
      newValue = items.length === option.length ? [] : option;
    } else if (Array.isArray(option.children)) {
      if (cascade) {
        newValue = xorBy(items, [option], valueField);
      } else if (withChildren) {
        option = flattenTree([option]);
        const fn = option.every(
          (opt: Option) =>
            !!~items.findIndex(item => item[valueField] === opt[valueField])
        )
          ? xorBy
          : unionBy;
        newValue = fn(items, option as any, valueField);
      } else {
        newValue = items.filter(
          item =>
            !~flattenTree([option], i => (i as Option)[valueField]).indexOf(
              item[valueField]
            )
        );
        !~items.map(item => item[valueField]).indexOf(option[valueField]) &&
          newValue.push(option);
      }
    } else {
      newValue = xorBy(items, [option], valueField);
    }

    if (joinValues) {
      newValue = (newValue as Options)
        .map(item => item[valueField])
        .join(delimiter || ',');
    } else if (extractValue) {
      newValue = (newValue as Options).map(item => item[valueField]);
    }

    onChange(newValue);
  }

  allChecked(options: Options): boolean {
    const {selectedOptions, withChildren, valueField} = this.props;
    return options.every(option => {
      if (withChildren && option.children) {
        return this.allChecked(option.children);
      }
      return selectedOptions.some(
        item => item[valueField || 'value'] == option[valueField || 'value']
      );
    });
  }

  partialChecked(options: Options): boolean {
    const {selectedOptions, withChildren, valueField} = this.props;
    return options.some(option => {
      if (withChildren && option.children) {
        return this.partialChecked(option.children);
      }
      return selectedOptions.some(
        item => item[valueField || 'value'] == option[valueField || 'value']
      );
    });
  }

  reload() {
    const reload = this.props.reloadOptions;
    reload && reload();
  }

  @autobind
  onFocus(e: any) {
    this.props.disabled ||
      this.state.isOpened ||
      this.setState(
        {
          isFocused: true
        },
        this.focus
      );

    this.props.onFocus && this.props.onFocus(e);
  }

  @autobind
  onBlur(e: any) {
    this.setState({
      isFocused: false
    });

    this.props.onBlur && this.props.onBlur(e);
  }

  @autobind
  focus() {
    this.input
      ? this.input.focus()
      : this.getTarget() && this.getTarget().focus();
  }

  @autobind
  blur() {
    this.input
      ? this.input.blur()
      : this.getTarget() && this.getTarget().blur();
  }

  @autobind
  getTarget() {
    if (!this.target) {
      this.target = findDOMNode(this) as HTMLElement;
    }
    return this.target as HTMLElement;
  }

  @autobind
  inputRef(ref: HTMLInputElement) {
    this.input = ref;
  }

  @autobind
  handleInputChange(evt: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = evt.currentTarget.value;
    const {options, labelField, valueField} = this.props;

    const regexp = string2regExp(inputValue);

    let filtedOptions =
      inputValue && this.state.isOpened
        ? filterTree(
            options,
            option =>
              regexp.test(option[labelField || 'label']) ||
              regexp.test(option[valueField || 'value']) ||
              !!(option.children && option.children.length),
            1,
            true
          )
        : options.concat();

    this.setState({
      inputValue,
      stack: [filtedOptions]
    });
  }

  renderOptions() {
    const {
      multiple,
      selectedOptions,
      classnames: cx,
      value,
      options,
      disabled,
      searchable,
      checkAll,
      checkAllLabel,
      searchPromptText,
      translate: __,
      labelField
    } = this.props;
    const valueField = this.props.valueField || 'value';

    const stack = this.state.stack;

    const searchInput = searchable ? (
      <div
        className={cx(`Select-input`, {
          'is-focused': this.state.isFocused
        })}
      >
        <Icon icon="search" className="icon" />
        <Input
          value={this.state.inputValue || ''}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          disabled={disabled!!}
          placeholder={__(searchPromptText)}
          onChange={this.handleInputChange}
          ref={this.inputRef}
        />
      </div>
    ) : null;

    let partialChecked = this.partialChecked(options);
    let allChecked = this.allChecked(options);

    return (
      <>
        {stack.map((options, index) => (
          <div key={index} className={cx('NestedSelect-menu')}>
            {index === 0 ? searchInput : null}
            {multiple && checkAll && index === 0 ? (
              <div
                className={cx('NestedSelect-option', 'checkall')}
                onMouseEnter={this.onMouseEnterAll}
              >
                <Checkbox
                  onChange={this.handleCheck.bind(this, options)}
                  checked={partialChecked}
                  partial={partialChecked && !allChecked}
                >
                  {__(checkAllLabel)}
                </Checkbox>
              </div>
            ) : null}

            {options.map((option: Option, idx: number) => {
              const checked = selectedOptions.some(
                o => o[valueField] == option[valueField]
              );
              const selfChecked = !!option.uncheckable || checked;
              let nodeDisabled = !!option.uncheckable || !!disabled;

              return (
                <div
                  key={idx}
                  className={cx('NestedSelect-option', {
                    'is-active': value && value === option[valueField]
                  })}
                  onClick={this.handleOptionClick.bind(this, option)}
                  onMouseEnter={this.onMouseEnter.bind(this, option, index)}
                >
                  {multiple ? (
                    <Checkbox
                      className={cx('NestedSelect-optionLabel')}
                      onChange={this.handleCheck.bind(this, option, index)}
                      trueValue={option[valueField]}
                      checked={selfChecked}
                      disabled={nodeDisabled}
                    >
                      {`${option[labelField || 'label']}`}
                    </Checkbox>
                  ) : (
                    <div className={cx('NestedSelect-optionLabel')}>
                      <span>{`${option[labelField || 'label']}`}</span>
                    </div>
                  )}

                  {option.children && option.children.length ? (
                    <div className={cx('NestedSelect-optionArrowRight')}>
                      <Icon icon="right-arrow" className="icon" />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </>
    );
  }

  @autobind
  onMouseEnterAll() {
    this.setState({
      stack: [this.props.options]
    });
  }

  onMouseEnter(option: Option, index: number, e: MouseEvent) {
    let {stack} = this.state;
    let {cascade, multiple, selectedOptions, valueField} = this.props;
    index = index + 1;

    if (option.children && option.children.length) {
      const checked = selectedOptions.some(
        o => o[valueField || 'value'] == option[valueField || 'value']
      );
      const uncheckable = cascade
        ? false
        : option.uncheckable || (multiple && checked);
      const children = option.children.map(c => ({...c, uncheckable}));
      if (stack[index]) {
        stack.splice(index, 1, children);
      } else {
        stack.push(children);
      }
    } else {
      stack[index] && stack.splice(index, 1);
    }

    this.setState({stack: stack.slice(0, index + 1)});
  }

  renderOuter() {
    const {popOverContainer, classnames: cx} = this.props;

    let body = (
      <RootCloseWrapper
        disabled={!this.state.isOpened}
        onRootClose={this.close}
      >
        <div className={cx('NestedSelect-menuOuter')}>
          {this.renderOptions()}
        </div>
      </RootCloseWrapper>
    );

    return (
      <Overlay
        container={popOverContainer || this.getTarget}
        target={this.getTarget}
        show
      >
        <PopOver className={cx('NestedSelect-popover')}>{body}</PopOver>
      </Overlay>
    );
  }

  render() {
    const {className, disabled, classnames: cx, multiple} = this.props;

    return (
      <div className={cx('NestedSelectControl', className)}>
        <div
          className={cx('NestedSelect', {
            [`NestedSelect--multi`]: multiple,
            'is-opened': this.state.isOpened,
            'is-disabled': disabled
          })}
          onClick={this.open}
          ref={this.domRef}
        >
          <div className={cx('NestedSelect-valueWrap')} onClick={this.open}>
            {this.renderValue()}
          </div>

          {this.renderClear()}

          <span className={cx('Select-arrow')}>
            <Icon icon="caret" className="icon" />
          </span>
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
