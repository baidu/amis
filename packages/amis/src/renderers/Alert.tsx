import React from 'react';
import {Renderer, RendererProps} from 'amis-core';
import {Alert2 as Alert} from 'amis-ui';
import {isPureVariable, resolveVariableAndFilter} from 'amis-core';

import type {AlertProps} from 'amis-ui/lib/components/Alert2';
import type {BaseSchema, SchemaCollection, SchemaIcon} from '../Schema';

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

  /**
   * 操作区域
   */
  actions?: SchemaCollection;
}

@Renderer({
  type: 'alert'
})
export class AlertRenderer extends React.Component<
  Omit<AlertProps, 'actions'> & RendererProps
> {
  render() {
    let {render, body, level, icon, showIcon, actions, ...rest} = this.props;
    if (isPureVariable(level)) {
      level = resolveVariableAndFilter(level, this.props.data);
    }
    if (isPureVariable(icon)) {
      icon = resolveVariableAndFilter(icon, this.props.data);
    }
    if (isPureVariable(showIcon)) {
      showIcon = resolveVariableAndFilter(showIcon, this.props.data);
    }

    const actionsDom: React.ReactNode = actions
      ? React.isValidElement(actions)
        ? actions
        : render('alert-actions', actions)
      : null;

    return (
      <Alert
        {...rest}
        level={level}
        icon={icon}
        showIcon={showIcon}
        actions={actionsDom}
      >
        {render('body', body)}
      </Alert>
    );
  }
}
