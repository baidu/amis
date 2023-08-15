/**
 * @file client/renderer/TextAreaI18n.tsx
 * @description 支持国际化的 textarea 组件
 */

import React from 'react';
import {
  autobind,
  FormControlProps,
  FormItem
} from '../../../amis-core/src/index';
import {Icon, Textarea} from '../../../amis-ui/src/index';
import cx from 'classnames';

/** 语料 key 正则表达式 */
export const corpusKeyReg =
  /^i18n:[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}$/;

export interface TextareaI18nProps extends FormControlProps {}

class TextareaI18n extends React.Component<TextareaI18nProps> {
  @autobind
  onClickI18nBtn() {
    const {value} = this.props;
    if (corpusKeyReg.test(value!)) {
      this.props?.onChange?.('');
      return;
    }
    let _uuid = 'i18n:1189fb5d-ac5b-4558-b363-068ce5decc99';
    this.props?.onChange?.(_uuid);
  }

  render() {
    const {value, onChange, className} = this.props;

    const isMatch = corpusKeyReg.test(value!);

    return (
      <>
        <div
          className={cx(
            'TextareaI18n',
            className,
            'TextareaI18n-multi-container'
          )}
        >
          <Textarea
            value={value}
            clearable={false}
            onChange={onChange}
          ></Textarea>

          {
            <ul className={cx('TextareaI18n-footer')}>
              <li
                className={cx('TextareaI18n-footer-corpusIcon', {
                  'TextareaI18n-footer-highlight-corpusIcon': isMatch
                })}
                onClick={this.onClickI18nBtn}
              >
                <a data-tooltip="多语言" data-position="top">
                  <Icon icon="corpus-i18n" className="icon" />
                </a>
              </li>
            </ul>
          }

          {isMatch ? (
            <div
              className={cx('TextareaI18n-overlay')}
              onClick={this.onClickI18nBtn}
            ></div>
          ) : null}
        </div>
      </>
    );
  }
}

@FormItem({
  type: 'textarea-i18n'
})
export class TextAreaI18nRenderer extends TextareaI18n {}
