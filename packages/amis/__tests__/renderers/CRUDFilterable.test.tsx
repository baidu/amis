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

async function fetcher(config: any) {
  return {
    status: 200,
    headers: {},
    data: {
      status: 0,
      msg: '',
      data: {
        count: 144,
        rows
      }
    }
  };
}

test('Renderer: crud filterable', async () => {
  const mockFetcher = jest.fn(fetcher);
  const {container, debug, getByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'crud',
          api: '/api/mock2/sample',
          syncLocation: false,
          columns: [
            {
              name: '__id',
              label: 'ID'
            },
            {
              name: 'engine',
              label: 'Rendering engine',
              filterable: {
                options: ['A', 'B', 'C', 'D', 'X']
              }
            }
          ]
        }
      },
      {},
      makeEnv({fetcher: mockFetcher})
    )
  );

  await waitFor(() => {
    expect(container.querySelectorAll('tbody>tr').length > 5).toBeTruthy();
  });

  fireEvent.click(container.querySelector('[icon="column-filter"]')!);

  await waitFor(() => {
    expect(container.querySelector('.cxd-PopOver')).toBeInTheDocument();
  });
});

test('Renderer: crud filterable searchable', async () => {
  const mockFetcher = jest.fn(fetcher);
  const {container, debug, getByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'crud',
          api: '/api/mock2/sample',
          syncLocation: false,
          columns: [
            {
              name: '__id',
              label: 'ID'
            },
            {
              name: 'engine',
              label: 'Rendering engine',
              filterable: {
                searchable: true,
                options: ['A', 'B', 'C', 'D', 'X']
              }
            }
          ]
        }
      },
      {},
      makeEnv({fetcher: mockFetcher})
    )
  );

  await waitFor(() => {
    expect(container.querySelectorAll('tbody>tr').length > 5).toBeTruthy();
  });

  fireEvent.click(container.querySelector('[icon="column-filter"]')!);

  await waitFor(() => {
    expect(container.querySelector('.cxd-PopOver')).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(container.querySelector('.cxd-SearchBox')).toBeInTheDocument();
  });
});
