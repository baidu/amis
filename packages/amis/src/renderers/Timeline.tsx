import React from 'react';
import {
  Renderer,
  RendererProps,
  filter,
  isPureVariable,
  resolveVariableAndFilter,
  createObject,
  isEffectiveApi,
  ApiObject,
  autobind,
  isObject
} from 'amis-core';
import {RemoteOptionsProps, withRemoteConfig, Timeline} from 'amis-ui';

import type {
  BaseSchema,
  SchemaApi,
  SchemaCollection,
  SchemaTokenizeableString
} from '../Schema';
import type {IconCheckedSchema} from 'amis-ui';
import {CardSchema} from './Card';

type DotSize = 'sm' | 'md' | 'lg' | 'xl';

enum DirectionMode {
  left = 'left',
  right = 'right',
  top = 'top',
  bottom = 'bottom',
  alternate = 'alternate'
}

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

  // 节点大小，可选值为 sm md lg xl，默认为md
  dotSize?: DotSize;

  // 连线颜色，默认为空字符串（跟随主题色）
  lineColor?: string;

  // 隐藏当前节点的圆圈
  hideDot?: boolean;
  /**
   * 卡片展示配置，如果传入则以卡片形式展示，传入对象转为卡片展示，传入的time、title、detail及相关属性将被忽略，只有连线配置和节点圆圈配置生效
   */
  cardSchema?: CardSchema;
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
  mode?: DirectionMode;

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

  /**
   * 卡片展示配置，如果传入则将items数据传入cardSchema中循环渲染，itemTitleSchema、titleClassName、detailClassName将不生效。配置后 timeline item中的数据都将可以在cardSchema中通过数据方式引用。如果子节点也配置了cardSchema，则子节点的cardSchema优先级高于timeline的cardSchema
   */
  cardSchema?: CardSchema;
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
    cardSchema: commonCardSchema,
    name,
    itemKeyName,
    indexKeyName,
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
        time,
        detail,
        timeClassName,
        titleClassName,
        detailClassName,
        cardSchema
      } = timelineItem;

      const cardRenderer = cardSchema || commonCardSchema;
      const ctx = createObject(data, {
        ...(isObject(timelineItem)
          ? {index, ...timelineItem}
          : {[name]: timelineItem}),
        [itemKeyName || 'item']: timelineItem,
        [indexKeyName || 'index']: index
      });

      return {
        ...timelineItem,
        iconClassName,
        timeClassName,
        titleClassName,
        detailClassName,
        icon: isPureVariable(icon)
          ? resolveVariableAndFilter(icon, ctx, '| raw')
          : icon,
        title: itemTitleSchema
          ? render(`${index}/body`, itemTitleSchema, {
              data: ctx
            })
          : resolveRender('title', title),
        time: resolveRender('time', time),
        detail: resolveRender('detail', detail),
        cardNode: cardRenderer
          ? render('card', cardRenderer, {
              data: ctx // 当前继承的data和本身节点的数据作为当前卡片schema的渲染数据
            })
          : undefined
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
  remoteRef:
    | {
        loadConfig: (ctx?: any) => Promise<any> | void;
        setConfig: (value: any) => void;
        syncConfig: () => void;
      }
    | undefined = undefined;

  @autobind
  remoteConfigRef(ref: any) {
    this.remoteRef = ref;
  }

  componentDidUpdate(prevProps: any) {
    const {source, data} = this.props;
    if (this.remoteRef && source !== prevProps.source) {
      // 如果是变量，则同步配置。如果为api，则重新加载配置
      (isPureVariable(source) && this.remoteRef.syncConfig()) ||
        (isEffectiveApi(source, data)
          ? (source as ApiObject).autoRefresh !== false &&
            this.remoteRef.loadConfig()
          : this.remoteRef.setConfig(undefined));
    }
  }

  render() {
    return (
      <TimelineWithRemoteConfig
        {...this.props}
        remoteConfigRef={this.remoteConfigRef}
      />
    );
  }
}
