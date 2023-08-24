import {localeable} from 'amis-core';
import {themeable} from 'amis-core';
import {Transfer, TransferProps, TransferState} from './Transfer';
import {uncontrollable, autobind} from 'amis-core';
import React from 'react';
import ResultBox from './ResultBox';
import {Icon} from './icons';
import InputBox from './InputBox';
import PopOverContainer, {
  OverlayAlignType,
  PopOverOverlay
} from './PopOverContainer';

import type {TooltipObject} from './TooltipWrapper';

export interface TransferDropDownProps extends TransferProps {
  // 新的属性？
  multiple?: boolean;
  borderMode?: 'full' | 'half' | 'none';
  popOverContainer?: any;
  itemRender: (value: any) => JSX.Element | string;
  maxTagCount?: number;
  overflowTagPopover?: TooltipObject;
  overlayAlign?: OverlayAlignType;
  overlayWidth?: string;
  overlay?: PopOverOverlay;
}

export class TransferDropDown extends Transfer<TransferDropDownProps> {
  constructor(props: TransferDropDownProps) {
    super(props);
    this.state = {
      tempValue: props.value,
      inputValue: '',
      searchResult: null,
      isTreeDeferLoad: false,
      resultSelectMode: 'list'
    };
  }

  componentDidUpdate(prevProps: TransferDropDownProps) {
    if (this.props.value !== prevProps.value) {
      this.setState({
        tempValue: this.props.value
      });
    }
  }

  @autobind
  handleAfterPopoverHide() {
    this.setState({inputValue: '', searchResult: null});
  }

  @autobind
  handleChange(value: any, onClose: () => void) {
    const {multiple, onChange, mobileUI} = this.props;

    if (mobileUI) {
      this.setState({tempValue: value});
    } else {
      onChange?.(value);
      if (!multiple) {
        onClose();
      }
    }
  }

  @autobind
  onConfirm() {
    const {onChange} = this.props;
    onChange?.(this.state.tempValue as (typeof Option)[]);
  }

  render() {
    const {
      classnames: cx,
      value,
      itemRender,
      translate: __,
      disabled,
      clearable,
      className,
      onChange,
      onSearch,
      multiple,
      borderMode,
      mobileUI,
      popOverContainer,
      placeholder,
      maxTagCount,
      overflowTagPopover,
      itemHeight,
      virtualThreshold,
      showInvalidMatch,
      overlay
    } = this.props;
    const {inputValue, searchResult} = this.state;

    return (
      <PopOverContainer
        onAfterHide={this.handleAfterPopoverHide}
        mobileUI={mobileUI}
        popOverContainer={popOverContainer}
        overlayWidth={overlay && overlay?.width}
        align={overlay && overlay?.align}
        popOverClassName={cx('TransferDropDown-popover')}
        showConfirm
        onConfirm={this.onConfirm}
        popOverRender={({onClose}) => (
          <div
            className={cx('TransferDropDown-content', {
              'is-mobile': mobileUI
            })}
          >
            {onSearch ? (
              <div className={cx('Transfer-search')}>
                <InputBox
                  value={inputValue}
                  onChange={this.handleSearch}
                  placeholder={placeholder ?? __('Transfer.searchKeyword')}
                  clearable={false}
                  onKeyDown={this.handleSearchKeyDown}
                  mobileUI={mobileUI}
                >
                  {searchResult !== null ? (
                    <a onClick={this.handleSeachCancel}>
                      <Icon icon="close" className="icon" />
                    </a>
                  ) : (
                    <Icon icon="search" className="icon" />
                  )}
                </InputBox>
              </div>
            ) : null}
            {searchResult !== null
              ? this.renderSearchResult({
                  ...this.props,
                  value: this.state.tempValue,
                  onChange: value => this.handleChange(value, onClose),
                  multiple
                })
              : this.renderOptions({
                  ...this.props,
                  value: this.state.tempValue,
                  onChange: value => this.handleChange(value, onClose),
                  multiple
                })}
          </div>
        )}
      >
        {({onClick, isOpened, ref}) => (
          <ResultBox
            className={cx(
              'TransferDropDown',
              className,
              isOpened ? 'is-opened' : ''
            )}
            borderMode={borderMode}
            allowInput={false}
            result={multiple ? value : value?.[0] ? value?.[0] : null}
            onResultChange={onChange}
            onResultClick={onClick}
            placeholder={placeholder ?? __('Select.placeholder')}
            disabled={disabled}
            clearable={clearable}
            maxTagCount={maxTagCount}
            overflowTagPopover={overflowTagPopover}
            popOverContainer={popOverContainer}
            ref={ref}
            itemRender={itemRender}
            mobileUI={mobileUI}
            hasDropDownArrow={!mobileUI}
            showInvalidMatch={showInvalidMatch}
          />
        )}
      </PopOverContainer>
    );
  }
}

export default themeable(
  localeable(
    uncontrollable(TransferDropDown, {
      value: 'onChange'
    })
  )
);
