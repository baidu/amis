import React from 'react';
import {
  FormItem,
  FormControlProps,
  FormBaseControl,
  resolveEventData
} from 'amis-core';
import {Icon, Switch} from 'amis-ui';
import {createObject, autobind, isObject} from 'amis-core';
import {IconSchema} from '../Icon';
import {FormBaseControlSchema} from '../../Schema';
import {supportStatic} from './StaticHoc';

/**
 * Switch
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/switch
 */

export interface SwitchControlSchema extends FormBaseControlSchema {
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

  /** 开关尺寸 */
  size?: 'sm' | 'md';
}

export interface SwitchProps extends FormControlProps {
  option?: string;
  trueValue?: any;
  falseValue?: any;
  size?: 'sm';
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
    const {dispatchEvent, onChange} = this.props;
    const rendererEvent = await dispatchEvent(
      'change',
      resolveEventData(this.props, {value: checked})
    );
    if (rendererEvent?.prevented) {
      return;
    }

    onChange && onChange(checked);
  }

  getResult() {
    const {classnames: cx, onText, offText} = this.props;
    const on = isObject(onText) ? (
      <Icon cx={cx} icon={onText.icon} className="Switch-icon" />
    ) : (
      onText
    );
    const off = isObject(offText) ? (
      <Icon cx={cx} icon={offText.icon} className="Switch-icon" />
    ) : (
      offText
    );
    return {on, off};
  }

  renderBody(children: any) {
    const {classnames: cx, option, optionAtLeft} = this.props;

    const Option = <span className={cx('Switch-option')}>{option}</span>;
    return (
      <>
        {optionAtLeft ? Option : null}
        {children}
        {optionAtLeft ? null : Option}
      </>
    );
  }

  renderStatic() {
    const {value, trueValue} = this.props;

    const {on = '开', off = '关'} = this.getResult();
    const body = <span>{value === trueValue ? on : off}</span>;
    return this.renderBody(body);
  }

  @supportStatic()
  render() {
    const {
      size,
      className,
      style,
      classPrefix: ns,
      classnames: cx,
      value,
      trueValue,
      falseValue,
      onChange,
      disabled
    } = this.props;

    const {on, off} = this.getResult();

    return (
      <div className={cx(`SwitchControl`, className)}>
        {this.renderBody(
          <Switch
            classPrefix={ns}
            value={value}
            trueValue={trueValue}
            falseValue={falseValue}
            onText={on}
            offText={off}
            disabled={disabled}
            onChange={this.handleChange}
            size={size as any}
          />
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
