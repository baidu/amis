import React = require('react');
import PageRenderer from '../../../src/renderers/Form';
import * as renderer from 'react-test-renderer';
import {render, fireEvent, cleanup, getByText} from '@testing-library/react';
import '../../../src/themes/default';
import {render as amisRender} from '../../../src/index';
import {makeEnv} from '../../helper';
import moment from 'moment';

test('Renderer:inputMonth click', async () => {
  const {container, findByText} = render(
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

  const inputDate = await findByText('请选择月份');

  fireEvent.click(inputDate);

  // 点击前一年
  (
    document.querySelector('.cxd-DatePicker-popover .rdtPrev') as HTMLElement
  ).click();

  const firstMonth = await findByText('1月');

  fireEvent.click(firstMonth);

  const lastYearMonth = moment().subtract(1, 'year').format('YYYY') + '-01';

  await findByText(lastYearMonth);

  const value = document.querySelector(
    '.cxd-DatePicker-value'
  ) as HTMLSpanElement;

  expect(value.innerHTML).toEqual(lastYearMonth);
});
