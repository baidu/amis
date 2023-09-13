import {Renderer, RendererProps} from 'amis-core';
import React from 'react';
import {Alert2 as Alert} from 'amis-ui';
import {
  BaseSchema,
  SchemaObject,
  SchemaCollection,
  SchemaIcon
} from '../Schema';
import {isPureVariable, resolveVariableAndFilter} from 'amis-core';
import type {AlertProps} from 'amis-ui/lib/components/Alert2';

/**
 * Alert 提示渲染器。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/alert
 */
export interface AlertSchema extends BaseSchema {
  /**
   * 指定为提示框类型
   */
  type: 'alert';

  /**
   * 提示框标题
   */
  title?: string;

  /**
   * 内容区域
   */
  body: SchemaCollection;

  /**
   * 提示类型
   */
  level?: 'info' | 'warning' | 'success' | 'danger';

  /**
   * 是否显示关闭按钮
   */
  showCloseButton?: boolean;

  /**
   * 关闭按钮CSS类名
   */
  closeButtonClassName?: string;

  /**
   * 是否显示ICON
   */
  showIcon?: boolean;

  /**
   * 左侧图标
   */
  icon?: SchemaIcon;

  /**
   * 图标CSS类名
   */
  iconClassName?: string;
}

@Renderer({
  type: 'alert'
})
export class TplRenderer extends React.Component<AlertProps & RendererProps> {
  render() {
    let {render, body, level, icon, showIcon, ...rest} = this.props;
    if (isPureVariable(level)) {
      level = resolveVariableAndFilter(level, this.props.data);
    }
    if (isPureVariable(icon)) {
      icon = resolveVariableAndFilter(icon, this.props.data);
    }
    if (isPureVariable(showIcon)) {
      showIcon = resolveVariableAndFilter(showIcon, this.props.data);
    }

    return (
      <Alert {...rest} level={level} icon={icon} showIcon={showIcon}>
        {render('body', body)}
      </Alert>
    );
  }
}
