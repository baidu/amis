/**
 * @file Select
 * @description
 * @author fex
 * @date 2017-11-07
 */

import {uncontrollable} from 'uncontrollable';
import React from 'react';
import VirtualList from './virtual-list';
import Overlay from './Overlay';
import PopOver from './PopOver';
import TooltipWrapper from './TooltipWrapper';
import Downshift, {ControllerStateAndHelpers} from 'downshift';
import {closeIcon, Icon} from './icons';
// @ts-ignore
import {matchSorter} from 'match-sorter';
import {
  noop,
  isObject,
  findTree,
  autobind,
  ucFirst,
  normalizeNodePath,
  isMobile
} from '../utils/helper';
import find from 'lodash/find';
import isPlainObject from 'lodash/isPlainObject';
import union from 'lodash/union';
import {highlight} from '../renderers/Form/Options';
import {findDOMNode} from 'react-dom';
import {ClassNamesFn, themeable, ThemeProps} from '../theme';
import Checkbox from './Checkbox';
import Input from './Input';
import {Api} from '../types';
import {LocaleProps, localeable} from '../locale';
import Spinner from './Spinner';
import {Option, Options} from '../Schema';
import {RemoteOptionsProps, withRemoteConfig} from './WithRemoteConfig';
import Picker from './Picker';
import PopUp from './PopUp';

export {Option, Options};

export interface OptionProps {
  className?: string;
  multi?: boolean;
  multiple?: boolean;
  valueField?: string;
  labelField?: string;
  simpleValue?: boolean; // 默认onChange 出去是整个 option 节点，如果配置了 simpleValue 就只包含值。
  options: Options;
  loading?: boolean;
  joinValues?: boolean;
  extractValue?: boolean;
  delimiter?: string;
  clearable?: boolean;
  resetValue: any;
  placeholder?: string;
  disabled?: boolean;
  creatable?: boolean;
  pathSeparator?: string;
  onAdd?: (
    idx?: number | Array<number>,
    value?: any,
    skipForm?: boolean
  ) => void;
  editable?: boolean;
  onEdit?: (value: Option, origin?: Option, skipForm?: boolean) => void;
  removable?: boolean;
  onDelete?: (value: Option) => void;
}

export type OptionValue = string | number | null | undefined | Option;

export function value2array(
  value: OptionValue | Array<OptionValue>,
  props: Pick<
    OptionProps,
    | 'multi'
    | 'multiple'
    | 'delimiter'
    | 'valueField'
    | 'labelField'
    | 'options'
    | 'pathSeparator'
  >,
  enableNodePath: boolean = false
): Array<Option> {
  if (enableNodePath) {
    value = normalizeNodePath(
      value,
      enableNodePath,
      props.labelField,
      props.valueField,
      props.pathSeparator,
      props.delimiter
    ).nodeValueArray;
  }

  if (props.multi || props.multiple) {
    if (typeof value === 'string') {
      value = value.split(props.delimiter || ',');
    }

    if (!Array.isArray(value)) {
      if (value === null || value === undefined) {
        return [];
      }

      value = [value];
    }

    return value
      .map((value: any) => expandValue(value, props.options, props.valueField))
      .filter((item: any) => item) as Array<Option>;
  } else if (Array.isArray(value)) {
    value = value[0];
  }

  let expandedValue = expandValue(
    value as OptionValue,
    props.options,
    props.valueField
  );
  return expandedValue ? [expandedValue] : [];
}

export function expandValue(
  value: OptionValue,
  options: Options,
  valueField = 'value'
): Option | null {
  const valueType = typeof value;

  if (
    valueType !== 'string' &&
    valueType !== 'number' &&
    valueType !== 'boolean' &&
    valueType !== 'object'
  ) {
    return value as Option;
  }

  if (!options) {
    return null;
  }

  if (
    valueType === 'object' &&
    value &&
    value.hasOwnProperty(valueField || 'value')
  ) {
    value = (value as Option)[valueField || 'value'] ?? '';
  }

  return findTree(
    options,
    optionValueCompare(value, valueField || 'value')
  ) as Option;
}

