import React = require('react');
import * as renderer from 'react-test-renderer';
import {
  render,
  fireEvent,
  cleanup,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import '../../src/themes/default';
import {render as amisRender} from '../../src/index';
import {wait, makeEnv} from '../helper';
import {clearStoresCache} from '../../src/factory';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

test('Renderer:Wizard default', () => {
  const {container, getByTestId} = render(
    amisRender(
      {
        type: 'wizard',
        api: '/api/mock2/form/saveForm?waitSeconds=2',
        steps: [
          {
            title: 'Step 1',
            controls: [
              {
                name: 'website',
                label: '网址',
                type: 'url',
                required: true
              },
              {
                name: 'name',
                label: '名称',
                type: 'text',
                required: true
              }
            ]
          },
          {
            title: 'Step 2',
            controls: [
              {
                name: 'email2',
                label: '邮箱',
                type: 'email',
                required: true
              }
            ]
          },
          {
            title: 'Step 3',
            controls: ['这是最后一步了']
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});

test('Renderer:Wizard readOnly', () => {
  const {container, getByTestId} = render(
    amisRender(
      {
        type: 'wizard',
        api: '/api/mock2/form/saveForm?waitSeconds=2',
        steps: [
          {
            title: 'Step 1',
            controls: [
              {
                name: 'website',
                label: '网址',
                type: 'url',
                readOnly: true,
                value: 'http://amis.baidu.com'
              },
              {
                name: 'name',
                label: '名称',
                type: 'text',
                value: 'Amis'
              }
            ]
          },
          {
            title: 'Step 2',
            controls: [
              {
                name: 'email2',
                label: '邮箱',
                type: 'email',
                value: 'xxx@xxx.com'
              }
            ]
          },
          {
            title: 'Step 3',
            controls: ['这是最后一步了']
          }
        ]
      },
      {},
      makeEnv()
    )
  );

  expect(container).toMatchSnapshot();
});

test('Renderer:Wizard initApi default', async () => {
  const fetcher = jest.fn().mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          author: 'fex',
          date: 1555382395,
          info: '',
          name: 'Amis renderer'
        }
      }
    })
  );

  const {container, getByText, getByTestId} = render(
    amisRender(
      {
        type: 'wizard',
        api: '/api/mock2/form/saveForm?waitSeconds=2',
        initApi: '/api/mock2/form/initData?waitSeconds=2',
        steps: [
          {
            title: 'Step 1',
            controls: [
              {
                name: 'website',
                label: '网址',
                type: 'url',
                required: true
              },
              {
                name: 'name',
                label: '名称',
                type: 'text',
                required: true
              }
            ]
          },
          {
            title: 'Step 2',
            controls: [
              {
                name: 'email2',
                label: '邮箱',
                type: 'email',
                required: true
              }
            ]
          },
          {
            title: 'Step 3',
            controls: ['这是最后一步了']
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
    expect(getByText('名称')).toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();
  expect(fetcher).toHaveBeenCalled();
});

test('Renderer:Wizard initApi show loading', async () => {
  const fetcher = jest.fn().mockImplementationOnce(() => {
    return new Promise(async resolve =>
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
  });

  const {container, getByTestId} = render(
    amisRender(
      {
        type: 'wizard',
        api: '/api/mock2/form/saveForm?waitSeconds=2',
        initApi: '/api/mock2/form/saveForm?waitSeconds=2',
        steps: [
          {
            title: 'Step 1',
            controls: [
              {
                name: 'website',
                label: '网址',
                type: 'url',
                required: true
              },
              {
                name: 'name',
                label: '名称',
                type: 'text',
                required: true
              }
            ]
          },
          {
            title: 'Step 2',
            controls: [
              {
                name: 'email2',
                label: '邮箱',
                type: 'email',
                required: true
              }
            ]
          },
          {
            title: 'Step 3',
            controls: ['这是最后一步了']
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
    expect(getByTestId('spinner')).toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();

  await waitForElementToBeRemoved(() => getByTestId('spinner'));
  expect(container).toMatchSnapshot();
});

test('Renderer:Wizard initApi initFetch:false', async () => {
  const fetcher = jest.fn().mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          author: 'fex',
          date: 1555382395,
          info: '',
          name: 'Amis renderer'
        }
      }
    })
  );

  const {container, getByText, getByTestId} = render(
    amisRender(
      {
        type: 'wizard',
        api: '/api/mock2/form/saveForm?waitSeconds=2',
        initApi: '/api/mock2/form/initData?waitSeconds=2',
        initFetch: false,
        steps: [
          {
            title: 'Step 1',
            controls: [
              {
                name: 'website',
                label: '网址',
                type: 'url',
                required: true
              },
              {
                name: 'name',
                label: '名称',
                type: 'text',
                required: true
              }
            ]
          },
          {
            title: 'Step 2',
            controls: [
              {
                name: 'email2',
                label: '邮箱',
                type: 'email',
                required: true
              }
            ]
          },
          {
            title: 'Step 3',
            controls: ['这是最后一步了']
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
    expect(getByText('名称')).toBeInTheDocument();
  });
  expect(fetcher).not.toHaveBeenCalled();
});

test('Renderer:Wizard initApi initFetch:true', async () => {
  const fetcher = jest.fn().mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          author: 'fex',
          date: 1555382395,
          info: '',
          name: 'Amis renderer'
        }
      }
    })
  );

  const {container, getByText, getByTestId} = render(
    amisRender(
      {
        type: 'wizard',
        api: '/api/mock2/form/saveForm?waitSeconds=2',
        initApi: '/api/mock2/form/initData?waitSeconds=2',
        initFetch: true,
        steps: [
          {
            title: 'Step 1',
            controls: [
              {
                name: 'website',
                label: '网址',
                type: 'url',
                required: true
              },
              {
                name: 'name',
                label: '名称',
                type: 'text',
                required: true
              }
            ]
          },
          {
            title: 'Step 2',
            controls: [
              {
                name: 'email2',
                label: '邮箱',
                type: 'email',
                required: true
              }
            ]
          },
          {
            title: 'Step 3',
            controls: ['这是最后一步了']
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
    expect(getByText('名称')).toBeInTheDocument();
  });
  expect(fetcher).toHaveBeenCalled();
});

test('Renderer:Wizard initApi initFetchOn:false', async () => {
  const fetcher = jest.fn().mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          author: 'fex',
          date: 1555382395,
          info: '',
          name: 'Amis renderer'
        }
      }
    })
  );

  const {container, getByText, getByTestId} = render(
    amisRender(
      {
        type: 'wizard',
        api: '/api/mock2/form/saveForm?waitSeconds=2',
        initApi: '/api/mock2/form/initData?waitSeconds=2',
        initFetchOn: 'this.goFetch',
        steps: [
          {
            title: 'Step 1',
            controls: [
              {
                name: 'website',
                label: '网址',
                type: 'url',
                required: true
              },
              {
                name: 'name',
                label: '名称',
                type: 'text',
                required: true
              }
            ]
          },
          {
            title: 'Step 2',
            controls: [
              {
                name: 'email2',
                label: '邮箱',
                type: 'email',
                required: true
              }
            ]
          },
          {
            title: 'Step 3',
            controls: ['这是最后一步了']
          }
        ]
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
    expect(getByText('名称')).toBeInTheDocument();
  });
  expect(fetcher).not.toHaveBeenCalled();
});

test('Renderer:Wizard initApi initFetchOn:true', async () => {
  const fetcher = jest.fn().mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          author: 'fex',
          date: 1555382395,
          info: '',
          name: 'Amis renderer'
        }
      }
    })
  );

  const {container, getByText, getByTestId} = render(
    amisRender(
      {
        type: 'wizard',
        api: '/api/mock2/form/saveForm?waitSeconds=2',
        initApi: '/api/mock2/form/initData?waitSeconds=2',
        initFetchOn: 'this.goFetch',
        steps: [
          {
            title: 'Step 1',
            controls: [
              {
                name: 'website',
                label: '网址',
                type: 'url',
                required: true
              },
              {
                name: 'name',
                label: '名称',
                type: 'text',
                required: true
              }
            ]
          },
          {
            title: 'Step 2',
            controls: [
              {
                name: 'email2',
                label: '邮箱',
                type: 'email',
                required: true
              }
            ]
          },
          {
            title: 'Step 3',
            controls: ['这是最后一步了']
          }
        ]
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
    expect(getByText('名称')).toBeInTheDocument();
  });
  expect(fetcher).toHaveBeenCalled();
});

