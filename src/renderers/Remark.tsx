import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {Api, SchemaNode, Schema, Action} from '../types';
import cx from 'classnames';
import TooltipWrapper from '../components/TooltipWrapper';
import {filter} from '../utils/tpl';
import {themeable} from '../theme';
import {Icon} from '../components/icons';
import {BaseSchema, SchemaIcon, SchemaTpl} from '../Schemas';

/**
 * 提示渲染器，默认会显示个小图标，鼠标放上来的时候显示配置的内容。
 */
export interface RemarkSchema extends BaseSchema {
  /**
   * 指定为提示类型
   */
  type: 'remark';

  icon?: SchemaIcon;

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
    | {title?: string; content?: string; body?: string},
  data: any
) {
  if (typeof tooltip === 'string') {
    return filter(tooltip, data);
  } else if (tooltip) {
    return tooltip.title
      ? {
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

export interface RemarkProps extends RendererProps, RemarkSchema {
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
      tooltip,
      placement,
      rootClose,
      trigger,
      container,
      classPrefix: ns,
      classnames: cx,
      content,
      data
    } = this.props;

    const finalIcon = (tooltip && tooltip.icon) || icon;

    return (
      <div
        className={cx(
          `Remark`,
          (tooltip && tooltip.className) || className || `Remark--warning`
        )}
      >
        <TooltipWrapper
          classPrefix={ns}
          classnames={cx}
          tooltip={filterContents(tooltip || content, data)}
          tooltipClassName={tooltip && tooltip.tooltipClassName}
          placement={(tooltip && tooltip.placement) || placement}
          rootClose={(tooltip && tooltip.rootClose) || rootClose}
          trigger={(tooltip && tooltip.trigger) || trigger}
          container={container}
          delay={tooltip && tooltip.delay}
        >
          {finalIcon ? (
            <i className={cx('Remark-icon', finalIcon)} />
          ) : (
            <Icon icon="question" className="icon" />
          )}
        </TooltipWrapper>
      </div>
    );
  }
}

export default themeable(Remark);

@Renderer({
  test: /(^|\/)remark$/,
  name: 'remark'
})
export class RemarkRenderer extends Remark {}
