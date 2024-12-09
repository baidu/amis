import {localeable} from 'amis-core';
import {themeable} from 'amis-core';
import Transfer, {TransferProps} from './Transfer';
import {uncontrollable} from 'amis-core';
import React from 'react';
import ResultBox from './ResultBox';
import {Icon} from './icons';
import PickerContainer from './PickerContainer';
import {autobind, mapTree} from 'amis-core';

export interface TransferPickerProps extends Omit<TransferProps, 'itemRender'> {
  // 新的属性？
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

  /**
   * 边框模式，全边框，还是半边框，或者没边框。
   */
  borderMode?: 'full' | 'half' | 'none';

  onFocus?: () => void;
  onItemClick?: (item: Object) => void;
  onBlur?: () => void;
  popOverContainer?: any;
}

export interface TransferPickerState {
  tempValue?: any;
}

export class TransferPicker extends React.Component<
  TransferPickerProps,
  TransferPickerState
> {
  state: TransferPickerState = {
    tempValue: null
  };
  optionModified = false;
  @autobind
  handleConfirm(value: any) {
    this.setState({
      tempValue: null
    });
    this.props.onChange?.(value, this.optionModified);
    this.optionModified = false;
  }

  @autobind
  onFocus() {
    this.props.onFocus?.();
  }

  @autobind
  onBlur() {
    this.setState({
      tempValue: null
    });
    this.props.onBlur?.();
  }

  render() {
    const {
      classnames: cx,
      value,
      translate: __,
      disabled,
      className,
      onChange,
      onItemClick,
      size,
      borderMode,
      labelField = 'label',
      mobileUI,
      popOverContainer,
      maxTagCount,
      overflowTagPopover,
      placeholder,
      ...rest
    } = this.props;

    const tp = {
      value: this.state.tempValue || value,
      onChange: (value: any) => {
        this.setState({
          tempValue: value
        });
      }
    };

    return (
      <PickerContainer
        title={__('Select.placeholder')}
        onFocus={this.onFocus}
        onClose={this.onBlur}
        mobileUI={mobileUI}
        popOverContainer={popOverContainer}
        bodyRender={({onClose, value, onChange, setState, ...states}) => {
          return (
            <Transfer
              mobileUI={mobileUI}
              {...rest}
              {...states}
              value={value}
              labelField={labelField}
              onChange={(value: any, optionModified) => {
                if (optionModified) {
                  let options = mapTree(rest.options, item => {
                    return (
                      value.find((a: any) => a.value === item.value) || item
                    );
                  });
                  this.optionModified = true;
                  setState({options, value});
                } else {
                  tp.onChange(value);
                }
              }}
            />
          );
        }}
        value={tp.value}
        onConfirm={this.handleConfirm}
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
            onItemClick={onItemClick}
            onResultChange={onChange}
            onResultClick={onClick}
            placeholder={placeholder ?? __('Select.placeholder')}
            disabled={disabled}
            borderMode={borderMode}
            itemRender={option => (
              <span>{(option && option[labelField]) || 'undefined'}</span>
            )}
            mobileUI={mobileUI}
            maxTagCount={maxTagCount}
            overflowTagPopover={overflowTagPopover}
          >
            {!mobileUI ? (
              <span className={cx('TransferPicker-icon')}>
                <Icon icon="pencil" className="icon" />
              </span>
            ) : null}
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