test('Renderer:Wizard actionPrevLabel actionNextLabel actionFinishLabel className actionClassName', async () => {
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: '保存成功',
        data: {}
      }
    })
  );

  const {getByText, container} = render(
    amisRender(
      {
        type: 'wizard',
        api: '/api/mock2/form/saveForm?waitSeconds=2',
        className: 'wizard-class-name',
        actionClassName: 'btn-lg btn-primary',
        actionPrevLabel: 'PrevStep',
        actionNextLabel: 'NextStep',
        actionFinishLabel: 'Submit',
        steps: [
          {
            title: 'Step 1',
            controls: [
              {
                name: 'website',
                label: '网址',
                type: 'url'
              },
              {
                name: 'name',
                label: '名称',
                type: 'text'
              }
            ]
          },
          {
            title: 'Step 2',
            controls: ['这是最后一步了']
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
    expect(getByText('NextStep')).toBeInTheDocument();
  });
  fireEvent.click(getByText(/NextStep/));
  await waitFor(() => {
    expect(getByText('Submit')).toBeInTheDocument();
  });
  fireEvent.click(getByText(/Submit/));

  await waitFor(() => {
    expect(fetcher).toHaveBeenCalled();
  });

  expect(container).toMatchSnapshot();

  fireEvent.click(getByText(/PrevStep/));
  await waitFor(() => {
    expect(getByText('网址')).toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();
});

test('Renderer:Wizard actionNextSaveLabel', async () => {
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: '保存成功',
        data: {}
      }
    })
  );

  const {getByText} = render(
    amisRender(
      {
        type: 'wizard',
        api: '/api/mock2/form/saveForm?waitSeconds=2',
        actionNextSaveLabel: 'saveAndNext',
        steps: [
          {
            title: 'Step 1',
            api: '/api/mock2/form/saveForm?waitSeconds=2',
            controls: [
              {
                name: 'website',
                label: '网址',
                type: 'url'
              },
              {
                name: 'name',
                label: '名称',
                type: 'text'
              }
            ]
          },
          {
            title: 'Step 2',
            controls: ['这是最后一步了']
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
    expect(getByText('saveAndNext')).toBeInTheDocument();
  });
  fireEvent.click(getByText(/saveAndNext/));
  await waitFor(() => {
    expect(fetcher).toHaveBeenCalled();
  });
});

test('Renderer:Wizard send data', async () => {
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: '保存成功',
        data: {}
      }
    })
  );

  const {getByText, container} = render(
    amisRender(
      {
        type: 'wizard',
        api: '/api/mock2/form/saveForm?waitSeconds=2',
        steps: [
          {
            title: 'Step 1',
            controls: [
              {
                name: 'website',
                label: '网址',
                type: 'url',
                value: 'http://amis.baidu.com'
              },
              {
                name: 'name',
                label: '名称',
                type: 'text',
                value: 'Amis'
              }
            ]
          },
          {
            title: 'Step 2',
            controls: ['这是最后一步了']
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
    expect(getByText('下一步')).toBeInTheDocument();
  });
  fireEvent.click(getByText(/下一步/));
  await waitFor(() => {
    expect(getByText('完成')).toBeInTheDocument();
  });
  fireEvent.click(getByText(/完成/));
  await waitFor(() => {
    expect(fetcher).toHaveBeenCalled();
  });
  expect(fetcher.mock.calls[0][0]).toMatchObject({
    data: {
      name: 'Amis',
      website: 'http://amis.baidu.com'
    }
  });
  expect(container).toMatchSnapshot();
});

test('Renderer:Wizard step api', async () => {
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: '保存成功',
        data: {}
      }
    })
  );

  const {getByText} = render(
    amisRender(
      {
        type: 'wizard',
        steps: [
          {
            title: 'Step 1',
            api: '/api/mock2/form/saveForm?waitSeconds=2',
            controls: [
              {
                name: 'website',
                label: '网址',
                type: 'url',
                value: 'http://amis.baidu.com'
              },
              {
                name: 'name',
                label: '名称',
                type: 'text',
                value: 'Amis'
              }
            ]
          },
          {
            title: 'Step 2',
            controls: [
              {
                name: 'email2',
                label: '邮箱',
                type: 'email',
                required: true
              }
            ]
          },
          {
            title: 'Step 3',
            controls: ['这是最后一步了']
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
    expect(getByText('保存并下一步')).toBeInTheDocument();
  });
  fireEvent.click(getByText('保存并下一步'));
  await waitFor(() => {
    expect(fetcher).toHaveBeenCalled();
  });
});

test('Renderer:Wizard step initApi', async () => {
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          author: 'fex',
          date: 1555382395,
          email: 'xxx@xxx.com'
        }
      }
    })
  );

  const {getByText, getByTestId, container} = render(
    amisRender(
      {
        type: 'wizard',
        api: '/api/mock2/form/saveForm?waitSeconds=2',
        steps: [
          {
            title: 'Step 1',
            controls: [
              {
                name: 'website',
                label: '网址',
                type: 'url',
                value: 'http://amis.baidu.com'
              },
              {
                name: 'name',
                label: '名称',
                type: 'text',
                value: 'Amis'
              }
            ]
          },
          {
            title: 'Step 2',
            initApi: '/api/mock2/form/saveForm?waitSeconds=2',
            controls: [
              {
                name: 'email',
                label: '邮箱',
                type: 'email',
                required: true
              }
            ]
          },
          {
            title: 'Step 3',
            controls: ['这是最后一步了']
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
    expect(getByText('下一步')).toBeInTheDocument();
  });
  fireEvent.click(getByText(/下一步/));
  await waitFor(() => {
    expect(
      container.querySelector('[value="xxx@xxx.com"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).not.toBeInTheDocument();
  });
  expect(fetcher).toHaveBeenCalled();
  expect(container).toMatchSnapshot();
});

test('Renderer:Wizard step initFetch:false', async () => {
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: '保存成功',
        data: {}
      }
    })
  );

  const {getByText} = render(
    amisRender(
      {
        type: 'wizard',
        api: '/api/mock2/form/saveForm?waitSeconds=2',
        steps: [
          {
            title: 'Step 1',
            controls: [
              {
                name: 'website',
                label: '网址',
                type: 'url',
                value: 'http://amis.baidu.com'
              },
              {
                name: 'name',
                label: '名称',
                type: 'text',
                value: 'Amis'
              }
            ]
          },
          {
            title: 'Step 2',
            initApi: '/api/mock2/form/saveForm?waitSeconds=2',
            initFetch: false,
            controls: [
              {
                name: 'email2',
                label: '邮箱',
                type: 'email',
                required: true
              }
            ]
          },
          {
            title: 'Step 3',
            controls: ['这是最后一步了']
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
    expect(getByText('下一步')).toBeInTheDocument();
  });
  fireEvent.click(getByText('下一步'));
  await waitFor(() => {
    expect(getByText('邮箱')).toBeInTheDocument();
  });
  fireEvent.click(getByText('下一步'));
  await waitFor(() => {
    expect(getByText('这是必填项')).toBeInTheDocument();
  });
  expect(fetcher).not.toHaveBeenCalled();
});

test('Renderer:Wizard step initFetch:true', async () => {
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: '保存成功',
        data: {
          email2: 'xxx@xxx.com'
        }
      }
    })
  );

  const {container, getByText} = render(
    amisRender(
      {
        type: 'wizard',
        api: '/api/mock2/form/saveForm?waitSeconds=2',
        steps: [
          {
            title: 'Step 1',
            controls: [
              {
                name: 'website',
                label: '网址',
                type: 'url',
                value: 'http://amis.baidu.com'
              },
              {
                name: 'name',
                label: '名称',
                type: 'text',
                value: 'Amis'
              }
            ]
          },
          {
            title: 'Step 2',
            initApi: '/api/mock2/form/saveForm?waitSeconds=2',
            initFetch: true,
            controls: [
              {
                name: 'email2',
                label: '邮箱',
                type: 'email',
                required: true
              }
            ]
          },
          {
            title: 'Step 3',
            controls: ['这是最后一步了']
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
    expect(getByText('下一步')).toBeInTheDocument();
  });
  fireEvent.click(getByText('下一步'));
  await waitFor(() => {
    expect(
      container.querySelector('[value="xxx@xxx.com"]')
    ).toBeInTheDocument();
  });
  expect(fetcher).toHaveBeenCalled();
});

test('Renderer:Wizard step initFetchOn:false', async () => {
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: '保存成功',
        data: {}
      }
    })
  );

  const {container, getByText} = render(
    amisRender(
      {
        type: 'wizard',
        api: '/api/mock2/form/saveForm?waitSeconds=2',
        steps: [
          {
            title: 'Step 1',
            controls: [
              {
                name: 'website',
                label: '网址',
                type: 'url',
                value: 'http://amis.baidu.com'
              },
              {
                name: 'name',
                label: '名称',
                type: 'text',
                value: 'Amis'
              }
            ]
          },
          {
            title: 'Step 2',
            initApi: '/api/mock2/form/saveForm?waitSeconds=2',
            initFetchOn: 'this.goFetch',
            controls: [
              {
                name: 'email2',
                label: '邮箱',
                type: 'email',
                required: true
              }
            ]
          },
          {
            title: 'Step 3',
            controls: ['这是最后一步了']
          }
        ]
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
    expect(getByText('下一步')).toBeInTheDocument();
  });
  fireEvent.click(getByText('下一步'));
  await waitFor(() => {
    expect(getByText('邮箱')).toBeInTheDocument();
  });
  fireEvent.click(getByText('下一步'));
  await waitFor(() => {
    expect(getByText('这是必填项')).toBeInTheDocument();
  });
  expect(fetcher).not.toHaveBeenCalled();
});

