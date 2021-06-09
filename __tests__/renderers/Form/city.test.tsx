import React = require('react');
import {render, fireEvent} from '@testing-library/react';
import '../../../src/themes/default';
import {render as amisRender} from '../../../src/index';
import {makeEnv, wait} from '../../helper';

test('Renderer:city', async () => {
  const {container, getByText} = render(
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

  await wait(200);

  fireEvent.click(getByText('请选择'));
  fireEvent.click(getByText('北京市'));
  fireEvent.click(getByText('请选择'));
  fireEvent.click(getByText('北京市市辖区'));
  fireEvent.click(getByText('请选择'));
  fireEvent.click(getByText('东城区'));

  expect(container).toMatchSnapshot();
});
