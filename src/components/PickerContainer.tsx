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
  showTitle?: boolean;
  headerClassName?: string;
  children: (props: {
    onClick: (e: React.MouseEvent) => void;
    setState: (state: any) => void;
    isOpened: boolean;
  }) => JSX.Element;
  bodyRender: (props: {
    onClose: () => void;
    value: any;
    onChange: (value: any) => void;
    setState: (state: any) => void;
    [propName: string]: any;
  }) => JSX.Element;
  value?: any;
  onConfirm?: (value?: any) => void;
  onCancel?: () => void;
  popOverContainer?: any;
  popOverClassName?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  onFocus?: () => void;
  onClose?: () => void;

  onPickerOpen?: (props: PickerContainerProps) => any;
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
    const state = {
      ...this.props.onPickerOpen?.(this.props),
      isOpened: true
    };
    this.setState(state, () => this.props.onFocus?.());
  }

  @autobind
  close(e?: any, callback?: () => void) {
    this.setState(
      {
        isOpened: false
      },
      () => {
        this.props.onClose?.();
        if (callback) {
          callback();
          return;
        }
        this.props.onCancel?.();
      }
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

  @autobind
  updateState(state: any = {}) {
    const {isOpened, ...rest} = state;
    this.setState({
      ...this.state,
      ...rest
    });
  }

  render() {
    const {
      children,
      bodyRender: popOverRender,
      title,
      showTitle,
      headerClassName,
      translate: __,
      size
    } = this.props;
    return (
      <>
        {children({
          isOpened: this.state.isOpened,
          onClick: this.handleClick,
          setState: this.updateState
        })}

        <Modal
          size={size}
          closeOnEsc
          show={this.state.isOpened}
          onHide={this.close}
        >
          {showTitle !== false ? (
            <Modal.Header onClose={this.close} className={headerClassName}>
              {__(title || 'Select.placeholder')}
            </Modal.Header>
          ) : null}
          <Modal.Body>
            {popOverRender({
              ...(this.state as any),
              setState: this.updateState,
              onClose: this.close,
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
