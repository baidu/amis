import React from 'react';
import {
  Renderer,
  RendererProps,
  filter,
  isPureVariable,
  resolveVariableAndFilter
} from 'amis-core';
import {RemoteOptionsProps, withRemoteConfig, Timeline} from 'amis-ui';

import type {
  BaseSchema,
  SchemaApi,
  SchemaCollection,
  SchemaTokenizeableString
} from '../Schema';
import type {IconCheckedSchema} from 'amis-core';

export interface TimelineItemSchema extends Omit<BaseSchema, 'type'> {
  /**
   * 时间点
   */
  time: string;

  /**
   * 时间节点标题
   */
  title?: SchemaCollection;

  /**
   * 详细内容
   */
  detail?: string;

  /**
   * detail折叠时文案
   */
  detailCollapsedText?: string;

  /**
   * detail展开时文案
   */
  detailExpandedText?: string;

  /**
   * 时间点圆圈颜色
   */
  color?: string;

  /**
   * 图标
   */
  icon?: string | IconCheckedSchema;

  /**
   * 图标的CSS类名
   */
  iconClassName?: string;
}

export interface TimelineSchema extends BaseSchema {
  /**
   * 指定为 Timeline 时间轴渲染器
   */
  type: 'timeline';

  /**
   * 节点数据
   */
  items?: Array<TimelineItemSchema>;

  /**
   * API 或 数据映射
   */
  source?: SchemaApi | SchemaTokenizeableString;

  /**
   * 文字相对于时间轴展示方向
   */
  mode?: 'left' | 'right' | 'alternate';

  /**
   * 展示方向
   */
  direction?: 'horizontal' | 'vertical';

  /**
   * 节点倒序
   */
  reverse?: boolean;
}

export interface TimelineProps
  extends RendererProps,
    Omit<TimelineSchema, 'className'> {}

export function TimelineCmpt(props: TimelineProps) {
  const {items, mode, direction, reverse, data, config, source, render} = props;

  // 获取源数据
  const timelineItemsRow: Array<TimelineItemSchema> = config || items || [];

  // 渲染内容
  const resolveRender = (region: string, val?: SchemaCollection) =>
    typeof val === 'string' ? filter(val, data) : val && render(region, val);

  // 处理源数据
  const resolveTimelineItems = timelineItemsRow?.map(
    (timelineItem: TimelineItemSchema) => {
      const {icon, iconClassName, title} = timelineItem;

      return {
        ...timelineItem,
        iconClassName,
        icon: isPureVariable(icon)
          ? resolveVariableAndFilter(icon, data, '| raw')
          : icon,
        title: resolveRender('title', title)
      };
    }
  );

  return (
    <Timeline
      items={resolveTimelineItems}
      direction={direction}
      reverse={reverse}
      mode={mode}
    />
  );
}

const TimelineWithRemoteConfig = withRemoteConfig({
  adaptor: data => data.items || data
})(
  class extends React.Component<
    RemoteOptionsProps & React.ComponentProps<typeof TimelineCmpt>
  > {
    render() {
      const {config, deferLoad, loading, updateConfig, ...rest} = this.props;
      return <TimelineCmpt config={config} {...rest} />;
    }
  }
);

@Renderer({
  type: 'timeline'
})
export class TimelineRenderer extends React.Component<TimelineProps> {
  render() {
    return <TimelineWithRemoteConfig {...this.props} />;
  }
}
