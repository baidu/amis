import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from './Item';
import Switch from '../../components/Switch';
import {createObject, autobind} from '../../utils/helper';
import {generateIcon} from "../../utils/icon";

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
  trueValue?: boolean | string | number;

  /**
   * 未勾选值
   */
  falseValue?: boolean | string | number;

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

  /**
   * 开启时显示的icon
   */
  onIcon?: string;

  /**
   * 关闭时显示的icon
   */
  offIcon?: string;

  /**
   * 展示icon还是文字
   */
  iconShow?: boolean;
}

export interface SwitchProps extends FormControlProps {
  option?: string;
  trueValue?: boolean | string | number;
  falseValue?: boolean | string | number;
  onIcon?: string;
  offIcon?: string;
  iconShow?: boolean;
}

export type SwitchRendererEvent = 'change';

export default class SwitchControl extends React.Component<SwitchProps, any> {
  static defaultProps = {
    trueValue: true,
    falseValue: false,
    optionAtLeft: false,
    iconShow: false
  };

  @autobind
  async handleChange(checked: string | number | boolean) {
    const {dispatchEvent, data, onChange} = this.props;
    const rendererEvent = await dispatchEvent('change', createObject(data, {
      value: checked,
    }));
    if (rendererEvent?.prevented) {
      return;
    }

    onChange && onChange(checked);
  }

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
      optionAtLeft,
      iconShow,
      onIcon,
      offIcon
    } = this.props;

    const onShow = iconShow ? generateIcon(cx, onIcon, 'Switch-icon') : onText;
    const offShow = iconShow ? generateIcon(cx, offIcon, 'Switch-icon') : offText;

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
          onText={onShow}
          offText={offShow}
          disabled={disabled}
          onChange={this.handleChange}
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
