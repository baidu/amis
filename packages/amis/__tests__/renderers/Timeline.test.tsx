/**
 * 组件名称：Timeline 时间轴
 * 单测内容：
 * 1. mode & direction
 * 2. items
 * 3. source
 * 4. reverse
 */

import 'react';
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

test('Renderer:timeline with reverse', async () => {
  const {container, getByText, rerender} = render(
    amisRender({
      type: 'timeline',
      items: [
        {
          time: '2019-02-07',
          title: '节点数据'
        },
        {
          time: '2019-02-08',
          title: '节点数据'
        },
        {
          time: '2019-02-09',
          title: '节点数据'
        },
        {
          time: '2019-02-10',
          title: '节点数据'
        }
      ]
    })
  );

  expect(container.querySelector('.cxd-TimelineItem-time')).toHaveTextContent(
    '2019-02-07'
  );

  rerender(
    amisRender({
      type: 'timeline',
      reverse: true,
      items: [
        {
          time: '2019-02-07',
          title: '节点数据'
        },
        {
          time: '2019-02-08',
          title: '节点数据'
        },
        {
          time: '2019-02-09',
          title: '节点数据'
        },
        {
          time: '2019-02-10',
          title: '节点数据'
        }
      ]
    })
  );

  expect(container.querySelector('.cxd-TimelineItem-time')).toHaveTextContent(
    '2019-02-10'
  );
});

test('Renderer:timeline itemTitleSchema', async () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'timeline',
        itemTitleSchema: [
          {
            type: 'tpl',
            tpl: '<div class="itemSchemaClassName">${title}</div>'
          }
        ],
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
  expect(container.querySelector('.itemSchemaClassName')).toBeInTheDocument();
});

test('Renderer:timeline detailClassName timeClassName', async () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'timeline',
        detailClassName: 'auto-detail-class',
        items: [
          {
            time: '2019-02-07',
            title: '节点数据',
            detail: '#ffb200',
            detailCollapsedText: 'detailCollapsedText',
            detailExpandedText: 'detailExpandedText',
            icon: 'close'
          },
          {
            time: '2019-02-08',
            title: '节点数据',
            titleClassName: 'auto-item-title-class',
            detail: '#4F86F4'
          },
          {
            time: '2019-02-09',
            title: '节点数据',
            detail: 'success'
          },
          {
            time: '2019-02-09',
            title: '节点数据',
            detail: 'warning'
          }
        ]
      },
      {},
      makeEnv()
    )
  );

  const timelineTitles = () =>
    container.querySelectorAll('.cxd-TimelineItem-title')!;
  expect(timelineTitles()[1]).toHaveClass('auto-item-title-class');
});

test('Renderer:timeline card style is enabled', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'timeline',
        detailClassName: 'auto-detail-class',
        items: [
          {
            time: '2019-02-07',
            cardSchema: {
              type: 'card',
              href: 'https://github.com/baidu/amis',
              header: {
                title: '标题',
                subTitle: '副标题',
                description: '这是一段描述',
                avatarText: 'AMIS'
              },
              body: '这里是内容'
            }
          },
          {
            time: '2019-02-08',
            cardSchema: {
              type: 'card',
              href: 'https://github.com/baidu/amis',
              header: {
                title: '标题',
                subTitle: '副标题',
                description: '这是一段描述',
                avatarText: 'AMIS'
              },
              body: '这里是内容'
            }
          },
          {
            time: '2019-02-09',
            cardSchema: {
              type: 'card',
              href: 'https://github.com/baidu/amis',
              header: {
                title: '标题',
                subTitle: '副标题',
                description: '这是一段描述',
                avatarText: 'AMIS'
              },
              body: '这里是内容'
            }
          }
        ]
      },
      {},
      makeEnv()
    )
  );

  const cardsElements = container.querySelectorAll('.cxd-Card');
  expect(cardsElements.length).toBe(3);
});

test('Renderer:timeline dot size is adjusted', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'timeline',
        detailClassName: 'auto-detail-class',
        items: [
          {
            time: '2019-02-08',
            title: '节点数据',
            detail: 'error',
            dotSize: 'xl'
          },
          {
            time: '2019-02-09',
            title: '节点数据',
            detail: 'success',
            dotSize: 'sm'
          },
          {
            time: '2019-02-09',
            title: '节点数据',
            detail: 'warning',
            dotSize: 'lg',
            hideDot: true
          }
        ]
      },
      {},
      makeEnv()
    )
  );
  expect(container).toMatchSnapshot();
});
