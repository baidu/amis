import React from 'react';
import {Renderer} from 'amis-core';
import {SchemaObject, BaseSchema} from '../Schema';
import {DateControlRenderer} from './Form/InputDate';
import type {AMISClassName, AMISSchemaBase} from 'amis-core';

interface AMISScheduleItem {
  startTime: string;
  endTime: string;
  content: any;
  className?: AMISClassName;
}

/**
 * 日历组件，用于日期选择与事件展示。支持自定义渲染与多视图。
 */
export interface AMISCalendarSchema extends AMISSchemaBase {
  /**
   * 指定为 calendar 组件
   */
  type: 'calendar';

  /**
   * 日程
   */
  schedules?: Array<AMISScheduleItem> | string;

  /**
   * 日程显示颜色自定义
   */
  scheduleClassNames?: Array<AMISClassName>;

  /**
   * 日程点击展示
   */
  scheduleAction?: SchemaObject;

  /**
   * 是否开启放大模式
   */
  largeMode?: boolean;

  /**
   * 今日激活时的自定义样式
   */
  todayActiveStyle?: {
    [propName: string]: any;
  };
}

@Renderer({
  type: 'calendar'
})
export class CalendarRenderer extends DateControlRenderer {
  static defaultProps = {
    ...DateControlRenderer.defaultProps,
    embed: true
  };
}