export function matchOptionValue(
  a: OptionValue,
  b: Option,
  valueField: string = 'value'
) {
  return isObject(a)
    ? a === b[valueField || 'value']
    : String(b[valueField || 'value']) === String(a);
}

export function optionValueCompare(
  a: OptionValue,
  valueField: string = 'value'
) {
  return (b: Option) => matchOptionValue(a, b, valueField);
}

export function normalizeOptions(
  options: string | {[propName: string]: string} | Array<string> | Options,
  share: {
    values: Array<any>;
    options: Array<any>;
  } = {
    values: [],
    options: []
  },
  valueField = 'value'
): Options {
  if (typeof options === 'string') {
    return options.split(',').map(item => {
      const idx = share.values.indexOf(item);
      if (~idx) {
        return share.options[idx];
      }

      const option = {
        label: item,
        value: item
      };

      share.values.push(option.value);
      share.options.push(option);

      return option;
    });
  } else if (
    Array.isArray(options as Array<string>) &&
    typeof (options as Array<string>)[0] === 'string'
  ) {
    return (options as Array<string>).map(item => {
      const idx = share.values.indexOf(item);
      if (~idx) {
        return share.options[idx];
      }

      const option = {
        label: item,
        value: item
      };

      share.values.push(option.value);
      share.options.push(option);

      return option;
    });
  } else if (Array.isArray(options as Options)) {
    return (options as Options).map(item => {
      const value = item && item[valueField];

      const idx =
        value !== undefined && !item.children
          ? share.values.indexOf(value)
          : -1;

      if (~idx) {
        return share.options[idx];
      }

      const option = {
        ...item,
        value
      };

      if (typeof option.children !== 'undefined') {
        option.children = normalizeOptions(option.children, share, valueField);
      } else if (value !== undefined) {
        share.values.push(value);
        share.options.push(option);
      }

      return option;
    });
  } else if (isPlainObject(options)) {
    return Object.keys(options).map(key => {
      const idx = share.values.indexOf(key);
      if (~idx) {
        return share.options[idx];
      }

      const option = {
        label: (options as {[propName: string]: string})[key] as string,
        value: key
      };

      share.values.push(option.value);
      share.options.push(option);

      return option;
    });
  }

  return [];
}

const DownshiftChangeTypes = Downshift.stateChangeTypes;

interface SelectProps extends OptionProps, ThemeProps, LocaleProps {
  className?: string;
  popoverClassName?: string;
  creatable: boolean;
  createBtnLabel: string;
  multiple: boolean;
  valuesNoWrap?: boolean;
  valueField: string;
  labelField: string;
  renderMenu?: (
    item: Option,
    states: {
      index: number;
      multiple?: boolean;
      checkAll?: boolean;
      checked: boolean;
      onChange: () => void;
      inputValue?: string;
      searchable?: boolean;
    }
  ) => JSX.Element;
  searchable?: boolean;
  options: Array<Option>;
  value: any;
  loadOptions?: Function;
  searchPromptText: string;
  loadingPlaceholder: string;
  spinnerClassName?: string;
  noResultsText: string;
  clearable: boolean;
  clearAllText: string;
  clearValueText: string;
  placeholder: string;
  inline: boolean;
  disabled: boolean;
  popOverContainer?: any;
  overlayPlacement?: string;
  onChange: (value: void | string | Option | Array<Option>) => void;
  onFocus?: Function;
  onBlur?: Function;
  checkAll?: boolean;
  checkAllLabel?: string;
  checkAllBySearch?: boolean;
  defaultCheckAll?: boolean;
  simpleValue?: boolean;
  defaultOpen?: boolean;
  useMobileUI?: boolean;

  /**
   * 边框模式，全边框，还是半边框，或者没边框。
   */
  borderMode?: 'full' | 'half' | 'none';
  /**
   * 是否隐藏已选项
   */
  hideSelected?: boolean;

