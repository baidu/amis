import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from './Item';
import Switch from '../../components/Switch';

/**
 * Switch
 * 文档：https://baidu.gitee.io/amis/docs/components/form/switch
 */
export interface SwitchControlSchema extends FormBaseControl {
  /**
   * 指定为多行文本输入框
   */
  type: 'switch';

  /**
   * 勾选值
   */
  trueValue?: any;

  /**
   * 未勾选值
   */
  falseValue?: any;

  /**
   * 选项说明
   */
  option?: string;

  /**
   * 开启时显示的文本
   */
  onText?: string;

  /**
   * 关闭时显示的文本
   */
  offText?: string;
}

export interface SwitchProps extends FormControlProps {
  option?: string;
  trueValue?: any;
  falseValue?: any;
}

export default class SwitchControl extends React.Component<SwitchProps, any> {
  static defaultProps = {
    trueValue: true,
    falseValue: false,
    optionAtLeft: false
  };
  render() {
    const {
      className,
      classPrefix: ns,
      classnames: cx,
      value,
      trueValue,
      falseValue,
      onText,
      offText,
      option,
      onChange,
      disabled,
      optionAtLeft
    } = this.props;

    return (
      <div className={cx(`SwitchControl`, className)}>
        {optionAtLeft ? (
          <span className={cx('Switch-option')}>{option}</span>
        ) : null}

        <Switch
          classPrefix={ns}
          value={value}
          trueValue={trueValue}
          falseValue={falseValue}
          onText={onText}
          offText={offText}
          disabled={disabled}
          onChange={onChange}
        />

        {optionAtLeft ? null : (
          <span className={cx('Switch-option')}>{option}</span>
        )}
      </div>
    );
  }
}

@FormItem({
  type: 'switch',
  sizeMutable: false
})
export class SwitchControlRenderer extends SwitchControl {}
