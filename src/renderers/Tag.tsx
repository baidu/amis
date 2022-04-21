/**
 * @file Tag
 */
import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {BaseSchema, SchemaClassName, SchemaIcon} from '../Schema';
import {getPropValue} from '../utils/helper';
import {isPureVariable, resolveVariableAndFilter} from '../utils/tpl-builtin';

import Tag from '../components/Tag';

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
  style?: React.CSSProperties;

  /**
   * 标签颜色
   */
  color?: string;

  /**
   * 标签文本内容
   */
  label: string;

  /**
   * normal: 面性标签，对应color的背景色
   * rounded: 线性标签， 对应color的边框
   * status: 带图标的标签， 图标可以自定义
   */
  displayMode?: 'normal' | 'rounded' | 'status';

  /**
   * status模式时候设置的前置图标
   */
  icon?: SchemaIcon;

  /**
   * 是否展示关闭按钮
   */
  closable?: boolean;

  /**
   * 关闭图标
   */
  closeIcon: SchemaIcon;

  /**
   * 是否是可选的标签
   */
  checkable?: boolean;

  /**
   * 是否选中
   */
  checked?: boolean;

  /**
   * 是否禁用
   */
  disabled?: boolean;
}

export interface TagProps
  extends RendererProps,
    Omit<TagSchema, 'type' | 'className'> {}

export class TagField extends React.Component<TagProps, object> {
  static defaultProps: Partial<TagProps> = {
    displayMode: 'normal'
  };

  render() {
    let {
      label,
      icon,
      displayMode,
      color,
      className,
      data,
      style = {}
    } = this.props;

    label =
      getPropValue(this.props) ||
      (label ? resolveVariableAndFilter(label, data, '| raw') : null);

    if (isPureVariable(icon)) {
      icon = resolveVariableAndFilter(icon, data);
    }

    if (isPureVariable(displayMode)) {
      displayMode = resolveVariableAndFilter(displayMode, data);
    }

    if (isPureVariable(color)) {
      color = resolveVariableAndFilter(color, data);
    }

    return (
      <Tag
        className={className}
        displayMode={displayMode}
        color={color}
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
