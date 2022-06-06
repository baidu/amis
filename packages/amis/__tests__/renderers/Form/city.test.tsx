import React = require('react');
import {render, fireEvent, waitFor} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';

test('Renderer:city', async () => {
  const {container, getByText, findByText} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        controls: [
          {
            type: 'city',
            name: 'a',
            label: 'city',
            allowDistrict: true,
            allowCity: true
          }
        ],
        title: 'The form',
        actions: []
      },
      {},
      makeEnv({})
    )
  );

  await waitFor(() => {
    getByText('请选择');
  });

  fireEvent.click(getByText('请选择'));
  fireEvent.click(getByText('北京市'));
  fireEvent.click(getByText('请选择'));
  fireEvent.click(getByText('北京市市辖区'));
  fireEvent.click(getByText('请选择'));
  fireEvent.click(getByText('东城区'));

  await wait(500);
  expect(container).toMatchSnapshot();
});
