/**
 * @file 用来条形码
 */
import React, {Suspense} from 'react';
import {Renderer, RendererProps} from 'amis-core';
import {BaseSchema} from '../Schema';
import {getPropValue} from 'amis-core';
const BarCode = React.lazy(() => import('amis-ui/lib/components/BarCode'));

/**
 * BarCode 显示渲染器，格式说明。
 * 文档：https://baidu.gitee.io/amis/docs/components/barcode
 */
export interface BarCodeSchema extends BaseSchema {
  /**
   *  指定为颜色显示控件
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
    Omit<BarCodeSchema, 'type' | 'className'> {}

export class BarCodeField extends React.Component<BarCodeProps, object> {
  render() {
    const {className, width, height, classnames: cx, options} = this.props;
    const value = getPropValue(this.props);

    return (
      <Suspense fallback={<div>...</div>}>
        <div data-testid="barcode" className={cx('BarCode', className)}>
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
