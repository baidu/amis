import React from 'react';
import cx from 'classnames';
import {
  ActionObject,
  IScopedContext,
  isNumeric,
  isObject,
  isPureVariable,
  Renderer,
  RendererProps,
  resolveVariableAndFilter,
  ScopedContext
} from 'amis-core';
import {FormItem, FormControlProps} from 'amis-core';
import {filter} from 'amis-core';
import QRCodeRender from 'qrcode.react';
import {BaseSchema, SchemaClassName} from '../Schema';
import {getPropValue} from 'amis-core';
import mapValues from 'lodash/mapValues';

function downloadBlob(blob: Blob, filename: string) {
  const objectUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(objectUrl), 500);
}

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
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/qrcode
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

  /**
   * 渲染模式
   */
  mode?: 'canvas' | 'svg';
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
    placeholder: '-',
    mode: 'canvas'
  };

  ref: React.RefObject<HTMLDivElement>;

  constructor(props: QRCodeProps) {
    super(props);
    this.ref = React.createRef();
  }

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

  /**
   * 接收动作事件
   */
  doAction(
    action: ActionObject,
    data: any,
    throwErrors: boolean,
    args?: any
  ): any {
    const codeSize = this.props.codeSize;
    const actionType = action?.actionType as string;
    if (actionType === 'saveAs') {
      if (this.ref?.current) {
        if (this.props.mode === 'svg') {
          const svgElement = this.ref.current.querySelector('svg');
          if (svgElement) {
            const contentWithSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" height="${codeSize}" width="${codeSize}" viewBox="${
              svgElement.getAttribute('viewBox') || '0 0 37 37'
            }">
         ${svgElement.innerHTML}
         </svg>`;
            const blob = new Blob([contentWithSvg], {type: 'image/svg+xml'});
            downloadBlob(blob, args?.name || 'qr-code.svg');
          }
        } else {
          const canvasElement = this.ref.current.querySelector('canvas');
          if (canvasElement) {
            canvasElement.toBlob(blob => {
              blob &&
                downloadBlob(
                  blob,
                  args?.name
                    ? args.name.replace(/\.svg$/, '.png')
                    : 'qr-code.png'
                );
            }, 'image/png');
          }
        }
      }
    }
  }

  render() {
    const {
      className,
      style,
      qrcodeClassName,
      codeSize,
      backgroundColor,
      foregroundColor,
      placeholder,
      level,
      defaultValue,
      data,
      mode,
      translate: __,
      classPrefix: ns
    } = this.props;

    const finalValue = getPropValue(
      this.props,
      () => filter(defaultValue, data, '| raw') || undefined
    );

    return (
      <div
        className={cx(`${ns}QrCode`, className)}
        style={style}
        ref={this.ref}
      >
        {!finalValue ? (
          <span className={`${ns}QrCode--placeholder`}>{placeholder}</span>
        ) : finalValue.length > 2953 ? (
          // https://github.com/zpao/qrcode.react/issues/69
          <span className="text-danger">
            {__('QRCode.tooLong', {max: 2953})}
          </span>
        ) : (
          <QRCodeRender
            // @ts-ignore 其实是支持的
            className={qrcodeClassName}
            value={finalValue}
            size={codeSize}
            bgColor={backgroundColor}
            fgColor={foregroundColor}
            level={level || 'L'}
            imageSettings={this.getImageSettings()}
            renderAs={mode}
          />
        )}
      </div>
    );
  }
}

@Renderer({
  type: 'qrcode',
  alias: ['qr-code'],
  name: 'qrcode'
})
export class QRCodeRenderer extends QRCode {
  static contextType = ScopedContext;

  constructor(props: QRCodeProps, context: IScopedContext) {
    super(props);
    const scoped = context;
    scoped.registerComponent(this);
  }

  componentWillUnmount() {
    super.componentWillUnmount?.();
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this);
  }
}
