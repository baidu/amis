import React = require('react');
import {render, fireEvent} from '@testing-library/react';
import '../../../src/themes/default';
import {render as amisRender} from '../../../src/index';
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

  // 第一个用 findByText 来等待 suspense 组件加载出来，后面的一般来说就不需要await的，除非是耗时操作
  fireEvent.click(await findByText('请选择'));
  fireEvent.click(getByText('北京市'));
  fireEvent.click(getByText('请选择'));
  fireEvent.click(getByText('北京市市辖区'));
  fireEvent.click(getByText('请选择'));
  fireEvent.click(getByText('东城区'));

  await wait(500);
  expect(container).toMatchSnapshot();
});
