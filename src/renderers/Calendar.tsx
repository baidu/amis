import React from 'react';
import {Renderer} from '../factory';
import {SchemaObject, BaseSchema} from '../Schema';
import {DateControlRenderer} from './Form/InputDate';

export interface CalendarSchema extends BaseSchema {
  /**
   * 指定为日历选择控件
   */
  type: 'calendar';
 
  /**
   * 日程
   */
  schedules?:
    | Array<{
        startTime: Date;
        endTime: Date;
        content: any;
        className?: string;
      }>
    | string;

  /**
   * 日程显示颜色自定义
   */
  scheduleClassNames?: Array<string>;

  /**
   * 日程点击展示
   */
  scheduleAction?: SchemaObject;
}

@Renderer({
  type: 'calendar'
})
export class CalendarRenderer extends DateControlRenderer {
  static defaultProps = {
    embed: true
  }
}
