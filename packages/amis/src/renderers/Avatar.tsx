/**
 * @file 用来展示用户头像
 */
import React from 'react';
import {
  AMISBadgeBase,
  AMISSchemaBase,
  Renderer,
  RendererProps
} from 'amis-core';
import {Avatar} from 'amis-ui';
import {BadgeObject, withBadge} from 'amis-ui';
import {BaseSchema, AMISClassName} from '../Schema';
import {isPureVariable, resolveVariableAndFilter, autobind} from 'amis-core';

/**
 * 头像组件，用于展示用户头像或图标。
 */
export interface AMISAvatarSchema extends AMISSchemaBase {
  // 指定类型
  type: 'avatar';

  /**
   * 类名
   */
  className?: AMISClassName;

  /**
   * 自定义样式
   */
  style?: {
    [propName: string]: any;
  };

  /**
   * 角标
   */
  badge?: AMISBadgeBase;

  /**
   * 图片地址
   */
  src?: string;

  /**
   * 默认头像
   */
  defaultAvatar?: string;

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
   * 图片加载失败的是否默认处理
   */
  onError?: string;
}

export interface AvatarProps
  extends RendererProps,
    Omit<AMISAvatarSchema, 'type' | 'className'> {}

export class AvatarField extends React.Component<AvatarProps> {
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
    let {
      style = {},
      className,
      classnames: cx,
      src,
      defaultAvatar,
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
        src={src || defaultAvatar}
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
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      />
    );
  }
}

@Renderer({
  type: 'avatar'
})
// @ts-ignore
@withBadge
export class AvatarFieldRenderer extends AvatarField {}
