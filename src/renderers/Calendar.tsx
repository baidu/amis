import React from 'react';
import {Renderer} from '../factory';
import {FormControlProps} from './Form/Item';
import {
  isPureVariable,
  resolveVariableAndFilter
} from '../utils/tpl-builtin';
import 'moment/locale/zh-cn';
import DatePicker from '../components/DatePicker';
import {SchemaObject, BaseSchema} from '../Schema';
import {createObject, anyChanged, isMobile} from '../utils/helper';

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

export interface CalendarProps extends FormControlProps {
  schedules?:
    | Array<{
      startTime: Date;
      endTime: Date;
      content: any;
      className?: string;
    }>
    | string;
  scheduleClassNames?: Array<string>;
  scheduleAction?: SchemaObject;
}

interface CalendarState {
  schedules?: Array<{
    startTime: Date;
    endTime: Date;
    content: any;
    className?: string;
  }>;
}

export default class CaLendarControl extends React.PureComponent<
  CalendarProps,
  CalendarState
> {
  static defaultProps = {
    format: 'X',
    viewMode: 'days',
    inputFormat: 'YYYY-MM-DD',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '',
    embed: true
  };

  constructor(props: CalendarProps) {
    super(props);

    const {data} = props;

    let schedulesData = props.schedules;
    if (typeof schedulesData === 'string') {
      const resolved = resolveVariableAndFilter(schedulesData, data, '| raw');
      if (Array.isArray(resolved)) {
        schedulesData = resolved;
      }
    }

    this.state = {
      schedules: typeof schedulesData === 'string' ? [] : schedulesData
    };
  }

  componentDidUpdate(prevProps: CalendarProps) {
    const props = this.props;

    if (
      anyChanged(['schedules', 'data'], prevProps, props) &&
      typeof props.schedules === 'string' &&
      isPureVariable(props.schedules)
    ) {
      const schedulesData = resolveVariableAndFilter(
        props.schedules,
        props.data,
        '| raw'
      );
      const preSchedulesData = typeof prevProps.schedules === 'string' && resolveVariableAndFilter(
        prevProps.schedules,
        prevProps.data,
        '| raw'
      );
      if (Array.isArray(schedulesData) && preSchedulesData !== schedulesData) {
        this.setState({
          schedules: schedulesData
        });
      }
    }
  }

  // 日程点击事件
  onScheduleClick(scheduleData: any) {
    const {scheduleAction, onAction, data, translate: __} = this.props;
    const defaultscheduleAction = {
      actionType: 'dialog',
      dialog: {
        title: __('Schedule'),
        actions: [],
        body: {
          type: 'table',
          columns: [
            {
              name: 'time',
              label: __('Time')
            },
            {
              name: 'content',
              label: __('Content')
            }
          ],
          data: '${scheduleData}'
        }
      }
    };

    onAction &&
      onAction(
        null,
        scheduleAction || defaultscheduleAction,
        createObject(data, scheduleData)
      );
  }

  onDateChange() {}

  render() {
    let {
      className,
      classnames: cx,
      largeMode,
      useMobileUI,
      scheduleClassNames,
      ...rest
    } = this.props;

    return (
      <div className={cx(`DateControl`, className)}>
        <DatePicker
          {...rest}
          scheduleClassNames={scheduleClassNames}
          useMobileUI={useMobileUI}
          schedules={this.state.schedules}
          largeMode={largeMode}
          onScheduleClick={this.onScheduleClick.bind(this)}
          onChange={this.onDateChange.bind(this)}
        />
      </div>
    );
  }
}

@Renderer({
  type: 'calendar'
})
export class CalendarRenderer extends CaLendarControl {}
