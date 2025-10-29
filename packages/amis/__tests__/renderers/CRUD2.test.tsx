/*
 * @Author: ZhangBaiSen
 * @since: 2023-06-02 15:46:01
 * @LastEditors: ZhangBaiSen
 * @LastEditTime: 2023-06-02 15:46:54
 * @desc:290057637@qq.com
 * @文件相对于项目的路径: /fork-amis/packages/amis/__tests__/renderers/CRUD2.test.tsx
 */
import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  screen
} from '@testing-library/react';
import '../../src';
import {clearStoresCache, render as amisRender} from '../../src';
import {makeEnv as makeEnvRaw, wait} from '../helper';
import rows from '../mockData/rows';
import type {RenderOptions} from '../../src';

afterEach(() => {
  cleanup();
  clearStoresCache();
  jest.useRealTimers();
});

/** 避免updateLocation里的console.error */
const makeEnv = (env?: Partial<RenderOptions>) =>
  makeEnvRaw({updateLocation: () => {}, ...env});

describe('inner events', () => {
  test('should call the callback function if provided while double clicking a row of the crud2', async () => {
    const mockFn = jest.fn();
    render(
      amisRender(
        {
          type: 'crud2',
          mode: 'table',
          data: {
            items: rows
          },
          columns: [
            {
              name: 'engine',
              label: 'Rendering engine'
            }
          ],
          onEvent: {
            rowDbClick: {
              actions: [
                {
                  actionType: 'custom',
                  args: {
                    script: mockFn
                  }
                }
              ]
            }
          }
        },
        {}
      )
    );

    await waitFor(() => {
      const ele = screen.getAllByText('Trident');
      fireEvent.dblClick(ele[0]);
      expect(mockFn).toBeCalledTimes(1);
    });
  });
});
