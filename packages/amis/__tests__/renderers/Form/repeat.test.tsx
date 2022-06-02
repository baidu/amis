import React = require('react');
import {render, fireEvent} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv} from '../../helper';

test('Renderer:repeat', async () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        controls: [
          {
            type: 'repeat',
            name: 'a',
            label: 'repeat',
            options:
              'secondly,minutely,hourly,daily,weekdays,weekly,monthly,yearly'
          }
        ],
        title: 'The form',
        actions: []
      },
      {},
      makeEnv({})
    )
  );

  fireEvent.click(getByText('不重复'));
  fireEvent.click(getByText('秒'));
  fireEvent.click(getByText('秒'));
  fireEvent.click(getByText('时'));
  fireEvent.click(getByText('时'));
  fireEvent.click(getByText('分'));
  fireEvent.click(getByText('分'));
  fireEvent.click(getByText('天'));
  fireEvent.click(getByText('天'));
  fireEvent.click(getByText('周中'));
  fireEvent.click(getByText('周中'));
  fireEvent.click(getByText('周'));
  fireEvent.click(getByText('周'));
  fireEvent.click(getByText('月'));
  fireEvent.click(getByText('月'));
  fireEvent.click(getByText('年'));
  fireEvent.click(getByText('年'));

  expect(container).toMatchSnapshot();
});
