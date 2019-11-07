import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {Api, SchemaNode, Schema, Action} from '../types';
import cx from 'classnames';
import TooltipWrapper from '../components/TooltipWrapper';
import {filter} from '../utils/tpl';

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

type RemarkProps = {
  icon: string;
  className?: string;
  trigger: Array<string>;
  title?: string;
  content: string;
  placement?: string;
} & RendererProps;

export default class Remark extends React.Component<RemarkProps> {
  static propsList: Array<string> = [];
  static defaultProps = {
    icon: 'fa fa-question-circle',
    trigger: ['hover', 'focus']
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

    return (
      <TooltipWrapper
        classPrefix={ns}
        classnames={cx}
        tooltip={filterContents(tooltip || content, data)}
        placement={(tooltip && tooltip.placement) || placement}
        rootClose={(tooltip && tooltip.rootClose) || rootClose}
        trigger={(tooltip && tooltip.trigger) || trigger}
        container={container}
        delay={tooltip && tooltip.delay}
      >
        <div
          className={cx(
            `Remark`,
            (tooltip && tooltip.className) || className || `Remark--warning`
          )}
        >
          <i className={cx('Remark-icon', (tooltip && tooltip.icon) || icon)} />
        </div>
      </TooltipWrapper>
    );
  }
}

@Renderer({
  test: /(^|\/)remark$/,
  name: 'remark'
})
export class RemarkRenderer extends Remark {}
