import React from 'react';
import {
  Renderer,
  RendererProps,
  AMISSchemaBase,
  AMISTemplate,
  AMISSchemaCollection,
  AMISClassName,
  AMISIcon,
  AMISLegacyActionSchema,
  AMISButtonSchema
} from 'amis-core';
import {Alert2 as Alert} from 'amis-ui';
import {isPureVariable, resolveVariableAndFilter} from 'amis-core';

import type {AlertProps} from 'amis-ui/lib/components/Alert2';

/**
 * 信息提示组件，用于展示通知、警告或成功/失败消息。支持标题、图标、操作按钮。
 */
export interface AMISAlertSchema extends AMISSchemaBase {
  /**
   * 指定为 alert 组件
   */
  type: 'alert';

  /**
   * 提示框标题
   */
  title?: AMISTemplate;

  /**
   * 提示内容
   */
  body: AMISSchemaCollection;

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
  closeButtonClassName?: AMISClassName;

  /**
   * 是否显示图标
   */
  showIcon?: boolean;

  /**
   * 左侧图标
   */
  icon?: AMISIcon;

  /**
   * 图标CSS类名
   */
  iconClassName?: AMISClassName;

  /**
   * 操作区域配置
   */
  actions?: AMISButtonSchema[];
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
