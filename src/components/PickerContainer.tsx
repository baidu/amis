import React from 'react';
import {autobind} from '../utils/helper';
import Overlay from './Overlay';
import PopOver from './PopOver';
import {findDOMNode} from 'react-dom';
import Modal from './Modal';
import {themeable, ThemeProps} from '../theme';
import {localeable, LocaleProps} from '../locale';
import Button from './Button';

export interface PickerContainerProps extends ThemeProps, LocaleProps {
  title?: string;
  children: (props: {
    onClick: (e: React.MouseEvent) => void;
    isOpened: boolean;
  }) => JSX.Element;
  popOverRender: (props: {
    onClose: () => void;
    value: any;
    onChange: (value: any) => void;
  }) => JSX.Element;
  value?: any;
  onConfirm?: (value?: any) => void;
  onCancel?: () => void;
  popOverContainer?: any;
  popOverClassName?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export interface PickerContainerState {
  isOpened: boolean;
  value?: any;
}

export class PickerContainer extends React.Component<
  PickerContainerProps,
  PickerContainerState
> {
  state: PickerContainerState = {
    isOpened: false,
    value: this.props.value
  };

  componentDidUpdate(prevProps: PickerContainerProps) {
    const props = this.props;

    if (props.value !== prevProps.value) {
      this.setState({
        value: props.value
      });
    }
  }

  @autobind
  handleClick() {
    this.setState({
      isOpened: true
    });
  }

  @autobind
  close(e?: any, callback?: () => void) {
    this.setState(
      {
        isOpened: false
      },
      callback || (() => this.props.onCancel?.())
    );
  }

  @autobind
  handleChange(value: any) {
    this.setState({
      value
    });
  }

  @autobind
  confirm() {
    const {onConfirm} = this.props;

    this.close(undefined, () => onConfirm?.(this.state.value));
  }

  render() {
    const {
      children,
      popOverRender: dropdownRender,
      title,
      translate: __,
      size
    } = this.props;
    return (
      <>
        {children({
          isOpened: this.state.isOpened,
          onClick: this.handleClick
        })}

        <Modal
          size={size}
          closeOnEsc
          show={this.state.isOpened}
          onHide={this.close}
        >
          <Modal.Header onClose={this.close}>
            {__(title || 'Select.placeholder')}
          </Modal.Header>
          <Modal.Body>
            {dropdownRender({
              onClose: this.close,
              value: this.state.value,
              onChange: this.handleChange
            })}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>{__('cancel')}</Button>
            <Button onClick={this.confirm} level="primary">
              {__('confirm')}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default themeable(localeable(PickerContainer));
