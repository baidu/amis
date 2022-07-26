import React = require('react');
import {render, fireEvent, within, cleanup} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv} from '../../helper';
import moment from 'moment';

test('Renderer:inputMonth click', async () => {
  const {container, findByPlaceholderText, getByText} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        body: [
          {
            type: 'input-month-range',
            name: 'a',
            label: '月份范围'
          }
        ],
        title: 'The form',
        actions: []
      },
      {},
      makeEnv({})
    )
  );

  const inputDate = await findByPlaceholderText('开始时间');

  fireEvent.click(inputDate);

  const thisMonthText = moment().format('M[月]');
  const nextMonthText = moment().add(1, 'month').format('M[月]');

  const thisMonthValue = moment().format('YYYY-MM');
  const nextMonthValue = moment().add(1, 'month').format('YYYY-MM');

  const startMonth = await within(
    document.querySelector('.cxd-DateRangePicker-start')!
  ).findByText(thisMonthText);

  fireEvent.click(startMonth);

  const endMonth = await within(
    document.querySelector('.cxd-DateRangePicker-end')!
  ).findByText(nextMonthText);

  fireEvent.click(endMonth);

  const confirm = getByText('确认');

  fireEvent.click(confirm);

  const value = document.querySelectorAll('.cxd-DateRangePicker-input')!;

  expect((value[0] as HTMLInputElement).value).toEqual(thisMonthValue);
  expect((value[1] as HTMLInputElement).value).toEqual(nextMonthValue);
});
