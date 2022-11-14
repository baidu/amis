import React = require('react');
import PageRenderer from '../../src/renderers/Page';
import * as renderer from 'react-test-renderer';
import {render, fireEvent, cleanup, waitFor} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {wait, makeEnv} from '../helper';
import {clearStoresCache} from '../../src';
import {createMemoryHistory} from 'history';

afterEach(() => {
  cleanup();
  clearStoresCache();
  jest.useRealTimers();
});

test('Renderer:Page', () => {
  const component = renderer.create(
    amisRender({
      type: 'page',
      title: 'This is Title',
      subTitle: 'This is SubTitle',
      remark: 'Remark Text',
      toolbar: 'This is toolbar',
      body: 'This is body'
    })
  );
  let tree = component.toJSON();

  expect(tree).toMatchSnapshot();
});

test('Renderer:Page initData', () => {
  const component = renderer.create(
    amisRender({
      type: 'page',
      data: {
        a: 1
      },
      body: 'The variable value is ${a}'
    })
  );
  let tree = component.toJSON();

  expect(tree).toMatchSnapshot();
});

test('Renderer:Page initApi', async () => {
  const fetcher = jest.fn().mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          a: 2
        }
      }
    })
  );
  const {container, getByText, rerender}: any = render(
    amisRender(
      {
        type: 'page',
        initApi: '/api/xxx',
        body: 'The variable value is ${a}'
      },
      {},
      makeEnv({
        fetcher
      })
    )
  );

  await waitFor(() => {
    expect(getByText('The variable value is 2')).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).not.toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();
});

test('Renderer:Page initApi error show Message', async () => {
  const fetcher = jest.fn().mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        status: 500,
        msg: 'Internal Error'
      }
    })
  );
  const {container, getByText, rerender}: any = render(
    amisRender(
      {
        type: 'page',
        initApi: '/api/xxx'
      },
      {},
      makeEnv({
        fetcher
      })
    )
  );

  await waitFor(() => {
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).not.toBeInTheDocument();

    expect(container.querySelector('.cxd-Alert')).toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();
});

test('Renderer:Page initApi show loading', async () => {
  const fetcher = jest.fn().mockImplementationOnce(() => {
    return new Promise(async resolve => {
      await wait(200, false);
      resolve({
        data: {
          status: 0,
          msg: 'ok',
          data: {
            a: 3
          }
        }
      });
    });
  });
  const {container, getByText, getByTestId, unmount} = render(
    amisRender(
      {
        type: 'page',
        initApi: '/api/xxx',
        body: 'The variable value is ${a}'
      },
      {},
      makeEnv({
        fetcher
      })
    )
  );

  await waitFor(() => {
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();

  await waitFor(() => {
    expect(getByText('The variable value is 3')).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).not.toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();
});

test('Renderer:Page initApi initFetch:false', async () => {
  const fetcher = jest.fn().mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          a: 2
        }
      }
    })
  );
  const {container, getByText, getByTestId} = render(
    amisRender(
      {
        type: 'page',
        initApi: '/api/xxx',
        initFetch: false,
        body: 'The variable value is ${a}'
      },
      {},
      makeEnv({
        fetcher
      })
    )
  );

  await waitFor(() => {
    expect(getByText('The variable value is')).toBeInTheDocument();
  });
  expect(fetcher).not.toHaveBeenCalled();
});

test('Renderer:Page initApi initFetch:true', async () => {
  const fetcher = jest.fn().mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          a: 2
        }
      }
    })
  );
  const {container, getByText, getByTestId} = render(
    amisRender(
      {
        type: 'page',
        initApi: '/api/xxx',
        initFetch: true,
        body: 'The variable value is ${a}'
      },
      {},
      makeEnv({
        fetcher
      })
    )
  );

  await waitFor(() => {
    expect(getByText('The variable value is 2')).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).not.toBeInTheDocument();
  });
  expect(fetcher).toHaveBeenCalled();
});

