import React = require('react');
import {render, fireEvent} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv} from '../../helper';

test('Renderer:fieldSet', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        controls: [
          {
            type: 'input-group',
            name: 'a',
            label: 'input-group',
            mode: 'horizontal',
            className: 'no-border',
            horizontal: {
              leftFixed: 1,
              left: 4,
              right: 7
            },
            controls: [
              {
                name: 'text',
                type: 'text',
                validation: 'isUrl',
                addOn: {
                  label: '按钮',
                  type: 'submit'
                }
              },
              {
                name: 'text1',
                type: 'text',
                hidden: true
              }
            ]
          }
        ],
        title: 'The form',
        actions: []
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});
