import React from 'react';
import Overlay from '../../components/Overlay';
import Checkbox from '../../components/Checkbox';
import PopOver from '../../components/PopOver';
import {RootCloseWrapper} from 'react-overlays';
import {Icon} from '../../components/icons';
import {
  autobind,
  flattenTree,
  filterTree,
  string2regExp,
  getTreeAncestors,
  getTreeParent
} from '../../utils/helper';
import {
  FormOptionsControl,
  OptionsControl,
  OptionsControlProps
} from '../Form/Options';
import {Option, Options} from '../../components/Select';
import {findDOMNode} from 'react-dom';
import {ResultBox, Spinner} from '../../components';
import xor from 'lodash/xor';
import union from 'lodash/union';
import {isEqual} from 'lodash';

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
    searchPromptText: 'Select.searchPromptText',
    checkAll: true,
    checkAllLabel: '全选'
  };
  target: any;
  input: HTMLInputElement;
  state: NestedSelectState = {
    isOpened: false,
    isFocused: false,
    inputValue: '',
    stack: [this.props.options]
  };

  @autobind
  domRef(ref: any) {
    this.target = ref;
  }

  componentDidUpdate(prevProps: NestedSelectProps) {
    if (prevProps.options !== this.props.options) {
      this.setState({
        stack: [this.props.options]
      });
    }
  }

  @autobind
  handleOutClick(e: React.MouseEvent<any>) {
    const {options} = this.props;
    e.defaultPrevented ||
      this.setState({
        isOpened: true
      });
  }

  @autobind
  close() {
    this.setState({
      isOpened: false
    });
  }

  removeItem(index: number, e?: React.MouseEvent<HTMLElement>) {
    let {
      onChange,
      selectedOptions,
      joinValues,
      valueField,
      extractValue,
      delimiter,
      value
    } = this.props;

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

  @autobind
  renderValue(item: Option, key?: any) {
    const {classnames: cx, labelField, options} = this.props;
    const ancestors = getTreeAncestors(options, item, true);

    return (
      <span className={cx('Select-valueLabel')} key={key}>
        {`${
          ancestors
            ? ancestors
                .map(item => `${item[labelField || 'label']}`)
                .join(' / ')
            : item[labelField || 'label']
        }`}
      </span>
    );
  }

  @autobind
  handleOptionClick(option: Option) {
    const {
      multiple,
      onChange,
      joinValues,
      extractValue,
      valueField
    } = this.props;

    if (multiple) {
      return;
    }

    onChange(
      joinValues
        ? option[valueField || 'value']
        : extractValue
        ? option[valueField || 'value']
        : option
    );
    !multiple && this.close();
  }

  @autobind
  handleCheck(option: Option | Options, index?: number) {
    const {
      onChange,
      selectedOptions,
      joinValues,
      delimiter,
      extractValue,
      withChildren,
      cascade,
      options
    } = this.props;
    const {stack} = this.state;

    let valueField = this.props.valueField || 'value';

    if (
      !Array.isArray(option) &&
      option.children &&
      option.children.length &&
      typeof index === 'number'
    ) {
      if (stack[index]) {
        stack.splice(index + 1, 1, option.children);
      } else {
        stack.push(option.children);
      }
    }

    const items = selectedOptions;
    let value: any[];

    // 三种情况：
    // 1.全选，option为数组
    // 2.单个选中，且有children
    // 3.单个选中，没有children

    if (Array.isArray(option)) {
      option = withChildren ? flattenTree(option) : option;
      value = items.length === option.length ? [] : (option as Options);
    } else if (Array.isArray(option.children)) {
      if (cascade) {
        value = xor(items, [option]);
      } else if (withChildren) {
        option = flattenTree([option]);
        const isEvery = (option as Options).every(opt => !!~items.indexOf(opt));
        value = (isEvery ? xor : union)(items, option as any);
      } else {
        value = items.filter(item => !~flattenTree([option]).indexOf(item));
        !~items.indexOf(option) && value.push(option);
      }
    } else {
      value = xor(items, [option]);
    }

    if (!cascade) {
      let toCheck = option;

      while (true) {
        const parent = getTreeParent(options, toCheck as any);
        if (parent?.value) {
          // 如果所有孩子节点都勾选了，应该自动勾选父级。

          if (parent.children.every((child: any) => ~value.indexOf(child))) {
            parent.children.forEach((child: any) => {
              const index = value.indexOf(child);
              if (~index && !withChildren) {
                value.splice(index, 1);
              }
            });
            value.push(parent);
            toCheck = parent;
            continue;
          }
        }
        break;
      }
    }

    onChange(
      joinValues
        ? value.map(item => item[valueField as string]).join(delimiter)
        : extractValue
        ? value.map(item => item[valueField as string])
        : value
    );
  }

  allChecked(options: Options): boolean {
    const {selectedOptions, withChildren} = this.props;
    return options.every(option => {
      if (withChildren && option.children) {
        return this.allChecked(option.children);
      }
      return selectedOptions.some(item => item === option);
    });
  }

  partialChecked(options: Options): boolean {
    return options.some(option => {
      const childrenPartialChecked =
        option.children && this.partialChecked(option.children);
      return (
        childrenPartialChecked ||
        this.props.selectedOptions.some(item => item === option)
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
      this.setState({
        isFocused: true
      });
  }

  @autobind
  onBlur(e: any) {
    this.setState({
      isFocused: false
    });
  }

  @autobind
  getTarget() {
    if (!this.target) {
      this.target = findDOMNode(this) as HTMLElement;
    }
    return this.target as HTMLElement;
  }

  @autobind
  handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === ' ') {
      this.handleOutClick(e as any);
      e.preventDefault();
    }
  }

  @autobind
  handleInputKeyDown(event: React.KeyboardEvent) {
    const inputValue = this.state.inputValue;
    const {multiple, selectedOptions} = this.props;

    if (
      event.key === 'Backspace' &&
      !inputValue &&
      selectedOptions.length &&
      multiple
    ) {
      this.removeItem(selectedOptions.length - 1);
    }
  }

  @autobind
  handleInputChange(inputValue: string) {
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

  @autobind
  handleResultChange(value: Array<Option>) {
    const {
      joinValues,
      extractValue,
      delimiter,
      valueField,
      onChange,
      multiple
    } = this.props;

    let newValue: any = Array.isArray(value) ? value.concat() : [];

    if (!multiple && !newValue.length) {
      onChange('');
      return;
    }

    if (joinValues || extractValue) {
      newValue = value.map(item => item[valueField || 'value']);
    }

    if (joinValues) {
      newValue = newValue.join(delimiter || ',');
    }

    onChange(newValue);
  }

  renderOptions() {
    const {
      multiple,
      selectedOptions,
      classnames: cx,
      options: propOptions,
      disabled,
      checkAll,
      checkAllLabel,
      translate: __,
      labelField,
      cascade
    } = this.props;
    const valueField = this.props.valueField || 'value';

    const stack = this.state.stack;

    let partialChecked = this.partialChecked(propOptions);
    let allChecked = this.allChecked(propOptions);

    return (
      <>
        {stack.map((options, index) => (
          <div key={index} className={cx('NestedSelect-menu')}>
            {multiple && checkAll && index === 0 ? (
              <div className={cx('NestedSelect-option', 'checkall')}>
                <Checkbox
                  size="sm"
                  onChange={this.handleCheck.bind(this, options)}
                  checked={partialChecked}
                  partial={partialChecked && !allChecked}
                ></Checkbox>
                <span onClick={this.handleCheck.bind(this, options)}>
                  {__(checkAllLabel)}
                </span>
              </div>
            ) : null}

            {options.map((option: Option, idx: number) => {
              const ancestors = getTreeAncestors(propOptions, option as any);
              const parentChecked = ancestors?.some(
                item => !!~selectedOptions.indexOf(item)
              );
              const uncheckable = cascade ? false : multiple && parentChecked;
              const selfChecked =
                uncheckable || !!~selectedOptions.indexOf(option);

              const parentDisabled = ancestors?.some(item => !!item.disabled);
              let nodeDisabled =
                uncheckable || option.disabled || parentDisabled || !!disabled;

              let selfChildrenChecked = !!(
                option.children && this.partialChecked(option.children)
              );

              return (
                <div
                  key={idx}
                  className={cx('NestedSelect-option', {
                    'is-active':
                      !nodeDisabled &&
                      (selfChecked || (!cascade && selfChildrenChecked))
                  })}
                  onMouseEnter={this.onMouseEnter.bind(this, option, index)}
                >
                  {multiple ? (
                    <Checkbox
                      size="sm"
                      onChange={this.handleCheck.bind(this, option, index)}
                      trueValue={option[valueField]}
                      checked={selfChecked || (!cascade && selfChildrenChecked)}
                      partial={!selfChecked}
                      disabled={nodeDisabled}
                    ></Checkbox>
                  ) : null}

                  <div
                    className={cx('NestedSelect-optionLabel', {
                      'is-disabled': nodeDisabled
                    })}
                    onClick={() =>
                      !nodeDisabled &&
                      (multiple
                        ? this.handleCheck(option, index)
                        : this.handleOptionClick(option))
                    }
                  >
                    {option[labelField || 'label']}
                  </div>

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

  onMouseEnter(option: Option, index: number, e: MouseEvent) {
    let {stack} = this.state;
    index = index + 1;

    const children = option.children;
    if (children && children.length) {
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
    const {
      className,
      disabled,
      classnames: cx,
      multiple,
      placeholder,
      translate: __,
      inline,
      searchable,
      autoComplete,
      selectedOptions,
      clearable,
      loading
    } = this.props;

    return (
      <div className={cx('NestedSelectControl', className)}>
        <ResultBox
          disabled={disabled}
          ref={this.domRef}
          placeholder={__(placeholder || '空')}
          className={cx(`NestedSelect`, {
            'NestedSelect--inline': inline,
            'NestedSelect--single': !multiple,
            'NestedSelect--multi': multiple,
            'NestedSelect--searchable': searchable,
            'is-opened': this.state.isOpened,
            'is-focused': this.state.isFocused
          })}
          result={
            multiple
              ? selectedOptions
              : selectedOptions.length
              ? this.renderValue(selectedOptions[0])
              : ''
          }
          onResultClick={this.handleOutClick}
          value={this.state.inputValue}
          onChange={this.handleInputChange}
          onResultChange={this.handleResultChange}
          itemRender={this.renderValue}
          onKeyPress={this.handleKeyPress}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onKeyDown={this.handleInputKeyDown}
          clearable={clearable}
          allowInput={searchable}
          inputPlaceholder={''}
        >
          {loading ? <Spinner size="sm" /> : undefined}
        </ResultBox>
        {this.state.isOpened ? this.renderOuter() : null}
      </div>
    );
  }
}

@OptionsControl({
  type: 'nested-select'
})
export class NestedSelectControlRenderer extends NestedSelectControl {}
