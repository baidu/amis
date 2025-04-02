import React from 'react';
import {
  OptionsControl,
  OptionsControlProps,
  Option,
  resolveEventData,
  getVariable
} from 'amis-core';
import Downshift from 'downshift';
import find from 'lodash/find';
import isInteger from 'lodash/isInteger';
import unionWith from 'lodash/unionWith';
import compact from 'lodash/compact';
import uniq from 'lodash/uniq';
import {findDOMNode} from 'react-dom';
import {PopUp, ResultBox, SpinnerExtraProps} from 'amis-ui';
import {autobind, filterTree, createObject} from 'amis-core';
import {Spinner} from 'amis-ui';
import {Overlay} from 'amis-core';
import {PopOver} from 'amis-core';
import {ListMenu, Button} from 'amis-ui';
import {ActionObject} from 'amis-core';
import {isMobile} from 'amis-core';
import {FormOptionsSchema} from '../../Schema';
import {supportStatic} from './StaticHoc';
import {TooltipWrapperSchema} from '../TooltipWrapper';
import {matchSorter} from 'match-sorter';

/**
 * Tag 输入框
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/tag
 */
export interface TagControlSchema extends FormOptionsSchema {
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
   * 允许添加的标签的最大数量
   */
  max?: number;

  /**
   * 单个标签的最大文本长度
   */
  maxTagLength?: number;

  /**
   * 标签的最大展示数量，超出数量后以收纳浮层的方式展示，仅在多选模式开启后生效
   */
  maxTagCount?: number;

  /**
   * 收纳标签的Popover配置
   */
  overflowTagPopover?: TooltipWrapperSchema;

  /** 是否开启批量添加模式 */
  enableBatchAdd: boolean;

  /**
   * 开启批量添加后，输入多个标签的分隔符，支持传入多个符号，默认为"-"
   *
   * @default "-"
   */
  separator?: string;
}

// declare function matchSorter(items:Array<any>, input:any, options:any): Array<any>;

export type InputTagValidationType = 'max' | 'maxLength';

export interface TagProps extends OptionsControlProps, SpinnerExtraProps {
  placeholder?: string;
  clearable: boolean;
  resetValue?: any;
  optionsTip: string;
  dropdown?: boolean;
  /** 是否支持批量输入 */
  enableBatchAdd: boolean;
  /** 开启批量添加后，输入多个标签的分隔符，支持传入多个符号，默认为英文逗号 */
  separator?: string;
  /** 允许添加的tag的最大数量 */
  max?: number;
  /** 单个标签的最大文本长度 */
  maxTagLength?: number;
  /** 文本输入后校验失败的callback */
  onInputValidateFailed?(
    value: string | string[],
    validationType: InputTagValidationType
  ): void;
}

