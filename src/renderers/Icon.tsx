import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {BaseSchema} from '../Schema';
import {BadgeSchema, withBadge} from '../components/Badge';

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

  vendor?: 'iconfont' | 'fa' | '';

  /**
   * 角标
   */
  badge?: BadgeSchema;
}

export interface IconProps
  extends RendererProps,
    Omit<IconSchema, 'type' | 'className'> {}

export class Icon extends React.Component<IconProps, object> {
  static defaultProps: Partial<IconProps> = {
    icon: '',
    vendor: 'fa'
  };

  render() {
    const {icon, vendor, classnames: cx, className} = this.props;

    const isURLIcon = icon?.indexOf('.') !== -1;
    let iconPrefix = '';
    if (vendor === 'iconfont') {
      iconPrefix = `iconfont icon-${icon}`;
    } else if (vendor === 'fa') {
      //默认是fontawesome v4，兼容之前配置
      iconPrefix = `${vendor} ${vendor}-${icon}`;
    } else {
      // 如果vendor为空，则不设置前缀,这样可以支持fontawesome v5、fontawesome v6或者其他框架
      iconPrefix = `${icon}`;
    }
    return isURLIcon ? (
      <img className={cx('Icon')} src={icon} />
    ) : (
      <i className={cx(iconPrefix, className)} />
    );
  }
}

@Renderer({
  type: 'icon'
})
// @ts-ignore 类型没搞定
@withBadge
export class TplRenderer extends Icon {}