test('Renderer:Page initApi initFetchOn -> true', async () => {
  const fetcher = jest.fn().mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          a: 2
        }
      }
    })
  );
  const {container, getByText, getByTestId} = render(
    amisRender(
      {
        type: 'page',
        initApi: '/api/xxx',
        initFetchOn: 'this.goFetch',
        body: 'The variable value is ${a}'
      },
      {
        data: {
          goFetch: true
        }
      },
      makeEnv({
        fetcher
      })
    )
  );

  await waitFor(() => {
    expect(getByText('The variable value is 2')).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).not.toBeInTheDocument();
  });
  expect(fetcher).toHaveBeenCalled();
});

test('Renderer:Page initApi initFetchOn -> false', async () => {
  const fetcher = jest.fn().mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          a: 2
        }
      }
    })
  );
  const {container, getByText, getByTestId} = render(
    amisRender(
      {
        type: 'page',
        initApi: '/api/xxx',
        initFetchOn: 'this.goFetch',
        body: 'The variable value is ${a}'
      },
      {
        data: {
          goFetch: false
        }
      },
      makeEnv({
        fetcher
      })
    )
  );

  await waitFor(() => {
    expect(getByText('The variable value is')).toBeInTheDocument();
  });
  expect(fetcher).not.toHaveBeenCalled();
});

test('Renderer:Page classNames', async () => {
  const {container, getByText, getByTestId} = render(
    amisRender({
      type: 'page',
      title: 'This is Title',
      subTitle: 'This is SubTitle',
      remark: 'Remark Text',
      toolbar: 'This is toolbar',
      body: 'This is body',
      aside: 'This is aside',

      headerClassName: 'header-class-name',
      bodyClassName: 'body-class-name',
      asideClassName: 'aside-class-name',
      toolbarClassName: 'toolbar-class-name'
    })
  );
  await waitFor(() => {
    expect(getByText('This is body')).toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();
});

test('Renderer:Page initApi interval 轮询调用', async () => {
  jest.useFakeTimers();
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          a: 4
        }
      }
    })
  );
  const component = renderer.create(
    amisRender(
      {
        type: 'page',
        initApi: '/api/xxx',
        interval: 3000,
        body: 'The variable value is ${a}'
      },
      {},
      makeEnv({
        fetcher
      })
    )
  );

  await wait(10, false);
  jest.advanceTimersByTime(3000);

  const times = fetcher.mock.calls.length;

  // 至少调用了 1次
  expect(times).toBeGreaterThan(0);
  component.unmount();
});

test('Renderer:Page initApi interval 轮询调用自动停止', async () => {
  // jest.useFakeTimers();

  let count = 1;
  const fetcher = jest.fn().mockImplementation(() => {
    return Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          a: count++
        }
      }
    });
  });
  renderer.create(
    amisRender(
      {
        type: 'page',
        initApi: '/api/xxx',
        interval: 1000,
        stopAutoRefreshWhen: 'this.a > 2',
        body: 'The variable value is ${a}'
      },
      {},
      makeEnv({
        fetcher
      })
    )
  );

  await wait(1000);
  // jest.advanceTimersByTime(3000);

  await wait(1000);
  // jest.advanceTimersByTime(3000);

  await wait(1000);
  // jest.advanceTimersByTime(3000);

  expect(fetcher).toHaveBeenCalledTimes(3);
});

