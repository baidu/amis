import {localeable} from 'amis-core';
import {themeable} from 'amis-core';
import {uncontrollable} from 'amis-core';
import React from 'react';
import ResultBox from './ResultBox';
import {Icon} from './icons';
import PickerContainer from './PickerContainer';
import {autobind, mapTree} from 'amis-core';
import TabsTransfer, {TabsTransferProps} from './TabsTransfer';

export interface TabsTransferPickerProps
  extends Omit<TabsTransferProps, 'itemRender'> {
  // 新的属性？
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  onFocus?: () => void;
  onBlur?: () => void;
}

export class TransferPicker extends React.Component<TabsTransferPickerProps> {
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
      ...rest
    } = this.props;

    return (
      <PickerContainer
        title={__('Select.placeholder')}
        onFocus={this.onFoucs}
        onClose={this.onBlur}
        bodyRender={({onClose, value, onChange, setState, ...states}) => {
          return (
            <TabsTransfer
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
