/**
 * @file 用来展示颜色块。
 */
import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {resolveVariableAndFilter} from '../utils/tpl-builtin';

export interface ColorProps extends RendererProps {
  className: string;
  defaultColor: string;
  showValue: boolean;
}

export class ColorField extends React.Component<ColorProps, object> {
  static defaultProps = {
    className: '',
    defaultColor: '#ccc',
    showValue: true
  };

  render() {
    const {
      className,
      data,
      classnames: cx,
      name,
      value,
      defaultColor,
      showValue
    } = this.props;
    const color =
      value || (name ? resolveVariableAndFilter(name, data, '| raw') : null);

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
  test: /(^|\/)color$/,
  name: 'color'
})
export class ColorFieldRenderer extends ColorField {}
