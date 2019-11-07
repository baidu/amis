import React from 'react';
import cx from 'classnames';
import {Renderer, RendererProps} from '../factory';
import {FormItem, FormControlProps} from './Form/Item';
import {filter} from '../utils/tpl';
import QrCode = require('qrcode.react');

export interface QRCodeProps extends FormControlProps {
  codeSize?: number;
  backgroundColor?: string;
  foregroundColor?: string;
  level?: string;
  placeholder: string;
}

export default class QRCode extends React.Component<QRCodeProps, any> {
  static defaultProps: Partial<QRCodeProps> = {
    codeSize: 128,
    backgroundColor: '#fff',
    foregroundColor: '#000',
    level: 'L',
    placeholder: '-'
  };

  render() {
    const {
      className,
      codeSize,
      backgroundColor,
      foregroundColor,
      placeholder,
      level,
      value,
      data,
      classPrefix: ns
    } = this.props;

    return (
      <div className={cx(`${ns}QrCode`, className)}>
        {value ? (
          <QrCode
            value={filter(value, data, '| raw')}
            size={codeSize}
            bgColor={backgroundColor}
            fgColor={foregroundColor}
            level={level || 'L'}
          />
        ) : (
          <span className={`${ns}QrCode--placeholder`}>{placeholder}</span>
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
