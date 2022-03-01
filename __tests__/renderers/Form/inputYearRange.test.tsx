import React = require('react');
import PageRenderer from '../../../src/renderers/Form';
import * as renderer from 'react-test-renderer';
import {render, fireEvent, screen, within} from '@testing-library/react';
import '../../../src/themes/default';
import {render as amisRender} from '../../../src/index';
import {makeEnv} from '../../helper';
import moment from 'moment';

test('Renderer:inputYearRange click', async () => {
  const {container, findByText, getByText} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        body: [
          {
            type: 'input-year-range',
            name: 'year',
            label: '年'
          }
        ],
        title: 'The form',
        actions: []
      },
      {},
      makeEnv({})
    )
  );

  const inputDate = await findByText('请选择年份范围');

  fireEvent.click(inputDate);

  const thisYearText = moment().format('YYYY');
  const nextYearText = moment().add(1, 'year').format('YYYY');

  const thisYear = await within(
    document.querySelector('.cxd-DateRangePicker-start')!
  ).findByText(thisYearText);

  fireEvent.click(thisYear);

  const nextYear = await within(
    document.querySelector('.cxd-DateRangePicker-end')!
  ).findByText(nextYearText);

  fireEvent.click(nextYear);

  const confirm = getByText('确认');

  fireEvent.click(confirm);

  const value = document.querySelector(
    '.cxd-DateRangePicker-value'
  ) as HTMLSpanElement;

  expect(value.innerHTML).toEqual(thisYearText + ' 至 ' + nextYearText);
});
