/**
 * @file 用来展示颜色块。
 */
import React from 'react';
import {AMISSchemaBase, Renderer, RendererProps} from 'amis-core';
import {BaseSchema} from '../Schema';
import {getPropValue} from 'amis-core';

/**
 * Color 显示渲染器，格式说明。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/color
 */
/**
 * 颜色展示组件，用于显示颜色块或文本。支持取色器触发。
 */
export interface AMISColorSchema extends AMISSchemaBase {
  /**
   * 指定为 color 组件
   */
  type: 'color';

  /**
   * 默认颜色
   */
  defaultColor?: string;

  /**
   * 是否用文字显示值
   */
  showValue?: boolean;
}

export interface ColorProps
  extends RendererProps,
    Omit<AMISColorSchema, 'type' | 'className'> {}

export class ColorField extends React.Component<ColorProps, object> {
  static defaultProps = {
    className: '',
    defaultColor: '',
    showValue: true
  };

  render() {
    const {
      className,
      style,
      classnames: cx,
      defaultColor,
      showValue
    } = this.props;
    const color = getPropValue(this.props) || defaultColor;

    return (
      <div className={cx('ColorField', className)} style={style}>
        <i
          className={cx('ColorField-previewIcon')}
          style={{backgroundColor: color}}
        />
        {showValue && color ? (
          <span className={cx('ColorField-value')}>{color}</span>
        ) : null}
      </div>
    );
  }
}

@Renderer({
  type: 'color'
})
export class ColorFieldRenderer extends ColorField {}
