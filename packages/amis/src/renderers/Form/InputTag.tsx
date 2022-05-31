import React from 'react';
import {
  OptionsControl,
  OptionsControlProps,
  Option,
  FormOptionsControl
} from 'amis-core';
import Downshift from 'downshift';
import find from 'lodash/find';
import {findDOMNode} from 'react-dom';
import {ResultBox} from 'amis-ui';
import {autobind, filterTree, createObject} from 'amis-core';
import {Spinner} from 'amis-ui';
import {Overlay} from 'amis-ui';
import {PopOver} from 'amis-ui';
import {ListMenu} from 'amis-ui';
import {Action} from 'amis-core';

/**
 * Tag 输入框
 * 文档：https://baidu.gitee.io/amis/docs/components/form/tag
 */
export interface TagControlSchema extends FormOptionsControl {
  type: 'input-tag';

  /**
   * 选项提示信息
   */
  optionsTip?: string;

  /**
   * 是否为下拉模式
   */
  dropdown?: boolean;

  /**
   * 标签的最大展示数量，超出数量后以收纳浮层的方式展示，仅在多选模式开启后生效
   */
  maxTagCount?: number;

  /**
   * 收纳标签的Popover配置
   */
  overflowTagPopover?: object;
}

// declare function matchSorter(items:Array<any>, input:any, options:any): Array<any>;

export interface TagProps extends OptionsControlProps {
  placeholder?: string;
  clearable: boolean;
  resetValue?: any;
  optionsTip: string;
  dropdown?: boolean;
}

export interface TagState {
  inputValue: string;
  isFocused?: boolean;
  isOpened?: boolean;
}

export default class TagControl extends React.PureComponent<
  TagProps,
  TagState
