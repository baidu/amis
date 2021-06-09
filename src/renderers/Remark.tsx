import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {Api, SchemaNode, Schema, Action} from '../types';
import cx from 'classnames';
import TooltipWrapper from '../components/TooltipWrapper';
import {filter} from '../utils/tpl';
import {themeable} from '../theme';
import {hasIcon, Icon} from '../components/icons';
import {BaseSchema, SchemaClassName, SchemaIcon, SchemaTpl} from '../Schema';

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
}

export type SchemaRemark = string | Omit<RemarkSchema, 'type'>;

export function filterContents(
  tooltip:
    | string
    | undefined
    | {title?: string; render?: any; content?: string; body?: string},
  data: any
) {
  if (typeof tooltip === 'string') {
    return filter(tooltip, data);
  } else if (tooltip) {
    return tooltip.title
      ? {
          render: tooltip.render ? () => tooltip.render(data) : undefined,
          title: filter(tooltip.title, data),
          content:
            tooltip.content || tooltip.body
              ? filter(tooltip.content || tooltip.body || '', data)
              : undefined
        }
      : tooltip.content || tooltip.body
      ? filter(tooltip.content || tooltip.body || '', data)
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

  render() {
    const {
      className,
      icon,
      label,
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
      tooltipClassName
    } = this.props;

    const finalIcon = tooltip?.icon ?? icon;
    const finalLabel = tooltip?.label ?? label;

    return (
      <TooltipWrapper
        classPrefix={ns}
        classnames={cx}
        tooltip={filterContents(tooltip || content, data)}
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
          {finalLabel ? <span>{finalLabel}</span> : null}
          {finalIcon ? (
            hasIcon(finalIcon) ? (
              <span className={cx('Remark-icon')}>
                <Icon icon={finalIcon} />
              </span>
            ) : (
              <i className={cx('Remark-icon', finalIcon)} />
            )
          ) : finalIcon === false && finalLabel ? null : (
            <span className={cx('Remark-icon icon')}>
              <Icon icon="question-mark" />
            </span>
          )}
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