export interface TagState {
  inputValue: string;
  isFocused?: boolean;
  isOpened?: boolean;
  selectedOptions: Option[];
  cacheOptions: Option[];
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
    optionsTip: 'Tag.tip',
    separator: '-'
  };

  constructor(props: TagProps) {
    super(props);
    this.state = {
      isOpened: false,
      inputValue: '',
      isFocused: false,
      selectedOptions: props.selectedOptions,
      cacheOptions: []
    };
  }

  componentDidUpdate(prevProps: TagProps) {
    const props = this.props;

    if (prevProps.value !== props.value) {
      this.setState({
        inputValue: ''
      });
    }
  }

  doAction(action: ActionObject, data: object, throwErrors: boolean) {
    const {resetValue, onChange, formStore, store, name} = this.props;
    const actionType = action?.actionType as string;

    if (actionType === 'clear') {
      onChange?.('');
    } else if (actionType === 'reset') {
      const pristineVal =
        getVariable(formStore?.pristine ?? store?.pristine, name) ?? resetValue;
      onChange?.(pristineVal ?? '');
    }
  }

  @autobind
  async dispatchEvent(eventName: string, eventData: any = {}) {
    const {dispatchEvent, options} = this.props;
    const rendererEvent = await dispatchEvent(
      eventName,
      resolveEventData(this.props, {
        options,
        items: options, // 为了保持名字统一
        ...eventData
      })
    );
    // 返回阻塞标识
    return !!rendererEvent?.prevented;
  }

  /** 处理输入的内容 */
  normalizeInputValue(inputValue: string): Option[] {
    const {enableBatchAdd, separator, valueField, labelField, delimiter} =
      this.props;
    let batchValues = [];

    if (enableBatchAdd && separator && typeof separator === 'string') {
      batchValues = inputValue.split(separator);
    } else {
      const inputValueArr = uniq(compact(inputValue.split(delimiter || ',')));
      batchValues.push(...inputValueArr);
    }

    return batchValues.filter(Boolean).map(item => ({
      [`${valueField || 'value'}`]: item,
      [`${labelField || 'label'}`]: item
    }));
  }

  normalizeOptions(options: Option[]) {
    const {joinValues, extractValue, delimiter, valueField} = this.props;

    return joinValues
      ? options.map(item => item[valueField || 'value']).join(delimiter || ',')
      : extractValue
      ? options.map(item => item[valueField || 'value'])
      : options;
  }

  /** 输入的内容和存量的内容合并，过滤掉value值相同的 */
  normalizeMergedValue(inputValue: string, normalized: boolean = true) {
    const {selectedOptions, valueField} = this.props;

    const options = unionWith(
      selectedOptions.concat(),
      this.normalizeInputValue(inputValue),
      (origin: Option, input: Option) =>
        origin[valueField || 'value'] === input[valueField || 'value']
    );

    return normalized ? this.normalizeOptions(options) : options;
  }

  validateInputValue(inputValue: string): boolean {
    const {
      max,
      maxTagLength,
      enableBatchAdd,
      separator,
      onInputValidateFailed,
      valueField
    } = this.props;

    const normalizedValue = this.normalizeMergedValue(
      inputValue,
      false
    ) as Option[];

    if (max != null && isInteger(max) && normalizedValue.length > max) {
      onInputValidateFailed?.(
        normalizedValue.map(item => item[valueField || 'value']),
        'max'
      );
      return false;
    }

    const addedValues = this.normalizeInputValue(inputValue);

    if (
      maxTagLength != null &&
      isInteger(maxTagLength) &&
      addedValues.some(
        item => item[valueField || 'value'].length > maxTagLength
      )
    ) {
      onInputValidateFailed?.(
        addedValues.map(item => item[valueField || 'value']),
        'maxLength'
      );
      return false;
    }

    return true;
  }

  @autobind
  getValue(
    type: 'push' | 'pop' | 'normal' = 'normal',
    option: any = {},
    selectedOptions?: Option[]
  ) {
    const {joinValues, extractValue, delimiter, valueField} = this.props;
    selectedOptions = selectedOptions
      ? selectedOptions
      : this.props.selectedOptions;

    const newValue = selectedOptions.concat();
    if (type === 'push') {
      newValue.push(option);
    } else if (type === 'pop') {
      newValue.pop();
    }

    return joinValues
      ? newValue.map(item => item[valueField || 'value']).join(delimiter || ',')
      : extractValue
      ? newValue.map(item => item[valueField || 'value'])
      : newValue;
  }

  async addItem(option: Option) {
    if (this.isReachMax()) {
      return;
    }

    const {selectedOptions, onChange, valueField} = this.props;
    const newValue = selectedOptions.concat();

    if (
      find(
        newValue,
        item => item[valueField || 'value'] == option[valueField || 'value']
      )
    ) {
      return;
    }

    const newValueRes = this.getValue('push', option);

    const isPrevented = await this.dispatchEvent('change', {
      value: newValueRes,
      selectedItems: selectedOptions.concat(option)
    });
    isPrevented || onChange(newValueRes);
  }

  // 移动端特殊处理
  addItem2(option: Option) {
    const {mobileUI, valueField = 'value'} = this.props;

    if (mobileUI) {
      const selectedOptions = this.state.selectedOptions.concat();
      let index = selectedOptions.findIndex(
        item => item[valueField] === option[valueField]
      );
      if (~index) {
        selectedOptions.splice(index, 1);
      } else if (!this.isReachMaxFromState()) {
        selectedOptions.push(option);
      }
      this.setState({
        selectedOptions
      });
    }
  }

  // 手机端校验
  isExist(inputValue: string) {
    const {options, valueField = 'value'} = this.props;
    const {cacheOptions} = this.state;
    return (
      options.some(item => item[valueField] === inputValue) ||
      cacheOptions.some(item => item[valueField] === inputValue)
    );
  }

  @autobind
  addSelection() {
    let {inputValue} = this.state;
    const {maxTagLength} = this.props;
    const selectedOptions = this.state.selectedOptions.slice();
    const cacheOptions = this.state.cacheOptions.slice();

    if (maxTagLength !== undefined) {
      inputValue = inputValue.trim();
      inputValue = inputValue.slice(0, maxTagLength);
    }
    if (this.isExist(inputValue)) {
      return;
    }

    if (inputValue && !this.isReachMaxFromState()) {
      const addedValues = this.normalizeInputValue(inputValue);
      selectedOptions.push(addedValues[0]);
      cacheOptions.push(addedValues[0]);
      this.setState({
        inputValue: '',
        selectedOptions,
        cacheOptions
      });
    }
  }

  @autobind
  async onConfirm() {
    const {selectedOptions} = this.state;
    const {onChange} = this.props;
    const newValueRes = this.getValue('normal', {}, selectedOptions);

    const isPrevented = await this.dispatchEvent('change', {
      value: newValueRes,
      selectedItems: selectedOptions
    });

    isPrevented || onChange(newValueRes);
    this.close();
  }

  @autobind
  async handleFocus(e: any) {
    this.setState({
      isFocused: true,
      isOpened: true,
      selectedOptions: this.props.selectedOptions
    });

    const newValueRes = this.getValue('normal');
    const isPrevented = await this.dispatchEvent('focus', {
      value: newValueRes,
      selectedItems: this.props.selectedOptions
    });
    isPrevented || this.props.onFocus?.(e);
  }

  @autobind
  async handleBlur(e: any) {
    const {selectedOptions, onChange, mobileUI, options} = this.props;

    if (mobileUI && options.length) {
      return;
    }
    const value = this.state.inputValue.trim();

    if (!this.validateInputValue(value)) {
      this.setState({isFocused: false, isOpened: false});
      return;
    }

    const newValueRes = this.normalizeMergedValue(value);
    const isPrevented = await this.dispatchEvent('blur', {
      value: newValueRes,
      selectedItems: selectedOptions
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
            if (selectedOptions.length !== newValueRes.length) {
              onChange?.(newValueRes);
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
    this.setState({inputValue: text});
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
      value: newValue,
      selectedItems: value
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
    const {selectedOptions, onChange, delimiter, labelField, valueField} =
      this.props;

    const value = this.state.inputValue.trim();
    const selectedItems = selectedOptions.concat(
      this.normalizeMergedValue(value, false) as Option[]
    );

    if (selectedOptions.length && !value && evt.key == 'Backspace') {
      const newValueRes = this.getValue('pop');
      const isPrevented = await this.dispatchEvent('change', {
        value: newValueRes,
        selectedItems
      });
      isPrevented || onChange(newValueRes);
    } else if (value && (evt.key === 'Enter' || evt.key === delimiter)) {
      evt.preventDefault();
      evt.stopPropagation();

      const newValueRes = this.normalizeMergedValue(value);
      const isPrevented = await this.dispatchEvent('change', {
        value: newValueRes,
        selectedItems
      });

      if (!this.validateInputValue(value)) {
        this.setState({isFocused: false, isOpened: false});
        return;
      }

      if (!isPrevented && selectedOptions.length !== newValueRes.length) {
        onChange(newValueRes);
      }

      this.setState({
        inputValue: ''
      });
    } else if (!value && evt.key === 'Enter') {
      this.handleBlur(evt);
    }
  }

  @autobind
  handleOptionChange(option: Option) {
    const {mobileUI} = this.props;

    if (mobileUI) {
      this.addItem2(option);
      return;
    }
    if (this.isReachMax() || !option) {
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

  reload(subpath?: string, query?: any) {
    const reload = this.props.reloadOptions;
    reload && reload(subpath, query);
  }

  @autobind
  isReachMax() {
    const {max, selectedOptions} = this.props;
    return max != null && isInteger(max) && selectedOptions.length >= max;
  }

  @autobind
  isReachMaxFromState() {
    const {selectedOptions} = this.state;
    const {max} = this.props;
    return max != null && isInteger(max) && selectedOptions.length >= max;
  }

  @supportStatic()
  render() {
    const {
      className,
      style,
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
      translate: __,
      loadingConfig,
      valueField,
      env,
      mobileUI,
      labelField,
      testIdBuilder
    } = this.props;

    const term = this.state.inputValue;
    const finnalOptions = Array.isArray(options)
      ? filterTree(
          options,
          (item: Option, key: number, level: number, paths: Array<Option>) =>
            item[valueField || 'value'] !== undefined &&
            (mobileUI || !~selectedOptions.indexOf(item)) &&
            (matchSorter([item].concat(paths), term, {
              keys: [labelField || 'label', valueField || 'value'],
              threshold: matchSorter.rankings.CONTAINS
            }).length ||
              (Array.isArray(item.children) && !!item.children.length)),
          0,
          true
        )
      : [];

    const reachMax = this.isReachMax();

    return (
      <Downshift
        selectedItem={selectedOptions}
        isOpen={mobileUI ? this.state.isOpened : this.state.isFocused}
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
                  placeholder: __(placeholder ?? 'Tag.placeholder'),
                  value: this.state.inputValue,
                  onKeyDown: this.handleKeyDown,
                  onFocus: !mobileUI ? this.handleFocus : undefined,
                  onBlur: this.handleBlur,
                  disabled
                })}
                onResultClick={mobileUI ? this.handleFocus : undefined}
                inputPlaceholder={''}
                onChange={this.handleInputChange}
                className={cx('TagControl-input')}
                result={selectedOptions}
                onResultChange={this.handleChange}
                itemRender={this.renderItem}
                clearable={clearable}
                maxTagCount={maxTagCount}
                overflowTagPopover={overflowTagPopover}
                popOverContainer={popOverContainer || env.getModalContainer}
                allowInput={!mobileUI || (mobileUI && !options?.length)}
                mobileUI={mobileUI}
                testIdBuilder={testIdBuilder?.getChild('resule-box')}
              >
                {loading ? (
                  <Spinner loadingConfig={loadingConfig} size="sm" />
                ) : undefined}
              </ResultBox>

              {dropdown !== false ? (
                mobileUI ? (
                  <PopUp
                    className={cx(`Tag-popup`)}
                    container={
                      mobileUI
                        ? env?.getModalContainer
                        : popOverContainer || env.getModalContainer
                    }
                    isShow={isOpen && !!finnalOptions.length}
                    showConfirm={true}
                    onConfirm={this.onConfirm}
                    onHide={this.close}
                  >
                    <div>
                      <ListMenu
                        selectedOptions={selectedOptions}
                        mobileUI={mobileUI}
                        options={finnalOptions.concat(this.state.cacheOptions)}
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
                            className: cx('ListMenu-item', {
                              'is-active': ~(
                                this.state.selectedOptions.map(
                                  item => item[valueField]
                                ) || []
                              ).indexOf(item[valueField])
                            })
                          })
                        })}
                      />
                      {mobileUI && !this.isReachMaxFromState() ? (
                        <div className={cx('ListMenu-add-wrap')}>
                          <ResultBox
                            placeholder={__('placeholder.enter') + '...'}
                            allowInput
                            value={this.state.inputValue}
                            mobileUI={mobileUI}
                            clearable
                            maxTagCount={maxTagCount}
                            onChange={value => {
                              this.setState({inputValue: value});
                            }}
                            onBlur={this.addSelection}
                          ></ResultBox>
                        </div>
                      ) : null}
                    </div>
                  </PopUp>
                ) : (
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
                        testIdBuilder={testIdBuilder?.getChild('options')}
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
                            disabled: reachMax || item.disabled,
                            className: cx('ListMenu-item', {
                              'is-disabled': reachMax
                            })
                          })
                        })}
                      />
                    </PopOver>
                  </Overlay>
                )
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
                        'is-disabled': item.disabled || disabled || reachMax
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
