import React from 'react';
import cx from 'classnames';
import {Renderer, RendererProps} from '../factory';
import {FormItem, FormControlProps} from './Form/Item';
import {filter} from '../utils/tpl';
// @ts-ignore
import QrCode from 'qrcode.react';

export interface QRCodeProps extends FormControlProps {
  qrcodeClassName?: string;
  codeSize?: number;
  backgroundColor?: string;
  foregroundColor?: string;
  level?: string;
  placeholder: string;
}

export default class QRCode extends React.Component<QRCodeProps, any> {
  static defaultProps: Partial<QRCodeProps> = {
    codeSize: 128,
    qrcodeClassName: '',
    backgroundColor: '#fff',
    foregroundColor: '#000',
    level: 'L',
    placeholder: '-'
  };

  render() {
    const {
      className,
      qrcodeClassName,
      codeSize,
      backgroundColor,
      foregroundColor,
      placeholder,
      level,
      value,
      data,
      classPrefix: ns
    } = this.props;

    const finalValue = filter(value, data, '| raw');

    return (
      <div className={cx(`${ns}QrCode`, className)}>
        {!finalValue ? (
          <span className={`${ns}QrCode--placeholder`}>{placeholder}</span>
        ) : finalValue.length > 2953 ? (
          // https://github.com/zpao/qrcode.react/issues/69
          <span className="text-danger">
            二维码值过长，请设置2953个字符以下的文本
          </span>
        ) : (
          <QrCode
            className={qrcodeClassName}
            value={finalValue}
            renderAs={'svg'}
            size={codeSize}
            bgColor={backgroundColor}
            fgColor={foregroundColor}
            level={level || 'L'}
          />
        )}
      </div>
    );
  }
}

@Renderer({
  test: /(^|\/)qr\-?code$/,
  name: 'qrcode'
})
export class QRCodeRenderer extends QRCode {}

@FormItem({
  type: 'qr-code',
  sizeMutable: false
})
export class QRCodeControlRenderer extends QRCode {}