test('Renderer:Page initApi silentPolling', async () => {
  jest.useFakeTimers();
  const fetcher = jest
    .fn()
    .mockImplementationOnce(() => {
      return new Promise(resolve =>
        resolve({
          data: {
            status: 0,
            msg: 'ok',
            data: {
              a: 3
            }
          }
        })
      );
    })
    .mockImplementationOnce(() => {
      return new Promise(async resolve => {
        resolve({
          data: {
            status: 0,
            msg: 'ok',
            data: {
              a: 4
            }
          }
        });
      });
    });
  const {container, getByText, getByTestId} = render(
    amisRender(
      {
        type: 'page',
        initApi: '/api/xxx',
        body: 'The variable value is ${a}',
        interval: 3000, // 最少是 3秒
        silentPolling: true
      },
      {},
      makeEnv({
        fetcher
      })
    )
  );

  await waitFor(() => {
    expect(getByText('The variable value is 3')).toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();
  jest.advanceTimersByTime(3000);

  await waitFor(() => {
    expect(getByText('The variable value is 4')).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).not.toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();
});

test('Renderer:Page initApi sendOn -> true', async () => {
  const fetcher = jest.fn().mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          a: 2
        }
      }
    })
  );
  const {container, getByText, getByTestId} = render(
    amisRender(
      {
        type: 'page',
        initApi: {
          method: 'get',
          url: '/api/xxx',
          sendOn: 'this.goFetch'
        },
        body: 'The variable value is ${a}'
      },
      {
        data: {
          goFetch: true
        }
      },
      makeEnv({
        fetcher
      })
    )
  );

  await waitFor(() => {
    expect(getByText('The variable value is 2')).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).not.toBeInTheDocument();
  });
  expect(fetcher).toHaveBeenCalled();
});

test('Renderer:Page initApi sendOn -> false', async () => {
  const fetcher = jest.fn().mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          a: 2
        }
      }
    })
  );
  const {container, getByText, getByTestId} = render(
    amisRender(
      {
        type: 'page',
        initApi: {
          method: 'get',
          url: '/api/xxx',
          sendOn: 'this.goFetch'
        },
        body: 'The variable value is ${a}'
      },
      {
        data: {
          goFetch: false
        }
      },
      makeEnv({
        fetcher
      })
    )
  );

  await waitFor(() => {
    expect(getByText('The variable value is')).toBeInTheDocument();
  });
  expect(fetcher).not.toHaveBeenCalled();
});

test('Renderer:Page location query', () => {
  const history = createMemoryHistory({
    initialEntries: ['/xxx?a=5']
  });

  const component = renderer.create(
    amisRender(
      {
        type: 'page',
        body: 'The variable value is ${a}'
      },
      {
        location: history.location as any
      }
    )
  );

  expect(component.toJSON()).toMatchSnapshot();

  history.push('/xxx?a=6');

  component.update(
    amisRender(
      {
        type: 'page',
        body: 'The variable value is ${a}'
      },
      {
        location: history.location as any
      }
    )
  );

  expect(component.toJSON()).toMatchSnapshot();
});

test('Renderer:Page initFetchOn trigger initApi fetch when condition becomes ture', async () => {
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          a: 6
        }
      }
    })
  );
  const history = createMemoryHistory({
    initialEntries: ['/xxx']
  });
  const component = renderer.create(
    amisRender(
      {
        type: 'page',
        initApi: {
          method: 'get',
          url: '/api/xxx?id=${id}'
        },
        initFetchOn: 'this.id',
        body: 'The variable value is ${a}'
      },
      {
        location: history.location as any
      },
      makeEnv({
        fetcher
      })
    )
  );

  await wait(300);
  history.push('/xxxx?id=1');

  component.update(
    amisRender(
      {
        type: 'page',
        initApi: {
          method: 'get',
          url: '/api/xxx?id=${id}'
        },
        initFetchOn: 'this.id',
        body: 'The variable value is ${a}'
      },
      {
        location: history.location as any
      },
      makeEnv({
        fetcher
      })
    )
  );

  await wait(300);
  expect(fetcher).toHaveBeenCalledTimes(1);
  expect(component.toJSON()).toMatchSnapshot();
});

test('Renderer:Page handleAction actionType=url|link', async () => {
  const jumpTo = jest.fn();
  const {getByText} = render(
    amisRender(
      {
        type: 'page',
        toolbar: [
          {
            type: 'button',
            label: 'JumpTo',
            actionType: 'link',
            to: '/goToPath?a=${a}'
          }
        ]
      },
      {
        data: {
          a: 1
        }
      },
      makeEnv({
        jumpTo
      })
    )
  );

  await waitFor(() => {
    expect(getByText('JumpTo')).toBeInTheDocument();
  });
  fireEvent.click(getByText(/JumpTo/));
  await wait(300);
  expect(jumpTo).toHaveBeenCalled();
  expect(jumpTo.mock.calls[0][0]).toEqual('/goToPath?a=1');
});

