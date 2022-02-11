import React = require('react');
import {render} from '@testing-library/react';
import '../../src/themes/default';
import {render as amisRender} from '../../src/index';
import {makeEnv} from '../helper';
import rows from '../mockData/rows';

test('Renderer:crud', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'crud',
          api: '/api/mock2/sample',
          syncLocation: false,
          columns: [
            {
              name: 'id',
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

  // TODO: 没想好还有啥别的办法，这里可能会导致太慢的机器报错
  await new Promise(r => setTimeout(r, 2500));

  expect(container).toMatchSnapshot();
});
