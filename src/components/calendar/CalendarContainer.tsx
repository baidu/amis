// @ts-ignore
import CalendarContainer from 'react-datetime/src/CalendarContainer';

import CustomDaysView from './DaysView';
import CustomYearsView from './YearsView';
import CustomMonthsView from './MonthsView';

export default class CustomCalendarContainer extends CalendarContainer {
  viewComponents: any = {
    ...(this as any).viewComponents,
    days: CustomDaysView,
    years: CustomYearsView,
    months: CustomMonthsView
  };
}
