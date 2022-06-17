import React = require('react');
import {render, cleanup, screen, fireEvent} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';
import {clearStoresCache} from '../../../src';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

test('Renderer:checkboxes', async () => {
  const {getByText, container} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        controls: [
          {
            name: 'checkboxes',
            type: 'checkboxes',
            label: 'Checkboxes',
            columnsCount: 1,
            options: [
              {
                label: 'Option A',
                value: 'a'
              },
              {
                label: 'Option B',
                value: 'b'
              },
              {
                label: 'Option C',
                value: 'c'
              },
              {
                label: 'Option D',
                value: 'd'
              }
            ]
          },
          {
            type: 'static',
            name: 'checkboxes',
            label: '当前值'
          }
        ],
        submitText: null,
        actions: []
      },
      {},
      makeEnv()
    )
  );
  expect(container).toMatchSnapshot();
  await wait(500);
  fireEvent.click(getByText(/Option A/));
  await wait(500);
  fireEvent.click(getByText(/Option B/));
  await wait(500);
  expect(container).toMatchSnapshot();
});

test('Renderer:checkboxes group', async () => {
  const {getByText, container} = render(
    amisRender(
      {
        type: 'form',
        mode: 'horizontal',
        body: [
          {
            type: 'checkboxes',
            name: 'checkboxes',
            label: '城市选择',
            inline: false,
            options: [
              {
                label: 'A类型',
                children: [
                  {
                    value: '选项 A-1',
                    label: 'a-1'
                  },
                  {
                    value: '选项 A-2',
                    label: 'a-2'
                  }
                ]
              },
              {
                label: 'B类型',
                children: [
                  {
                    value: '选项 B-1',
                    label: 'b-1'
                  },
                  {
                    value: '选项 B-2',
                    label: 'b-2'
                  },
                  {
                    value: '选项 B-3',
                    label: 'b-3'
                  },
                  {
                    value: '选项 B-4',
                    label: 'b-4'
                  }
                ]
              }
            ]
          }
        ]
      },
      {},
      makeEnv()
    )
  );
  expect(container).toMatchSnapshot();
});

test('Renderer:checkboxes columnsCount', async () => {
  const {getByText, container} = render(
    amisRender(
      {
        type: 'form',
        mode: 'horizontal',
        body: [
          {
            name: 'checkboxes2',
            type: 'checkboxes',
            label: '显示两列的复选框',
            columnsCount: 2,
            inline: false,
            options: [
              {
                label: 'OptionA',
                value: 'a'
              },
              {
                label: 'OptionB',
                value: 'b'
              },
              {
                label: 'OptionC',
                value: 'c'
              },
              {
                label: 'OptionD',
                value: 'd'
              }
            ]
          }
        ]
      },
      {},
      makeEnv()
    )
  );
  expect(container).toMatchSnapshot();
});

test('Renderer:checkboxes checkall', async () => {
  const {getByText, container} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/mock2/form/saveForm',
        body: [
          {
            name: 'checkboxes',
            type: 'checkboxes',
            label: '复选框',
            checkAll: true,
            options: [
              {
                label: 'OptionA',
                value: 'a'
              },
              {
                label: 'OptionB',
                value: 'b'
              },
              {
                label: 'OptionC',
                value: 'c'
              },
              {
                label: 'OptionD',
                value: 'd'
              }
            ]
          }
        ]
      },
      {},
      makeEnv()
    )
  );
  expect(container).toMatchSnapshot();
});

test('Renderer:checkboxes menuTpl', async () => {
  const {getByText, container} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/mock2/form/saveForm',
        body: [
          {
            name: 'checkboxes',
            type: 'checkboxes',
            label: '复选框',
            menuTpl: "<span class='label label-${klass}'>${label}</span>",
            options: [
              {
                label: 'OptionA',
                value: 'a',
                klass: 'success'
              },
              {
                label: 'OptionB',
                value: 'b',
                klass: 'danger'
              },
              {
                label: 'OptionC',
                value: 'c',
                klass: 'warning'
              },
              {
                label: 'OptionD',
                value: 'd',
                klass: 'info'
              }
            ]
          }
        ]
      },
      {},
      makeEnv()
    )
  );

  const optionA = screen.getByText('OptionA');
  expect(optionA).toBeVisible();
  expect(optionA).toHaveClass('label label-success');

  const optionC = screen.getByText('OptionA');
  expect(optionC).toBeVisible();
  expect(optionC).toHaveClass('label label-success');

  expect(container).toMatchSnapshot();
});