  /**
   * 移动端样式类名
   */
  mobileClassName?: string;
}

interface SelectState {
  itemHeight: number;
  isOpen: boolean;
  isFocused: boolean;
  inputValue: string;
  highlightedIndex: number;
  selection: Array<Option>;
  pickerSelectItem: any;
}

export class Select extends React.Component<SelectProps, SelectState> {
  static defaultProps = {
    multiple: false,
    clearable: true,
    creatable: false,
    createBtnLabel: 'Select.createLabel',
    searchPromptText: 'Select.searchPromptText',
    loadingPlaceholder: 'loading',
    noResultsText: 'noResult',
    clearAllText: 'Select.clearAll',
    clearValueText: 'Select.clear',
    placeholder: 'Select.placeholder',
    valueField: 'value',
    labelField: 'label',
    resetValue: '',
    inline: false,
    disabled: false,
    checkAll: false,
    checkAllLabel: 'Select.checkAll',
    defaultCheckAll: false,
    overlayPlacement: 'auto'
  };

  input: HTMLInputElement;
  target: HTMLElement;
  menu: React.RefObject<HTMLDivElement> = React.createRef();
  constructor(props: SelectProps) {
    super(props);

    this.state = {
      isOpen: props.defaultOpen || false,
      isFocused: false,
      inputValue: '',
      highlightedIndex: -1,
      selection: value2array(props.value, props),
      itemHeight: 35,
      pickerSelectItem: ''
    };
  }

  componentDidMount() {
    const {loadOptions} = this.props;
    loadOptions && loadOptions('');
  }

  componentDidUpdate(prevProps: SelectProps) {
    const props = this.props;
    let fn: () => void = noop;

    if (
      JSON.stringify(props.value) !== JSON.stringify(prevProps.value) ||
      JSON.stringify(props.options) !== JSON.stringify(prevProps.options)
    ) {
      const selection: Array<Option> = value2array(props.value, props);
      this.setState(
        {
          selection: selection
        },
        fn
      );
    }
  }

  @autobind
  open() {
    this.props.disabled ||
      this.setState(
        {
          isOpen: true,
          highlightedIndex: -1
        },
        () => setTimeout(this.focus, 500)
      );
  }

  @autobind
  close() {
    this.setState({
      isOpen: false
    });
  }

  @autobind
  confirm() {
    // @ts-ignore
    this.handleChange(this.state.pickerSelectItem);
    this.setState({
      isOpen: false
    });
  }

  @autobind
  toggle(e?: React.MouseEvent<HTMLDivElement>) {
    if (
      e &&
      this.menu.current &&
      this.menu.current.contains(e.target as HTMLElement)
    ) {
      return;
    }

    this.props.disabled ||
      this.setState(
        {
          isOpen: !this.state.isOpen,
          highlightedIndex: -1
        },
        this.state.isOpen ? undefined : () => setTimeout(this.focus, 500)
      );
  }