test('Renderer:Page handleAction actionType=dialog default', async () => {
  const {getByText, container}: any = render(
    amisRender(
      {
        type: 'page',
        toolbar: [
          {
            type: 'button',
            label: 'OpenDialog',
            actionType: 'dialog',
            dialog: {
              body: 'this is dialog'
            }
          }
        ]
      },
      {},
      makeEnv({
        getModalContainer: () => container
      })
    )
  );

  await waitFor(() => {
    expect(getByText('OpenDialog')).toBeInTheDocument();
  });
  fireEvent.click(getByText('OpenDialog'));
  expect(container).toMatchSnapshot();

  await waitFor(() => {
    expect(getByText('取消')).toBeInTheDocument();
  });
  fireEvent.click(getByText('取消'));

  await waitFor(() => {
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();
});

test('Renderer:Page handleAction actionType=dialog mergeData', async () => {
  const {getByText, container}: any = render(
    amisRender(
      {
        type: 'page',
        toolbar: [
          {
            type: 'button',
            label: 'OpenDialog',
            actionType: 'dialog',
            dialog: {
              actions: [
                {
                  label: '确认',
                  type: 'submit',
                  mergeData: true
                }
              ],
              body: {
                type: 'form',
                controls: [
                  {
                    label: 'A',
                    type: 'text',
                    value: '3',
                    name: 'a'
                  }
                ]
              }
            }
          }
        ],
        body: 'The variable a is ${a}'
      },
      {},
      makeEnv({
        getModalContainer: () => container
      })
    )
  );

  await waitFor(() => {
    expect(getByText('OpenDialog')).toBeInTheDocument();
  });
  fireEvent.click(getByText(/OpenDialog/));

  await waitFor(() => {
    expect(getByText('确认')).toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();

  fireEvent.click(getByText(/确认/));
  await wait(300);
  await waitFor(() => {
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();
});

test('Renderer:Page handleAction actionType=drawer default', async () => {
  const {getByText, container}: any = render(
    amisRender(
      {
        type: 'page',
        toolbar: [
          {
            type: 'button',
            label: 'OpenDrawer',
            actionType: 'drawer',
            drawer: {
              body: 'this is drawer'
            }
          }
        ]
      },
      {},
      makeEnv({
        getModalContainer: () => container
      })
    )
  );

  await waitFor(() => {
    expect(getByText('OpenDrawer')).toBeInTheDocument();
  });
  fireEvent.click(getByText(/OpenDrawer/));

  await waitFor(() => {
    expect(getByText('取消')).toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();

  fireEvent.click(getByText(/取消/));
  await waitFor(() => {
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();
});

test('Renderer:Page handleAction actionType=drawer mergeData', async () => {
  const {getByText, container}: any = render(
    amisRender(
      {
        type: 'page',
        toolbar: [
          {
            type: 'button',
            label: 'OpenDrawer',
            actionType: 'drawer',
            drawer: {
              actions: [
                {
                  label: '确认',
                  type: 'submit',
                  mergeData: true
                }
              ],
              body: {
                type: 'form',
                controls: [
                  {
                    label: 'A',
                    type: 'text',
                    value: '3',
                    name: 'a'
                  }
                ]
              }
            }
          }
        ],
        body: 'The variable a is ${a}'
      },
      {},
      makeEnv({
        getModalContainer: () => container
      })
    )
  );

  await waitFor(() => {
    expect(getByText('OpenDrawer')).toBeInTheDocument();
  });
  fireEvent.click(getByText('OpenDrawer'));
  await waitFor(() => {
    expect(
      container.querySelector('[name="a"][value="3"]')
    ).toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();

  fireEvent.click(getByText(/确认/));
  await waitFor(() => {
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();
});

test('Renderer:Page handleAction actionType=ajax', async () => {
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          a: 6
        }
      }
    })
  );
  const {getByText, container}: any = render(
    amisRender(
      {
        type: 'page',
        toolbar: [
          {
            type: 'button',
            label: 'RequestAjax',
            actionType: 'ajax',
            api: '/doxxx'
          }
        ],
        body: 'The variable a is ${a}'
      },
      {},
      makeEnv({
        fetcher,
        getModalContainer: () => container
      })
    )
  );

  await waitFor(() => {
    expect(getByText('RequestAjax')).toBeInTheDocument();
  });
  fireEvent.click(getByText(/RequestAjax/));
  await waitFor(() => {
    expect(getByText('The variable a is 6')).toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();
});

test('Renderer:Page handleAction actionType=copy', async () => {
  const copy = jest.fn();
  const {getByText} = render(
    amisRender(
      {
        type: 'page',
        toolbar: [
          {
            type: 'button',
            label: 'CopyContent',
            actionType: 'copy',
            content: 'the content is ${a}'
          }
        ]
      },
      {
        data: {
          a: 1
        }
      },
      makeEnv({
        copy
      })
    )
  );

  fireEvent.click(getByText(/CopyContent/));
  await wait(300);
  expect(copy).toHaveBeenCalled();
  expect(copy.mock.calls[0][0]).toEqual('the content is 1');
});

test('Renderer:Page handleAction actionType=ajax & feedback', async () => {
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          a: 6
        }
      }
    })
  );
  const {getByText, container}: any = render(
    amisRender(
      {
        type: 'page',
        toolbar: [
          {
            type: 'button',
            label: 'RequestAjax',
            actionType: 'ajax',
            api: '/doxxx',
            feedback: {
              body: 'this is feedback'
            }
          }
        ],
        body: 'The variable a is ${a}'
      },
      {},
      makeEnv({
        fetcher,
        getModalContainer: () => container
      })
    )
  );

  fireEvent.click(getByText(/RequestAjax/));
  await waitFor(() => {
    expect(getByText('确认')).toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();

  fireEvent.click(getByText(/确认/));
  await waitFor(() => {
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();
});

test('Renderer:Page initApi reFetch when condition changes', async () => {
  let count = 1;
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          a: count++
        }
      }
    })
  );
  const history = createMemoryHistory({
    initialEntries: ['/xxx']
  });
  const component = renderer.create(
    amisRender(
      {
        type: 'page',
        initApi: {
          method: 'get',
          url: '/api/xxx?id=${id}'
        },
        body: 'The variable value is ${a}'
      },
      {
        location: history.location as any
      },
      makeEnv({
        fetcher
      })
    )
  );

  await wait(300);
  expect(component.toJSON()).toMatchSnapshot();
  history.push('/xxxx?id=1');

  component.update(
    amisRender(
      {
        type: 'page',
        initApi: {
          method: 'get',
          url: '/api/xxx?id=${id}'
        },
        body: 'The variable value is ${a}'
      },
      {
        location: history.location as any
      },
      makeEnv({
        fetcher
      })
    )
  );

  await wait(500);
  expect(fetcher).toHaveBeenCalledTimes(2);
  expect(component.toJSON()).toMatchSnapshot();
});

test('Renderer:Page initApi reload by action', async () => {
  let count = 1;
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          a: count++
        }
      }
    })
  );
  const {container, getByText, rerender} = render(
    amisRender(
      {
        type: 'page',
        name: 'thepage',
        initApi: {
          method: 'get',
          url: '/api/xxx?id=${id}'
        },
        toolbar: {
          type: 'button',
          label: 'Reload',
          actionType: 'reload',
          target: 'thepage'
        },
        body: 'The variable value is ${a}'
      },
      {},
      makeEnv({
        fetcher
      })
    )
  );

  await waitFor(() => {
    expect(getByText('The variable value is 1')).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).not.toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();

  fireEvent.click(getByText(/Reload/));

  await waitFor(() => {
    expect(getByText('The variable value is 2')).toBeInTheDocument();
  });
  expect(fetcher).toHaveBeenCalledTimes(2);
  expect(container).toMatchSnapshot();
});

test('Renderer:Page Tpl JumpTo', async () => {
  const jumpTo = jest.fn();
  const {getByText} = render(
    amisRender(
      {
        type: 'page',
        toolbar: ['<a data-link="/goToPath?a=${a}">JumpTo</a>']
      },
      {
        data: {
          a: 1
        }
      },
      makeEnv({
        jumpTo
      })
    )
  );

  fireEvent.click(getByText(/JumpTo/));
  await wait(300);
  expect(jumpTo).toHaveBeenCalled();
  expect(jumpTo.mock.calls[0][0]).toEqual('/goToPath?a=1');
});

test('Renderer:Page initApi reload by Dialog action', async () => {
  let count = 1;
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          a: count++
        }
      }
    })
  );
  const {container, getByText, rerender}: any = render(
    amisRender(
      {
        type: 'page',
        name: 'thepage',
        initApi: {
          method: 'get',
          url: '/api/xxx?id=${id}'
        },
        toolbar: {
          type: 'button',
          label: 'OpenDialog',
          actionType: 'dialog',
          reload: 'thepage',
          dialog: {
            body: {
              type: 'form',
              controls: [
                {
                  type: 'text',
                  name: 'a',
                  value: '3'
                }
              ]
            }
          }
        },
        body: 'The variable value is ${a}'
      },
      {},
      makeEnv({
        fetcher,
        getModalContainer: () => container
      })
    )
  );

  await waitFor(() => {
    expect(getByText('The variable value is 1')).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).not.toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();

  fireEvent.click(getByText(/OpenDialog/));

  await waitFor(() => {
    expect(getByText(/确认/)).toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();
  fireEvent.click(getByText(/确认/));

  await waitFor(() => {
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
    expect(getByText('The variable value is 2')).toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();

  expect(fetcher).toHaveBeenCalledTimes(2);
});

test('Renderer:Page initApi reload by Drawer action', async () => {
  let count = 1;
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          a: count++
        }
      }
    })
  );
  const {container, getByText, rerender}: any = render(
    amisRender(
      {
        type: 'page',
        name: 'thepage',
        initApi: {
          method: 'get',
          url: '/api/xxx?id=${id}'
        },
        toolbar: {
          type: 'button',
          label: 'OpenDialog',
          actionType: 'drawer',
          reload: 'thepage',
          drawer: {
            body: {
              type: 'form',
              controls: [
                {
                  type: 'text',
                  name: 'a',
                  value: '3'
                }
              ]
            }
          }
        },
        body: 'The variable value is ${a}'
      },
      {},
      makeEnv({
        fetcher,
        getModalContainer: () => container
      })
    )
  );

  await waitFor(() => {
    expect(getByText('The variable value is 1')).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).not.toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();

  fireEvent.click(getByText(/OpenDialog/));

  await waitFor(() => {
    expect(getByText(/确认/)).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).not.toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();
  fireEvent.click(getByText(/确认/));
  await waitFor(() => {
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
    expect(getByText('The variable value is 2')).toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();
  expect(fetcher).toHaveBeenCalledTimes(2);
});

test('Renderer:Page initApi reload by Form submit', async () => {
  let count = 1;
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          a: count++
        }
      }
    })
  );
  const {container, getByText, rerender}: any = render(
    amisRender(
      {
        type: 'page',
        name: 'thepage',
        initApi: {
          method: 'get',
          url: '/api/xxx?id=${id}'
        },
        toolbar: {
          type: 'form',
          target: 'thepage',
          controls: [
            {
              type: 'text',
              name: 'a',
              value: '3'
            }
          ],
          actions: [
            {
              type: 'submit',
              label: 'Submit'
            }
          ]
        },
        body: 'The variable value is ${a}'
      },
      {},
      makeEnv({
        fetcher,
        getModalContainer: () => container
      })
    )
  );

  await waitFor(() => {
    expect(getByText(/Submit/)).toBeInTheDocument();
    expect(getByText('The variable value is 1')).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).not.toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();

  fireEvent.click(getByText(/Submit/));
  await waitFor(() => {
    expect(getByText('The variable value is 2')).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).not.toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();
  expect(fetcher).toHaveBeenCalledTimes(2);
});
