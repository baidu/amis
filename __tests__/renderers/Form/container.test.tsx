import React = require('react');
import {render, fireEvent} from '@testing-library/react';
import '../../../src/themes/default';
import {render as amisRender} from '../../../src/index';
import {makeEnv} from '../../helper';

test('Renderer:container', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        controls: [
          {
            type: 'container',
            name: 'a',
            label: 'container',
            mode: 'horizontal',
            className: 'no-border',
            bodyClassName: 'bg-white',
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
