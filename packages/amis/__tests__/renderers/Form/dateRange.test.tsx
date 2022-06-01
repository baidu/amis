import React = require('react');
import PageRenderer from '../../../../amis-core/src/renderers/Form';
import * as renderer from 'react-test-renderer';
import {render, fireEvent, cleanup, getByText} from '@testing-library/react';
import '../../../src/themes/default';
import {render as amisRender} from '../../../src/index';
import {makeEnv} from '../../helper';
import moment from 'moment';

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

  const input = container.querySelectorAll('.cxd-DateRangePicker-input');
  expect(input[0].value).toEqual(
    `${moment(1559750400, 'X').format('YYYY-MM-DD')}`
  );
  expect(input[1].value).toEqual(
    `${moment(1561564799, 'X').format('YYYY-MM-DD')}`
  );

  expect(container).toMatchSnapshot();
});
