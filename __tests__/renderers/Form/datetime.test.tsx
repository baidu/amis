import React = require('react');
import PageRenderer from '../../../src/renderers/Form';
import * as renderer from 'react-test-renderer';
import {render, fireEvent, cleanup, getByText} from 'react-testing-library';
import '../../../src/themes/default';
import {render as amisRender} from '../../../src/index';
import {makeEnv} from '../../helper';
import moment from 'moment';

test('Renderer:date', async () => {
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

  const input = container.querySelector('.a-DatePicker-value');
  expect(input?.innerHTML).toEqual(
    moment(1559826660, 'X').format('YYYY-MM-DD HH:mm:ss')
  );

  expect(container).toMatchSnapshot();
});
