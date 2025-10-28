import React from 'react';
import {
  FormItem,
  FormControlProps,
  FormBaseControl,
  resolveEventData,
  getVariable,
  ListenerAction,
  AMISFormItem,
  AMISSchemaCollection
} from 'amis-core';
import {Icon, Switch} from 'amis-ui';
import {autobind, isObject} from 'amis-core';
import {AMISIconSchema} from '../Icon';
import {supportStatic} from './StaticHoc';

import type {SpinnerExtraProps} from 'amis-ui';

/**
 * 开关组件，用于布尔值切换。支持开启/关闭状态的切换操作。
 */

export interface AMISSwitchSchema extends AMISFormItem {
  /**
   * 指定为 switch 组件
   */
  type: 'switch';

  /**
   * 开启时的值
   */
  trueValue?: boolean | string | number;

  /**
   * 关闭时的值
   */
  falseValue?: boolean | string | number;

  /**
   * 选项说明
   */
  option?: string;

  /**
   * 开启时显示内容
   */
  onText?: string | AMISIconSchema | AMISSchemaCollection;

  /**
   * 关闭时显示内容
   */
  offText?: string | AMISIconSchema | AMISSchemaCollection;

  /**
   * 开关尺寸
   */
  size?: 'sm' | 'md';

  /**
   * 是否加载中
   */
  loading?: boolean;
}

export interface SwitchProps extends FormControlProps, SpinnerExtraProps {
  option?: string;
  trueValue?: any;
  falseValue?: any;
  size?: 'sm';
  loading?: boolean;
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
    const {classnames: cx, render, onText, offText} = this.props;
    let onComp = onText;
    let offComp = offText;

    /** 兼容单独使用Icon的场景 */
    if (isObject(onText) && onText.icon && !onText.type) {
      onComp = <Icon cx={cx} icon={onText.icon} className="Switch-icon" />;
    } else if (onText != null && typeof onText !== 'string') {
      /** 兼容原来的DOM接口，string类型直接渲染 */
      onComp = render('switch-on-text', onText);
    }

    if (isObject(offText) && offText.icon && !offText.type) {
      offComp = <Icon cx={cx} icon={offText.icon} className="Switch-icon" />;
    } else if (offText != null && typeof offText !== 'string') {
      offComp = render('switch-off-text', offText);
    }

    return {on: onComp, off: offComp};
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
    const {value, trueValue, translate} = this.props;

    const {on = 'swith.on', off = 'swith.off'} = this.getResult();
    const body = (
      <span>{value === trueValue ? translate(on) : translate(off)}</span>
    );
    return this.renderBody(body);
  }

  doAction(
    action: ListenerAction,
    data: any,
    throwErrors: boolean = false,
    args?: any
  ) {
    const actionType = action?.actionType as string;
    const {onChange, formStore, store, name, resetValue} = this.props;

    if (actionType === 'clear') {
      onChange?.(''); // switch的value可能是任何类型，空值可能是'' or null，但因为form的clear的清空现在是''，则这里为了保持一致也用''
    } else if (actionType === 'reset') {
      const pristineVal =
        getVariable(formStore?.pristine ?? store?.pristine, name) ?? resetValue;
      onChange?.(pristineVal);
    }
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
      disabled,
      loading,
      loadingConfig,
      testIdBuilder
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
            loading={loading}
            loadingConfig={loadingConfig}
            testIdBuilder={testIdBuilder}
          />
        )}
      </div>
    );
  }
}

@FormItem({
  type: 'switch',
  sizeMutable: false,
  thin: true
})
export class SwitchControlRenderer extends SwitchControl {}
