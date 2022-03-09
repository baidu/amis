import React = require('react');
import {render, fireEvent, cleanup, screen} from '@testing-library/react';
import '../../../src/themes/default';
import {render as amisRender} from '../../../src/index';
import {makeEnv, wait} from '../../helper';

test('Renderer:inputArray', async () => {
  const {container, findByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          debug: true,
          api: '/api/mock/saveForm?waitSeconds=1',
          mode: 'horizontal',
          body: [
            {
              name: 'array',
              label: '颜色集合',
              type: 'input-array',
              inline: true,
              items: {
                type: 'input-text',
                clearable: false
              }
            }
          ],
          submitText: null,
          actions: []
        }
      },
      {},
      makeEnv({})
    )
  );

  const addButton = await findByText('新增');

  fireEvent.click(addButton);

  await wait(500);

  const input = container.querySelector('.cxd-TextControl-input input')!;

  fireEvent.change(input, {target: {value: 'amis'}});

  await wait(500);

  const formDebug = JSON.parse(document.querySelector('pre code')!.innerHTML);

  expect(formDebug).toEqual({
    array: ['amis']
  });

  expect(container).toMatchSnapshot();
});
