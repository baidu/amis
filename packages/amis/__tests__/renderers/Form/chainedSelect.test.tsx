import React = require('react');
import {
  render,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';

test('Renderer:chained-select', async () => {
  const {container, findByText, getByText, getByTestId} = render(
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
              '/api/mock2/options/chainedOptions?parentId=$parentId&level=$level&maxLevel=4',
            value: 'a,b'
          }
        ]
      },
      {},
      makeEnv({
        async fetcher(config: any): Promise<any> {
          const level = parseInt(config.query.level, 10) || 0;
          const maxLevel = parseInt(config.query.maxLevel, 10) || 0;
          if (level >= maxLevel) {
            return {
              status: 200,
              headers: {},
              data: {
                status: 0,
                data: null
              }
            };
          } else {
            return {
              status: 200,
              headers: {},
              data: {
                status: 0,
                msg: '',
                data: [
                  {
                    label: `A ${level}`,
                    value: 'a'
                  },

                  {
                    label: `B ${level}`,
                    value: 'b'
                  },

                  {
                    label: `C ${level}`,
                    value: 'c'
                  },

                  {
                    label: `D ${level}`,
                    value: 'd'
                  }
                ]
              }
            };
          }
        }
      })
    )
  );

  await waitFor(() => {
    expect(getByText('B 1')).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).not.toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();
});
