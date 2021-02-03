import React = require('react');
import {render} from 'react-testing-library';
import '../../src/themes/default';
import {render as amisRender} from '../../src/index';
import {makeEnv} from '../helper';

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

  const input = container.querySelector('.a-DateField');
  expect(input?.innerHTML).toEqual('2019-06-07');

  expect(container).toMatchSnapshot();
});
