import React from 'react';
import cx from 'classnames';
import {
  OptionsControl,
  OptionsControlProps,
  Option,
  FormOptionsControl
} from 'amis-core';
import {normalizeOptions} from 'amis-core';
import find from 'lodash/find';
import debouce from 'lodash/debounce';
import {Api, ActionObject} from 'amis-core';
import {isEffectiveApi, isApiOutdated} from 'amis-core';
import {isEmpty, createObject, autobind, isMobile} from 'amis-core';

import {FormOptionsSchema, SchemaApi} from '../../Schema';
import {Spinner, Select} from 'amis-ui';
import {BaseTransferRenderer, TransferControlSchema} from './Transfer';
import {TransferDropDown} from 'amis-ui';

import type {SchemaClassName} from '../../Schema';
import type {TooltipObject} from 'amis-ui/lib/components/TooltipWrapper';
import {supportStatic} from './StaticHoc';

/**
 * Select 下拉选择框。
 * 文档：https://baidu.gitee.io/amis/docs/components/form/select
 */
export interface SelectControlSchema extends FormOptionsSchema {
  type: 'select' | 'multi-select';

  /**
   * 自动完成 API，当输入部分文字的时候，会将这些文字通过 ${term} 可以取到，发送给接口。
   * 接口可以返回匹配到的选项，帮助用户输入。
   */
  autoComplete?: SchemaApi;

  /**
   * 可以自定义菜单展示。
   */
  menuTpl?: string;

  /**
   * 当在value值未匹配到当前options中的选项时，是否value值对应文本飘红显示
   */
  showInvalidMatch: boolean;

  /**
   * 边框模式，全边框，还是半边框，或者没边框。
   */
  borderMode?: 'full' | 'half' | 'none';

  /**
   * 勾选展示模式
   */
  selectMode?: 'table' | 'group' | 'tree' | 'chained' | 'associated';

  /**
   * 当 selectMode 为 associated 时用来定义左侧的选项
   */
  leftOptions?: Array<Option>;

  /**
   * 当 selectMode 为 associated 时用来定义左侧的选择模式
   */
  leftMode?: 'tree' | 'list';

  /**
   * 当 selectMode 为 associated 时用来定义右侧的选择模式
   */
  rightMode?: 'table' | 'list' | 'tree' | 'chained';

  /**
   * 搜索结果展示模式
   */
  searchResultMode?: 'table' | 'list' | 'tree' | 'chained';

  /**
   * 当 selectMode 为 table 时定义表格列信息。
   */
  columns?: Array<any>;

  /**
   * 当 searchResultMode 为 table 时定义表格列信息。
   */
  searchResultColumns?: Array<any>;

  /**
   * 可搜索？
   */
  searchable?: boolean;

  /**
   * 搜索 API
   */
  searchApi?: SchemaApi;

  /**
   * 单个选项的高度，主要用于虚拟渲染
   */
  itemHeight?: number;

  /**
   * 在选项数量达到多少时开启虚拟渲染
   */
  virtualThreshold?: number;

  /**
   * 可多选条件下，是否可全选
   */
  checkAll?: boolean;
  /**
   * 可多选条件下，是否默认全选中所有值
   */
  defaultCheckAll?: boolean;
  /**
   * 可多选条件下，全选项文案，默认 ”全选“
   */
  checkAllLabel?: string;

  /**
   * 标签的最大展示数量，超出数量后以收纳浮层的方式展示，仅在多选模式开启后生效
   */
  maxTagCount?: number;

  /**
   * 收纳标签的Popover配置
   */
  overflowTagPopover?: object;

  /**
   * 选项的自定义CSS类名
   */
  optionClassName?: SchemaClassName;
}

export interface SelectProps extends OptionsControlProps {
  autoComplete?: Api;
  searchable?: boolean;
  showInvalidMatch?: boolean;
  defaultOpen?: boolean;
  useMobileUI?: boolean;
  maxTagCount?: number;
  overflowTagPopover?: TooltipObject;
}

export type SelectRendererEvent =
  | 'change'
  | 'blur'
  | 'focus'
  | 'add'
  | 'edit'
  | 'delete';
export default class SelectControl extends React.Component<SelectProps, any> {
  static defaultProps: Partial<SelectProps> = {
    clearable: false,
    searchable: false,
    multiple: false,
    showInvalidMatch: false
  };

  input: any;
  unHook: Function;
  lazyloadRemote: Function;
  lastTerm: string = ''; // 用来记录上一次搜索时关键字
  constructor(props: SelectProps) {
    super(props);

    this.changeValue = this.changeValue.bind(this);
    this.lazyloadRemote = debouce(this.loadRemote.bind(this), 250, {
      trailing: true,
      leading: false
    });
    this.inputRef = this.inputRef.bind(this);
  }

  componentDidUpdate(prevProps: SelectProps) {
    const props = this.props;

    if (
      isEffectiveApi(props.autoComplete, props.data) &&
      isApiOutdated(
        prevProps.autoComplete,
        props.autoComplete,
        prevProps.data,
        props.data
      )
    ) {
      this.lazyloadRemote(this.lastTerm);
    }
  }