> {
  input: React.RefObject<any> = React.createRef();

  static defaultProps = {
    resetValue: '',
    labelField: 'label',
    valueField: 'value',
    multiple: true,
    placeholder: 'Tag.placeholder',
    optionsTip: 'Tag.tip'
  };

  state = {
    isOpened: false,
    inputValue: '',
    isFocused: false
  };

  componentDidUpdate(prevProps: TagProps) {
    const props = this.props;

    if (prevProps.value !== props.value) {
      this.setState({
        inputValue: ''
      });
    }
  }

  doAction(action: Action, data: object, throwErrors: boolean) {
    const {resetValue, onChange} = this.props;
    const actionType = action?.actionType as string;

    if (actionType === 'clear') {
      onChange?.('');
    } else if (actionType === 'reset') {
      onChange?.(resetValue ?? '');
    }
  }

  @autobind
  async dispatchEvent(eventName: string, eventData: any = {}) {
    const {dispatchEvent, options, data} = this.props;
    const rendererEvent = await dispatchEvent(
      eventName,
      createObject(data, {
        options,
        ...eventData
      })
    );
    // 返回阻塞标识
    return !!rendererEvent?.prevented;
  }

  @autobind
  getValue(type: 'push' | 'pop' | 'normal' = 'normal', option: any = {}) {
    const {selectedOptions, joinValues, extractValue, delimiter, valueField} =
      this.props;

    const newValue = selectedOptions.concat();
    if (type === 'push') {
      newValue.push(option);
    } else if (type === 'pop') {
      newValue.pop();
    }

    const newValueRes = joinValues
      ? newValue.map(item => item[valueField || 'value']).join(delimiter || ',')
      : extractValue
      ? newValue.map(item => item[valueField || 'value'])
      : newValue;
    return newValueRes;
  }

  async addItem(option: Option) {
    const {selectedOptions, onChange} = this.props;
    const newValue = selectedOptions.concat();

    if (find(newValue, item => item.value == option.value)) {
      return;
    }

    const newValueRes = this.getValue('push', option);

    const isPrevented = await this.dispatchEvent('change', {
      value: newValueRes
    });
    isPrevented || onChange(newValueRes);
  }

  @autobind
  async handleFocus(e: any) {
    this.setState({
      isFocused: true,
      isOpened: true
    });

    const newValueRes = this.getValue('normal');
    const isPrevented = await this.dispatchEvent('focus', {
      value: newValueRes
    });
    isPrevented || this.props.onFocus?.(e);
  }

  @autobind
  async handleBlur(e: any) {
    const {
      selectedOptions,
      onChange,
      joinValues,
      extractValue,
      delimiter,
      valueField
    } = this.props;

    const value = this.state.inputValue.trim();
    const newValueRes = this.getValue('normal');

    const isPrevented = await this.dispatchEvent('blur', {
      value: newValueRes
    });
    isPrevented || this.props.onBlur?.(e);
    this.setState(
      {
        isFocused: false,
        isOpened: false,
        inputValue: ''
      },
      value
        ? () => {
            const newValue = selectedOptions.concat();
            if (!find(newValue, item => item.value === value)) {
              const option = {
                label: value,
                value: value
              };
              newValue.push(option);
              onChange(
                joinValues
                  ? newValue
                      .map(item => item[valueField || 'value'])
                      .join(delimiter || ',')
                  : extractValue
                  ? newValue.map(item => item[valueField || 'value'])
                  : newValue
              );
            }
          }
        : undefined
    );
  }

  @autobind
  close() {
    this.setState({
      isOpened: false
    });
  }

  @autobind
  handleInputChange(text: string) {
    this.setState({
      inputValue: text
    });
  }

  @autobind
  async handleChange(value: Array<Option>) {
    const {joinValues, extractValue, delimiter, valueField, onChange} =
      this.props;

    let newValue: any = Array.isArray(value) ? value.concat() : [];

    if (joinValues || extractValue) {
      newValue = value.map(item => item[valueField || 'value']);
    }

    if (joinValues) {
      newValue = newValue.join(delimiter || ',');
    }

    const isPrevented = await this.dispatchEvent('change', {
      value: newValue
    });
    isPrevented || onChange(newValue);
  }

  @autobind
  renderItem(item: Option): any {
    const {labelField} = this.props;
    return `${item[labelField || 'label']}`;
  }

  @autobind
  async handleKeyDown(evt: React.KeyboardEvent<HTMLInputElement>) {
    const {selectedOptions, onChange, delimiter} = this.props;

    const value = this.state.inputValue.trim();

    if (selectedOptions.length && !value && evt.key == 'Backspace') {
      const newValueRes = this.getValue('pop');
      const isPrevented = await this.dispatchEvent('change', {
        value: newValueRes
      });
      isPrevented || onChange(newValueRes);
    } else if (value && (evt.key === 'Enter' || evt.key === delimiter)) {
      evt.preventDefault();
      evt.stopPropagation();
      const newValue = selectedOptions.concat();

      if (!find(newValue, item => item.value == value)) {
        const newValueRes = this.getValue('push', {
          label: value,
          value: value
        });
        const isPrevented = await this.dispatchEvent('change', {
          value: newValueRes
        });
        isPrevented || onChange(newValueRes);
      }

      this.setState({
        inputValue: ''
      });
    }
  }

  @autobind
  handleOptionChange(option: Option) {
    if (this.state.inputValue || !option) {
      return;
    }
    this.addItem(option);
  }

  @autobind
  getTarget() {
    return this.input.current;
  }

  @autobind
  getParent() {
    return this.input.current && findDOMNode(this.input.current)!.parentElement;
  }

  reload() {
    const reload = this.props.reloadOptions;
    reload?.();
  }

  render() {
    const {
      className,
      classnames: cx,
      disabled,
      placeholder,
      name,
      clearable,
      selectedOptions,
      loading,
      popOverContainer,
      dropdown,
      options,
      optionsTip,
      maxTagCount,
      overflowTagPopover,
      translate: __
    } = this.props;

    const finnalOptions = Array.isArray(options)
      ? filterTree(
          options,
          item =>
            (Array.isArray(item.children) && !!item.children.length) ||
            (item.value !== undefined && !~selectedOptions.indexOf(item)),
          0,
          true
        )
      : [];

    return (
      <Downshift
        selectedItem={selectedOptions}
        isOpen={this.state.isFocused}
        inputValue={this.state.inputValue}
        onChange={this.handleOptionChange}
        itemToString={this.renderItem}
      >
        {({isOpen, highlightedIndex, getItemProps, getInputProps}) => {
          return (
            <div className={cx(className, `TagControl`)}>
              {/* @ts-ignore 怪了为啥类型不对，后续看 */}
              <ResultBox
                {...getInputProps({
                  name,
                  ref: this.input,
                  placeholder: __(placeholder || 'Tag.placeholder'),
                  value: this.state.inputValue,
                  onKeyDown: this.handleKeyDown,
                  onFocus: this.handleFocus,
                  onBlur: this.handleBlur,
                  disabled
                })}
                onChange={this.handleInputChange}
                className={cx('TagControl-input')}
                result={selectedOptions}
                onResultChange={this.handleChange}
                itemRender={this.renderItem}
                clearable={clearable}
                maxTagCount={maxTagCount}
                overflowTagPopover={overflowTagPopover}
                allowInput
              >
                {loading ? <Spinner size="sm" /> : undefined}
              </ResultBox>

              {dropdown !== false ? (
                <Overlay
                  container={popOverContainer || this.getParent}
                  target={this.getTarget}
                  placement={'auto'}
                  show={isOpen && !!finnalOptions.length}
                >
                  <PopOver
                    overlay
                    className={cx('TagControl-popover')}
                    onHide={this.close}
                  >
                    <ListMenu
                      options={finnalOptions}
                      itemRender={this.renderItem}
                      highlightIndex={highlightedIndex}
                      getItemProps={({
                        item,
                        index
                      }: {
                        item: Option;
                        index: number;
                      }) => ({
                        ...getItemProps({
                          index,
                          item,
                          disabled: item.disabled
                        })
                      })}
                    />
                  </PopOver>
                </Overlay>
              ) : (
                // 保留原来的展现方式，不推荐
                <div className={cx('TagControl-sug')}>
                  {optionsTip ? (
                    <div className={cx('TagControl-sugTip')}>
                      {__(optionsTip)}
                    </div>
                  ) : null}
                  {options.map((item, index) => (
                    <div
                      className={cx('TagControl-sugItem', {
                        'is-disabled': item.disabled || disabled
                      })}
                      key={index}
                      onClick={this.addItem.bind(this, item)}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        }}
      </Downshift>
    );
  }
}

@OptionsControl({
  type: 'input-tag'
})
export class TagControlRenderer extends TagControl {}
