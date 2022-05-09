import React = require('react');
import {render, waitFor} from '@testing-library/react';
import '../../src/themes/default';
import {render as amisRender} from '../../src/index';
import {makeEnv, wait} from '../helper';
import rows from '../mockData/rows';

test('Renderer:crud', async () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'crud',
          api: '/api/mock2/sample',
          syncLocation: false,
          columns: [
            {
              name: '__id',
              label: 'ID'
            },
            {
              name: 'engine',
              label: 'Rendering engine'
            },
            {
              name: 'browser',
              label: 'Browser'
            },
            {
              name: 'platform',
              label: 'Platform(s)'
            },
            {
              name: 'version',
              label: 'Engine version'
            },
            {
              name: 'grade',
              label: 'CSS grade'
            }
          ]
        }
      },
      {},
      makeEnv({
        fetcher: async (config: any) => {
          return {
            status: 200,
            headers: {},
            data: {
              status: 0,
              msg: '',
              data: {
                count: 1,
                rows
              }
            }
          };
        }
      })
    )
  );

  await wait(300);
  await waitFor(() => {
    expect(getByText('Internet Explorer 4.0')).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).not.toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();
});