test('Renderer:Wizard step initFetchOn:true', async () => {
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: '保存成功',
        data: {
          email2: 'xxx@xxx.com'
        }
      }
    })
  );

  const {getByText, container} = render(
    amisRender(
      {
        type: 'wizard',
        api: '/api/mock2/form/saveForm?waitSeconds=2',
        steps: [
          {
            title: 'Step 1',
            controls: [
              {
                name: 'website',
                label: '网址',
                type: 'url',
                value: 'http://amis.baidu.com'
              },
              {
                name: 'name',
                label: '名称',
                type: 'text',
                value: 'Amis'
              }
            ]
          },
          {
            title: 'Step 2',
            initApi: '/api/mock2/form/saveForm?waitSeconds=2',
            initFetchOn: 'this.goFetch',
            controls: [
              {
                name: 'email2',
                label: '邮箱',
                type: 'email',
                required: true
              }
            ]
          },
          {
            title: 'Step 3',
            controls: ['这是最后一步了']
          }
        ]
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
    expect(getByText('下一步')).toBeInTheDocument();
  });

  fireEvent.click(getByText('下一步'));
  await waitFor(() => {
    expect(
      container.querySelector('[value="xxx@xxx.com"]')
    ).toBeInTheDocument();
  });
  expect(fetcher).toHaveBeenCalled();
});

