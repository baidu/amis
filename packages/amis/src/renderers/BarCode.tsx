/**
 * @file 用来条形码
 */
import React, {Suspense} from 'react';
import {Renderer, RendererProps} from 'amis-core';
import {BaseSchema} from '../Schema';
import {getPropValue} from 'amis-core';
import {AMISSchemaBase} from 'amis-core';
const BarCode = React.lazy(() => import('amis-ui/lib/components/BarCode'));

/**
 * BarCode 显示渲染器，格式说明。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/barcode
 */
/**
 * 条形码组件，用于生成和显示条形码。支持内容、格式与尺寸。
 */
export interface AMISBarCodeSchema extends AMISSchemaBase {
  /**
   * 指定为 barcode 组件
   */
  type: 'barcode';

  /**
   * 宽度
   */
  width?: number;

  /**
   * 高度
   */
  height?: number;

  /**
   * 显示配置
   */
  options: object;
}

export interface BarCodeProps
  extends RendererProps,
    Omit<AMISBarCodeSchema, 'type' | 'className'> {}

export class BarCodeField extends React.Component<BarCodeProps, object> {
  render() {
    const {
      className,
      style,
      width,
      height,
      classnames: cx,
      options
    } = this.props;
    const value = getPropValue(this.props);

    return (
      <Suspense fallback={<div>...</div>}>
        <div
          data-testid="barcode"
          className={cx('BarCode', className)}
          style={style}
        >
          <BarCode value={value} options={options}></BarCode>
        </div>
      </Suspense>
    );
  }
}

@Renderer({
  type: 'barcode'
})
export class BarCodeFieldRenderer extends BarCodeField {}
