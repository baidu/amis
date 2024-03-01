/**
 * @file client/renderer/InputTextI18n.tsx
 * @description 支持国际化的 input-text 组件
 */

import {
  FormControlProps,
  FormItem,
  makeTranslator,
  autobind
} from '../../../amis-core/src/index';
import React from 'react';
import {Icon, InputBox} from '../../../amis-ui/src/index';
import {InputBoxProps} from '../../../amis-ui/src/components/InputBox';
import cx from 'classnames';
import {getEnv} from 'mobx-state-tree';
import {pick} from 'lodash';
import {LocaleProps} from 'amis-core';

/** 语料 key 正则表达式 */
export const corpusKeyReg =
  /^i18n:[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}$/;

interface InputTextI18nProps extends InputBoxProps, LocaleProps {
  classPrefix: string;
  i18nEnabled?: boolean;
  disabled?: boolean;
  maxLength?: number;
  minLength?: number;
  onI18nChange?: (value: string) => void;
}

export class InputTextI18n extends React.Component<InputTextI18nProps> {
  constructor(props: InputTextI18nProps) {
    super(props);
  }

  render() {
    let {
      value,
      classPrefix,
      i18nEnabled,
      className,
      disabled,
      translate = makeTranslator(this.props.locale),
      placeholder,
      onI18nChange,
      ...rest
    } = this.props;

    const restProps = rest
      ? pick(rest, [
          'onBlur',
          'placeholder',
          'disabled',
          'readOnly',
          'onClear',
          'hasError',
          'prefix',
          'children',
          'borderMode'
        ])
      : {};

    const isMatch = corpusKeyReg.test(value!);
    const _value = i18nEnabled ? translate(value) : value;

    return (
      <div
        className={cx(className, `${classPrefix}InputI18n-container`, {
          [`${classPrefix}InputI18n-multi-container`]: i18nEnabled
        })}
      >
        <div className={cx(`${classPrefix}InputI18n-inner-container`)}>
          <InputBox
            {...restProps}
            value={_value}
            clearable={false}
            onChange={this.onInputChange}
            placeholder={placeholder}
            disabled={disabled}
          ></InputBox>
          {i18nEnabled && !disabled ? (
            <div
              className={cx(`${classPrefix}InputI18n-addon-container`, {
                [`${classPrefix}InputI18n-addon-active`]: isMatch
              })}
              onClick={this.onClickI18nBtn}
            >
              <Icon
                icon="corpus-i18n"
                className="icon cursor-pointer CorpusI18n-input-icon"
              />
            </div>
          ) : null}

          {isMatch && i18nEnabled ? (
            <div
              className={cx(`${classPrefix}InputI18n-overlay`)}
              onClick={this.onClickI18nBtn}
            ></div>
          ) : null}
        </div>
      </div>
    );
  }

  @autobind
  onClickI18nBtn() {
    const {value} = this.props;
    if (corpusKeyReg.test(value!)) {
      this.props?.onChange?.('');
      this.props.onI18nChange?.('');
      return;
    }
    let _uuid = 'i18n:1189fb5d-ac5b-4558-b363-068ce5decc99';
    this.props?.onChange?.(_uuid);
    this.props.onI18nChange?.(_uuid);
  }

  @autobind
  onInputChange(value: string) {
    this.props.onChange?.(value);
  }
}

interface InputTextI18nControlProps extends FormControlProps {}

class InputTextI18nControl extends React.Component<InputTextI18nControlProps> {
  constructor(props: InputTextI18nControlProps) {
    super(props);
  }

  render() {
    const {
      onChange,
      value,
      classPrefix,
      className,
      classnames,
      placeholder,
      disabled,
      ...rest
    } = this.props;
    const {i18nEnabled} = getEnv((window as any).editorStore);

    return (
      <InputTextI18n
        {...rest}
        i18nEnabled={i18nEnabled}
        onChange={onChange}
        classPrefix={classPrefix}
        classnames={classnames}
        value={value}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
      ></InputTextI18n>
    );
  }
}

@FormItem({
  type: 'input-text-i18n'
})
export class InputTextI18nRenderer extends InputTextI18nControl {}
