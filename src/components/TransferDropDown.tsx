import {localeable} from '../locale';
import {themeable} from '../theme';
import {Transfer, TransferProps} from './Transfer';
import {uncontrollable} from 'uncontrollable';
import React from 'react';
import ResultBox from './ResultBox';
import {Icon} from './icons';
import InputBox from './InputBox';
import PopOverContainer from './PopOverContainer';

export interface TransferDropDownProps extends TransferProps {
  // 新的属性？
  multiple?: boolean;
  borderMode?: 'full' | 'half' | 'none';
}

export class TransferDropDown extends Transfer<TransferDropDownProps> {
  render() {
    const {
      classnames: cx,
      value,
      translate: __,
      disabled,
      className,
      onChange,
      onSearch,
      multiple,
      borderMode
    } = this.props;
    const {inputValue, searchResult} = this.state;

    return (
      <PopOverContainer
        popOverClassName={cx('TransferDropDown-popover')}
        popOverRender={({onClose}) => (
          <div className={cx('TransferDropDown-content')}>
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
            result={
              multiple
                ? value
                : value?.[0]
                ? this.props.itemRender(value[0])
                : null
            }
            onResultChange={onChange}
            onResultClick={onClick}
            placeholder={__('Select.placeholder')}
            disabled={disabled}
            ref={ref}
          >
            <span className={cx('TransferDropDown-icon')}>
              <Icon icon="caret" className="icon" />
            </span>
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
