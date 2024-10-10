import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  screen
} from '@testing-library/react';
import '../../src';
import {clearStoresCache, render as amisRender} from '../../src';
import {makeEnv as makeEnvRaw, replaceReactAriaIds, wait} from '../helper';
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

// 主要用来验证是否可以回显正确，如果外部存在同名变量是否不影响 filter
test('CRUD filter1', async () => {
  const mockFetcher = jest.fn().mockImplementation((api: any) => {
    return Promise.resolve({
      data: {
        status: 0,
        data: {
          items: [{id: 1, a: 'a1', b: 'b1'}]
        }
      }
    });
  });
  const {container} = render(
    amisRender(
      {
        type: 'page',
        data: {b: '2'},
        body: {
          type: 'crud',
          api: '/api/mock2/sample',
          filter: {
            body: [
              {
                type: 'input-text',
                name: 'a'
              },
              {
                type: 'input-text',
                name: 'b'
              }
            ]
          },
          columns: [
            {
              name: 'id',
              label: 'ID'
            },
            {
              name: 'a',
              label: 'A'
            },
            {
              name: 'b',
              label: 'B'
            }
          ]
        }
      },
      {
        location: {
          pathname: '/mock2/sample',
          search: '?a=1',
          query: ''
        } as any
      },
      makeEnv({fetcher: mockFetcher})
    )
  );
  await wait(500);
  const a = container.querySelector('input[name="a"]')!;
  const b = container.querySelector('input[name="b"]')!;
  expect(a).toBeTruthy();
  expect(a.nodeValue).not.toBe('1');

  // 因为数据不在 query 里面，所以不显示是正常的
  expect(b).toBeTruthy();
  expect(b.nodeValue).not.toBe('');
});

// 验证 autoGenerateFilter 模式是否表现一致
test('CRUD filter2', async () => {
  const mockFetcher = jest.fn().mockImplementation((api: any) => {
    return Promise.resolve({
      data: {
        status: 0,
        data: {
          items: [{id: 1, a: 'a1', b: 'b1'}]
        }
      }
    });
  });
  const {container} = render(
    amisRender(
      {
        type: 'page',
        data: {b: '2'},
        body: {
          type: 'crud',
          api: '/api/mock2/sample',
          autoGenerateFilter: true,
          columns: [
            {
              name: 'id',
              label: 'ID'
            },
            {
              name: 'a',
              searchable: true,
              label: 'A'
            },
            {
              name: 'b',
              searchable: true,
              label: 'B'
            }
          ]
        }
      },
      {
        location: {
          pathname: '/mock2/sample',
          search: '?a=1',
          query: ''
        } as any
      },
      makeEnv({fetcher: mockFetcher})
    )
  );
  await wait(500);
  const a = container.querySelector('input[name="a"]')!;
  const b = container.querySelector('input[name="b"]')!;
  expect(a).toBeTruthy();
  expect(a.nodeValue).not.toBe('1');

  // 因为数据不在 query 里面，所以不显示是正常的
  expect(b).toBeTruthy();
  expect(b.nodeValue).not.toBe('');
});

// picker 的话，不应该回显任何数据
test('Picker filter1', async () => {
  const mockFetcher = jest.fn().mockImplementation((api: any) => {
    return Promise.resolve({
      data: {
        status: 0,
        data: {
          items: [{id: 1, a: 'a1', b: 'b1'}]
        }
      }
    });
  });
  let container: HTMLElement;
  const renderResult: any = render(
    amisRender(
      {
        type: 'page',
        data: {b: '2'},
        body: {
          type: 'form',
          body: [
            {
              type: 'picker',
              name: 'xxx',
              source: '/api/mock2/sample',
              pickerSchema: {
                type: 'crud',
                filter: {
                  body: [
                    {
                      type: 'input-text',
                      name: 'a'
                    },
                    {
                      type: 'input-text',
                      name: 'b'
                    }
                  ]
                },
                columns: [
                  {
                    name: 'id',
                    label: 'ID'
                  },
                  {
                    name: 'a',
                    label: 'A'
                  },
                  {
                    name: 'b',
                    label: 'B'
                  }
                ]
              }
            }
          ]
        }
      },
      {
        location: {
          pathname: '/mock2/sample',
          search: '?a=1',
          query: ''
        } as any
      },
      makeEnv({fetcher: mockFetcher, getModalContainer: () => container} as any)
    )
  );
  container = renderResult.container;

  await wait(200);
  const pickerBtn = container.querySelector('span.cxd-Picker-btn')!;
  expect(pickerBtn).toBeTruthy();

  fireEvent.click(pickerBtn);

  await wait(1000);
  const a = container.querySelector('input[name="a"]')!;
  const b = container.querySelector('input[name="b"]')!;

  // picker 里面不应该自动回显任何数据
  expect(a).toBeTruthy();
  expect(a.nodeValue).not.toBe('');

  // picker 里面不应该自动回显任何数据
  expect(b).toBeTruthy();
  expect(b.nodeValue).not.toBe('');
});

// picker 的话，不应该回显任何数据
// autoGenerateFilter 模式也一样
test('Picker filter2', async () => {
  const mockFetcher = jest.fn().mockImplementation((api: any) => {
    return Promise.resolve({
      data: {
        status: 0,
        data: {
          items: [{id: 1, a: 'a1', b: 'b1'}]
        }
      }
    });
  });
  let container: HTMLElement;
  const renderResult: any = render(
    amisRender(
      {
        type: 'page',
        data: {b: '2'},
        body: {
          type: 'form',
          body: [
            {
              type: 'picker',
              name: 'xxx',
              source: '/api/mock2/sample',
              pickerSchema: {
                type: 'crud',
                autoGenerateFilter: true,
                columns: [
                  {
                    name: 'id',
                    label: 'ID'
                  },
                  {
                    name: 'a',
                    label: 'A',
                    searchable: true
                  },
                  {
                    name: 'b',
                    label: 'B',
                    searchable: true
                  }
                ]
              }
            }
          ]
        }
      },
      {
        location: {
          pathname: '/mock2/sample',
          search: '?a=1',
          query: ''
        } as any
      },
      makeEnv({fetcher: mockFetcher, getModalContainer: () => container} as any)
    )
  );
  container = renderResult.container;

  await wait(200);
  const pickerBtn = container.querySelector('span.cxd-Picker-btn')!;
  expect(pickerBtn).toBeTruthy();

  fireEvent.click(pickerBtn);

  await wait(1000);
  const a = container.querySelector('input[name="a"]')!;
  const b = container.querySelector('input[name="b"]')!;

  // picker 里面不应该自动回显任何数据
  expect(a).toBeTruthy();
  expect(a.nodeValue).not.toBe('');

  // picker 里面不应该自动回显任何数据
  expect(b).toBeTruthy();
  expect(b.nodeValue).not.toBe('');
});
