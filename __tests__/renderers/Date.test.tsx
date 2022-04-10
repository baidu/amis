import React = require('react');
import {render} from '@testing-library/react';
import '../../src/themes/default';
import {render as amisRender} from '../../src/index';
import {makeEnv} from '../helper';
import moment from 'moment';

test('Renderer:date', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'date',
        name: 'date',
        label: 'date',
        value: '1559836800',
        format: 'YYYY-MM-DD',
        placeholder: '请选择时间',
        minDate: '1559664000',
        maxDate: '1561737600',
        className: 'show'
      },
      {},
      makeEnv({})
    )
  );

  const input = container.querySelector('.cxd-DateField');
  expect(input?.innerHTML).toEqual(
    moment('1559836800', 'X').format('YYYY-MM-DD')
  );

  expect(container).toMatchSnapshot();
});
