import React = require('react');
import PageRenderer from '../../../../amis-core/src/renderers/Form';
import * as renderer from 'react-test-renderer';
import {render, fireEvent, waitFor, getByText} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv} from '../../helper';
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
