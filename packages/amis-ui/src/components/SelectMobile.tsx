import React from 'react';
import {findDomCompat as findDOMNode} from 'amis-core';
import Picker from './Picker';
import PopUp from './PopUp';
import {autobind, highlight} from 'amis-core';
import merge from 'lodash/merge';
// @ts-ignore
import {matchSorter} from 'match-sorter';
import {Option, value2array, SelectProps} from './Select';
import VirtualList from './virtual-list';
import Checkbox from './Checkbox';
import Input from './Input';
import {Icon} from './icons';

interface SelectState {
  isFocused: boolean;
  inputValue: string;
  itemHeight: number;
  selection: Array<Option>;
}

interface Props extends SelectProps {
  isOpen: boolean;
  highlightedIndex: any;
  selectedItem: any;
  visibleItemCount?: number;
  getInputProps: (...params: any) => any;
  getItemProps: (...params: any) => any;
  onClose: () => void;
}

export default class SelectMobile extends React.Component<Props, SelectState> {
  input: HTMLInputElement;
  target: HTMLElement;

  constructor(props: Props) {
    super(props);
    this.state = {
      selection: value2array(props.value, props),
      isFocused: false,
      inputValue: '',
      itemHeight: 32 /** Select选项高度保持一致 */
    };
  }

