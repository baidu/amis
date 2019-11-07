import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {ServiceStore, IServiceStore} from '../store/service';
import {Api, SchemaNode, PlainObject} from '../types';
import {filter} from '../utils/tpl';
import cx from 'classnames';
import Switch from '../components/Switch';
import {resolveVariable} from '../utils/tpl-builtin';

export interface SwitchProps extends RendererProps {
  className?: string;
  placeholder?: string;
  format?: string;
  valueFormat?: string;
  map: PlainObject;
}

export class SwitchField extends React.Component<SwitchProps, object> {
  static defaultProps: Partial<SwitchProps> = {
    placeholder: '-',
    trueValue: true,
    falseValue: false,
    readOnly: true,
    saveImmediately: false
  };

  constructor(props: SwitchProps) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(checked: boolean) {
    const {
      onQuickChange,
      name,
      trueValue,
      falseValue,
      saveImmediately,
      readOnly,
      disabled
    } = this.props;

    onQuickChange &&
      !readOnly &&
      !disabled &&
      onQuickChange(
        {
          [name as string]: checked ? trueValue : falseValue
        },
        saveImmediately
      );
  }

  render() {
    const {
      className,
      classPrefix: ns,
      placeholder,
      trueValue,
      falseValue,
      onQuickChange,
      option,
      disabled,
      name,
      data
    } = this.props;

    let value = this.props.value;
    let viewValue: React.ReactNode = (
      <span className="text-muted">{placeholder}</span>
    );
    let showOption = false;

    if (value === void 0 && name) {
      value = resolveVariable(name, data);
    }

    if (value !== void 0) {
      showOption = !!option;
      viewValue = (
        <Switch
          inline
          classPrefix={ns}
          checked={value == trueValue}
          onChange={this.handleChange}
          disabled={disabled || !onQuickChange}
        />
      );
    }

    return (
      <span className={cx(`${ns}SwitchField`, className)}>
        {viewValue}
        {showOption ? option : null}
      </span>
    );
  }
}

@Renderer({
  test: /(^|\/)switch$/,
  name: 'switch'
})
export class SwitchFieldRenderer extends SwitchField {}
