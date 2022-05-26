import React from 'react';
import {
  autobind,
  isObject,
  themeable,
  ThemeProps,
  localeable,
  LocaleProps
} from 'amis-core';
import Modal from './Modal';
import Button from './Button';

export interface PickerContainerProps extends ThemeProps, LocaleProps {
  title?: string;
  showTitle?: boolean;
  showFooter?: boolean;
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
  }) => JSX.Element | null;
  value?: any;
  beforeConfirm?: (bodyRef: any) => any;
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
  bodyRef = React.createRef<any>();

  componentDidUpdate(prevProps: PickerContainerProps) {
    const props = this.props;

    if (props.value !== prevProps.value) {
      this.setState({
        value: props.value
      });
    }
  }

  @autobind
  async handleClick() {
    const state = {
      ...(await this.props.onPickerOpen?.(this.props)),
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
  async confirm() {
    const {onConfirm, beforeConfirm} = this.props;

    const ret = await beforeConfirm?.(this.bodyRef.current);
    let state: any = {
      isOpened: false
    };

    // beforeConfirm 返回 false 则阻止后续动作
    if (ret === false) {
      return;
    } else if (isObject(ret)) {
      state.value = ret;
    }

    this.setState(state, () => onConfirm?.(this.state.value));
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
      size,
      showFooter
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
              ref: this.bodyRef,
              setState: this.updateState,
              onClose: this.close,
              onChange: this.handleChange,
              onConfirm: this.confirm
            })}
          </Modal.Body>
          {showFooter ?? true ? (
            <Modal.Footer>
              <Button onClick={this.close}>{__('cancel')}</Button>
              <Button onClick={this.confirm} level="primary">
                {__('confirm')}
              </Button>
            </Modal.Footer>
          ) : null}
        </Modal>
      </>
    );
  }
}

export default themeable(localeable(PickerContainer));
