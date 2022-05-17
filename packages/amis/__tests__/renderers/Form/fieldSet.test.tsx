import React = require('react');
import {render, fireEvent} from '@testing-library/react';
import '../../../src/themes/default';
import {render as amisRender} from '../../../src/index';
import {makeEnv} from '../../helper';

test('Renderer:fieldSet', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        controls: [
          {
            type: 'fieldSet',
            name: 'a',
            label: 'fieldSet',
            mode: 'horizontal',
            collapsable: true,
            collapsed: false,
            className: 'no-border',
            headingClassName: 'bg-dark',
            bodyClassName: 'bg-white',
            horizontal: {
              leftFixed: 1,
              left: 4,
              right: 7
            },
            controls: [
              {
                name: 'text',
                type: 'text'
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
