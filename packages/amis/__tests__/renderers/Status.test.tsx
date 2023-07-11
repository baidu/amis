import React = require('react');
import {render} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv} from '../helper';

test('Renderer:status', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: [
          {
            type: 'status',
            value: 0
          },
          {
            type: 'status',
            value: 1
          },
          {
            type: 'status',
            value: 'success'
          },
          {
            type: 'status',
            value: 'pending'
          },
          {
            type: 'status',
            value: 'fail'
          },
          {
            type: 'status',
            value: 'fail'
          },
          {
            type: 'status',
            value: 'queue'
          },
          {
            type: 'status',
            value: 'schedule'
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});

test('Renderer:status source', async () => {
  const setup = (value?: any) =>
    render(
      amisRender(
        {
          type: 'status',
          source: {
            11: {
              label: 11,
              icon: 'fa fa-check',
              color: '#f0f'
            },
            success: {
              label: 'custom success',
              icon: 'fa fa-success',
              color: '#ff0'
            }
          },
          ...(value !== undefined ? {value} : {})
        },
        {},
        makeEnv({})
      )
    ).container;

  const value1 = setup(11).querySelector('.cxd-StatusField')!;
  expect((value1 as HTMLElement).style.color).toBe('rgb(255, 0, 255)');
  expect(
    (value1.querySelector('.cxd-StatusField-label') as HTMLElement).innerHTML
  ).toBe('11');
  expect((value1.querySelector('i') as HTMLElement).classList.value).toMatch(
    /fa fa-check cxd-Status-icon/
  );

  const valueSuccess = setup('success').querySelector('.cxd-StatusField')!;
  expect((valueSuccess as HTMLElement).style.color).toBe('rgb(255, 255, 0)');
  expect(
    (valueSuccess.querySelector('.cxd-StatusField-label') as HTMLElement)
      .innerHTML
  ).toBe('custom success');
  expect(
    (valueSuccess.querySelector('i') as HTMLElement).classList.value
  ).toMatch(/fa fa-success cxd-Status-icon/);
});