  @autobind
  onFocus(e: any) {
    this.props.disabled ||
      this.state.isOpen ||
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
  toggleCheckAll() {
    const {
      options,
      onChange,
      simpleValue,
      checkAllBySearch,
      labelField,
      valueField
    } = this.props;
    const inputValue = this.state.inputValue;
    let {selection} = this.state;
    let filtedOptions: Array<Option> =
      inputValue && checkAllBySearch
        ? matchSorter(options, inputValue, {
            keys: [labelField || 'label', valueField || 'value']
          })
        : options.concat();
    const optionsValues = filtedOptions.map(option => option.value);
    const selectionValues = selection.map(select => select.value);
    const checkedAll = optionsValues.every(
      option => selectionValues.indexOf(option) > -1
    );

    selection = checkedAll ? [] : filtedOptions;
    onChange(simpleValue ? selection.map(item => item.value) : selection);
  }

  removeItem(index: number, e?: React.MouseEvent<HTMLElement>) {
    const {onChange, simpleValue, disabled} = this.props;
    if (disabled) {
      return;
    }
    let {selection: value} = this.state;

    e && e.stopPropagation();
    value = Array.isArray(value) ? value.concat() : [value];
    value.splice(index, 1);

    onChange(simpleValue ? value.map(item => item.value) : value);
  }

  @autobind
  handleInputChange(evt: React.ChangeEvent<HTMLInputElement>) {
    const {loadOptions} = this.props;
    this.setState(
      {
        inputValue: evt.currentTarget.value
      },
      () => loadOptions && loadOptions(this.state.inputValue)
    );
  }

  @autobind
  handlePickerChange(selectItem: any, index: number, confirm?: boolean) {
    if (!this.props.multiple) {
      selectItem = selectItem[0];
    }
    this.setState({
      pickerSelectItem: selectItem
    });
    // 直接选中选项
    if (confirm) {
      this.handleChange(selectItem);
    }
  }

  @autobind
  handleChange(selectItem: any) {
    const {onChange, multiple, simpleValue, valueField} = this.props;
    let {selection} = this.state;

    if (multiple) {
      const selectionValues = selection.map(item => item[valueField]);
      selection = selection.concat();
      const idx = selectionValues.indexOf(selectItem[valueField]);
      if (~idx) {
        selection.splice(idx, 1);
      } else {
        selection.push(selectItem);
      }
      onChange(
        simpleValue ? selection.map(item => item[valueField]) : selection
      );
    } else {
      onChange(simpleValue ? selectItem[valueField] : selectItem);
    }
  }

  @autobind
  handleStateChange(changes: any) {
    const {multiple, checkAll} = this.props;
    let update: any = {};

    switch (changes.type) {
      case DownshiftChangeTypes.keyDownEnter:
      case DownshiftChangeTypes.clickItem:
        update = {
          ...update,
          isOpen: multiple ? true : false,
          isFocused: multiple && checkAll ? true : false
        };
        break;
      case DownshiftChangeTypes.controlledPropUpdatedSelectedItem:
        break;
      case DownshiftChangeTypes.changeInput:
        update.highlightedIndex = 0;
        break;
      case DownshiftChangeTypes.keyDownArrowDown:
      case DownshiftChangeTypes.keyDownArrowUp:
      case DownshiftChangeTypes.itemMouseEnter:
        update = {
          ...update,
          ...changes
        };
        break;
    }

    if (Object.keys(update).length) {
      this.setState(update);
    }
  }

  @autobind
  handleKeyPress(e: React.KeyboardEvent) {
    if (this.props.multiple && e.key === ' ') {
      this.toggle();
      e.preventDefault();
    }
  }

  @autobind
  clearValue(e: React.MouseEvent<any>) {
    const onChange = this.props.onChange;
    e.preventDefault();
    e.stopPropagation();
    onChange(this.props.resetValue);
  }

  @autobind
  clearSearchValue() {
    const {loadOptions} = this.props;
    this.setState(
      {
        inputValue: ''
      },
      () => loadOptions?.('')
    );
  }

  @autobind
  handleAddClick() {
    const {onAdd} = this.props;
    onAdd && onAdd();
  }

  @autobind
  handleEditClick(e: Event, item: any) {
    const {onEdit} = this.props;
    e.preventDefault();
    e.stopPropagation();
    onEdit && onEdit(item);
  }

  @autobind
  handleDeleteClick(e: Event, item: any) {
    const {onDelete} = this.props;
    e.preventDefault();
    e.stopPropagation();
    onDelete && onDelete(item);
  }

  @autobind
  menuItemRef(ref: any) {
    ref && this.setState({itemHeight: ref.offsetHeight});
  }

  renderValue({inputValue, isOpen}: ControllerStateAndHelpers<any>) {
    const {
      classnames: cx,
      multiple,
      valuesNoWrap,
      placeholder,
      classPrefix: ns,
      labelField,
      disabled,
      translate: __
    } = this.props;

    const selection = this.state.selection;
    // console.log('selection', selection);

    if (!selection.length) {
      return (
        <div key="placeholder" className={`${ns}Select-placeholder`}>
          {__(placeholder)}
        </div>
      );
    }

    return selection.map((item, index) => {
      if (!multiple) {
        return (
          <div
            className={cx('Select-value', {
              'is-disabled': disabled
            })}
            key={index}
          >
            {item[labelField || 'label']}
          </div>
        );
      }

      return valuesNoWrap ? (
        `${item[labelField || 'label']}${
          index === selection.length - 1 ? '' : ' + '
        }`
      ) : (
        <TooltipWrapper
          placement={'top'}
          tooltip={item[labelField || 'label']}
          trigger={'hover'}
          key={index}
        >
          <div className={`${ns}Select-value`}>
            <span className={`${ns}Select-valueLabel`}>
              {item[labelField || 'label']}
            </span>
            <span
              className={cx('Select-valueIcon', {
                'is-disabled': disabled || item.disabled
              })}
              onClick={this.removeItem.bind(this, index)}
            >
              ×
            </span>
          </div>
        </TooltipWrapper>
      );
    });
  }

  renderOuter({
    selectedItem,
    getItemProps,
    highlightedIndex,
    inputValue,
    isOpen,
    getToggleButtonProps,
    getInputProps
  }: ControllerStateAndHelpers<any>) {
    const {
      popOverContainer,
      options,
      value,
      valueField,
      labelField,
      noResultsText,
      loadOptions,
      creatable,
      multiple,
      valuesNoWrap,
      classnames: cx,
      popoverClassName,
      checkAll,
      checkAllLabel,
      checkAllBySearch,
      searchable,
      createBtnLabel,
      disabled,
      searchPromptText,
      editable,
      removable,
      overlayPlacement,
      translate: __,
      hideSelected,
      renderMenu,
      mobileClassName,
      useMobileUI = false
    } = this.props;
    const {selection} = this.state;

    let checkedAll = false;
    let checkedPartial = false;
    let filtedOptions: Array<Option> = (
      inputValue && isOpen && !loadOptions
        ? matchSorter(options, inputValue, {
            keys: [labelField || 'label', valueField || 'value']
          })
        : options.concat()
    ).filter((option: Option) => !option.hidden && option.visible !== false);

    const selectionValues = selection.map(select => select[valueField]);
    if (multiple && checkAll) {
      const optionsValues = (checkAllBySearch ? filtedOptions : options).map(
        option => option[valueField]
      );

      checkedAll = optionsValues.every(
        option => selectionValues.indexOf(option) > -1
      );
      checkedPartial = optionsValues.some(
        option => selectionValues.indexOf(option) > -1
      );
    }

    const itemHeight = this.state.itemHeight;

    // 渲染单个选项
    const renderItem = ({index, style}: {index: number; style?: object}) => {
      const item = filtedOptions[index];
      if (!item) {
        return null;
      }
      const checked =
        selectedItem === item || !!~selectionValues.indexOf(item[valueField]);
      if (hideSelected && checked) {
        return null;
      }
      return (
        <div
          {...getItemProps({
            key:
              typeof item.value === 'string'
                ? `${item.label}-${item.value}`
                : index,
            index,
            item,
            disabled: item.disabled
          })}
          style={style}
          className={cx(`Select-option`, {
            'is-disabled': item.disabled,
            'is-highlight': highlightedIndex === index,
            'is-active': checked
          })}
        >
          {removable ? (
            <a data-tooltip={__('Select.clear')} data-position="left">
              <Icon
                icon="minus"
                className="icon"
                onClick={(e: any) => this.handleDeleteClick(e, item)}
              />
            </a>
          ) : null}
          {editable ? (
            <a data-tooltip="编辑" data-position="left">
              <Icon
                icon="pencil"
                className="icon"
                onClick={(e: any) => this.handleEditClick(e, item)}
              />
            </a>
          ) : null}

          {renderMenu ? (
            checkAll || multiple ? (
              <Checkbox
                checked={checked}
                trueValue={item.value}
                onChange={() => {
                  this.handleChange(item);
                }}
                disabled={item.disabled}
              >
                {renderMenu(item, {
                  multiple,
                  checkAll,
                  checked,
                  onChange: () => this.handleChange(item),
                  inputValue: inputValue || '',
                  searchable,
                  index
                })}
              </Checkbox>
            ) : (
              renderMenu(item, {
                multiple,
                checkAll,
                checked,
                onChange: () => this.handleChange(item),
                inputValue: inputValue || '',
                searchable,
                index
              })
            )
          ) : multiple ? (
            <Checkbox
              checked={checked}
              trueValue={item.value}
              onChange={() => {
                this.handleChange(item);
              }}
              disabled={item.disabled}
              size="sm"
            >
              {item.disabled
                ? item[labelField]
                : highlight(
                    item[labelField],
                    inputValue as string,
                    cx('Select-option-hl')
                  )}

              {item.tip}
            </Checkbox>
          ) : (
            <span>
              {item.disabled
                ? item[labelField]
                : highlight(
                    item[labelField],
                    inputValue as string,
                    cx('Select-option-hl')
                  )}
              {item.tip}
            </span>
          )}
        </div>
      );
    };

    const mobileUI = isMobile() && useMobileUI;
    const column = {
      labelField: 'label',
      options: filtedOptions
    };
    const menu = (
      <div
        ref={this.menu}
        className={cx('Select-menu', {
          'Select--longlist':
            filtedOptions.length && filtedOptions.length > 100,
          'is-mobile': mobileUI
        })}
      >
        {searchable ? (
          <div
            className={cx(`Select-input`, {
              'is-focused': this.state.isFocused
            })}
          >
            <Icon icon="search" className="icon" />
            <Input
              {...getInputProps({
                onFocus: this.onFocus,
                onBlur: this.onBlur,
                disabled: disabled,
                placeholder: __(searchPromptText),
                onChange: this.handleInputChange,
                ref: this.inputRef
              })}
            />
            {inputValue?.length ? (
              <a onClick={this.clearSearchValue} className={cx('Select-clear')}>
                <Icon icon="close" className="icon" />
              </a>
            ) : null}
          </div>
        ) : null}
        {multiple && valuesNoWrap ? (
          <div className={cx('Select-option')}>
            已选择({selectionValues.length})
          </div>
        ) : null}
        {multiple && checkAll && filtedOptions.length ? (
          <div className={cx('Select-option')}>
            <Checkbox
              checked={checkedPartial}
              partial={checkedPartial && !checkedAll}
              onChange={this.toggleCheckAll}
              size="sm"
            >
              {__(checkAllLabel)}
            </Checkbox>
          </div>
        ) : null}

        <div ref={this.menuItemRef} className={cx('Select-option invisible')}>
          {multiple ? (
            <Checkbox size="sm">Placeholder</Checkbox>
          ) : (
            <span>Placeholder</span>
          )}
        </div>

        {creatable && !disabled ? (
          <a className={cx('Select-addBtn')} onClick={this.handleAddClick}>
            <Icon icon="plus" className="icon" />
            {__(createBtnLabel)}
          </a>
        ) : null}

        {filtedOptions.length ? (
          filtedOptions.length > 100 ? ( // 超过 100 行数据才启用 virtuallist 避免滚动条问题
            <VirtualList
              height={
                filtedOptions.length > 8
                  ? 266
                  : filtedOptions.length * itemHeight
              }
              itemCount={filtedOptions.length}
              itemSize={itemHeight}
              renderItem={renderItem}
            />
          ) : (
            filtedOptions.map((item, index) => {
              return renderItem({index});
            })
          )
        ) : (
          <div className={cx('Select-noResult')}>{__(noResultsText)}</div>
        )}
      </div>
    );
    return mobileUI ? (
      <PopUp
        className={cx(`Select-popup`)}
        container={popOverContainer}
        isShow={this.state.isOpen}
        onHide={this.close}
      >
        {menu}
      </PopUp>
    ) : (
      <Overlay
        container={popOverContainer || this.getTarget}
        target={this.getTarget}
        placement={overlayPlacement}
        show
      >
        <PopOver
          overlay
          className={cx('Select-popover')}
          style={{
            minWidth: this.target ? this.target.offsetWidth : 'auto'
          }}
          onHide={this.close}
        >
          {menu}
        </PopOver>
      </Overlay>
    );
  }

  render() {
    const {
      classnames: cx,
      multiple,
      valuesNoWrap,
      searchable,
      inline,
      className,
      value,
      loading,
      clearable,
      labelField,
      disabled,
      checkAll,
      borderMode,
      useMobileUI
    } = this.props;

    const selection = this.state.selection;
    const inputValue = this.state.inputValue;
    const resetValue = this.props.resetValue;
    const mobileUI = useMobileUI && isMobile();
    return (
      <Downshift
        selectedItem={selection}
        highlightedIndex={this.state.highlightedIndex}
        isOpen={this.state.isOpen}
        inputValue={inputValue}
        onChange={
          /*展示 Checkbox 的时候，会出发多次 onChange 原因待查*/ multiple &&
          checkAll
            ? noop
            : this.handleChange
        }
        onStateChange={this.handleStateChange}
        itemToString={item => (item ? `${item[labelField]}` : '')}
      >
        {(options: ControllerStateAndHelpers<any>) => {
          const {isOpen} = options;
          return (
            <div
              tabIndex={disabled ? -1 : 0}
              onKeyPress={this.handleKeyPress}
              onClick={this.toggle}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              className={cx(
                `Select`,
                {
                  [`Select--multi`]: multiple,
                  [`Select--inline`]: inline,
                  [`Select--searchable`]: searchable,
                  'is-opened': isOpen,
                  'is-focused': this.state.isFocused,
                  'is-disabled': disabled,
                  'is-mobile': mobileUI,
                  [`Select--border${ucFirst(borderMode)}`]: borderMode
                },
                className
              )}
            >
              <div
                className={cx(`Select-valueWrap`, {
                  'Select-valuesNoWrap': valuesNoWrap
                })}
              >
                {this.renderValue(options)}
              </div>
              {clearable &&
              !disabled &&
              (Array.isArray(value) ? value.length : value !== resetValue) ? (
                <a onClick={this.clearValue} className={cx('Select-clear')}>
                  <Icon icon="close-small" className="icon" />
                </a>
              ) : null}
              {loading ? (
                <Spinner
                  show
                  icon="reload"
                  size="sm"
                  spinnerClassName={cx('Select-spinner')}
                />
              ) : null}

              <span className={cx('Select-arrow')}>
                <Icon icon="caret" className="icon" />
              </span>
              {isOpen ? this.renderOuter(options) : null}
            </div>
          );
        }}
      </Downshift>
    );
  }
}

const EnhancedSelect = themeable(
  localeable(
    uncontrollable(Select, {
      value: 'onChange'
    })
  )
);

export default EnhancedSelect;
export const SelectWithRemoteOptions = withRemoteConfig<Array<Options>>({
  adaptor: data => data.options || data.items || data.rows || data,
  normalizeConfig: (options: any, origin) => {
    options = normalizeOptions(options);

    if (Array.isArray(options)) {
      return options.concat();
    }

    return origin;
  }
})(
  class extends React.Component<
    RemoteOptionsProps<Array<Options>> &
      React.ComponentProps<typeof EnhancedSelect>
  > {
    render() {
      const {loading, config, deferLoad, updateConfig, ...rest} = this.props;

      return (
        <EnhancedSelect
          {...rest}
          options={config || rest.options || []}
          loading={loading}
        />
      );
    }
  }
);
