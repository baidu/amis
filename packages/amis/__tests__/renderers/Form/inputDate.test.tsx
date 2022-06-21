import React = require('react');
import PageRenderer from '../../../../amis-core/src/renderers/Form';
import * as renderer from 'react-test-renderer';
import {render, fireEvent, cleanup, getByText} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv} from '../../helper';
import moment from 'moment';

test('Renderer:inputDate', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        body: [
          {
            type: 'input-date',
            name: 'a',
            label: 'date',
            value: '1559836800',
            minDate: '1559664000',
            maxDate: '1561737600'
          }
        ],
        title: 'The form',
        actions: []
      },
      {},
      makeEnv({})
    )
  );

  const input = container.querySelector(
    '.cxd-DatePicker input'
  )! as HTMLInputElement;
  expect(input.value).toEqual(moment(1559836800, 'X').format('YYYY-MM-DD'));

  expect(container).toMatchSnapshot();
});

test('Renderer:inputDate click', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          api: '/api/mock2/form/saveForm',
          body: [
            {
              type: 'static-date',
              name: 'date',
              label: '当前值'
            },
            {
              type: 'input-date',
              name: 'date',
              label: '日期'
            }
          ]
        }
      },
      {},
      makeEnv({})
    )
  );

  const inputDate = container.querySelector('.cxd-DatePicker') as HTMLElement;

  fireEvent.click(inputDate);

  // 点击前一年
  fireEvent.click(
    container.querySelector('.cxd-DatePicker-popover .rdtPrev') as HTMLElement
  );

  // 点击下一个月
  fireEvent.click(
    container.querySelector('.cxd-DatePicker-popover .rdtNext') as HTMLElement
  );

  const date = container.querySelector(
    '.cxd-DatePicker-popover tr td[data-value="1"]'
  ) as HTMLElement;

  fireEvent.click(date);

  const tpl = container.querySelector('.cxd-DateField') as HTMLElement;

  expect(tpl.innerHTML).toEqual(
    moment().subtract(1, 'year').add(1, 'month').format('YYYY-MM') + '-01'
  );
});

test('Renderer:inputDate embed', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          api: '/api/mock2/form/saveForm',
          body: [
            {
              type: 'static-date',
              name: 'date',
              label: '当前值'
            },
            {
              type: 'input-date',
              name: 'date',
              label: '日期',
              embed: true
            }
          ]
        }
      },
      {},
      makeEnv({})
    )
  );

  const date = container.querySelector(
    '.cxd-DateCalendar tr td[data-value="1"]'
  ) as HTMLElement;

  fireEvent.click(date);

  const tpl = container.querySelector('.cxd-DateField') as HTMLElement;

  expect(tpl.innerHTML).toEqual(moment().format('YYYY-MM') + '-01');
});
