import React = require('react');
import {render, waitForElementToBeRemoved} from '@testing-library/react';
import '../../../src/themes/default';
import {render as amisRender} from '../../../src/index';
import {makeEnv, wait} from '../../helper';

test('Renderer:chained-select', async () => {
  const {container, findByText} = render(
    amisRender(
      {
        type: 'form',
        debug: true,
        api: '/api/mock2/form/saveForm',
        body: [
          {
            name: 'select3',
            type: 'chained-select',
            label: '级联下拉',
            source:
              '/api/mock2/options/chainedOptions?waitSeconds=1&parentId=$parentId&level=$level&maxLevel=4',
            value: 'a,b'
          }
        ]
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
              data: [
                {label: 'A 0', value: 'a'},
                {label: 'B 0', value: 'b'},
                {label: 'C 0', value: 'c'},
                {label: 'D 0', value: 'd'}
              ]
            }
          };
        }
      })
    )
  );

  await wait(500);
  expect(container).toMatchSnapshot();
});
