/**
 * @file 用来展示颜色块。
 */
import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {BaseSchema} from '../Schema';
import {getPropValue} from '../utils/helper';
import {resolveVariableAndFilter} from '../utils/tpl-builtin';

/**
 * Color 显示渲染器，格式说明。
 * 文档：https://baidu.gitee.io/amis/docs/components/color
 */
export interface ColorSchema extends BaseSchema {
  /**
   *  指定为颜色显示控件
   */
  type: 'color';

  /**
   * 默认颜色
   */
  defaultColor?: string;

  /**
   * 是否用文字显示值。
   */
  showValue?: boolean;
}

export interface ColorProps
  extends RendererProps,
    Omit<ColorSchema, 'type' | 'className'> {}

export class ColorField extends React.Component<ColorProps, object> {
  static defaultProps = {
    className: '',
    defaultColor: '#ccc',
    showValue: true
  };

  render() {
    const {className, classnames: cx, defaultColor, showValue} = this.props;
    const color = getPropValue(this.props);

    return (
      <div className={cx('ColorField', className)}>
        <i
          className={cx('ColorField-previewIcon')}
          style={{backgroundColor: color || defaultColor}}
        />
        {showValue ? (
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
