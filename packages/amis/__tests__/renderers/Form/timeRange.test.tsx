/**
 * 组件名称：InputTimeRange 时间范围
 * 
 * 备注：InputTimeRange 与 dateRange 等日期范围使用的是同一个组件，所以只测试不同的地方即可
 * 
 * 单测内容：
 1. 默认值
 2. timeFormat
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
test('Renderer:timeRange with default', async () => {
  const {container, start, end}: any = await setup([
    {
      type: 'input-time-range',
      name: 'a',
      label: '时间范围',
      value: '03:05,07:08'
    }
  ]);

  expect(start.value).toEqual('03:05');
  expect(end.value).toEqual('07:08');

  fireEvent.click(start!);
  await wait(200);

  const highlights = container.querySelectorAll(
    '.cxd-CalendarInputWrapper .cxd-CalendarInput-sugsItem.is-highlight'
  );
  expect(highlights.length).toBe(2);
  expect(highlights[0]!.innerHTML).toBe('03');
  expect(highlights[1]!.innerHTML).toBe('05');

  fireEvent.click(end!);
  await wait(200);

  const highlights2 = container.querySelectorAll(
    '.cxd-CalendarInputWrapper .cxd-CalendarInput-sugsItem.is-highlight'
  );
  expect(highlights2.length).toBe(2);
  expect(highlights2[0]!.innerHTML).toBe('07');
  expect(highlights2[1]!.innerHTML).toBe('08');
  // expect(container).toMatchSnapshot();
});

// 2. timeFormat
test('Renderer:datetimeRange with timeFormat', async () => {
  const {container, start, end, getByText, submitBtn, onSubmit}: any =
    await setup([
      {
        type: 'input-time-range',
        name: 'times',
        label: '时间范围',
        timeFormat: 'HH:mm:ss',
        format: 'HH:mm:ss',
        inputFormat: 'HH:mm:ss'
      }
    ]);

  fireEvent.click(start!);
  await wait(200);

  const selects = container.querySelectorAll(
    '.cxd-TimeContentWrapper .cxd-CalendarInputWrapper'
  );

  expect(selects!.length).toBe(3);
  fireEvent.click(
    selects[0].querySelector('.cxd-CalendarInput-sugsItem:nth-child(4)')
  );
  fireEvent.click(
    selects[1].querySelector('.cxd-CalendarInput-sugsItem:nth-child(14)')
  );
  fireEvent.click(
    selects[2].querySelector('.cxd-CalendarInput-sugsItem:nth-child(24)')
  );
  fireEvent.click(getByText('确认'));

  await wait(200);
  const selects2 = container.querySelectorAll(
    '.cxd-TimeContentWrapper .cxd-CalendarInputWrapper'
  );
  fireEvent.click(
    selects2[0].querySelector('.cxd-CalendarInput-sugsItem:nth-child(15)')
  );
  fireEvent.click(
    selects2[1].querySelector('.cxd-CalendarInput-sugsItem:nth-child(25)')
  );
  fireEvent.click(
    selects2[2].querySelector('.cxd-CalendarInput-sugsItem:nth-child(35)')
  );
  fireEvent.click(getByText('确认'));
  await wait(200);

  // expect(container).toMatchSnapshot();

  fireEvent.click(submitBtn);
  await wait(1);

  const formData = onSubmit.mock.calls[0][0];
  expect(onSubmit).toHaveBeenCalled();
  expect(formData).toEqual({
    times: '03:13:23,14:24:34'
  });
});
