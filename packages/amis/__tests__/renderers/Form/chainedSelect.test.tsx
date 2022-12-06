/**
 * 组件名称：Chained-Select 链式下拉框
 * 单测内容：
 * 1. 基础使用
 */

import {
  render,
  waitFor,
  fireEvent,
  waitForElementToBeRemoved
} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';

test('Renderer:chained-select', async () => {
  const fetcher = jest.fn().mockImplementation((config: any) => {
    return new Promise(resolve => {
      const level = parseInt(config.query.level, 10) || 0;
      const maxLevel = parseInt(config.query.maxLevel, 10) || 0;
      if (level >= maxLevel) {
        resolve({
          status: 200,
          headers: {},
          data: {
            status: 0,
            data: null
          }
        });
      } else {
        resolve({
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
        });
      }
    });
  });
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
            source: '/api/xxx?parentId=$parentId&level=$level&maxLevel=4',
            value: 'a,b'
          }
        ]
      },
      {},
      makeEnv({
        fetcher
      })
    )
  );

  await waitFor(() => {
    expect(fetcher).toBeCalledTimes(3);
    expect(fetcher.mock.calls[2][0].query).toMatchObject({
      parentId: 'b',
      level: 2,
      maxLevel: '4'
    });
    expect(getByText('B 1')).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).not.toBeInTheDocument();
  });

  fireEvent.click(getByText('请选择'));
  expect(getByText('D 2')).toBeInTheDocument();
  fireEvent.click(getByText('D 2'));

  await wait(100);
  expect(fetcher).toBeCalledTimes(4);
  expect(fetcher.mock.calls[3][0].query).toMatchObject({
    parentId: 'd',
    level: 3,
    maxLevel: '4'
  });

  fireEvent.click(getByText('请选择'));
  expect(getByText('C 3')).toBeInTheDocument();
  fireEvent.click(getByText('C 3'));

  await wait(100);
  expect(fetcher).toBeCalledTimes(5);
  fireEvent.click(getByText('请选择'));
  expect(getByText('未找到任何结果')).toBeInTheDocument();

  await waitFor(() => {
    expect(container).toMatchSnapshot();
  });
});
