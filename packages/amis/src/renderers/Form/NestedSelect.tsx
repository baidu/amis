import React from 'react';
import {
  ResultBox,
  Spinner,
  Icon,
  PopUp,
  Checkbox,
  Cascader,
  SpinnerExtraProps
} from 'amis-ui';
import {
  Overlay,
  resolveEventData,
  PopOver,
  Option,
  Options,
  autobind,
  flattenTree,
  filterTree,
  getTreeDepth,
  string2regExp,
  getTreeAncestors,
  getTreeParent,
  ucFirst,
  isMobile,
  OptionsControl,
  OptionsControlProps,
  RootClose,
  ActionObject,
  renderTextByKeyword,
  getVariable,
  TestIdBuilder,
  labelToString,
  setThemeClassName,
  CustomStyle
} from 'amis-core';
import {findDOMNode} from 'react-dom';
import xor from 'lodash/xor';
import union from 'lodash/union';
import compact from 'lodash/compact';
import {FormOptionsSchema} from '../../Schema';
import {supportStatic} from './StaticHoc';
import {matchSorter} from 'match-sorter';

import type {TooltipObject} from 'amis-ui/lib/components/TooltipWrapper';

/**
 * Nested Select
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/nested-select
 */
export interface NestedSelectControlSchema extends FormOptionsSchema {
  type: 'nested-select';
  /**
   * 边框模式，全边框，还是半边框，或者没边框。
   */
  borderMode?: 'full' | 'half' | 'none';

  /**
   * 弹框的 css 类
   */
  menuClassName?: string;

  /**
   * 父子之间是否完全独立。
   */
  cascade?: boolean;

  /**
   * 选父级的时候是否把子节点的值也包含在内。
   */
  withChildren?: boolean;

  /**
   * 选父级的时候，是否只把子节点的值包含在内
   */
  onlyChildren?: boolean;

  /**
   * 只允许选择叶子节点
   */
  onlyLeaf?: boolean;

  /**
   * 是否隐藏选择框中已选中节点的祖先节点的文本信息
   */
  hideNodePathLabel?: boolean;

  /**
   * 标签的最大展示数量，超出数量后以收纳浮层的方式展示，仅在多选模式开启后生效
   */
  maxTagCount?: number;

  /**
   * 收纳标签的Popover配置
   */
  overflowTagPopover?: object;
}

