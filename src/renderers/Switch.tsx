import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {ServiceStore, IServiceStore} from '../store/service';
import {Api, SchemaNode, PlainObject} from '../types';
import {filter} from '../utils/tpl';
import cx from 'classnames';
import Switch from '../components/Switch';
import {resolveVariable} from '../utils/tpl-builtin';
import {BaseSchema} from '../Schema';

/**
 * 开关展示控件。
 * 文档：https://baidu.gitee.io/amis/docs/components/switch
 */
export interface SwitchSchema extends BaseSchema {
  /**
   * 指定为状态展示控件
   */
  type: 'switch';

  /**
   * 占位符
   * @default -
   */
  placeholder?: string;

  /**
   * 为真时的值
   */
  trueValue?: any;

  /**
   * 为假时的值
   */
  falseValue?: any;

  /**
   * 默认为只读，要开启编辑请配置这个为 false
   * @default true
   */
  readOnly?: boolean;

  /**
   * 开启时显示的文本
   */
  onText?: string;

  /**
   * 关闭时显示的文本
   */
  offText?: string;

  /**
   * 是否立即保存。关乎到是否立即调用保存接口。
   */
  saveImmediately?: boolean;
}

export interface SwitchProps
  extends RendererProps,
    Omit<SwitchSchema, 'className'> {}

export class SwitchField extends React.Component<SwitchProps, object> {
  static defaultProps: Partial<SwitchProps> = {
    placeholder: '-',
    trueValue: true,
    falseValue: false,
    readOnly: false,
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
      onText,
      offText,
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
          onText={onText}
          offText={offText}
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
