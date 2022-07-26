import React = require('react');
import {render, fireEvent, screen} from '@testing-library/react';
import '../../../src';

import {render as amisRender} from '../../../src';
import {createMockMediaMatcher, makeEnv} from '../../helper';

let originalMatchMedia: any;

beforeAll(() => {
  originalMatchMedia = window.matchMedia;
  window.matchMedia = createMockMediaMatcher(true);
});

afterAll(() => {
  window.matchMedia = originalMatchMedia;
});

test('Renderer:mobile nested select', async () => {
  const {container, findByText, getByText} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/mock2/form/saveForm',
        body: [
          {
            type: 'nested-select',
            name: 'nestedSelect',
            label: '级联选择器',
            options: [
              {
                label: 'A',
                value: 'a'
              },
              {
                label: 'B',
                value: 'b',
                children: [
                  {
                    label: 'B-1',
                    value: 'b-1'
                  },
                  {
                    label: 'B-2',
                    value: 'b-2'
                  },
                  {
                    label: 'B-3',
                    value: 'b-3'
                  }
                ]
              },
              {
                label: 'C',
                value: 'c'
              }
            ]
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  // jsdom 支持不好，先禁用
  // const select = await findByText('请选择');
  // fireEvent.click(select);

  // const bOption = await findByText('B');
  // fireEvent.click(bOption);

  // const b1Option = await findByText('B-1');
  // fireEvent.click(b1Option);

  // const confirmButton = document.querySelector(
  //   '.cxd-Cascader-btnConfirm'
  // ) as HTMLButtonElement;

  // fireEvent.click(confirmButton);

  // const value = document.querySelector(
  //   '.cxd-Select-valueLabel'
  // ) as HTMLSpanElement;

  // expect(value).toMatchSnapshot();
});
