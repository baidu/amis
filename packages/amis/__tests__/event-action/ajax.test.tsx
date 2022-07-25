import {fireEvent, render, waitFor} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv, wait} from '../helper';

test('EventAction:ajax', async () => {
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          age: 18
        }
      }
    })
  );
  const {getByText, container}: any = render(
    amisRender(
      {
        type: 'page',
        id: 'page_001',
        data: {
          name: 'lll'
        },
        body: [
          {
            type: 'button',
            label: '发送请求',
            level: 'primary',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'ajax',
                    args: {
                      api: {
                        url: 'api/xxx',
                        method: 'get'
                      },
                      messages: {
                        success: '成功了！欧耶',
                        failed: '失败了呢。。'
                      }
                    },
                    outputVar: 'result'
                  },
                  {
                    actionType: 'setValue',
                    componentId: 'page_001',
                    args: {
                      value: '${event.data.result.data}'
                    }
                  }
                ]
              }
            }
          },
          {
            type: 'tpl',
            tpl: '${age}岁的天空'
          },
          {
            type: 'button',
            label: '发送请求2',
            level: 'primary',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'ajax',
                    args: {
                      api: {
                        url: 'api/xxx',
                        method: 'get'
                      },
                      messages: {
                        success: '成功了！欧耶',
                        failed: '失败了呢。。'
                      }
                    }
                  },
                  {
                    actionType: 'setValue',
                    componentId: 'page_001',
                    args: {
                      value: '${event.data}'
                    }
                  }
                ]
              }
            }
          },
          {
            type: 'tpl',
            tpl: '${responseResult.data.age}岁的天空，status:${responseResult.status}，msg:${responseResult.msg}'
          }
        ]
      },
      {},
      makeEnv({
        fetcher
      })
    )
  );

  fireEvent.click(getByText('发送请求'));
  await waitFor(() => {
    expect(getByText('18岁的天空')).toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();

  fireEvent.click(getByText('发送请求2'));
  await waitFor(() => {
    expect(getByText('18岁的天空，status:0，msg:ok')).toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();
});
