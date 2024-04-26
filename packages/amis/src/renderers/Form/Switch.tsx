import React from 'react';
import {
  FormItem,
  FormControlProps,
  FormBaseControl,
  resolveEventData,
  getVariable,
  ListenerAction
} from 'amis-core';
import {Icon, Switch} from 'amis-ui';
import {autobind, isObject} from 'amis-core';
import {IconSchema} from '../Icon';
import {FormBaseControlSchema, SchemaCollection} from '../../Schema';
import {supportStatic} from './StaticHoc';

import type {SpinnerExtraProps} from 'amis-ui';

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
  onText?: string | IconSchema | SchemaCollection;

  /**
   * 关闭时显示的内容
   */
  offText?: string | IconSchema | SchemaCollection;

  /** 开关尺寸 */
  size?: 'sm' | 'md';

  /** 是否处于加载状态 */
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
    const {value, trueValue} = this.props;

    const {on = '开', off = '关'} = this.getResult();
    const body = <span>{value === trueValue ? on : off}</span>;
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
  sizeMutable: false
})
export class SwitchControlRenderer extends SwitchControl {}
