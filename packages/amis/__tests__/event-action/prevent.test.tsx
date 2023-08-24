import {fireEvent, render, waitFor} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv} from '../helper';

test('EventAction:prevent', async () => {
  const notify = jest.fn();
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
        body: [
          {
            type: 'button',
            className: 'ml-2',
            label: '打开弹窗',
            level: 'primary',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'dialog',
                    dialog: {
                      type: 'dialog',
                      title: '提示',
                      id: 'dialog_001',
                      data: {
                        myage: '22'
                      },
                      body: [
                        {
                          type: 'alert',
                          body: '确认后将不关闭弹窗',
                          level: 'warning'
                        }
                      ],
                      onEvent: {
                        confirm: {
                          actions: [
                            {
                              actionType: 'toast',
                              args: {
                                msg: '不关闭'
                              },
                              preventDefault: true,
                              stopPropagation: true
                            },
                            {
                              actionType: 'ajax',
                              args: {
                                api: {
                                  url: '/api/xxx',
                                  method: 'get'
                                }
                              }
                            }
                          ]
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        ]
      },
      {},
      makeEnv({
        getModalContainer: () => container,
        notify,
        fetcher
      })
    )
  );

  fireEvent.click(getByText('打开弹窗'));
  await waitFor(() => {
    expect(getByText('确认')).toBeInTheDocument();
  });
  fireEvent.click(getByText('确认'));
  await waitFor(() => {
    expect(notify).toHaveBeenCalled();
    expect(container.querySelector('[role="dialog"]')).toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();
  expect(fetcher).not.toHaveBeenCalled();
});

test('EventAction:ignoreError', async () => {
  const notify = jest.fn();
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
        body: [
          {
            type: 'button',
            label: '按钮',
            level: 'primary',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'reload',
                    componentId: 'notfound',
                    ignoreError: true
                  },
                  {
                    actionType: 'ajax',
                    api: '/api/test3'
                  },
                  {
                    actionType: 'custom',
                    script:
                      "const myMsg = '我是自定义JS';\nsdfsdfsdf();\ndoAction({\n  actionType: 'toast',\n  args: {\n    msg: myMsg\n  }\n});\n",
                    ignoreError: true
                  },
                  {
                    actionType: 'ajax',
                    api: '/api/test4'
                  }
                ]
              }
            }
          }
        ]
      },
      {},
      makeEnv({
        getModalContainer: () => container,
        notify,
        fetcher
      })
    )
  );

  fireEvent.click(getByText('按钮'));
  await waitFor(() => {
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(fetcher.mock.calls[0][0].url).toEqual('/api/test3');
    expect(fetcher.mock.calls[1][0].url).toEqual('/api/test4');
  });
});
