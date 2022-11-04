import React from 'react';
import {Renderer, RendererProps} from 'amis-core';
import {Api, SchemaNode, Schema, ActionObject} from 'amis-core';
import cx from 'classnames';
import {TooltipWrapper} from 'amis-ui';
import {filter, generateIcon} from 'amis-core';
import {ClassNamesFn, themeable} from 'amis-core';
import {hasIcon, Icon} from 'amis-ui';
import {BaseSchema, SchemaClassName, SchemaIcon, SchemaTpl} from '../Schema';
import {autobind, isMobile} from 'amis-core';
import type {TooltipObject} from 'amis-ui/lib/components/TooltipWrapper';

/**
 * 提示渲染器，默认会显示个小图标，鼠标放上来的时候显示配置的内容。
 */
export interface RemarkSchema extends BaseSchema {
  /**
   * 指定为提示类型
   */
  type: 'remark';

  label?: string;

  icon?: SchemaIcon;

  tooltipClassName?: SchemaClassName;

  /**
   * 触发规则
   */
  trigger?: Array<'click' | 'hover' | 'focus'>;

  /**
   * 提示标题
   */
  title?: string;

  /**
   * 提示内容
   */
  content: SchemaTpl;

  /**
   * 显示位置
   */
  placement?: 'top' | 'right' | 'bottom' | 'left';

  /**
   * 点击其他内容时是否关闭弹框信息
   */
  rootClose?: boolean;

  /**
   * icon的形状
   */
  shape?: 'circle' | 'square';
}

export type SchemaRemark = string | Omit<RemarkSchema, 'type'>;

export function filterContents(
  tooltip:
    | string
    | undefined
    | {title?: string; children?: any; content?: string; body?: string},
  data: any
) {
  if (typeof tooltip === 'string') {
    return filter(tooltip, data);
  } else if (tooltip) {
    const {title, content, body, ...rest} = tooltip;
    return title || content || body
      ? {
          ...rest,
          title: filter(title, data),
          content:
            content || body ? filter(content || body || '', data) : undefined
        }
      : undefined;
  }
  return tooltip;
}

export interface RemarkProps
  extends RendererProps,
    Omit<RemarkSchema, 'type' | 'className'> {
  icon: string;
  trigger: Array<'hover' | 'click' | 'focus'>;
}

class Remark extends React.Component<RemarkProps> {
  static propsList: Array<string> = [];
  static defaultProps = {
    icon: '',
    trigger: ['hover', 'focus'] as Array<'hover' | 'click' | 'focus'>
  };

  @autobind
  showModalTip(tooltip?: string | TooltipObject) {
    let {onAction, data} = this.props;
    return (e: React.MouseEvent) => {
      onAction &&
        onAction(
          e,
          {
            actionType: 'dialog',
            dialog: {
              title:
                tooltip && typeof tooltip !== 'string' ? tooltip.title : '',
              body:
                tooltip && typeof tooltip !== 'string'
                  ? tooltip.content
                  : tooltip,
              actions: []
            }
          },
          data
        );
    };
  }

  renderLabel(
    finalIcon: any,
    finalLabel: string,
    cx: ClassNamesFn,
    shape?: 'circle' | 'square'
  ) {
    const shapeClass = shape ? `Remark-icon--${shape}` : undefined;

    return (
      <>
        {finalLabel ? <span>{finalLabel}</span> : null}
        {finalIcon ? (
          typeof finalIcon === 'object' ? (
            generateIcon(cx, finalIcon)
          ) : hasIcon(finalIcon) ? (
            <span className={cx('Remark-icon', shapeClass)}>
              <Icon icon={finalIcon} />
            </span>
          ) : (
            <i className={cx('Remark-icon', finalIcon)} />
          )
        ) : finalIcon === false && finalLabel ? null : (
          <span className={cx('Remark-icon icon', shapeClass)}>
            <Icon icon="question-mark" />
          </span>
        )}
      </>
    );
  }

  render() {
    const {
      className,
      icon,
      label,
      shape,
      tooltip,
      placement,
      rootClose,
      trigger,
      container,
      classPrefix: ns,
      classnames: cx,
      content,
      data,
      env,
      tooltipClassName,
      useMobileUI
    } = this.props;

    const finalIcon = tooltip?.icon ?? icon;
    const finalLabel = tooltip?.label ?? label;
    const finalShape = tooltip?.shape ?? shape;
    const parsedTip = filterContents(tooltip || content, data);

    // 移动端使用弹框提示
    if (isMobile() && useMobileUI) {
      return (
        <div
          className={cx(
            `Remark`,
            (tooltip && tooltip.className) || className || `Remark--warning`
          )}
          onClick={this.showModalTip(parsedTip)}
        >
          {this.renderLabel(finalIcon, finalLabel, cx, finalShape)}
        </div>
      );
    }

    return (
      <TooltipWrapper
        classPrefix={ns}
        classnames={cx}
        tooltip={parsedTip}
        tooltipClassName={
          (tooltip && tooltip.tooltipClassName) || tooltipClassName
        }
        placement={(tooltip && tooltip.placement) || placement}
        rootClose={(tooltip && tooltip.rootClose) || rootClose}
        trigger={(tooltip && tooltip.trigger) || trigger}
        container={container || env.getModalContainer}
        delay={tooltip && tooltip.delay}
      >
        <div
          className={cx(
            `Remark`,
            (tooltip && tooltip.className) || className || `Remark--warning`
          )}
        >
          {this.renderLabel(finalIcon, finalLabel, cx, finalShape)}
        </div>
      </TooltipWrapper>
    );
  }
}

export default themeable(Remark);

@Renderer({
  type: 'remark'
})
export class RemarkRenderer extends Remark {}
