/**
 * 组件名称：InputDateRange 日期范围
 * 单测内容：
 1. 默认值
 2. 相对默认值
 3. 快捷键
 4. minDate & maxDate
 5. 内嵌模式
 6. minDuration & maxDuration
 7. clearable
 */

import {render, fireEvent} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';
import moment from 'moment';

const setup = async (items: any[] = []) => {
  const onSubmit = jest.fn();
  const utils = await render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          submitText: 'Submit',
          api: '/api/mock/saveForm?waitSeconds=1',
          mode: 'horizontal',
          body: items
        }
      },
      {onSubmit},
      makeEnv()
    )
  );

  await wait(200);

  const submitBtn = utils.container.querySelector(
    'button[type="submit"]'
  ) as HTMLElement;

  const inputs = utils.container.querySelectorAll('.cxd-DateRangePicker-input');

  function rerender(items: any[]) {
    const onSubmit = jest.fn();
    utils.rerender(
      amisRender(
        {
          type: 'page',
          body: {
            type: 'form',
            submitText: 'Submit',
            api: '/api/mock/saveForm?waitSeconds=1',
            mode: 'horizontal',
            body: items
          }
        },
        {onSubmit},
        makeEnv()
      )
    );
  }

  return {
    onSubmit,
    submitBtn,
    start: inputs[0],
    end: inputs[1],
    ...utils,
    rerender
  };
};

// 1. 默认值
test('Renderer:dateRange with default', async () => {
  const {container, start, end}: any = await setup([
    {
      type: 'input-date-range',
      name: 'a',
      label: 'date-range',
      value: '1559750400,1561564799',
      minDate: '1559664000',
      maxDate: '1561737600'
    }
  ]);

  expect(start.value).toEqual(
    `${moment(1559750400, 'X').format('YYYY-MM-DD')}`
  );
  expect(end.value).toEqual(`${moment(1561564799, 'X').format('YYYY-MM-DD')}`);

  // expect(container).toMatchSnapshot();
});

// 2. 相对默认值
test('Renderer:dateRange with relative default', async () => {
  const {container, start, end}: any = await setup([
    {
      type: 'input-date-range',
      name: 'a',
      label: 'date-range',
      value: '-1day,+1weeks'
    }
  ]);

  expect(start.value).toEqual(moment().add(-1, 'day').format('YYYY-MM-DD'));
  expect(end.value).toEqual(moment().add(+1, 'week').format('YYYY-MM-DD'));

  // expect(container).toMatchSnapshot();
});

// 3. 快捷键
test('Renderer:dateRange with shortcuts', async () => {
  const {container, start, end, getByText}: any = await setup([
    {
      type: 'input-date-range',
      name: 'a',
      label: 'date-range',
      shortcuts: [
        '7daysago',
        '15dayslater',
        '2weeksago',
        '1weekslater',
        'thismonth',
        '2monthsago',
        '3monthslater'
      ]
    }
  ]);

  fireEvent.click(container.querySelector('.cxd-DateRangePicker-input'));

  await wait(200);
  // expect(container).toMatchSnapshot('open');

  expect(
    container.querySelector('.cxd-DateRangePicker-rangers')!
  ).toBeInTheDocument();
  expect(
    container.querySelectorAll(
      '.cxd-DateRangePicker-rangers > .cxd-DateRangePicker-ranger'
    )!.length
  ).toBe(7);

  expect(getByText('15天以内')).toBeInTheDocument();

  fireEvent.click(getByText('15天以内'));

  await wait(200);

  expect(start.value).toEqual(moment().format('YYYY-MM-DD'));
  expect(end.value).toEqual(moment().add(+15, 'day').format('YYYY-MM-DD'));

  // expect(container).toMatchSnapshot();
});

// 4. minDate & maxDate
test('Renderer:dateRange with minDate and maxDate', async () => {
  const {container} = await setup([
    {
      type: 'input-date-range',
      name: 'date',
      label: '日期',
      valueFormat: 'YY-MM-DD',
      minDate: '-1days',
      maxDate: '+1days',
      value: '-2days,+2days'
    }
  ]);

  fireEvent.click(container.querySelector('.cxd-DateRangePicker-input')!);

  await wait(200);

  expect(
    container.querySelector(
      '.cxd-DateRangePicker-picker-wrap .rdtDay.rdtActive.rdtDisabled'
    )!
  ).toBeInTheDocument();
  expect(
    container.querySelector(
      '.cxd-DateRangePicker-picker-wrap .rdtDay.rdtActive.rdtDisabled'
    )!
  ).toBeInTheDocument();
});

