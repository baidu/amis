import React from 'react';
import cx from 'classnames';
import mapValues from 'lodash/mapValues';
import {Renderer, RendererProps} from '../factory';
import {FormItem, FormControlProps} from './Form/Item';
import {filter} from '../utils/tpl';
import {QRCodeSVG} from 'qrcode.react';
import {BaseSchema, SchemaClassName} from '../Schema';
import {getPropValue, isObject, isNumeric} from '../utils/helper';
import {isPureVariable, resolveVariableAndFilter} from '../utils/tpl-builtin';

export interface QRCodeImageSettings {
  src: string;
  height: number;
  width: number;
  excavate: boolean;
  x?: number;
  y?: number;
}

/**
 * 二维码展示控件。
 * 文档：https://baidu.gitee.io/amis/docs/components/qrcode
 */
export interface QRCodeSchema extends BaseSchema {
  type: 'qrcode' | 'qr-code';

  /**
   * 关联字段名。
   */
  name?: string;

  /**
   * css 类名
   */
  qrcodeClassName?: SchemaClassName;

  /**
   * 二维码的宽高大小，默认 128
   * @default 128
   */
  codeSize?: number;

  /**
   * 背景色
   */
  backgroundColor?: string;

  /**
   * 前景色
   */
  foregroundColor?: string;

  /**
   * 二维码复杂级别
   */
  level?: 'L' | 'M' | 'Q' | 'H';

  /**
   * 占位符
   */
  placeholder?: string;

  /**
   * 图片配置
   */
  imageSettings?: QRCodeImageSettings;
}

export interface QRCodeProps
  extends FormControlProps,
    Omit<QRCodeSchema, 'type' | 'className'> {}

export default class QRCode extends React.Component<QRCodeProps, any> {
  static defaultProps: Partial<QRCodeProps> = {
    codeSize: 128,
    qrcodeClassName: '',
    backgroundColor: '#fff',
    foregroundColor: '#000',
    level: 'L',
    placeholder: '-'
  };

  /**
   * 获取图片配置
   */
  getImageSettings(): QRCodeImageSettings | undefined {
    const {imageSettings, data} = this.props;

    if (
      !imageSettings ||
      !isObject(imageSettings) ||
      !imageSettings.src ||
      typeof imageSettings.src !== 'string'
    ) {
      return undefined;
    }

    if (isPureVariable(imageSettings.src)) {
      imageSettings.src = resolveVariableAndFilter(
        imageSettings.src,
        data,
        '| raw'
      );
    }

    return mapValues(imageSettings, (value: any, key: string) => {
      if (!!~['width', 'height', 'x', 'y'].indexOf(key)) {
        /** 处理非数字格式的输入，QRCodeSVG内部会对空值进行默认赋值 */
        return isNumeric(value) ? Number(value) : null;
      }
      return value;
    });
  }

  render() {
    const {
      className,
      qrcodeClassName,
      codeSize,
      backgroundColor,
      foregroundColor,
      placeholder,
      level,
      defaultValue,
      data,
      classPrefix: ns
    } = this.props;

    const finalValue = getPropValue(
      this.props,
      () => filter(defaultValue, data, '| raw') || undefined
    );

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
          <QRCodeSVG
            // @ts-ignore 其实是支持的
            className={qrcodeClassName}
            value={finalValue}
            size={codeSize}
            bgColor={backgroundColor}
            fgColor={foregroundColor}
            level={level || 'L'}
            imageSettings={this.getImageSettings()}
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
