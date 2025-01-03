/**
 * @file Tag
 */
import React from 'react';
import {
  autobind,
  createObject,
  labelToString,
  Renderer,
  RendererProps
} from 'amis-core';
import {BaseSchema, SchemaClassName, SchemaIcon} from '../Schema';
import {getPropValue} from 'amis-core';
import {isPureVariable, resolveVariableAndFilter} from 'amis-core';

import {Tag} from 'amis-ui';

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
    Omit<TagSchema, 'type' | 'className'> {
  onClick?: (params: {[propName: string]: any}) => void;
  onClose?: (params: {[propName: string]: any}) => void;
}

export class TagField extends React.Component<TagProps, object> {
  static defaultProps: Partial<TagProps> = {
    displayMode: 'normal'
  };

  @autobind
  handleClick(nativeEvent: React.MouseEvent<any>) {
    const {dispatchEvent, onClick} = this.props;
    const params = this.getResolvedEventParams();

    dispatchEvent(nativeEvent, params);
    onClick?.(params);
  }

  @autobind
  handleMouseEnter(e: React.MouseEvent<any>) {
    const {dispatchEvent} = this.props;
    const params = this.getResolvedEventParams();

    dispatchEvent(e, params);
  }

  @autobind
  handleMouseLeave(e: React.MouseEvent<any>) {
    const {dispatchEvent} = this.props;
    const params = this.getResolvedEventParams();

    dispatchEvent(e, params);
  }

  @autobind
  handleClose(nativeEvent: React.MouseEvent<HTMLElement>) {
    const {dispatchEvent, onClose} = this.props;
    const params = this.getResolvedEventParams();

    dispatchEvent(
      {
        ...nativeEvent,
        type: 'close'
      },
      params
    );
    onClose?.(params);
  }

  render() {
    let {
      icon,
      displayMode,
      color,
      className,
      closable,
      data,
      style = {}
    } = this.props;

    const label = labelToString(this.resolveLabel());

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
        closable={closable}
        style={style}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClose={this.handleClose}
      >
        {label}
      </Tag>
    );
  }

  private resolveLabel() {
    const {label, data} = this.props;
    return (
      getPropValue(this.props) ||
      (label ? resolveVariableAndFilter(label, data, '| raw') : null)
    );
  }

  private getResolvedEventParams<T>() {
    const {data} = this.props;

    return createObject(data, {
      label: this.resolveLabel()
    }) as {
      [propName: string]: any;
      label: string;
    };
  }
}

@Renderer({
  type: 'tag'
})
export class TagFieldRenderer extends TagField {}
