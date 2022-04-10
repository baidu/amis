import React = require('react');
import {render, fireEvent, within, cleanup} from '@testing-library/react';
import '../../../src/themes/default';
import {render as amisRender} from '../../../src/index';
import {makeEnv} from '../../helper';
import moment from 'moment';

test('Renderer:inputMonth click', async () => {
  const {container, findByText, getByText} = render(
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

  const inputDate = await findByText('请选择月份范围');

  fireEvent.click(inputDate);

  const startMonth = await within(
    document.querySelector('.cxd-DateRangePicker-start')!
  ).findByText('2月');

  fireEvent.click(startMonth);

  const endMonth = await within(
    document.querySelector('.cxd-DateRangePicker-end')!
  ).findByText('8月');

  fireEvent.click(endMonth);

  const confirm = getByText('确认');

  fireEvent.click(confirm);

  const monthRange =
    moment().format('YYYY') +
    '-02 至 ' +
    moment().add(1, 'year').format('YYYY') +
    '-08';

  await findByText(monthRange);
});
