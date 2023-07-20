import {fireEvent, render, waitFor} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv, wait} from '../helper';

test('EventAction:ajax args', async () => {
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
                        url: '/api/xxx',
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
                      value: '${event.data.result.responseData}'
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
                        url: '/api/xxx',
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
            tpl: '${responseResult.responseData.age}岁的天空，status:${responseResult.responseStatus}，msg:${responseResult.responseMsg}'
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
                    api: {
                      url: '/api/xxx',
                      method: 'get'
                    },
                    messages: {
                      success: '成功了！欧耶',
                      failed: '失败了呢。。'
                    },
                    outputVar: 'result'
                  },
                  {
                    actionType: 'setValue',
                    componentId: 'page_001',
                    args: {
                      value: '${event.data.result.responseData}'
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
                    api: {
                      url: '/api/xxx',
                      method: 'get'
                    },
                    messages: {
                      success: '成功了！欧耶',
                      failed: '失败了呢。。'
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
            tpl: '${responseResult.responseData.age}岁的天空，status:${responseResult.responseStatus}，msg:${responseResult.responseMsg}'
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

test('EventAction:ajax data1', async () => {
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          name: 'amis',
          age: 18
        }
      }
    })
  );
  const {getByText, container}: any = render(
    amisRender(
      {
        type: 'page',
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
                        url: '/api/xxx?name=${event.data.name}',
                        method: 'post',
                        data: {
                          myname1: '${name}',
                          myname2: '\\${name}',
                          myname3: '${text}',
                          myname4: '\\${text}'
                        }
                      }
                    },
                    outputVar: 'result'
                  },
                  {
                    actionType: 'ajax',
                    args: {
                      api: {
                        url: '/api/xxx?q1=${result.responseData.age}',
                        method: 'post',
                        data: {
                          param1: '${event.data.result.responseData.name}',
                          param2: '${responseData.name}',
                          param3: '${result.name}',
                          param4: '${event.data.responseData.name}'
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
      {
        data: {
          text: '${lll}'
        }
      },
      makeEnv({
        fetcher
      })
    )
  );

  await waitFor(() => {
    expect(getByText('发送请求')).toBeInTheDocument();
  });

  fireEvent.click(getByText(/发送请求/));

  await waitFor(() => {
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(fetcher.mock.calls[0][0].url).toEqual('/api/xxx?name=lll');
    expect(fetcher.mock.calls[0][0].data).toMatchObject({
      myname1: 'lll',
      myname2: '${name}',
      myname3: '${lll}',
      myname4: '${text}'
    });
    expect(fetcher.mock.calls[1][0].url).toEqual('/api/xxx?q1=18');
    expect(fetcher.mock.calls[1][0].data).toMatchObject({
      param1: 'amis',
      param2: 'amis',
      param3: 'amis',
      param4: 'amis'
    });
  });
});

test('EventAction:ajax data2', async () => {
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          name: 'amis',
          age: 18
        }
      }
    })
  );
  const {getByText, container}: any = render(
    amisRender(
      {
        type: 'page',
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
                    api: {
                      url: '/api/xxx?name=${event.data.name}',
                      method: 'post',
                      data: {
                        myname1: '${name}',
                        myname2: '\\${name}',
                        myname3: '${text}',
                        myname4: '\\${text}'
                      }
                    },
                    outputVar: 'result'
                  },
                  {
                    actionType: 'ajax',
                    api: {
                      url: '/api/xxx?q1=${result.responseData.age}',
                      method: 'post',
                      data: {
                        param1: '${event.data.result.responseData.name}',
                        param2: '${responseData.name}',
                        param3: '${result.name}',
                        param4: '${event.data.responseData.name}'
                      }
                    }
                  }
                ]
              }
            }
          }
        ]
      },
      {
        data: {
          text: '${lll}'
        }
      },
      makeEnv({
        fetcher
      })
    )
  );

  await waitFor(() => {
    expect(getByText('发送请求')).toBeInTheDocument();
  });

  fireEvent.click(getByText(/发送请求/));

  await waitFor(() => {
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(fetcher.mock.calls[0][0].url).toEqual('/api/xxx?name=lll');
    expect(fetcher.mock.calls[0][0].data).toMatchObject({
      myname1: 'lll',
      myname2: '${name}',
      myname3: '${lll}',
      myname4: '${text}'
    });
    expect(fetcher.mock.calls[1][0].url).toEqual('/api/xxx?q1=18');
    expect(fetcher.mock.calls[1][0].data).toMatchObject({
      param1: 'amis',
      param2: 'amis',
      param3: 'amis',
      param4: 'amis'
    });
  });
});