  componentWillUnmount() {
    this.unHook && this.unHook();
  }

  inputRef(ref: any) {
    this.input = ref;
  }

  foucs() {
    this.input && this.input.focus();
  }

  getValue(value: Option | Array<Option> | string | void) {
    const {joinValues, extractValue, delimiter, multiple, valueField, options} =
      this.props;
    let newValue: string | Option | Array<Option> | void = value;
    let additonalOptions: Array<any> = [];

    (Array.isArray(value) ? value : value ? [value] : []).forEach(
      (option: any) => {
        let resolved = find(
          options,
          (item: any) =>
            item[valueField || 'value'] == option[valueField || 'value']
        );
        resolved || additonalOptions.push(option);
      }
    );

    if (joinValues) {
      if (multiple) {
        newValue = Array.isArray(value)
          ? (value
              .map(item => item[valueField || 'value'])
              .join(delimiter) as string)
          : value
          ? (value as Option)[valueField || 'value']
          : '';
      } else {
        newValue = newValue ? (newValue as Option)[valueField || 'value'] : '';
      }
    } else if (extractValue) {
      if (multiple) {
        newValue = Array.isArray(value)
          ? value.map(item => item[valueField || 'value'])
          : value
          ? [(value as Option)[valueField || 'value']]
          : [];
      } else {
        newValue = newValue ? (newValue as Option)[valueField || 'value'] : '';
      }
    }

    return newValue;
  }

  async dispatchEvent(eventName: SelectRendererEvent, eventData: any = {}) {
    const event = 'on' + eventName.charAt(0).toUpperCase() + eventName.slice(1);
    const {dispatchEvent, options, data} = this.props;
    // 触发渲染器事件
    const rendererEvent = await dispatchEvent(
      eventName,
      createObject(data, {
        options,
        value: ['onEdit', 'onDelete'].includes(event)
          ? eventData
          : eventData && eventData.value
      })
    );
    if (rendererEvent?.prevented) {
      return;
    }
    // 触发外部方法
    this.props[event](eventData);
  }

  async changeValue(value: Option | Array<Option> | string | void) {
    const {onChange, setOptions, options, data, dispatchEvent} = this.props;

    let newValue: string | Option | Array<Option> | void = this.getValue(value);
    let additonalOptions: Array<any> = [];
    // 不设置没法回显
    additonalOptions.length && setOptions(options.concat(additonalOptions));

    const rendererEvent = await dispatchEvent(
      'change',
      createObject(data, {
        value: newValue,
        options
      })
    );
    if (rendererEvent?.prevented) {
      return;
    }

    onChange?.(newValue);
  }

  async loadRemote(input: string) {
    const {
      autoComplete,
      env,
      data,
      setOptions,
      setLoading,
      formInited,
      addHook
    } = this.props;

    if (!env || !env.fetcher) {
      throw new Error('fetcher is required');
    }

    if (!formInited) {
      this.unHook && this.unHook();
      return (this.unHook = addHook(this.loadRemote.bind(this, input), 'init'));
    }

    this.lastTerm = input;
    const ctx = createObject(data, {
      term: input,
      value: input
    });

    if (!isEffectiveApi(autoComplete, ctx)) {
      return Promise.resolve({
        options: []
      });
    }

    setLoading(true);
    try {
      const ret = await env.fetcher(autoComplete, ctx);

      let options = (ret.data && (ret.data as any).options) || ret.data || [];
      let combinedOptions = this.mergeOptions(options);
      setOptions(combinedOptions);

      return {
        options: combinedOptions
      };
    } finally {
      setLoading(false);
    }
  }

  mergeOptions(options: Array<object>) {
    const {selectedOptions, valueField = 'value'} = this.props;
    let combinedOptions = normalizeOptions(
      options,
      undefined,
      valueField
    ).concat();

    if (Array.isArray(selectedOptions) && selectedOptions.length) {
      selectedOptions.forEach(option => {
        if (
          !find(combinedOptions, (item: Option) => item.value == option.value)
        ) {
          combinedOptions.push({
            ...option,
            hidden: true
          });
        }
      });
    }
    return combinedOptions;
  }

  @autobind
  renderMenu(option: Option, state: any) {
    const {menuTpl, render, data, optionClassName} = this.props;

    return render(`menu/${state.index}`, menuTpl, {
      showNativeTitle: true,
      className: cx('Select-option-content', optionClassName),
      data: createObject(createObject(data, state), option)
    });
  }

  reload() {
    const reload = this.props.reloadOptions;
    reload && reload();
  }

  option2value() {}

  renderOtherMode() {
    const {selectMode, ...rest} = this.props;
    return (
      <TransferDropdownRenderer
        {...rest}
        selectMode={selectMode === 'group' ? 'list' : selectMode}
      />
    );
  }

