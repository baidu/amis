import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from './Item';
import Switch from '../../components/Switch';
import {createObject, autobind, isObject} from '../../utils/helper';
import {generateIcon} from "../../utils/icon";
import {IconSchema} from "../Icon";

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
   * 开启时显示的内容
   */
  onText?: string | IconSchema;

  /**
   * 关闭时显示的内容
   */
  offText?: string | IconSchema;
}

export interface SwitchProps extends FormControlProps {
  option?: string;
  trueValue?: any;
  falseValue?: any;
}

export type SwitchRendererEvent = 'change';

export default class SwitchControl extends React.Component<SwitchProps, any> {
  static defaultProps = {
    trueValue: true,
    falseValue: false,
    optionAtLeft: false
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
      optionAtLeft
    } = this.props;

    const on = isObject(onText) ? generateIcon(cx, onText.icon, 'Switch-icon') : onText;
    const off = isObject(offText) ? generateIcon(cx, offText.icon, 'Switch-icon') :offText;

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
          onText={on}
          offText={off}
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
