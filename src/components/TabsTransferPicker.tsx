import {localeable} from '../locale';
import {themeable} from '../theme';
import {uncontrollable} from 'uncontrollable';
import React from 'react';
import ResultBox from './ResultBox';
import {Icon} from './icons';
import PickerContainer from './PickerContainer';
import {autobind} from '../utils/helper';
import TabsTransfer, {TabsTransferProps} from './TabsTransfer';

export interface TabsTransferPickerProps
  extends Omit<TabsTransferProps, 'itemRender'> {
  // 新的属性？
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export class TransferPicker extends React.Component<TabsTransferPickerProps> {
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
      size,
      ...rest
    } = this.props;

    return (
      <PickerContainer
        title={__('Select.placeholder')}
        popOverRender={({onClose, value, onChange}) => {
          return <TabsTransfer {...rest} value={value} onChange={onChange} />;
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