  doAction(action: ActionObject, data: object, throwErrors: boolean): any {
    const {resetValue, onChange} = this.props;
    const actionType = action?.actionType as string;

    if (actionType === 'clear') {
      onChange?.('');
    } else if (actionType === 'reset') {
      const value = this.getValue(resetValue ?? '');
      onChange?.(value);
    }
  }

  @supportStatic()
  render() {
    let {
      autoComplete,
      searchable,
      showInvalidMatch,
      options,
      className,
      loading,
      value,
      selectedOptions,
      multi,
      multiple,
      placeholder,
      id,
      classPrefix,
      classnames,
      creatable,
      inline,
      noResultsText,
      render,
      menuTpl,
      borderMode,
      selectMode,
      env,
      useMobileUI,
      ...rest
    } = this.props;

    if (noResultsText) {
      noResultsText = render('noResultText', noResultsText);
    }

    const mobileUI = useMobileUI && isMobile();

    return (
      <div className={cx(`${classPrefix}SelectControl`, className)}>
        {['table', 'list', 'group', 'tree', 'chained', 'associated'].includes(
          selectMode
        ) ? (
          this.renderOtherMode()
        ) : (
          <Select
            {...rest}
            useMobileUI={useMobileUI}
            popOverContainer={
              mobileUI && env && env.getModalContainer
                ? env.getModalContainer
                : mobileUI
                ? undefined
                : rest.popOverContainer
            }
            borderMode={borderMode}
            placeholder={placeholder}
            multiple={multiple || multi}
            ref={this.inputRef}
            value={selectedOptions}
            options={options}
            loadOptions={
              isEffectiveApi(autoComplete) ? this.lazyloadRemote : undefined
            }
            showInvalidMatch={showInvalidMatch}
            creatable={creatable}
            searchable={searchable || !!autoComplete}
            onChange={this.changeValue}
            onBlur={(e: any) => this.dispatchEvent('blur', e)}
            onFocus={(e: any) => this.dispatchEvent('focus', e)}
            onAdd={() => this.dispatchEvent('add')}
            onEdit={(item: any) => this.dispatchEvent('edit', item)}
            onDelete={(item: any) => this.dispatchEvent('delete', item)}
            loading={loading}
            noResultsText={noResultsText}
            renderMenu={menuTpl ? this.renderMenu : undefined}
          />
        )}
      </div>
    );
  }
}

export interface TransferDropDownProps
  extends OptionsControlProps,
    Omit<
      TransferControlSchema,
      | 'type'
      | 'options'
      | 'inputClassName'
      | 'className'
      | 'descriptionClassName'
    > {
  borderMode?: 'full' | 'half' | 'none';
  useMobileUI?: boolean;
}

class TransferDropdownRenderer extends BaseTransferRenderer<TransferDropDownProps> {
  @autobind
  renderItem(item: Option): any {
    const {labelField} = this.props;
    return `${item.scopeLabel || ''}${item[labelField || 'label']}`;
  }

  render() {
    const {
      className,
      classnames: cx,
      selectedOptions,
      sortable,
      loading,
      searchable,
      searchResultMode,
      showArrow,
      deferLoad,
      disabled,
      clearable,
      selectTitle,
      selectMode,
      multiple,
      columns,
      leftMode,
      borderMode,
      useMobileUI,
      popOverContainer,
      maxTagCount,
      overflowTagPopover,
      placeholder
    } = this.props;

    // 目前 LeftOptions 没有接口可以动态加载
    // 为了方便可以快速实现动态化，让选项的第一个成员携带
    // LeftOptions 信息
    let {options, leftOptions, leftDefaultValue} = this.props;
    if (
      selectMode === 'associated' &&
      options &&
      options.length === 1 &&
      options[0].leftOptions &&
      Array.isArray(options[0].children)
    ) {
      leftOptions = options[0].leftOptions;
      leftDefaultValue = options[0].leftDefaultValue ?? leftDefaultValue;
      options = options[0].children;
    }

    return (
      <>
        <TransferDropDown
          selectMode={selectMode}
          className={className}
          value={selectedOptions}
          disabled={disabled}
          clearable={clearable}
          options={options}
          onChange={this.handleChange}
          option2value={this.option2value}
          itemRender={this.renderItem}
          sortable={sortable}
          searchResultMode={searchResultMode}
          onSearch={searchable ? this.handleSearch : undefined}
          showArrow={showArrow}
          onDeferLoad={deferLoad}
          selectTitle={selectTitle}
          multiple={multiple}
          columns={columns}
          leftMode={leftMode}
          leftOptions={leftOptions}
          borderMode={borderMode}
          useMobileUI={useMobileUI}
          popOverContainer={popOverContainer}
          maxTagCount={maxTagCount}
          overflowTagPopover={overflowTagPopover}
          placeholder={placeholder}
        />

        <Spinner overlay key="info" show={loading} />
      </>
    );
  }
}

@OptionsControl({
  type: 'select'
})
export class SelectControlRenderer extends SelectControl {}

@OptionsControl({
  type: 'multi-select'
})
export class MultiSelectControlRenderer extends SelectControl {
  static defaultProps = {
    multiple: true
  };
}
