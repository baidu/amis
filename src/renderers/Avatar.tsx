/**
 * @file 用来展示用户头像
 */
import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {
  BaseSchema,
  SchemaClassName,
  SchemaIcon,
  SchemaUrlPath
} from '../Schema';
import {BadgeSchema, withBadge} from '../components/Badge';
import {resolveVariable, resolveVariableAndFilter} from '../utils/tpl-builtin';

/**
 * Avatar 用户头像显示
 * 文档：https://baidu.gitee.io/amis/docs/components/avatar
 */
export interface AvatarSchema extends BaseSchema {
  /**
   *  指定为用户头像控件
   */
  type: 'avatar';

  /**
   * 大小
   */
  size?: number;

  /**
   * 形状
   */
  shape?: 'circle' | 'square';

  /**
   * 图标
   */
  icon?: string;

  /**
   * 文本
   */
  text?: string;

  /**
   * 图片地址
   */
  src?: string;

  /**
   * 图片相对于容器的缩放方式
   */
  fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';

  /**
   * 图片无法显示时的替换文字地址
   */
  alt?: string;

  /**
   * 类名
   */
  className?: SchemaClassName;

  /**
   * 自定义样式
   */
  style?: {
    [propName: string]: any;
  };

  /**
   * 角标
   */
  badge?: BadgeSchema;
}

export interface AvatarProps
  extends RendererProps,
    Omit<AvatarSchema, 'type' | 'className'> {}

export class AvatarField extends React.Component<AvatarProps, object> {
  render() {
    let {
      className,
      icon = 'fa fa-user',
      text,
      src,
      fit = 'cover',
      data,
      shape = 'circle',
      size = 40,
      style,
      classnames: cx,
      props
    } = this.props;

    let sizeStyle = {
      height: size,
      width: size,
      lineHeight: size + 'px'
    };

    let avatar = <i className={icon} />;

    if (typeof text === 'string' && text[0] === '$') {
      text = resolveVariable(text, data);
    }

    if (typeof src === 'string' && src[0] === '$') {
      src = resolveVariable(src, data);
    }

    if (text) {
      if (text.length > 2) {
        text = text.substring(0, 2).toUpperCase();
      }
      avatar = <span>{text}</span>;
    }

    if (src) {
      avatar = <img src={src} style={{objectFit: fit}} />;
    }

    return (
      <div
        className={cx('Avatar', className, `Avatar--${shape}`)}
        style={{...sizeStyle, ...style}}
        {...props}
      >
        {avatar}
      </div>
    );
  }
}

@Renderer({
  test: /(^|\/)avatar$/,
  name: 'avatar'
})
@withBadge
export class AvatarFieldRenderer extends AvatarField {}