test('Renderer:Wizard validate', async () => {
  const {getByText, container} = render(
    amisRender(
      {
        type: 'wizard',
        api: '/api/mock2/form/saveForm?waitSeconds=2',
        steps: [
          {
            title: 'Step 1',
            controls: [
              {
                name: 'website',
                label: '网址',
                type: 'url',
                value: 'http',
                required: true
              },
              {
                name: 'name',
                label: '名称',
                type: 'text',
                required: true
              }
            ]
          },
          {
            title: 'Step 2',
            controls: [
              {
                name: 'email2',
                label: '邮箱',
                type: 'email',
                required: true
              }
            ]
          },
          {
            title: 'Step 3',
            controls: ['这是最后一步了']
          }
        ]
      },
      {},
      makeEnv()
    )
  );

  await waitFor(() => {
    expect(getByText('下一步')).toBeInTheDocument();
  });
  fireEvent.click(getByText('下一步'));

  await waitFor(() => {
    expect(getByText('这是必填项')).toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();
});

test('Renderer:Wizard initApi reload', async () => {
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {}
      }
    })
  );

  const {container, getByText} = render(
    amisRender(
      {
        type: 'page',
        name: 'thePage',
        initApi: '/api/xxx',
        body: {
          type: 'wizard',
          api: '/api/mock2/form/saveForm?waitSeconds=2',
          reload: 'thePage',
          steps: [
            {
              title: 'Step 1',
              controls: [
                {
                  name: 'website',
                  label: '网址',
                  type: 'url',
                  value: 'http://amis.baidu.com'
                },
                {
                  name: 'name',
                  label: '名称',
                  type: 'text',
                  value: 'Amis'
                }
              ]
            },
            {
              title: 'Step 2',
              controls: ['这是最后一步了']
            }
          ]
        }
      },
      {},
      makeEnv({
        fetcher
      })
    )
  );

  await waitFor(() => {
    expect(getByText('下一步')).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).not.toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();
  fireEvent.click(getByText(/下一步/));
  await waitFor(() => {
    expect(getByText('完成')).toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();
  fireEvent.click(getByText(/完成/));

  await waitFor(() => {
    expect(fetcher).toHaveBeenCalledTimes(3);
  });
  expect(container).toMatchSnapshot();
});

test('Renderer:Wizard steps not array', async () => {
  const {container, getByText} = render(
    amisRender({
      type: 'wizard',
      api: '/api/mock2/form/saveForm?waitSeconds=2',
      steps: ''
    })
  );
  await waitFor(() => {
    expect(getByText('配置错误')).toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();
});

test('Renderer:Wizard target', async () => {
  const {getByText, container} = render(
    amisRender(
      {
        type: 'page',
        body: [
          {
            type: 'wizard',
            target: 'theForm',
            steps: [
              {
                title: 'Step 1',
                controls: [
                  {
                    name: 'website',
                    label: '网址',
                    type: 'url',
                    value: 'http://amis.baidu.com'
                  },
                  {
                    name: 'name',
                    label: '名称',
                    type: 'text',
                    value: 'Amis'
                  }
                ]
              },
              {
                title: 'Step 2',
                controls: ['这是最后一步了']
              }
            ]
          },
          {
            type: 'form',
            name: 'theForm',
            controls: [
              {
                type: 'text',
                name: 'website',
                label: 'Website'
              },
              {
                type: 'text',
                name: 'name',
                label: 'Name'
              }
            ]
          }
        ]
      },
      {}
    )
  );

  await waitFor(() => {
    expect(getByText('下一步')).toBeInTheDocument();
  });
  fireEvent.click(getByText('下一步'));
  await waitFor(() => {
    expect(getByText('完成')).toBeInTheDocument();
  });
  fireEvent.click(getByText('完成'));

  await waitFor(() => {
    expect(
      container.querySelector('[name="name"][value="Amis"]')
    ).toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();
});

test('Renderer:Wizard dialog', async () => {
  const {getByText, container}: any = render(
    amisRender(
      {
        type: 'page',
        body: [
          {
            type: 'wizard',
            steps: [
              {
                title: 'Step 1',
                controls: [
                  {
                    name: 'website',
                    label: '网址',
                    type: 'url',
                    value: 'http://amis.baidu.com'
                  },
                  {
                    name: 'name',
                    label: '名称',
                    type: 'text',
                    value: 'Amis'
                  },
                  {
                    type: 'button',
                    label: 'OpenDialog',
                    actionType: 'dialog',
                    dialog: {
                      title: '添加',
                      body: {
                        type: 'form',
                        controls: [
                          {
                            type: 'text',
                            name: 'name',
                            label: 'Name'
                          }
                        ]
                      }
                    }
                  }
                ]
              },
              {
                title: 'Step 2',
                controls: ['这是最后一步了']
              }
            ]
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
    expect(getByText(/OpenDialog/)).toBeInTheDocument();
  });
  fireEvent.click(getByText(/OpenDialog/));

  await waitFor(() => {
    expect(getByText(/添加/)).toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();

  fireEvent.click(getByText(/取消/));
  await waitFor(() => {
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();
});
