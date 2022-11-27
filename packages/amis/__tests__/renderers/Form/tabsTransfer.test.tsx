/**
 * 组件名称：TabsTransfer 组合穿梭器
 * 
 * 单测内容：
 1. 点击切换
 */

import {fireEvent, getByText, render} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';

test('Renderer:tabsTransfer', async () => {
  const onSubmit = jest.fn();
  const {container, getByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          submitText: 'submitText',
          body: [
            {
              label: '组合穿梭器',
              type: 'tabs-transfer',
              name: 'a',
              sortable: true,
              selectMode: 'tree',
              options: [
                {
                  label: '成员',
                  selectMode: 'tree',
                  searchable: true,
                  children: [
                    {
                      label: '法师',
                      children: [
                        {
                          label: '诸葛亮',
                          value: 'zhugeliang'
                        }
                      ]
                    },
                    {
                      label: '战士',
                      children: [
                        {
                          label: '曹操',
                          value: 'caocao'
                        },
                        {
                          label: '钟无艳',
                          value: 'zhongwuyan'
                        }
                      ]
                    },
                    {
                      label: '打野',
                      children: [
                        {
                          label: '李白',
                          value: 'libai'
                        },
                        {
                          label: '韩信',
                          value: 'hanxin'
                        },
                        {
                          label: '云中君',
                          value: 'yunzhongjun'
                        }
                      ]
                    }
                  ]
                },
                {
                  label: '用户',
                  selectMode: 'chained',
                  children: [
                    {
                      label: '法师2',
                      children: [
                        {
                          label: '诸葛亮2',
                          value: 'zhugeliang2'
                        }
                      ]
                    },
                    {
                      label: '战士2',
                      children: [
                        {
                          label: '曹操2',
                          value: 'caocao2'
                        },
                        {
                          label: '钟无艳2',
                          value: 'zhongwuyan2'
                        }
                      ]
                    },
                    {
                      label: '打野2',
                      children: [
                        {
                          label: '李白2',
                          value: 'libai2'
                        },
                        {
                          label: '韩信2',
                          value: 'hanxin2'
                        },
                        {
                          label: '云中君2',
                          value: 'yunzhongjun2'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      },
      {onSubmit},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();

  fireEvent.click(getByText('诸葛亮'));
  fireEvent.click(getByText('用户'));
  // 这里必须长，不然切不过来
  await wait(2000);
  fireEvent.click(getByText('打野2'));
  fireEvent.click(getByText('云中君2'));
  await wait(400);
  fireEvent.click(getByText('submitText'));
  await wait(100);
  expect(onSubmit).toBeCalled();
  expect(onSubmit.mock.calls[0][0]).toEqual({
    a: 'zhugeliang,yunzhongjun2'
  });
});

test('Renderer:tabsTransfer with deferApi', async () => {
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        options: [
          {label: 'Option A', value: 'a'},
          {label: 'Option B', value: 'b'},
          {label: 'Option C', value: 'c'},
          {label: 'Option D', value: 'd'},
          {label: 'Option E', value: 'e'}
        ]
      },
      status: 0
    })
  );

  const notify = jest.fn();
  const {container, getByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          submitText: 'submitText',
          body: [
            {
              label: '组合穿梭器',
              type: 'tabs-transfer',
              name: 'a',
              selectMode: 'tree',
              options: [
                {
                  label: '成员',
                  selectMode: 'associated',
                  searchable: true,
                  leftMode: 'tree',
                  leftOptions: [
                    {
                      defer: true,
                      label: 'DEFER',
                      deferApi: '/api/xxx'
                    },
                    {
                      label: '法师',
                      value: 'user'
                    }
                  ],
                  children: [
                    {
                      ref: 'user',
                      children: [
                        {
                          label: '诸葛亮',
                          value: 'zhugeliang2'
                        },
                        {
                          label: '上官婉儿',
                          value: 'shangguan'
                        }
                      ]
                    },
                    {
                      ref: 'a',
                      children: [
                        {
                          label: 'Option A Child 1',
                          value: 'a-1'
                        },
                        {
                          label: 'Option A Child 2',
                          value: 'a-2'
                        }
                      ]
                    }
                  ]
                },
                {
                  label: '用户',
                  selectMode: 'chained',
                  children: [
                    {
                      label: '法师2',
                      children: [
                        {
                          label: '诸葛亮2',
                          value: 'zhugeliang2'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      },
      {},
      makeEnv({
        fetcher,
        notify,
        session: 'test-case-3'
      })
    )
  );

  expect(getByText('DEFER')).toBeInTheDocument();
  fireEvent.click(getByText('DEFER'));

  await wait(1000);

  expect(fetcher).toHaveBeenCalled();
  expect(getByText('Option A')).toBeInTheDocument();

  fireEvent.click(getByText('Option A'));

  await wait(100);
  expect(getByText('Option A Child 1')).toBeInTheDocument();

  fireEvent.click(getByText('Option B'));
  await wait(100);
  expect(notify).toBeCalledTimes(1);

  expect(container).toMatchSnapshot();
});
