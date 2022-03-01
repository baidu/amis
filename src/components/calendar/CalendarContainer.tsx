import React from 'react';

import CustomDaysView from './DaysView';
import CustomYearsView from './YearsView';
import CustomMonthsView from './MonthsView';
import CustomTimeView from './TimeView';
import QuartersView from './QuartersView';

interface CalendarProps {
  view: string;
  viewProps: any;
}

export default class CustomCalendarContainer extends React.Component<CalendarProps> {
  viewComponents: any = {
    ...(this as any).viewComponents,
    days: CustomDaysView,
    years: CustomYearsView,
    months: CustomMonthsView,
    time: CustomTimeView,
    quarters: QuartersView
  };

  render() {
    return React.createElement(
      this.viewComponents[this.props.view],
      this.props.viewProps
    );
  }
}
