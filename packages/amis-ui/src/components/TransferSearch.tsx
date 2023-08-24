/**
 * Tranasfer搜索
 */
import React from 'react';
import debounce from 'lodash/debounce';

import {ThemeProps, themeable} from 'amis-core';
import {Icon} from './icons';
import {autobind} from 'amis-core';
import {LocaleProps, localeable} from 'amis-core';
import InputBox from './InputBox';

export interface TransferSearchProps extends ThemeProps, LocaleProps {
  className?: string;
  placeholder: string;
  onSearch: Function;
  onCancelSearch: Function;
}

export interface ItemRenderStates {
  index: number;
  disabled?: boolean;
  onChange: (value: any, name: string) => void;
}

interface TransferSearchState {
  inputValue: string;
}

export class TransferSearch extends React.Component<
  TransferSearchProps,
  TransferSearchState
> {
  state: TransferSearchState = {
    inputValue: ''
  };

  cancelSearch?: () => void;

  componentWillUnmount() {
    this.lazySearch.cancel();
  }

  @autobind
  handleSearch(inputValue: string) {
    // text 有值的时候，走搜索否则直接走 handleSeachCancel ，等同于右侧的 clear 按钮
    this.setState({inputValue}, () => {
      if (inputValue) {
        // 如果有取消搜索，先取消掉。
        this.cancelSearch && this.cancelSearch();
        this.lazySearch();
      } else {
        this.handleSeachCancel();
      }
    });
  }

  lazySearch = debounce(
    () => {
      const {inputValue} = this.state;
      // 防止由于防抖导致空值问题
      if (!inputValue) {
        return;
      }
      const {onSearch} = this.props;
      onSearch!(inputValue);
    },
    250,
    {trailing: true, leading: false}
  );

  @autobind
  handleSearchKeyDown(e: React.KeyboardEvent<any>) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  @autobind
  handleSeachCancel() {
    this.props.onCancelSearch?.();
    this.setState({
      inputValue: ''
    });
  }

  @autobind
  clearInput() {
    this.setState({
      inputValue: ''
    });
  }

  render() {
    const {classnames: cx, translate: __, placeholder, mobileUI} = this.props;

    const {inputValue} = this.state;

    return (
      <div className={cx('Transfer-search')}>
        <InputBox
          value={inputValue}
          onChange={this.handleSearch}
          clearable={false}
          onKeyDown={this.handleSearchKeyDown}
          placeholder={placeholder}
          mobileUI={mobileUI}
        >
          {!!inputValue ? (
            <a onClick={this.handleSeachCancel}>
              <Icon icon="close" className="icon" />
            </a>
          ) : (
            <Icon icon="search" className="icon" />
          )}
        </InputBox>
      </div>
    );
  }
}

export default themeable(localeable(TransferSearch));
