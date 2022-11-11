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
import ConfirmBox, {ConfirmBoxProps} from './ConfirmBox';

export interface PickerContainerProps
  extends ThemeProps,
    LocaleProps,
    Omit<ConfirmBoxProps, 'children' | 'type'> {
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
  async confirm(): Promise<any> {
    const {onConfirm, beforeConfirm} = this.props;

    const ret = await beforeConfirm?.(this.bodyRef.current);
    let state: any = {
      isOpened: false
    };

    // beforeConfirm 返回 false 则阻止后续动作
    if (ret === false) {
      return false;
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
      bodyClassName,
      translate: __,
      size,
      showFooter,
      closeOnEsc
    } = this.props;
    return (
      <>
        {children({
          isOpened: this.state.isOpened,
          onClick: this.handleClick,
          setState: this.updateState
        })}

        <ConfirmBox
          type="dialog"
          size={size}
          closeOnEsc={closeOnEsc}
          show={this.state.isOpened}
          onCancel={this.close}
          title={title || __('Select.placeholder')}
          showTitle={showTitle}
          headerClassName={headerClassName}
          bodyClassName={bodyClassName}
          showFooter={showFooter}
          beforeConfirm={this.confirm}
        >
          {() =>
            popOverRender({
              ...(this.state as any),
              ref: this.bodyRef,
              setState: this.updateState,
              onClose: this.close,
              onChange: this.handleChange,
              onConfirm: this.confirm
            })!
          }
        </ConfirmBox>
      </>
    );
  }
}

export default themeable(localeable(PickerContainer));