  @autobind
  handleChange([item]: any) {
    const {onChange, multiple, simpleValue, valueField, options} = this.props;
    let {selection} = this.state;

    // 单选是字符串
    const selectItem = options.find((option: Option) =>
      multiple
        ? option[valueField] === item[valueField]
        : option[valueField] === item
    );
    if (multiple) {
      const selectionValues = selection.map(item => item[valueField]);
      selection = selection.concat();
      const idx = selectionValues.indexOf(selectItem?.[valueField]);
      if (~idx) {
        selection.splice(idx, 1);
      } else {
        selectItem && selection.push(selectItem);
      }
      this.setState({
        selection
      });
    } else {
      this.setState({
        selection: selectItem ? [selectItem] : []
      });
    }
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
      inputValue && checkAllBySearch !== false
        ? matchSorter(options, inputValue, {
            keys: [labelField || 'label', valueField || 'value'],
            threshold: matchSorter.rankings.CONTAINS
          })
        : options.concat();
    const optionsValues = filtedOptions.map(option => option.value);
    const selectionValues = selection.map(select => select.value);
    const checkedAll = optionsValues.every(
      option => selectionValues.indexOf(option) > -1
    );

    selection = checkedAll ? [] : filtedOptions;

    this.setState({selection});
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
  onFocus(e: any) {
    const {simpleValue} = this.props;
    const {selection} = this.state;
    const value = simpleValue ? selection.map(item => item.value) : selection;

    this.props.disabled ||
      this.props.isOpen ||
      this.setState(
        {
          isFocused: true
        },
        this.focus
      );

    this.props.onFocus &&
      this.props.onFocus({
        ...e,
        value
      });
  }

  @autobind
  onBlur(e: any) {
    const {simpleValue} = this.props;
    const {selection} = this.state;
    const value = simpleValue ? selection.map(item => item.value) : selection;

    this.setState({
      isFocused: false
    });

    this.props.onBlur &&
      this.props.onBlur({
        ...e,
        value
      });
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
  onConfirm() {
    const {selection} = this.state;
    const {
      multiple,
      onChange,
      simpleValue,
      valueField,
      options,
      loadOptions,
      labelField
    } = this.props;
    if (multiple) {
      onChange(
        simpleValue ? selection.map(item => item[valueField]) : selection
      );
    } else {
      const inputValue = this.state.inputValue;
      let filtedOptions: Array<Option> = (
        inputValue && !loadOptions
          ? matchSorter(options, inputValue, {
              keys: [labelField || 'label', valueField || 'value'],
              threshold: matchSorter.rankings.CONTAINS
            })
          : options.concat()
      ).filter((option: Option) => !option.hidden && option.visible !== false);
      // picker 打开未滑动时选中第一项
      if (!selection.length && filtedOptions.length) {
        onChange(
          simpleValue ? filtedOptions[0]?.[valueField] : filtedOptions[0]
        );
      } else {
        onChange(simpleValue ? selection[0]?.[valueField] : selection[0]);
      }
    }
  }

  render() {
    const {
      popOverContainer,
      options,
      valueField,
      labelField,
      noResultsText,
      loadOptions,
      multiple,
      valuesNoWrap,
      classnames: cx,
      checkAll,
      checkAllLabel,
      checkAllBySearch,
      searchable,
      disabled,
      searchPromptText,
      visibleItemCount,
      translate: __,
      hideSelected,
      renderMenu,
      virtualThreshold = 100,
      isOpen,
      onClose,
      getInputProps,
      getItemProps,
      selectedItem
    } = this.props;

    const {selection} = this.state;

    const inputValue = this.state.inputValue;
    let checkedAll = false;
    let checkedPartial = false;
    let filtedOptions: Array<Option> = (
      inputValue && isOpen && !loadOptions
        ? matchSorter(options, inputValue, {
            keys: [labelField || 'label', valueField || 'value'],
            threshold: matchSorter.rankings.CONTAINS
          })
        : options.concat()
    ).filter(
      (option: Option) =>
        !option.hidden &&
        option.visible !== false &&
        option[labelField || 'label']
    );
    const enableVirtualRender =
      filtedOptions.length && filtedOptions.length > virtualThreshold;
    const selectionValues = selection.map(select => select[valueField]);
    if (multiple && checkAll) {
      const optionsValues = (
        checkAllBySearch !== false ? filtedOptions : options
      ).map(option => option[valueField]);

      checkedAll = optionsValues.every(
        option => selectionValues.indexOf(option) > -1
      );
      checkedPartial = optionsValues.some(
        option => selectionValues.indexOf(option) > -1
      );
    }

    // 用于虚拟渲染的每项高度
    const virtualItemHeight = this.props.itemHeight || this.state.itemHeight;

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
          style={merge(style, enableVirtualRender ? {width: '100%'} : {})}
          className={cx(`Select-option`, {
            'is-disabled': item.disabled,
            'is-active': checked,
            'is-mobile': true
          })}
        >
          {renderMenu ? (
            multiple ? (
              <>
                <div
                  title={item[labelField]}
                  className={cx('Select-option-item-check')}
                  onClick={() => !item.disabled && this.handleChange([item])}
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
                </div>
                {checked ? (
                  <Icon icon="check" className={cx('Select-option-mcheck')} />
                ) : null}
              </>
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
            <>
              <div
                title={item[labelField]}
                className={cx('Select-option-item-check')}
                onClick={() => !item.disabled && this.handleChange([item])}
              >
                {item.disabled
                  ? item[labelField]
                  : highlight(
                      item[labelField],
                      inputValue as string,
                      cx('Select-option-hl')
                    )}

                {item.tip}
              </div>
              {checked ? (
                <Icon icon="check" className={cx('Select-option-mcheck')} />
              ) : null}
            </>
          ) : (
            <span
              className={cx('Select-option-content')}
              title={
                typeof item[labelField] === 'string' ? item[labelField] : ''
              }
            >
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

    const searchInput = (
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
    );

    const menu = (
      <div
        className={cx('Select-menu', {
          'Select--longlist': enableVirtualRender,
          'is-mobile': true
        })}
      >
        {searchable ? searchInput : null}
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

        {filtedOptions.length ? (
          filtedOptions.length > virtualThreshold ? ( // 较多数据时才启用 virtuallist，避免滚动条问题
            <VirtualList
              height={
                filtedOptions.length > 8
                  ? 266
                  : filtedOptions.length * virtualItemHeight
              }
              itemCount={filtedOptions.length}
              itemSize={virtualItemHeight}
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

    return (
      <PopUp
        className={cx(`Select-popup`)}
        container={popOverContainer}
        isShow={isOpen}
        showConfirm={true}
        onConfirm={this.onConfirm}
        onHide={onClose}
      >
        {multiple ? (
          menu
        ) : (
          <div className={cx(`Select-popup-inner`)}>
            {searchable ? searchInput : null}
            <Picker
              className={'Select-picker'}
              columns={{
                options: filtedOptions as Option[],
                optionRender: renderMenu
              }}
              highlightTxt={inputValue}
              onChange={item => this.handleChange(item as any)}
              showToolbar={false}
              labelField={labelField}
              valueField={valueField}
              itemHeight={40}
              visibleItemCount={visibleItemCount}
              value={[selection[0]?.[valueField]]}
            />
          </div>
        )}
      </PopUp>
    );
  }
}
