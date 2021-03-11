import React = require('react');
import PageRenderer from '../../../src/renderers/Form';
import * as renderer from 'react-test-renderer';
import {render, fireEvent, cleanup, getByText} from 'react-testing-library';
import '../../../src/themes/default';
import {render as amisRender} from '../../../src/index';
import {makeEnv} from '../../helper';

test('Renderer:dateRange', async () => {
  const {container}: any = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        controls: [
          {
            type: 'date-range',
            name: 'a',
            label: 'date-range',
            value: '1559750400,1561564799',
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

  const input = container.querySelector('.a-DateRangePicker-value');
  expect(input?.innerHTML).toEqual('2019-06-06 至 2019-06-26');

  expect(container).toMatchSnapshot();
});
