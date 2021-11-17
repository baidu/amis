import {localeable} from '../locale';
import {themeable} from '../theme';
import {Transfer, TransferProps} from './Transfer';
import {uncontrollable} from 'uncontrollable';
import React from 'react';
import ResultBox from './ResultBox';
import {Icon} from './icons';
import PickerContainer from './PickerContainer';
import InputBox from './InputBox';
import {BaseSelection} from './Selection';
import {autobind, flattenTree} from '../utils/helper';
import ResultList from './ResultList';
import {Options} from './Select';

export interface TransferPickerProps extends TransferProps {
  // 新的属性？
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export class TransferPicker extends Transfer<TransferPickerProps> {
  handlePickerToggleAll(value: any, onChange: (value: any) => void) {
    const {options, option2value} = this.props;
    let valueArray = BaseSelection.value2array(value, options, option2value);
    const availableOptions = flattenTree(options).filter(
      (option, index, list) =>
        !option.disabled &&
        option.value !== void 0 &&
        list.indexOf(option) === index
    );

    if (valueArray.length < availableOptions.length) {
      valueArray = availableOptions;
    } else {
      valueArray = [];
    }

    let newValue: string | Options = option2value
      ? valueArray.map(item => option2value(item))
      : valueArray;

    onChange && onChange(newValue);
  }

  @autobind
  handleClose() {
    this.setState({
      inputValue: '',
      searchResult: null
    });
  }

  @autobind
  handleConfirm(value: any) {
    this.props.onChange?.(value);
    this.handleClose();
  }

  render() {
    const {
      classnames: cx,
      value,
      translate: __,
      disabled,
      className,
      onChange,
      onSearch,
      options,
      option2value,
      inline,
      showArrow,
      resultTitle,
      statistics,
      sortable,
      resultItemRender,
      size
    } = this.props;

    return (
      <PickerContainer
        title={__('Select.placeholder')}
        popOverRender={({onClose, value, onChange}) => {
          this.valueArray = BaseSelection.value2array(
            value,
            options,
            option2value
          );
          this.availableOptions = flattenTree(options).filter(
            (option, index, list) =>
              !option.disabled &&
              option.value !== void 0 &&
              list.indexOf(option) === index
          );
          return (
            <>
              <div
                className={cx(
                  'Transfer',
                  className,
                  inline ? 'Transfer--inline' : ''
                )}
              >
                <div className={cx('Transfer-select')}>
                  {this.renderSelect({
                    ...this.props,
                    value,
                    onChange,
                    onToggleAll: () =>
                      this.handlePickerToggleAll(value, onChange)
                  })}
                </div>
                <div className={cx('Transfer-mid')}>
                  {showArrow /*todo 需要改成确认模式，即：点了按钮才到右边 */ ? (
                    <div className={cx('Transfer-arrow')}>
                      <Icon icon="right-arrow" className="icon" />
                    </div>
                  ) : null}
                </div>
                <div className={cx('Transfer-result')}>
                  <div className={cx('Transfer-title')}>
                    <span>
                      {__(resultTitle || 'Transfer.selectd')}
                      {statistics !== false ? (
                        <span>
                          （{this.valueArray.length}/
                          {this.availableOptions.length}）
                        </span>
                      ) : null}
                    </span>
                    <a
                      onClick={this.clearAll}
                      className={cx(
                        'Transfer-clearAll',
                        disabled || !this.valueArray.length ? 'is-disabled' : ''
                      )}
                    >
                      {__('clear')}
                    </a>
                  </div>
                  <ResultList
                    className={cx('Transfer-selections')}
                    sortable={sortable}
                    disabled={disabled}
                    value={value}
                    onChange={onChange}
                    placeholder={__('Transfer.selectFromLeft')}
                    itemRender={resultItemRender}
                  />
                </div>
              </div>
            </>
          );
        }}
        value={value}
        onConfirm={this.handleConfirm}
        onCancel={this.handleClose}
        size={size}
      >
        {({onClick, isOpened}) => (
          <ResultBox
            className={cx(
              'TransferPicker',
              className,
              isOpened ? 'is-active' : ''
            )}
            allowInput={false}
            result={value}
            onResultChange={onChange}
            onResultClick={onClick}
            placeholder={__('Select.placeholder')}
            disabled={disabled}
          >
            <span className={cx('TransferPicker-icon')}>
              <Icon icon="pencil" className="icon" />
            </span>
          </ResultBox>
        )}
      </PickerContainer>
    );
  }
}

export default themeable(
  localeable(
    uncontrollable(TransferPicker, {
      value: 'onChange'
    })
  )
);
