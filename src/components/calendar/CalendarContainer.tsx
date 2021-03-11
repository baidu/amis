// @ts-ignore
import CalendarContainer from 'react-datetime/src/CalendarContainer';

import CustomDaysView from './DaysView';
import CustomYearsView from './YearsView';
import CustomMonthsView from './MonthsView';
import CustomTimeView from './TimeView';
import QuartersView from './QuartersView';

export default class CustomCalendarContainer extends CalendarContainer {
  viewComponents: any = {
    ...(this as any).viewComponents,
    days: CustomDaysView,
    years: CustomYearsView,
    months: CustomMonthsView,
    time: CustomTimeView,
    quarters: QuartersView
  };
}
