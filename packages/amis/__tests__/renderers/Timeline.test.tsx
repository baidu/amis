import React = require('react');
import {render, cleanup, fireEvent, waitFor} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv, wait} from '../helper';
import {clearStoresCache} from '../../src';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

async function fetcher(config: any) {
  return {
    status: 200,
    headers: {},
    data: {
      status: 0,
      msg: '',
      data: {
        items: [
          {
            time: '2019-02-07',
            title: '数据开发',
            detail: '2019-02-07detail',
            color: '#ffb200',
            icon: 'close'
          },
          {time: '2019-02-08', title: '管理中心', detail: '2019-02-08detail'},
          {
            time: '2019-02-09',
            title: 'SQL语句',
            detail: '2019-02-09detail',
            color: 'warning'
          },
          {
            time: '2019-02-10',
            title: '一键部署',
            detail: '2019-02-10detail',
            icon: 'compress-alt'
          },
          {time: '2019-02-10', title: '一键部署', detail: '2019-02-11detail'},
          {
            time: '2019-02-10',
            title: '一键部署',
            detail: '2019-02-12detail',
            icon: 'close'
          }
        ]
      }
    }
  };
}

test('Renderer:timeline mode direction', async () => {
  const schema = {
    type: 'timeline',
    items: [
      {
        time: '2019-02-07',
        title: '节点数据',
        color: '#ffb200'
      },
      {
        time: '2019-02-08',
        title: '节点数据',
        color: '#4F86F4'
      },
      {
        time: '2019-02-09',
        title: '节点数据',
        color: 'success'
      },
      {
        time: '2019-02-09',
        title: '节点数据',
        color: 'warning'
      }
    ]
  };
  const {container, rerender} = render(amisRender(schema, {}, makeEnv()));
  expect(container).toMatchSnapshot();

  rerender(amisRender({...schema, mode: 'left'}, {}, makeEnv()));
  expect(container).toMatchSnapshot();

  rerender(amisRender({...schema, mode: 'alternate'}, {}, makeEnv()));
  expect(container).toMatchSnapshot();

  rerender(amisRender({...schema, direction: 'horizontal'}, {}, makeEnv()));
  expect(container).toMatchSnapshot();

  rerender(amisRender({...schema, reverse: true}, {}, makeEnv()));
  expect(container).toMatchSnapshot();
});

test('Renderer:timeline items', async () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'timeline',
        items: [
          {
            time: '2019-02-07',
            title: '节点数据',
            color: '#ffb200',
            detail: 'detail',
            detailCollapsedText: 'detailCollapsedText',
            detailExpandedText: 'detailExpandedText',
            icon: 'close'
          },
          {
            time: '2019-02-08',
            title: '节点数据',
            color: '#4F86F4'
          },
          {
            time: '2019-02-09',
            title: '节点数据',
            color: 'success'
          },
          {
            time: '2019-02-09',
            title: '节点数据',
            color: 'warning'
          }
        ]
      },
      {},
      makeEnv()
    )
  );
  expect(container).toMatchSnapshot();

  fireEvent.click(getByText('detailExpandedText'));
  expect(getByText('detailCollapsedText')).toBeInTheDocument();
});

test('Renderer:timeline source', async () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'timeline',
        source: {
          method: 'get',
          url: '/api/mock2/timeline/timelineItems'
        }
      },
      {},
      makeEnv({fetcher})
    )
  );
  await waitFor(() => getByText('数据开发'));
  expect(container).toMatchSnapshot();
});
