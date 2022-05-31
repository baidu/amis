import {localeable} from 'amis-core';
import {themeable} from 'amis-core';
import {Transfer, TransferProps} from './Transfer';
import {uncontrollable} from 'uncontrollable';
import React from 'react';
import ResultBox from './ResultBox';
import {Icon} from './icons';
import InputBox from './InputBox';
import PopOverContainer from './PopOverContainer';
import {isMobile} from 'amis-core';

export interface TransferDropDownProps extends TransferProps {
  // 新的属性？
  multiple?: boolean;
  borderMode?: 'full' | 'half' | 'none';
  useMobileUI?: boolean;
  popOverContainer?: any;
  itemRender: (value: any) => JSX.Element | string;
}

export class TransferDropDown extends Transfer<TransferDropDownProps> {
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
      useMobileUI,
      popOverContainer
    } = this.props;
    const {inputValue, searchResult} = this.state;

    const mobileUI = useMobileUI && isMobile();
    return (
      <PopOverContainer
        useMobileUI={useMobileUI}
        popOverContainer={popOverContainer}
        popOverClassName={cx('TransferDropDown-popover')}
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
                  placeholder={__('Transfer.searchKeyword')}
                  clearable={false}
                  onKeyDown={this.handleSearchKeyDown}
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
                  value,
                  onChange: multiple
                    ? onChange
                    : (value: any) => {
                        onClose();
                        onChange?.(value);
                      },
                  multiple
                })
              : this.renderOptions({
                  ...this.props,
                  value,
                  onChange: multiple
                    ? onChange
                    : (value: any) => {
                        onClose();
                        onChange?.(value);
                      },
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
              isOpened ? 'is-active' : ''
            )}
            borderMode={borderMode}
            allowInput={false}
            result={multiple ? value : value?.[0] ? value?.[0] : null}
            onResultChange={onChange}
            onResultClick={onClick}
            placeholder={__('Select.placeholder')}
            disabled={disabled}
            clearable={clearable}
            ref={ref}
            itemRender={itemRender}
            useMobileUI={useMobileUI}
          >
            {!mobileUI ? (
              <span className={cx('TransferDropDown-icon')}>
                <Icon icon="right-arrow-bold" className="icon" />
              </span>
            ) : (
              <></>
            )}
          </ResultBox>
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
