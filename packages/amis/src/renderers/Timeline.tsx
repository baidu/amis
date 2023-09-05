import React from 'react';
import {
  Renderer,
  RendererProps,
  filter,
  isPureVariable,
  resolveVariableAndFilter,
  createObject
} from 'amis-core';
import {RemoteOptionsProps, withRemoteConfig, Timeline} from 'amis-ui';

import type {
  BaseSchema,
  SchemaApi,
  SchemaCollection,
  SchemaTokenizeableString
} from '../Schema';
import type {IconCheckedSchema} from 'amis-ui';

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
  /**
   * 节点时间的CSS类名（优先级高于统一配置的timeClassName）
   */
  timeClassName?: string;
  /**
   * 节点标题的CSS类名（优先级高于统一配置的titleClassName）
   */
  titleClassName?: string;
  /**
   * 节点详情的CSS类名（优先级高于统一配置的detailClassName）
   */
  detailClassName?: string;
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
  /**
   * 节点title自定一展示模板
   */
  itemTitleSchema?: SchemaCollection;
  /**
   * 图标的CSS类名
   */
  iconClassName?: string;
  /**
   * 节点时间的CSS类名
   */
  timeClassName?: string;
  /**
   * 节点标题的CSS类名
   */
  titleClassName?: string;
  /**
   * 节点详情的CSS类名
   */
  detailClassName?: string;
}

export interface TimelineProps
  extends RendererProps,
    Omit<TimelineSchema, 'className'> {}

export function TimelineCmpt(props: TimelineProps) {
  const {
    items,
    mode,
    style,
    direction,
    reverse,
    data,
    itemTitleSchema,
    className,
    timeClassName,
    titleClassName,
    detailClassName,
    render
  } = props;

  // 渲染内容
  const resolveRender = (region: string, val?: SchemaCollection) =>
    typeof val === 'string' ? filter(val, data) : val && render(region, val);

  // 处理源数据
  const resolveTimelineItems = (items || []).map(
    (timelineItem: TimelineItemSchema, index: number) => {
      const {
        icon,
        iconClassName,
        title,
        timeClassName,
        titleClassName,
        detailClassName
      } = timelineItem;

      return {
        ...timelineItem,
        iconClassName,
        timeClassName,
        titleClassName,
        detailClassName,
        icon: isPureVariable(icon)
          ? resolveVariableAndFilter(icon, data, '| raw')
          : icon,
        title: itemTitleSchema
          ? render(`${index}/body`, itemTitleSchema, {
              data: createObject(data, timelineItem)
            })
          : resolveRender('title', title)
      };
    }
  );

  return (
    <Timeline
      items={resolveTimelineItems}
      direction={direction}
      reverse={reverse}
      mode={mode}
      style={style}
      className={className}
      timeClassName={timeClassName}
      titleClassName={titleClassName}
      detailClassName={detailClassName}
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
      const {config, items, deferLoad, loading, updateConfig, ...rest} =
        this.props;

      let sourceItems: Array<TimelineItemSchema> = config
        ? Array.isArray(config)
          ? config
          : Object.keys(config).map(key => ({
              time: key,
              title: config[key]
            }))
        : items || [];
      return <TimelineCmpt items={sourceItems} {...rest} />;
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
