import React = require('react');
import PageRenderer from '../../../../amis-core/src/renderers/Form';
import * as renderer from 'react-test-renderer';
import {
  render,
  screen,
  fireEvent,
  cleanup,
  getByText
} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';
import moment from 'moment';

test('Renderer:datetime', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        controls: [
          {
            type: 'datetime',
            name: 'a',
            label: 'date',
            value: '1559826660',
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

  expect(input.value).toEqual(
    moment(1559826660, 'X').format('YYYY-MM-DD HH:mm:ss')
  );

  expect(container).toMatchSnapshot();
});

test('Renderer:datetime displayFormat valueFormat', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        controls: [
          {
            type: 'datetime',
            name: 'b',
            label: 'datetime',
            value: '1559826660',
            displayFormat: 'YYYY/MM/DD HH:mm:ss',
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

  expect(input.value).toEqual(
    moment(1559826660, 'X').format('YYYY/MM/DD HH:mm:ss')
  );
});
