import React = require('react');
import {render} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
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

test('Renderer:Pagination', () => {
  const schema = {
    type: 'service',
    data: {
      rows
    },
    body: [
      {
        type: 'pagination',
        layout: 'total,perPage,pager,go',
        mode: 'normal',
        activePage: 2,
        lastPage: 99999,
        total: 999,
        perPage: 10,
        maxButtons: 4,
        showPerPage: true,
        perPageAvailable: [10, 20, 50, 100],
        showPageInput: true,
        disabled: false
      }
    ]
  };
  const {container} = render(amisRender(schema, {}, makeEnv({})));
  expect(container).toMatchSnapshot();
});