export interface NestedSelectProps
  extends OptionsControlProps,
    SpinnerExtraProps {
  cascade?: boolean;
  noResultsText?: string;
  withChildren?: boolean;
  onlyChildren?: boolean;
  hideNodePathLabel?: boolean;
  mobileUI?: boolean;
  maxTagCount?: number;
  overflowTagPopover?: TooltipObject;
  testIdBuilder?: TestIdBuilder;
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
    onlyChildren: false,
    onlyLeaf: false,
    searchPromptText: 'Select.searchPromptText',
    noResultsText: 'noResult',
    checkAll: true,
    checkAllLabel: 'Select.checkAll',
    hideNodePathLabel: false
  };
  outTarget: React.RefObject<HTMLDivElement> = React.createRef();
  outTargetWidth?: number;
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
    const {dispatchEvent, options, multiple, value, selectedOptions} =
      this.props;

    const rendererEvent = await dispatchEvent(
      eventName,
      resolveEventData(this.props, {
        options,
        items: options, // 为了保持名字统一
        value,
        selectedItems: multiple ? selectedOptions : selectedOptions[0],
        ...eventData
      })
    );
    // 返回阻塞标识
    return !!rendererEvent?.prevented;
  }

  /** 是否为父节点 */
  isParentNode(option: Option) {
    return Array.isArray(option.children) && option.children.length > 0;
  }

  @autobind
  handleOutClick(e: React.MouseEvent<any>) {
    e.stopPropagation();
    this.outTargetWidth = this.outTarget.current?.clientWidth;
    e.defaultPrevented ||
      this.setState(prevState => ({
        isOpened: !prevState.isOpened
      }));
  }

  @autobind
  handleResultClear() {
    this.setState({
      inputValue: undefined
    });
  }

  @autobind
  close() {
    this.setState({
      isOpened: false
    });
  }

  async removeItem(index: number, e?: React.MouseEvent<HTMLElement>) {
    let {onChange, selectedOptions} = this.props;

    e && e.stopPropagation();

    selectedOptions.splice(index, 1);

    const value = this.getValue();

    const isPrevented = await this.dispatchEvent('change', {
      value
    });
    isPrevented || onChange(value);
  }

  @autobind
  renderValue(option: Option, key?: any) {
    const {
      classnames: cx,
      labelField,
      valueField,
      options,
      hideNodePathLabel
    } = this.props;
    const inputValue = this.state.inputValue || '';
    const regexp = string2regExp(inputValue);

    if (hideNodePathLabel) {
      return labelToString(option[labelField || 'label']);
    }
    const ancestors = getTreeAncestors(options, option, true);

    const optionText = labelToString(option[labelField || 'label']);
    const splitJoin = ' / ';

    const title = ancestors
      ? ancestors
          .map(item => labelToString(item[labelField || 'label']))
          .join(splitJoin)
      : optionText;

    return (
      <span
        className={cx('Select-valueLabel')}
        key={key || option[valueField || 'value']}
        title={title}
      >
        {ancestors
          ? ancestors.map((item, index) => {
              const label = labelToString(item[labelField || 'label']);
              const value = item[valueField || 'value'];
              const isEnd = index === ancestors.length - 1;
              return (
                <span key={index}>
                  {regexp.test(value) || regexp.test(label)
                    ? renderTextByKeyword(label, inputValue)
                    : label}
                  {!isEnd && splitJoin}
                </span>
              );
            })
          : optionText}
      </span>
    );
  }

  @autobind
  async handleOptionClick(option: Option) {
    const {multiple, onChange, joinValues, extractValue, valueField, onlyLeaf} =
      this.props;

    if (multiple) {
      return;
    }

    const value = joinValues
      ? option[valueField || 'value']
      : extractValue
      ? option[valueField || 'value']
      : option;

    if (value === undefined) {
      return;
    }

    if (onlyLeaf && this.isParentNode(option)) {
      return;
    }

    const isPrevented = await this.dispatchEvent('change', {
      value,
      selectedItems: option
    });
    isPrevented || onChange(value);
    isPrevented || this.handleResultClear();
    /** 选项选择后需要重置下拉数据源：搜索结果 => 原始数据 */
    this.setState({stack: [this.props.options]});
    this.close();
  }

  @autobind
  async handleCheck(
    option: Option | Options,
    index?: number,
    resetOptionStack?: boolean
  ) {
    const {
      onChange,
      selectedOptions,
      joinValues,
      delimiter,
      extractValue,
      withChildren,
      onlyChildren,
      cascade,
      options,
      onlyLeaf
    } = this.props;
    const {stack} = this.state;

    let valueField = this.props.valueField || 'value';

    if (onlyLeaf && !Array.isArray(option) && this.isParentNode(option)) {
      return;
    }

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
    /**
     * 打平树且只保留叶节点
     */
    const flattenTreeWithLeafNodes = (option: Option | Options) =>
      compact(
        flattenTree(Array.isArray(option) ? option : [option], node =>
          node.children && node.children.length ? null : node
        )
      );

    // 三种情况：
    // 1.全选，option为数组
    // 2.单个选中，且有children
    // 3.单个选中，没有children

    if (Array.isArray(option)) {
      if (withChildren) {
        option = flattenTree(option);
      } else if (onlyChildren) {
        option = flattenTreeWithLeafNodes(option);
      }
      value = items.length === option.length ? [] : (option as Options);
    } else if (Array.isArray(option.children)) {
      if (cascade) {
        value = xor(items, [option]);
      } else if (withChildren) {
        option = flattenTree([option]);
        const isEvery = (option as Options).every(opt => !!~items.indexOf(opt));
        value = (isEvery ? xor : union)(items, option as any);
      } else if (onlyChildren) {
        option = flattenTreeWithLeafNodes(option);
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
              if (~index && !withChildren && !onlyChildren) {
                value.splice(index, 1);
              }
            });

            if (!onlyChildren) {
              value.push(parent);
            }

            toCheck = parent;
            continue;
          }
        }
        break;
      }
    }

    const newValue = joinValues
      ? value.map(item => item[valueField as string]).join(delimiter)
      : extractValue
      ? value.map(item => item[valueField as string])
      : value;
    const isPrevented = await this.dispatchEvent('change', {
      value: newValue,
      selectedItems: option
    });
    isPrevented || onChange(newValue);
    isPrevented || this.handleResultClear();
    /** 选项选择后需要重置下拉数据源：搜索结果 => 原始数据 */
    resetOptionStack && this.setState({stack: [this.props.options]});
  }

  allChecked(options: Options): boolean {
    const {selectedOptions, withChildren, onlyChildren} = this.props;

    return options.every(option => {
      if ((withChildren || onlyChildren) && option.children) {
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

  reload(subpath?: string, query?: any) {
    const reload = this.props.reloadOptions;
    reload && reload(subpath, query);
  }

  @autobind
  getValue() {
    let {
      selectedOptions,
      joinValues,
      valueField,
      extractValue,
      delimiter,
      value
    } = this.props;

    if (joinValues) {
      value = (selectedOptions as Options)
        .map(item => item[valueField || 'value'])
        .join(delimiter || ',');
    } else if (extractValue) {
      value = (selectedOptions as Options).map(
        item => item[valueField || 'value']
      );
    }

    return value;
  }

  @autobind
  async onFocus(e: any) {
    const {onFocus, disabled} = this.props;

    const value = this.getValue();

    if (!disabled && !this.state.isOpened) {
      this.setState({
        isFocused: true
      });

      const isPrevented = await this.dispatchEvent('focus', {
        value
      });
      isPrevented || (onFocus && onFocus(e));
    }
  }

  @autobind
  async onBlur(e: any) {
    const {onBlur} = this.props;

    const value = this.getValue();

    this.setState({
      isFocused: false
    });

    const isPrevented = await this.dispatchEvent('blur', {
      value
    });
    isPrevented || (onBlur && onBlur(e));
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

    let filtedOptions =
      inputValue && this.state.isOpened
        ? filterTree(
            options,
            (
              option: Option,
              key: number,
              level: number,
              paths: Array<Option>
            ) =>
              !!matchSorter([option].concat(paths), inputValue, {
                keys: [labelField || 'label', valueField || 'value'],
                threshold: matchSorter.rankings.CONTAINS
              }).length || !!(option.children && option.children.length),
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
  async handleResultChange(value: Array<Option>) {
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
      const isPrevented = await this.dispatchEvent('change', {
        value: ''
      });
      isPrevented || onChange('');
      return;
    }

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
  getMenuSelectMenuStyle() {
    const {options} = this.props;
    const width = this.outTargetWidth;
    const depth = getTreeDepth(options);
    let style = {};
    if (width) {
      style = {
        width: width / depth
      };
    }
    return style;
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
      menuClassName,
      cascade,
      onlyChildren,
      testIdBuilder
    } = this.props;
    const valueField = this.props.valueField || 'value';
    const stack = this.state.stack;
    let partialChecked = this.partialChecked(propOptions);
    let allChecked = this.allChecked(propOptions);

    return (
      <>
        {stack.map((options, index) => (
          <div
            key={index}
            className={cx('NestedSelect-menu', menuClassName)}
            style={this.getMenuSelectMenuStyle()}
          >
            {multiple && checkAll && index === 0 ? (
              <div className={cx('NestedSelect-option', 'checkall')}>
                <Checkbox
                  size="sm"
                  onChange={this.handleCheck.bind(this, options)}
                  checked={partialChecked}
                  partial={partialChecked && !allChecked}
                />
                <span onClick={this.handleCheck.bind(this, options)}>
                  {__(checkAllLabel)}
                </span>
              </div>
            ) : null}

            {options.map((option: Option, idx: number) => {
              const itemTIB = testIdBuilder
                ?.getChild(`menu-${index}`)
                .getChild(option.value || idx);
              const ancestors = getTreeAncestors(propOptions, option as any);
              const parentChecked = ancestors?.some(
                item => !!~selectedOptions.indexOf(item)
              );
              const uncheckable = cascade ? false : multiple && parentChecked;
              const parentDisabled = ancestors?.some(item => !!item.disabled);

              let nodeDisabled =
                uncheckable || option.disabled || parentDisabled || !!disabled;
              let selfChildrenChecked = !!(
                option.children && this.partialChecked(option.children)
              );
              let selfChecked =
                uncheckable || !!~selectedOptions.indexOf(option);

              if (
                !selfChecked &&
                onlyChildren &&
                multiple &&
                this.isParentNode(option) &&
                this.allChecked(option.children!)
              ) {
                selfChecked = true;
              }

              let label = labelToString(option[labelField || 'label']);

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
                      onChange={this.handleCheck.bind(
                        this,
                        option,
                        index,
                        false
                      )}
                      trueValue={option[valueField]}
                      checked={selfChecked || (!cascade && selfChildrenChecked)}
                      partial={!selfChecked}
                      disabled={nodeDisabled}
                      testIdBuilder={itemTIB?.getChild('checkbox')}
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
                    title={label}
                    {...itemTIB?.getTestId()}
                  >
                    {label}
                  </div>

                  {option.children && option.children.length ? (
                    <div
                      className={cx('NestedSelect-optionArrowRight', {
                        'is-disabled': nodeDisabled
                      })}
                      {...itemTIB?.getChild('arrow-right').getTestId()}
                    >
                      <Icon icon="right-arrow-bold" className="icon" />
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

  renderSearchResult() {
    const {stack, inputValue} = this.state;
    const {
      classnames: cx,
      translate: __,
      options: propOptions,
      labelField,
      valueField,
      cascade,
      selectedOptions,
      multiple,
      disabled,
      onlyChildren,
      render
    } = this.props;

    let noResultsText: any = this.props.noResultsText;
    if (noResultsText) {
      noResultsText = render('noResultText', __(noResultsText));
    }
    const regexp = string2regExp(inputValue || '');
    const flattenTreeWithNodes = flattenTree(stack[0]).filter(option => {
      return !!(
        regexp.test(option[valueField || 'value']) ||
        regexp.test(option[labelField || 'label'])
      );
    });

    // 一个stack一个menu
    const resultBody = (
      <div
        className={cx('NestedSelect-menu')}
        style={this.getMenuSelectMenuStyle()}
      >
        {flattenTreeWithNodes.length ? (
          flattenTreeWithNodes.map((option, index) => {
            const ancestors = getTreeAncestors(propOptions, option as any);

            const uncheckable = cascade
              ? false
              : multiple &&
                ancestors?.some(item => !!~selectedOptions.indexOf(item));

            let isNodeDisabled =
              uncheckable ||
              option.disabled ||
              !!disabled ||
              ancestors?.some(item => !!item.disabled);

            let isChildrenChecked = !!(
              option.children && this.partialChecked(option.children)
            );

            let isChecked = uncheckable || !!~selectedOptions.indexOf(option);

            if (
              !isChecked &&
              onlyChildren &&
              this.isParentNode(option) &&
              this.allChecked(option.children!)
            ) {
              isChecked = true;
            }

            return (
              <div
                className={cx('NestedSelect-option', {
                  'is-active':
                    !isNodeDisabled &&
                    (isChecked || (!cascade && isChildrenChecked))
                })}
                key={index}
              >
                <div
                  className={cx('NestedSelect-optionLabel', {
                    'is-disabled': isNodeDisabled
                  })}
                  onClick={() => {
                    !isNodeDisabled &&
                      (multiple
                        ? this.handleCheck(option, option.value, true)
                        : this.handleOptionClick(option));
                  }}
                >
                  {this.renderValue(option, option.value)}
                </div>
              </div>
            );
          })
        ) : (
          <div
            className={cx('NestedSelect-option', {
              'no-result': true
            })}
          >
            {noResultsText}
          </div>
        )}
      </div>
    );
    return resultBody;
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
    const {
      popOverContainer,
      translate: __,
      classnames: cx,
      options,
      render,
      id,
      themeCss
    } = this.props;
    const isSearch = !!this.state.inputValue;
    let noResultsText: any = this.props.noResultsText;

    if (noResultsText) {
      noResultsText = render('noResultText', __(noResultsText));
    }

    let body = (
      <RootClose disabled={!this.state.isOpened} onRootClose={this.close}>
        {(ref: any) => {
          return (
            <div className={cx('NestedSelect-menuOuter')} ref={ref}>
              {isSearch ? (
                this.renderSearchResult()
              ) : options.length ? (
                this.renderOptions()
              ) : (
                <div className={cx('NestedSelect-noResult')}>
                  {noResultsText}
                </div>
              )}
            </div>
          );
        }}
      </RootClose>
    );

    return (
      <Overlay
        target={this.getTarget}
        container={popOverContainer || (() => findDOMNode(this))}
        placement={'auto'}
        show
      >
        <PopOver
          className={cx(
            'NestedSelect-popover',
            setThemeClassName({
              ...this.props,
              name: 'nestedSelectPopoverClassName',
              id,
              themeCss: themeCss
            })
          )}
        >
          {body}
        </PopOver>
      </Overlay>
    );
  }

  @supportStatic()
  render() {
    const {
      className,
      style,
      disabled,
      classnames: cx,
      multiple,
      placeholder,
      translate: __,
      inline,
      searchable,
      selectedOptions,
      clearable,
      loading,
      borderMode,
      mobileUI,
      popOverContainer,
      env,
      testIdBuilder,
      loadingConfig,
      maxTagCount,
      overflowTagPopover
    } = this.props;

    const {classPrefix: ns, themeCss, id} = this.props;

    return (
      <div
        className={cx('NestedSelectControl', className)}
        ref={this.outTarget}
        style={style}
      >
        <ResultBox
          mobileUI={mobileUI}
          maxTagCount={maxTagCount}
          overflowTagPopover={overflowTagPopover}
          disabled={disabled}
          ref={this.domRef}
          placeholder={__(placeholder ?? 'placeholder.empty')}
          inputPlaceholder={''}
          className={cx(
            `NestedSelect`,
            {
              'NestedSelect--inline': inline,
              'NestedSelect--single': !multiple,
              'NestedSelect--multi': multiple,
              'NestedSelect--searchable': searchable,
              'is-opened': this.state.isOpened,
              'is-focused': this.state.isFocused,
              [`NestedSelect--border${ucFirst(borderMode)}`]: borderMode
            },
            setThemeClassName({
              ...this.props,
              name: 'nestedSelectControlClassName',
              id,
              themeCss: themeCss
            })
          )}
          result={
            multiple
              ? selectedOptions
              : selectedOptions.length
              ? selectedOptions[0]
              : ''
          }
          onResultClick={this.handleOutClick}
          value={this.state.inputValue}
          onChange={this.handleInputChange}
          onResultChange={this.handleResultChange}
          onClear={this.handleResultClear}
          itemRender={this.renderValue}
          onKeyPress={this.handleKeyPress}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onKeyDown={this.handleInputKeyDown}
          clearable={clearable}
          hasDropDownArrow={true}
          allowInput={searchable && !mobileUI}
          testIdBuilder={testIdBuilder}
        >
          {loading ? (
            <Spinner loadingConfig={loadingConfig} size="sm" />
          ) : undefined}
        </ResultBox>
        {mobileUI ? (
          <PopUp
            className={cx(`NestedSelect-popup`)}
            container={env.getModalContainer}
            isShow={this.state.isOpened}
            onHide={this.close}
            showConfirm={false}
            showClose={false}
          >
            <Cascader
              onClose={this.close}
              {...this.props}
              onChange={this.handleResultChange}
              options={this.props.options.slice()}
              value={selectedOptions}
            />
          </PopUp>
        ) : this.state.isOpened ? (
          this.renderOuter()
        ) : null}

        <CustomStyle
          {...this.props}
          config={{
            themeCss: themeCss,
            classNames: [
              {
                key: 'nestedSelectControlClassName',
                weights: {
                  hover: {
                    suf: '.is-clickable:not(.is-disabled)'
                  },
                  focused: {
                    suf: '.is-opened:not(.is-mobile)'
                  },
                  disabled: {
                    suf: '.is-disabled'
                  }
                }
              },
              {
                key: 'nestedSelectPopoverClassName',
                weights: {
                  default: {
                    suf: ` .${ns}NestedSelect-option`
                  },
                  hover: {
                    suf: ` .${ns}NestedSelect-option.is-highlight`
                  },
                  focused: {
                    inner: `.${ns}NestedSelect-option.is-active`
                  }
                }
              }
            ],
            id: id
          }}
          env={env}
        />
      </div>
    );
  }
}

@OptionsControl({
  type: 'nested-select'
})
export class NestedSelectControlRenderer extends NestedSelectControl {}
@OptionsControl({
  type: 'cascader-select'
})
export class CascaderSelectControlRenderer extends NestedSelectControl {}
