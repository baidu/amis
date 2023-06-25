import React from 'react';
import {
  Renderer,
  RendererProps,
  filter,
  IconCheckedSchema,
  autobind,
  createObject,
  CustomStyle
} from 'amis-core';
import {BaseSchema, SchemaTpl} from '../Schema';
import {BadgeObject, withBadge} from 'amis-ui';
import {getIcon} from 'amis-ui';
import {isObject} from 'lodash';

/**
 * Icon 图表渲染器
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/icon
 */
export interface IconSchema extends BaseSchema {
  type: 'icon';

  /**
   * 按钮类型
   */
  icon: SchemaTpl | IconCheckedSchema;

  vendor?: 'iconfont' | 'fa' | '';

  /**
   * 角标
   */
  badge?: BadgeObject;
}

export interface IconProps
  extends RendererProps,
    Omit<IconSchema, 'type' | 'className'> {}

export class Icon extends React.Component<IconProps, object> {
  static defaultProps: Partial<IconProps> = {
    icon: '',
    vendor: 'fa'
  };

  @autobind
  handleClick(e: React.MouseEvent<any>) {
    const {dispatchEvent, data} = this.props;
    dispatchEvent(e, data);
  }

  @autobind
  handleMouseEnter(e: React.MouseEvent<any>) {
    const {dispatchEvent, data} = this.props;
    dispatchEvent(e, data);
  }

  @autobind
  handleMouseLeave(e: React.MouseEvent<any>) {
    const {dispatchEvent, data} = this.props;
    dispatchEvent(e, data);
  }

  render() {
    const {
      vendor,
      classnames: cx,
      className,
      style,
      data,
      id,
      themeCss,
      css,
      env
    } = this.props;
    let icon = this.props.icon;

    if (typeof icon !== 'string') {
      if (
        isObject(icon) &&
        typeof (icon as IconCheckedSchema).id === 'string' &&
        (icon as IconCheckedSchema).id.startsWith('svg-')
      ) {
        return (
          <svg
            className={cx('icon', className)}
            style={style}
            onClick={this.handleClick}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
          >
            <use
              xlinkHref={`#${(icon as IconCheckedSchema).id.replace(
                /^svg-/,
                ''
              )}`}
            ></use>
          </svg>
        );
      }

      return;
    }

    icon = filter(icon, data);

    let CustomIcon = getIcon(icon);
    if (CustomIcon) {
      return (
        <CustomIcon
          className={cx(className, `icon-${icon}`)}
          style={style}
          onClick={this.handleClick}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        />
      );
    }

    const isURLIcon =
      icon?.indexOf('.') !== -1 || icon.startsWith('data:image/');
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
    return (
      <>
        {isURLIcon ? (
          <img
            className={cx('Icon', className)}
            src={icon}
            style={style}
            onClick={this.handleClick}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
          />
        ) : (
          <i
            className={cx(iconPrefix, className)}
            style={style}
            onClick={this.handleClick}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
          />
        )}
        <CustomStyle
          config={{
            themeCss: themeCss || css,
            classNames: [
              {
                key: 'className',
                value: className
              }
            ],
            id
          }}
          env={env}
        />
      </>
    );
  }
}

@Renderer({
  type: 'icon'
})
// @ts-ignore 类型没搞定
@withBadge
export class IconRenderer extends Icon {}
