/**
 * @file 用来展示用户头像
 */
import React from 'react';
import {Renderer, RendererProps} from '../factory';
import Avatar from '../components/Avatar';
import {BadgeSchema, withBadge} from '../components/Badge';
import {BaseSchema, SchemaClassName} from '../Schema';
import {isPureVariable, resolveVariableAndFilter} from '../utils/tpl-builtin';

export interface AvatarSchema extends BaseSchema {
  // 指定类型
  type: 'avatar';

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

  /**
   * 图片地址
   */
  src?: string;

  /**
   * 图标
   */
  icon?: string;

  /**
   * 图片相对于容器的缩放方式
   */
  fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';

  /**
   * 形状
   */
  shape?: 'circle' | 'square' | 'rounded';

  /**
   * 大小
   */
  size?: number | 'small' | 'default' | 'large';

  /**
   * 文本
   */
  text?: string;

  /**
   * 字符类型距离左右两侧边界单位像素
   */
  gap?: number;

  /**
   * 图片无法显示时的替换文字地址
   */
  alt?: string;

  /**
   * 图片是否允许拖动
   */
  draggable?: boolean;

  /**
   * 图片CORS属性
   */
  crossOrigin: 'anonymous' | 'use-credentials' | '';

  /**
   * 图片加载失败的是否默认处理，字符串函数
   */
  onError?: string
}

export interface AvatarProps extends RendererProps, Omit<AvatarSchema, 'type' | 'className'> {}

export class AvatarField extends React.Component<AvatarProps> {

  render() {
    let {
      style = {},
      className,
      classnames: cx,
      src,
      icon = 'fa fa-user',
      fit,
      shape,
      size,
      text,
      gap,
      alt,
      draggable,
      crossOrigin,
      onError,
      data
    } = this.props;

    let errHandler = () => false;

    if (typeof onError === 'string') {
      try {
        errHandler = new Function('event', onError) as () => boolean;
      } catch (e) {
        console.warn(onError, e);
      }
    }

    if (isPureVariable(src)) {
      src = resolveVariableAndFilter(src, data, '| raw');
    }

    if (isPureVariable(text)) {
      text = resolveVariableAndFilter(text, data);
    }

    if (isPureVariable(icon)) {
      icon = resolveVariableAndFilter(icon, data);
    }

    return (
      <Avatar
        style={style}
        className={className}
        classnames={cx}
        src={src}
        icon={icon}
        fit={fit}
        shape={shape}
        size={size}
        text={text}
        gap={gap}
        alt={alt}
        draggable={draggable}
        crossOrigin={crossOrigin}
        onError={errHandler}
      />
    );
  }
}

@Renderer({
  type: 'avatar'
})
@withBadge
export class AvatarFieldRenderer extends AvatarField {}
