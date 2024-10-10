/**
 * 组件名称：InputDatetimeRange 日期时间范围
 *
 * 备注：InputDatetimeRange 与 dateRange 等日期范围使用的是同一个组件，所以只测试不同的地方即可
 *
 * 单测内容：
 1. 默认值
 2. timeFormat 控制可以选择秒
 3. inputFormat
 4. 快捷键
 */

import {render, fireEvent, screen} from '@testing-library/react';
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
test('Renderer:datetimeRange with default', async () => {
  const {container, start, end}: any = await setup([
    {
      type: 'input-datetime-range',
      name: 'a',
      label: 'date-range',
      value: '1668115260,1668722939'
    }
  ]);

  expect(start.value).toEqual('2022-11-11 05:21');
  expect(end.value).toEqual('2022-11-18 06:08');

  // expect(container).toMatchSnapshot();
});

// 2. timeFormat 控制可以选择秒
test('Renderer:datetimeRange with displayFormat', async () => {
  const {container, start, end}: any = await setup([
    {
      type: 'input-datetime-range',
      name: 'select',
      displayFormat: 'YYYY-MM-DD HH:mm:ss',
      label: '日期时间范围',
      value: '1668115260,1668722939'
    }
  ]);

  fireEvent.click(container.querySelector('.cxd-DateRangePicker-input'));

  await wait(200);
  expect(
    container.querySelectorAll(
      '.cxd-CalendarInputWrapper.cxd-CalendarInputWrapperMT'
    ).length
  ).toBe(3);

  // expect(container).toMatchSnapshot();
});

// 3. inputFormat
test('Renderer:datetimeRange with timeFormat', async () => {
  const {container, start, end}: any = await setup([
    {
      type: 'input-datetime-range',
      name: 'select',
      inputFormat: 'YYYY-MM-DD HH:mm:ss',
      label: '日期时间范围',
      value: '1667404800,1669270456'
    }
  ]);

  expect(start.value).toEqual('2022-11-03 00:00:00');
  expect(end.value).toEqual('2022-11-24 14:14:16');
});

// 4. 快捷键
test('Renderer:datetimeRange with shortcuts', async () => {
  const {container, start, end, getByText}: any = await setup([
    {
      type: 'input-datetime-range',
      name: 'a',
      label: '日期时间范围',
      shortcuts: ['1hoursago', '2hourslater']
    }
  ]);

  fireEvent.click(start!);
  await wait(200);

  expect(getByText('最近1小时')).toBeInTheDocument();
  expect(getByText('2小时以内')).toBeInTheDocument();

  fireEvent.click(getByText('最近1小时'));
  await wait(200);
  expect(start.value).toEqual(
    moment().add(-1, 'hour').format('YYYY-MM-DD HH:00')
  );
  expect(end.value).toEqual(
    moment().add(-1, 'hour').format('YYYY-MM-DD HH:59')
  );

  fireEvent.click(start!);
  await wait(200);

  fireEvent.click(getByText('2小时以内'));
  await wait(200);
  expect(start.value).toEqual(moment().format('YYYY-MM-DD HH:00'));
  expect(end.value).toEqual(moment().add(2, 'hour').format('YYYY-MM-DD HH:59'));
});


/**
 * CASE: 日期时间选择器首次选择日期或时间后，时间自动设置为当前时间
 * 预期：后续选择日期或者时间，不会改变点选值
 */
test('InputDateTimeRange Picker selects date or time for the first time', async () => {
  const {container} = render(
    amisRender({
      type: 'form',
      body: [
        {
          "type": "input-datetime-range",
          "label": "日期时间范围",
          "name": "begin",
          "extraName": "end",
          "valueFormat": "YYYY-MM-DD HH:mm:ss",
          "displayFormat": "YYYY-MM-DD HH:mm:ss"
        }
      ],
      actions: []
    }, {}, makeEnv({}))
  );

  const start = screen.getByPlaceholderText('开始时间') as HTMLInputElement;
  const end = screen.getByPlaceholderText('结束时间');
  fireEvent.click(start);
  await wait(200);

  let todayEl = document.querySelector('.rdtDay.rdtToday')!;
  let yesterdayEl = todayEl?.previousSibling!;
  let tomorrowEl = todayEl?.nextSibling!;

  const currentTime = new Date();
  const currentSeconds = currentTime.getSeconds();

  /** 跳过0秒，用于后续测试值和00:00:00的Diff */
  if (currentSeconds === 0) {
    await wait(1000);
  }

  if (yesterdayEl) {
    fireEvent.click(yesterdayEl);
  }
  else {
    fireEvent.click(tomorrowEl);
  }
  await wait(200);

  let timeStr = start?.value?.split(/\s+/)?.[1];
  expect(timeStr.split?.(':')?.[0] !== '00').toEqual(true);
  // 再次选择0点，预期切换成功
  const hourSelector = container.querySelectorAll('.cxd-CalendarInput-sugsHours > .cxd-CalendarInput-sugsItem');
  const zeroHour = hourSelector?.[0]!;
  expect(hourSelector.length).toEqual(24);
  expect(zeroHour?.textContent).toEqual('00');
  fireEvent.click(zeroHour);
  await wait(200);
  timeStr = start?.value?.split(/\s+/)?.[1];
  expect(timeStr.split?.(':')?.[0] === '00').toEqual(true);
}, 5000);