// 5. 内嵌模式
test('Renderer:dateRange with embed', async () => {
  const {container} = await setup([
    {
      type: 'input-date-range',
      name: 'date',
      label: '日期',
      valueFormat: 'YY-MM-DD',
      value: '1656604800,1664553599',
      embed: true
    }
  ]);

  expect(
    container.querySelector('.cxd-DateRangeCalendar')!
  ).toBeInTheDocument();

  // expect(container).toMatchSnapshot();
});

// 6. minDuration & maxDuration
test('Renderer:dateRange with minDuration & maxDuration', async () => {
  const {container, rerender} = await setup([
    {
      type: 'input-date-range',
      name: 'select',
      label: '日期范围',
      value: 'today,+1days',
      minDuration: '2days',
      embed: true
    }
  ]);

  expect(
    container.querySelector(
      '.cxd-DateRangePicker-picker-wrap .rdtDay.rdtActive.rdtEndDay.rdtDisabled'
    )!
  ).toBeInTheDocument();

  rerender([
    {
      type: 'input-date-range',
      name: 'select',
      label: '日期范围',
      value: 'today,+3days',
      maxDuration: '2days',
      embed: true
    }
  ]);

  expect(
    container.querySelector(
      '.cxd-DateRangePicker-picker-wrap .rdtDay.rdtActive.rdtEndDay.rdtDisabled'
    )!
  ).toBeInTheDocument();
});

// 7. clearable
test('Renderer:dateRange with clearable', async () => {
  const {container, rerender} = await setup([
    {
      type: 'input-date-range',
      name: 'select',
      label: '日期范围',
      value: 'today,+1days'
    }
  ]);

  fireEvent.mouseEnter(container.querySelector('.cxd-DateRangePicker')!);
  await wait(200);
  expect(
    container.querySelector('.cxd-DateRangePicker-clear')!
  ).toBeInTheDocument();
  fireEvent.mouseLeave(container.querySelector('.cxd-DateRangePicker')!);

  await wait(200);
  rerender([
    {
      type: 'input-date-range',
      name: 'select',
      label: '日期范围',
      clearable: false
    }
  ]);

  fireEvent.mouseEnter(container.querySelector('.cxd-DateRangePicker')!);
  await wait(200);
  expect(
    container.querySelector('.cxd-DateRangePicker-clear')!
  ).not.toBeInTheDocument();
});

// 7. valueFormat/displayFormat
test('Renderer:inputDateRange compatible with format & inputFormat', async () => {
  const {container, start, end}: any = await setup([
    {
      type: 'input-date-range',
      name: 'a',
      label: 'date-range',
      value: '1559750400,1561564799',
      displayFormat: 'DD/MM-YYYY',
      valueFormat: 'X'
    }
  ]);

  expect(start.value).toEqual(
    `${moment(1559750400, 'X').format('DD/MM-YYYY')}`
  );
  expect(end.value).toEqual(`${moment(1561564799, 'X').format('DD/MM-YYYY')}`);
});

// 8. 兼容format & inputFormat
test('Renderer:inputDateRange compatible with format & inputFormat', async () => {
  const {container} = await setup([
    {
      type: 'input-date-range',
      name: 'date1',
      label: '日期',
      value: '1559750400,1561564799',
      inputFormat: 'DD/MM-YYYY',
      format: 'X'
    },
    {
      type: 'input-date-range',
      name: 'date2',
      label: '日期',
      value: '1559750400,1561564799',
      displayFormat: 'DD/MM-YYYY',
      valueFormat: 'X'
    }
  ]);

  const inputs = container.querySelectorAll(
    '.cxd-DateRangePicker-input'
  )! as NodeListOf<HTMLInputElement>;
  const first = {start: inputs[0].value, end: inputs[1].value};
  const second = {start: inputs[2].value, end: inputs[3].value};

  expect(first['start']).toEqual(second['start']);
  expect(first['end']).toEqual(second['end']);
});
