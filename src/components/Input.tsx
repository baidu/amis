/**
 * @file 这个 Input 与系统默认的 input 不同的地方在于，
 * 中文输入过程中不会触发 onChange 事件。对于 autoComplete
 * 功能很有必要。
 */
import React from 'react';
import {autobind} from '../utils/helper';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  forwardedRef: React.Ref<HTMLInputElement>;
}

export interface InputState {
  value: any;
}

class InputInner extends React.Component<InputProps, InputState> {
  isOnComposition: boolean = false;
  state = {value: this.props.value};

  componentDidUpdate(prevProps: InputProps) {
    const props = this.props;
    if (prevProps.value !== props.value) {
      this.setState({
        value: props.value
      });
    }
  }

  @autobind
  handleComposition(e: React.CompositionEvent<HTMLInputElement>) {
    this.isOnComposition = e.type !== 'compositionend';
    if (!this.isOnComposition) {
      this.handleChange(e as any);
    }
  }

  @autobind
  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const {onChange} = this.props;
    const value = e.currentTarget.value;

    this.isOnComposition || (onChange && onChange(e));
    this.setState({
      value
    });
  }

  render() {
    const {forwardedRef, ...rest} = this.props;

    return (
      <input
        type="text"
        {...rest}
        value={this.state.value}
        ref={forwardedRef}
        onChange={this.handleChange}
        onCompositionStart={this.handleComposition}
        onCompositionUpdate={this.handleComposition}
        onCompositionEnd={this.handleComposition}
      />
    );
  }
}

export default React.forwardRef<HTMLInputElement>((props, ref) => {
  return <InputInner {...props} forwardedRef={ref} />;
}) as React.ComponentType<
  React.InputHTMLAttributes<HTMLInputElement> & {ref?: any}
>;
