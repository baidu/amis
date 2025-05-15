import React from 'react';
import cx from 'classnames';
import find from 'lodash/find';
import debounce from 'lodash/debounce';
import {
  OptionsControl,
  OptionsControlProps,
  Option,
  resolveEventData,
  str2function,
  Api,
  ActionObject,
  normalizeOptions,
  isEffectiveApi,
  isApiOutdated,
  createObject,
  autobind,
  TestIdBuilder,
  getVariable,
  CustomStyle,
  setThemeClassName
} from 'amis-core';
import {TransferDropDown, Spinner, Select, SpinnerExtraProps} from 'amis-ui';
import {FormOptionsSchema, SchemaApi} from '../../Schema';
import {BaseTransferRenderer, TransferControlSchema} from './Transfer';
import {supportStatic} from './StaticHoc';

import type {SchemaClassName} from '../../Schema';
import type {TooltipObject} from 'amis-ui/lib/components/TooltipWrapper';

/**
 * Select 下拉选择框。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/select
 */
export interface SelectControlSchema
  extends FormOptionsSchema,
    SpinnerExtraProps {
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
  showInvalidMatch?: boolean;

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

  /**
   * 下拉框 Popover 设置
   */
  overlay?: {
    /**
     * 下拉框 Popover 的宽度设置，支持单位 '%'、'px'、'rem'、'em'、'vw', 支持相对写法如 '+20px'
     */
    width?: number | string;
    /**
     * 下拉框 Popover 的对齐方式
     */
    align?: 'left' | 'center' | 'right';

    /**
     * 检索函数
     */
    filterOption?: 'string';
  };

  testIdBuilder?: TestIdBuilder;
}

