import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {BaseSchema} from '../Schema';

/**
 * Icon 图表渲染器
 * 文档：https://baidu.gitee.io/amis/docs/components/icon
 */
export interface IconSchema extends BaseSchema {
  type: 'icon';

  /**
   * 按钮类型
   */
  icon: string;

  vendor?: 'iconfont' | 'fa';
}

export interface IconProps extends RendererProps, IconSchema {}

export class Icon extends React.Component<IconProps, object> {
  static defaultProps: Partial<IconProps> = {
    icon: '',
    vendor: 'fa'
  };

  render() {
    const {icon, vendor, classnames: cx, className} = this.props;

    const isURLIcon = icon?.indexOf('.') !== -1;
    return isURLIcon ? (
      <img className={cx('Icon')} src={icon} />
    ) : (
      <i
        className={cx(
          vendor === 'iconfont'
            ? `iconfont icon-${icon}`
            : `${vendor} ${vendor}-${icon}`,
          className
        )}
      />
    );
  }
}

@Renderer({
  test: /(^|\/)icon$/,
  name: 'icon'
})
export class TplRenderer extends Icon {}
