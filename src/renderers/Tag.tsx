/**
 * @file Tag
 */
import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {BaseSchema, SchemaClassName} from '../Schema';

import Tag, {CheckableTag} from '../components/Tag';

/**
 * Tag
 */
export interface TagSchema extends BaseSchema {
  type: 'tag';
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
   * 标签颜色
   */
  color?: string;

  /**
   * 标签文本内容
   */
  label: string | React.ReactNode;

  /**
   *
   */
  mode?: 'normal' | 'rounded' | 'status';
  /**
   * status模式时候设置的前置图标
   */
  icon: string;

  /**
   * 是否展示关闭按钮
   */
  closable: boolean;

  /**
   * 关闭图标
   */
  closeIcon: string;

  /**
   * 是否是可选的标签
   */
  checkable: boolean;

  /**
   * 是否选中
   */
  checked: boolean;

  /**
   * 是否禁用
   */
  disabled: boolean;
}

export interface TagProps
  extends RendererProps,
    Omit<TagSchema, 'type' | 'className'> {}

export class TagField extends React.Component<TagProps, object> {
  render() {
    const {
      checkable,
      checked,
      label,
      icon,
      closeIcon,
      closable,
      mode,
      color,
      className,
      data,
      style = {},
      disabled
    } = this.props;

    return checkable ? (
      <CheckableTag
        checked={checked}
        disabled={disabled}
        className={className}
        style={style}
      >
        {label}
      </CheckableTag>
    ) : (
      <Tag
        closable={closable}
        className={className}
        mode={mode}
        color={color}
        closeIcon={closeIcon}
        icon={icon}
        style={style}
      >
        {label}
      </Tag>
    );
  }
}

@Renderer({
  type: 'tag'
})
export class TagFieldRenderer extends TagField {}
