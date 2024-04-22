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
                  },
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
                      },
                      other: '${name}'
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
    expect(fetcher).toHaveBeenCalledTimes(3);
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
    // 测试干扰配置
    expect(fetcher.mock.calls[0][0].url).toEqual('/api/xxx?name=lll');
    expect(fetcher.mock.calls[0][0].data).toMatchObject({
      myname1: 'lll',
      myname2: '${name}',
      myname3: '${lll}',
      myname4: '${text}'
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

test('EventAction:ajax data3', async () => {
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
        body: [
          {
            type: 'button',
            label: '表单外的校验按钮',
            className: 'mb-2',
            level: 'primary',
            onEvent: {
              click: {
                actions: [
                  {
                    componentId: 'form_validate',
                    outputVar: 'validateResult',
                    actionType: 'validate'
                  },
                  {
                    outputVar: 'responseResult',
                    actionType: 'ajax',
                    api: {
                      method: 'post',
                      url: '/api/xxx1',
                      data: {
                        name: '${name}',
                        email: '${email}'
                      }
                    }
                  }
                ]
              }
            }
          },
          {
            type: 'form',
            id: 'form_validate',
            data: {
              name: 'amis',
              email: 'amis@baidu.com'
            },
            body: [
              {
                type: 'input-text',
                name: 'name',
                label: '姓名：',
                required: true
              },
              {
                name: 'email',
                type: 'input-text',
                label: '邮箱：',
                required: true,
                validations: {
                  isEmail: true
                }
              }
            ],
            actions: [
              {
                type: 'button',
                label: '表单内的校验按钮',
                level: 'primary',
                onEvent: {
                  click: {
                    actions: [
                      {
                        componentId: 'form_validate',
                        outputVar: 'validateResult',
                        actionType: 'validate'
                      },
                      {
                        outputVar: 'responseResult',
                        actionType: 'ajax',
                        api: {
                          method: 'post',
                          url: '/api/xxx2',
                          data: {
                            name: '${name}',
                            email: '${email}'
                          }
                        }
                      }
                    ]
                  }
                }
              },
              {
                type: 'button',
                label: '无data',
                level: 'primary',
                onEvent: {
                  click: {
                    actions: [
                      {
                        componentId: 'form_validate',
                        outputVar: 'validateResult',
                        actionType: 'validate'
                      },
                      {
                        outputVar: 'responseResult',
                        actionType: 'ajax',
                        api: {
                          method: 'post',
                          url: '/api/xxx3'
                        }
                      }
                    ]
                  }
                }
              },
              {
                type: 'button',
                label: '字符串api无参数',
                level: 'primary',
                onEvent: {
                  click: {
                    actions: [
                      {
                        componentId: 'form_validate',
                        outputVar: 'validateResult',
                        actionType: 'validate'
                      },
                      {
                        outputVar: 'responseResult',
                        actionType: 'ajax',
                        api: 'post:/api/xxx4'
                      }
                    ]
                  }
                }
              }
            ]
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
    expect(getByText('表单外的校验按钮')).toBeInTheDocument();
    expect(getByText('表单内的校验按钮')).toBeInTheDocument();
    expect(getByText('无data')).toBeInTheDocument();
    expect(getByText('字符串api无参数')).toBeInTheDocument();
  });

  fireEvent.click(getByText(/表单外的校验按钮/));
  await wait(200);
  fireEvent.click(getByText(/表单内的校验按钮/));
  await wait(200);
  fireEvent.click(getByText(/无data/));
  await wait(200);
  fireEvent.click(getByText(/字符串api无参数/));
  await wait(200);

  await waitFor(() => {
    expect(fetcher).toHaveBeenCalledTimes(4);
    expect(fetcher.mock.calls[0][0].url).toEqual('/api/xxx1');
    expect(fetcher.mock.calls[0][0].data).toMatchObject({
      name: '',
      email: ''
    });
    expect(fetcher.mock.calls[1][0].url).toEqual('/api/xxx2');
    expect(fetcher.mock.calls[1][0].data).toMatchObject({
      name: 'amis',
      email: 'amis@baidu.com'
    });
    expect(fetcher.mock.calls[2][0].url).toEqual('/api/xxx3');
    expect(fetcher.mock.calls[2][0].data).toMatchObject({});
    expect(fetcher.mock.calls[3][0].url).toEqual('/api/xxx4');
    expect(fetcher.mock.calls[3][0].data).toMatchObject({});
  });
});

test('EventAction:ajax silent', async () => {
  const notify = jest.fn();
  const fetcher = jest.fn().mockImplementation(() => {
    return Promise.resolve({
      data: {
        status: 0,
        msg: 'ok'
      }
    });
  });
  const {getByText, container}: any = render(
    amisRender(
      {
        type: 'page',
        body: [
          {
            type: 'button',
            label: '发送请求1',
            level: 'primary',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'ajax',
                    api: {
                      url: '/api/xxx1',
                      method: 'post',
                      silent: true
                    }
                  }
                ]
              }
            }
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
                      url: '/api/xxx2',
                      method: 'post',
                      silent: false
                    }
                  }
                ]
              }
            }
          },
          {
            type: 'button',
            label: '发送请求3',
            level: 'primary',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'ajax',
                    api: {
                      url: '/api/xxx3',
                      method: 'post'
                    },
                    options: {
                      silent: true
                    }
                  }
                ]
              }
            }
          },
          {
            type: 'button',
            label: '发送请求4',
            level: 'primary',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'ajax',
                    api: {
                      url: '/api/xxx4',
                      method: 'post'
                    },
                    options: {
                      silent: false
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
        fetcher,
        notify
      })
    )
  );

  await waitFor(() => {
    expect(getByText('发送请求1')).toBeInTheDocument();
    expect(getByText('发送请求2')).toBeInTheDocument();
    expect(getByText('发送请求3')).toBeInTheDocument();
    expect(getByText('发送请求4')).toBeInTheDocument();
  });

  fireEvent.click(getByText(/发送请求1/));
  fireEvent.click(getByText(/发送请求2/));
  fireEvent.click(getByText(/发送请求3/));
  fireEvent.click(getByText(/发送请求4/));

  await waitFor(() => {
    expect(fetcher).toHaveBeenCalledTimes(4);
    expect(fetcher.mock.calls[0][0].url).toEqual('/api/xxx1');
    expect(fetcher.mock.calls[1][0].url).toEqual('/api/xxx2');
    expect(fetcher.mock.calls[2][0].url).toEqual('/api/xxx3');
    expect(fetcher.mock.calls[3][0].url).toEqual('/api/xxx4');
    expect(notify).toBeCalledTimes(2);
  });
});

test('EventAction:ajax sendOn', async () => {
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
            label: '发送请求',
            level: 'primary',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'ajax',
                    api: {
                      url: '/api/xxx',
                      method: 'get',
                      sendOn: '${1 !== 1}'
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
        fetcher
      })
    )
  );

  fireEvent.click(getByText('发送请求'));
  await waitFor(() => {
    expect(fetcher).toHaveBeenCalledTimes(0);
  });

  expect(container).toMatchSnapshot();
});
