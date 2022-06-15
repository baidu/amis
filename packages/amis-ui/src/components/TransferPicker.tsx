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

  onBlur?: () => void;
}

export class TransferPicker extends React.Component<TransferPickerProps> {
  optionModified = false;
  @autobind
  handleConfirm(value: any) {
    this.props.onChange?.(value, this.optionModified);
    this.optionModified = false;
  }

  @autobind
  onFoucs() {
    this.props.onFocus?.();
  }

  @autobind
  onBlur() {
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
      size,
      borderMode,
      ...rest
    } = this.props;

    return (
      <PickerContainer
        title={__('Select.placeholder')}
        onFocus={this.onFoucs}
        onClose={this.onBlur}
        bodyRender={({onClose, value, onChange, setState, ...states}) => {
          return (
            <Transfer
              {...rest}
              {...states}
              value={value}
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
                  onChange(value);
                }
              }}
            />
          );
        }}
        value={value}
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
            onResultChange={onChange}
            onResultClick={onClick}
            placeholder={__('Select.placeholder')}
            disabled={disabled}
            borderMode={borderMode}
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
