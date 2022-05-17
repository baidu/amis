import React = require('react');
import {render} from '@testing-library/react';
import '../../src/themes/default';
import {render as amisRender} from '../../src/index';
import {makeEnv} from '../helper';
import rows from '../mockData/rows';

test('Renderer:Pagination', () => {
  const {container} = render(
    amisRender(
      {
        type: 'service',
        data: {
          rows
        },
        body: [
          {
            type: 'pagination-wrapper',
            inputName: 'rows',
            outputName: 'rows',
            perPage: 2,
            body: [
              {
                type: 'table',
                title: '分页表格',
                source: '${rows}',
                columns: [
                  {
                    name: 'engine',
                    label: 'Engine'
                  },
                  {
                    name: 'version',
                    label: 'Version'
                  }
                ]
              }
            ]
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});
