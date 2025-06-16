import React from 'react';
import PageRenderer from '../../../../amis-core/src/renderers/Form';
import * as renderer from 'react-test-renderer';
import {
  render,
  fireEvent,
  waitFor,
  getByText,
  within
} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';
import moment from 'moment';

test('Renderer:inputMonth click', async () => {
  const {
    debug,
    container,
    findByText,
    findByPlaceholderText,
    findByDisplayValue
  } = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        body: [
          {
            type: 'input-month',
            name: 'month',
            label: '时间'
          }
        ],
        title: 'The form',
        actions: []
      },
      {},
      makeEnv({})
    )
  );

  const inputDate = await findByPlaceholderText('请选择月份');

  fireEvent.click(inputDate);
  // 点击前一年
  fireEvent.click(
    container.querySelector('.cxd-DatePicker-popover .rdtPrev') as Element
  );

  const firstMonth = await findByText('1月');

  fireEvent.click(firstMonth);

  const lastYearMonth = moment().subtract(1, 'year').format('YYYY') + '-01';

  await findByDisplayValue(lastYearMonth);

  const input = container.querySelector(
    '.cxd-DatePicker input'
  ) as HTMLInputElement;

  expect(input.value).toEqual(lastYearMonth);
});

test('Renderer:inputMonth with dynamic minDate & maxDate', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        body: [
          {
            label: '开始日期',
            type: 'input-month',
            name: 'startTime',
            size: 'md',
            valueFormat: 'YYYY-MM',
            maxDate: '${endTime}',
            value: '2000-05'
          },
          {
            type: 'input-month',
            label: '结束日期',
            size: 'md',
            name: 'endTime',
            valueFormat: 'YYYY-MM',
            minDate: '${startTime}',
            maxDate: '${startTime} +1year',
            value: '2000-10'
          }
        ],
        title: 'The form',
        actions: []
      },
      {},
      makeEnv({})
    )
  );

  const items = container.querySelectorAll('.cxd-DatePicker');
  expect(items.length).toBe(2);

  const start = items[0];
  const end = items[1];

  fireEvent.click(end);

  await wait(200);
  expect(end.querySelector('.rdtMonth:not(.rdtDisabled)')!).toHaveTextContent(
    '5月'
  );
  fireEvent.click(start);
  await wait(200);
  fireEvent.click(await within(start as HTMLElement).getByText('8月'));
  await wait(400);

  // 这里两次 click 才能打开  popover
  fireEvent.click(end);
  fireEvent.click(end);

  await wait(400);
  expect(end.querySelector('.rdtMonth:not(.rdtDisabled)')!).toHaveTextContent(
    '8月'
  );
}, 10000);