export interface SelectProps extends OptionsControlProps, SpinnerExtraProps {
  autoComplete?: Api;
  searchable?: boolean;
  showInvalidMatch?: boolean;
  defaultOpen?: boolean;
  mobileUI?: boolean;
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
    this.lazyloadRemote = debounce(this.loadRemote.bind(this), 250, {
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
    this.fetchCancel = null;
  }

  inputRef(ref: any) {
    this.input = ref;
  }

  focus() {
    this.input && this.input?.focus?.();
  }

  getValue(
    value: Option | Array<Option> | string | void,
    additonalOptions: Array<any> = []
  ) {
    const {joinValues, extractValue, delimiter, multiple, valueField, options} =
      this.props;
    let newValue: string | Option | Array<Option> | void = value;

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
    const {dispatchEvent, options, value, multiple, selectedOptions} =
      this.props;
    // 触发渲染器事件
    const rendererEvent = await dispatchEvent(
      eventName,
      resolveEventData(this.props, {
        options,
        items: options, // 为了保持名字统一
        value,
        selectedItems: multiple ? selectedOptions : selectedOptions[0]
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

    let additonalOptions: Array<any> = [];

    let newValue: string | Option | Array<Option> | void = this.getValue(
      value,
      additonalOptions
    );

    // 不设置没法回显
    additonalOptions.length && setOptions(options.concat(additonalOptions));

    const rendererEvent = await dispatchEvent(
      'change',
      resolveEventData(this.props, {
        value: newValue,
        options,
        items: options, // 为了保持名字统一
        selectedItems: value
      })
    );
    if (rendererEvent?.prevented) {
      return;
    }

    onChange?.(newValue);
  }

  fetchCancel: Function | null = null;

  async loadRemote(input: string, force = false) {
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

    if (!force && formInited === false && addHook) {
      this.unHook && this.unHook();
      return (this.unHook = addHook(
        this.loadRemote.bind(this, input, true),
        'init'
      ));
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

    if (this.fetchCancel) {
      this.fetchCancel?.('autoComplete request cancelled.');
      this.fetchCancel = null;
      setLoading(false);
    }

    setLoading(true);
    try {
      const ret = await env.fetcher(autoComplete, ctx, {
        cancelExecutor: (executor: Function) => (this.fetchCancel = executor)
      });
      this.fetchCancel = null;

      const options = (ret.data && (ret.data as any).options) || ret.data || [];
      const combinedOptions = this.mergeOptions(options);

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
          !find(
            combinedOptions,
            (item: Option) => item[valueField] === option[valueField]
          )
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
    const {menuTpl, render, data, optionClassName, testIdBuilder} = this.props;

    return render(`menu/${state.index}`, menuTpl, {
      showNativeTitle: true,
      className: cx('Select-option-content', optionClassName),
      data: createObject(createObject(data, state), option),
      testIdBuilder: testIdBuilder?.getChild(
        'option-' + option.value || state.index
      )
    });
  }

  reload(subpath?: string, query?: any) {
    const reload = this.props.reloadOptions;
    reload && reload(subpath, query);
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
    const {resetValue, onChange, formStore, store, name, valueField} =
      this.props;
    const actionType = action?.actionType as string;

    if (actionType === 'clear') {
      onChange?.('');
    } else if (actionType === 'reset') {
      const pristineVal =
        getVariable(formStore?.pristine ?? store?.pristine, name) ?? resetValue;
      const value = this.getValue({[valueField]: pristineVal ?? ''});
      onChange?.(value);
    }
  }

  @autobind
  handleOptionAdd(
    idx: number | Array<number> = -1,
    value?: any,
    skipForm: boolean = false,
    callback?: (value: any) => any
  ) {
    const {onAdd, autoComplete} = this.props;

    onAdd?.(idx, value, skipForm, async () => {
      callback?.(value);

      if (autoComplete) {
        await this.loadRemote(this.lastTerm);
        return false;
      }

      return;
    });
  }

  @autobind
  handleOptionEdit(
    value: Option,
    origin?: Option,
    skipForm?: boolean,
    callback?: (value: any) => any
  ) {
    const {onEdit, autoComplete} = this.props;

    onEdit?.(value, origin, skipForm, async () => {
      callback?.(value);

      if (autoComplete) {
        await this.loadRemote(this.lastTerm);
        return false;
      }

      return;
    });
  }

  @autobind
  handleOptionDelete(value: any, callback?: (value: any) => any) {
    const {onDelete, autoComplete} = this.props;

    onDelete?.(value, async () => {
      callback?.(value);

      if (autoComplete) {
        await this.loadRemote(this.lastTerm);
        return false;
      }

      return;
    });
  }

  @supportStatic()
  render() {
    let {
      autoComplete,
      searchable,
      showInvalidMatch,
      options,
      className,
      popoverClassName,
      style,
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
      mobileUI,
      overlay,
      filterOption,
      ...rest
    } = this.props;
    const {classPrefix: ns, themeCss} = this.props;

    if (noResultsText) {
      noResultsText = render('noResultText', noResultsText);
    }

    return (
      <div
        className={cx(`${classPrefix}SelectControl`, className)}
        style={style}
      >
        {['table', 'list', 'group', 'tree', 'chained', 'associated'].includes(
          selectMode
        ) ? (
          this.renderOtherMode()
        ) : (
          <Select
            {...rest}
            onAdd={this.handleOptionAdd}
            onEdit={this.handleOptionEdit}
            onDelete={this.handleOptionDelete}
            className={cx(
              setThemeClassName({
                ...this.props,
                name: 'selectControlClassName',
                id,
                themeCss: themeCss
              })
            )}
            popoverClassName={cx(
              popoverClassName,
              setThemeClassName({
                ...this.props,
                name: 'selectPopoverClassName',
                id,
                themeCss: themeCss
              })
            )}
            mobileUI={mobileUI}
            popOverContainer={
              mobileUI
                ? env?.getModalContainer
                : rest.popOverContainer || env.getModalContainer
            }
            borderMode={borderMode}
            placeholder={placeholder}
            multiple={multiple || multi}
            ref={this.inputRef}
            value={selectedOptions}
            options={options}
            filterOption={
              typeof filterOption === 'string'
                ? str2function(filterOption, 'options', 'inputValue', 'option')
                : filterOption
            }
            loadOptions={
              isEffectiveApi(autoComplete) ? this.lazyloadRemote : undefined
            }
            showInvalidMatch={showInvalidMatch}
            creatable={creatable}
            searchable={searchable || !!autoComplete}
            onChange={this.changeValue}
            onBlur={(e: any) => this.dispatchEvent('blur', e)}
            onFocus={(e: any) => this.dispatchEvent('focus', e)}
            loading={loading}
            noResultsText={noResultsText}
            renderMenu={menuTpl ? this.renderMenu : undefined}
            overlay={overlay}
          />
        )}
        <CustomStyle
          {...this.props}
          config={{
            themeCss: themeCss,
            classNames: [
              {
                key: 'selectControlClassName',
                weights: {
                  focused: {
                    suf: '.is-opened:not(.is-mobile)'
                  },
                  disabled: {
                    suf: '.is-disabled'
                  }
                }
              },
              {
                key: 'selectPopoverClassName',
                weights: {
                  default: {
                    suf: ` .${ns}Select-option`
                  },
                  hover: {
                    suf: ` .${ns}Select-option.is-highlight`
                  },
                  focused: {
                    inner: `.${ns}Select-option.is-active`
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
export interface TransferDropDownProps
  extends OptionsControlProps,
    Omit<
      TransferControlSchema,
      | 'type'
      | 'options'
      | 'inputClassName'
      | 'className'
      | 'descriptionClassName'
    >,
    SpinnerExtraProps {
  borderMode?: 'full' | 'half' | 'none';
  mobileUI?: boolean;
}

class TransferDropdownRenderer extends BaseTransferRenderer<TransferDropDownProps> {
  @autobind
  renderItem(item: Option): any {
    const {labelField, menuTpl, data, render} = this.props;

    return menuTpl
      ? render(`option/${item.value}`, menuTpl, {
          data: createObject(data, item)
        })
      : `${item.scopeLabel || ''}${item[labelField || 'label']}`;
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
      mobileUI,
      env,
      popOverContainer,
      maxTagCount,
      overflowTagPopover,
      placeholder,
      itemHeight,
      virtualThreshold,
      rightMode,
      loadingConfig,
      labelField,
      showInvalidMatch,
      checkAll,
      checkAllLabel,
      overlay,
      valueField
    } = this.props;

    // 目前 LeftOptions 没有接口可以动态加载
    // 为了方便可以快速实现动态化，让选项的第一个成员携带
    // LeftOptions 信息
    let {options, leftOptions, leftDefaultValue} = this.props;
    if (
      selectMode === 'associated' &&
      options &&
      options.length &&
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
          optionItemRender={this.renderItem}
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
          rightMode={rightMode}
          leftOptions={leftOptions}
          borderMode={borderMode}
          mobileUI={mobileUI}
          popOverContainer={popOverContainer || env.getModalContainer}
          maxTagCount={maxTagCount}
          overflowTagPopover={overflowTagPopover}
          placeholder={placeholder}
          itemHeight={itemHeight}
          virtualThreshold={virtualThreshold}
          virtualListHeight={266}
          labelField={labelField}
          showInvalidMatch={showInvalidMatch}
          checkAllLabel={checkAllLabel}
          checkAll={checkAll}
          overlay={overlay}
          valueField={valueField}
        />

        <Spinner
          overlay
          key="info"
          show={loading}
          loadingConfig={loadingConfig}
        />
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
