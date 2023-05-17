/**
 * 组件名称：Picker 列表选择器
 * 单测内容：
 * 1. 在 table 中使用
 * 2. 触发方式 & 是否显示icon & 标题 & 位置 & 触发条件
 * 3. offset 偏移量
 * 4. 展示模式和尺寸
 */

import React from 'react';
import {
  render,
  fireEvent,
  cleanup,
  waitFor,
  getByText
} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {wait, makeEnv} from '../helper';
import {clearStoresCache} from '../../src';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

test('Renderer:Picker base', async () => {
  const {container, rerender, getByText, getByPlaceholderText, baseElement} =
    render(
      amisRender({
        type: 'picker',
        name: 'picker',
        label: 'picker',
        placeholder: 'picker-placeholder',
        options: [
          {
            label: 'A',
            value: 'a'
          },
          {
            label: 'B',
            value: 'b'
          },
          {
            label: 'C',
            value: 'c'
          }
        ]
      })
    );

  fireEvent.click(getByText('picker-placeholder')!);

  expect(
    baseElement.querySelector('.cxd-Modal .cxd-Crud')!
  ).toBeInTheDocument();

  const items = baseElement.querySelectorAll('.cxd-Crud .cxd-ListItem');
  expect(items!.length).toBe(3);

  fireEvent.click(items[1]);
  expect(
    baseElement.querySelector('.cxd-Crud .cxd-ListItem.is-checked')
  ).toHaveTextContent('B');
  expect(baseElement).toMatchSnapshot();

  fireEvent.click(getByText('确认'));

  await wait(500);

  expect(container.querySelector('.cxd-Picker-value')).toHaveTextContent('B');
  expect(container).toMatchSnapshot();
});

test('Renderer:Picker with pickerSchema & valueField & labelField & multiple & value & size', async () => {
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: [
          {
            id: 'a',
            engine: 'engine a',
            browser: 'browser a'
          },
          {
            id: 'b',
            engine: 'engine b',
            browser: 'browser b'
          },
          {
            id: 'c',
            engine: 'engine c',
            browser: 'browser c'
          },
          {
            id: 'd',
            engine: 'engine d',
            browser: 'browser d'
          }
        ]
      }
    })
  );
  const {container, rerender, getByText, getByPlaceholderText, baseElement} =
    render(
      amisRender(
        {
          type: 'picker',
          name: 'type4',
          joinValues: true,
          valueField: 'id',
          labelField: 'engine',
          label: '多选',
          source: '/api/mock2/sample',
          size: 'lg',
          value: 'a,b',
          multiple: true,
          pickerSchema: {
            columns: [
              {
                name: 'engine',
                label: 'Rendering engine'
              },
              {
                name: 'browser',
                label: 'Browser'
              }
            ]
          }
        },
        {},
        makeEnv({
          session: 'picker-fetcher-1',
          fetcher
        })
      )
    );

  await wait(500);
  expect(fetcher).toHaveBeenCalled;
  expect(fetcher.mock.calls[0][0].query).toEqual({
    op: 'loadOptions',
    id: 'a,b',
    value: 'a,b'
  });

  const values = container.querySelectorAll('.cxd-Picker .cxd-Picker-value');
  expect(values.length).toBe(2);

  expect(values[0]).toHaveTextContent('engine a');

  fireEvent.click(container.querySelector('.cxd-Picker-valueWrap')!);

  await wait(1000);

  expect(
    baseElement.querySelector('.cxd-Modal .cxd-Crud')!
  ).toBeInTheDocument();
  expect(baseElement.querySelector('.cxd-Modal')).toHaveClass('cxd-Modal--lg');

  expect(fetcher).toBeCalledTimes(2);
  expect(fetcher.mock.calls[1][0].query).toEqual({
    page: 1,
    perPage: 10
  });
});

test('Renderer:Picker with embed', async () => {
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: [
          {
            id: 'a',
            engine: 'engine a',
            browser: 'browser a'
          },
          {
            id: 'b',
            engine: 'engine b',
            browser: 'browser b'
          },
          {
            id: 'c',
            engine: 'engine c',
            browser: 'browser c'
          },
          {
            id: 'd',
            engine: 'engine d',
            browser: 'browser d'
          }
        ]
      }
    })
  );
  const {container, rerender, getByText, getByPlaceholderText, baseElement} =
    render(
      amisRender(
        {
          type: 'picker',
          name: 'type4',
          joinValues: true,
          valueField: 'id',
          labelField: 'engine',
          label: '多选',
          source: '/api/mock2/sample',
          size: 'lg',
          value: 'a,b',
          multiple: true,
          embed: true,
          pickerSchema: {
            columns: [
              {
                name: 'engine',
                label: 'Rendering engine'
              },
              {
                name: 'browser',
                label: 'Browser'
              }
            ]
          }
        },
        {},
        makeEnv({
          session: 'picker-fetcher-1',
          fetcher
        })
      )
    );

  await wait(500);
  expect(
    container.querySelector('.cxd-Picker .cxd-Crud .cxd-Table')
  ).toBeInTheDocument();
});

test('Renderer:Picker with drawer modalMode', async () => {
  const {container, rerender, getByText, getByPlaceholderText, baseElement} =
    render(
      amisRender({
        type: 'picker',
        name: 'picker',
        label: 'picker',
        modalMode: 'drawer',
        placeholder: 'picker-placeholder',
        options: [
          {
            label: 'A',
            value: 'a'
          },
          {
            label: 'B',
            value: 'b'
          },
          {
            label: 'C',
            value: 'c'
          }
        ]
      })
    );

  fireEvent.click(getByText('picker-placeholder')!);
  await wait(500);

  expect(
    baseElement.querySelector('.cxd-Drawer .cxd-Crud')!
  ).toBeInTheDocument();
});
