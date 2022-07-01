import React = require('react');
import PageRenderer from '../../../../amis-core/src/renderers/Form';
import * as renderer from 'react-test-renderer';
import {
  render,
  fireEvent,
  cleanup,
  getByText,
  waitFor
} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {wait, makeEnv} from '../../helper';
import {clearStoresCache} from '../../../src';
import {createMemoryHistory} from 'history';

// mock getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: (prop: any) => {
      return '';
    }
  })
});

afterEach(() => {
  cleanup();
  clearStoresCache();
});

test('Renderer:Form', async () => {
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok'
      }
    })
  );
  const {container, getByText} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        controls: [
          {
            type: 'text',
            name: 'a',
            label: 'Label',
            value: '123'
          }
        ],
        title: 'The form',
        actions: [
          {
            type: 'submit',
            label: 'Submit'
          }
        ]
      },
      {},
      makeEnv({
        fetcher
      })
    )
  );
  expect(container).toMatchSnapshot();

  fireEvent.click(getByText('Submit'));
  await waitFor(() => {
    expect(fetcher).toHaveBeenCalled();
    expect(fetcher.mock.calls[0][0]).toMatchSnapshot();
  });
});

test('Renderer:Form:valdiate', async () => {
  const notify = jest.fn();
  const onSubmit = jest.fn();
  const {container, getByText} = render(
    amisRender(
      {
        type: 'form',
        controls: [
          {
            type: 'text',
            name: 'a',
            required: true,
            label: 'Label'
          }
        ],
        title: 'The form',
        actions: [
          {
            type: 'submit',
            label: 'Submit'
          }
        ]
      },
      {
        onSubmit
      },
      makeEnv({
        notify
      })
    )
  );

  fireEvent.click(getByText('Submit'));
  await waitFor(() => {
    expect(container.querySelector('.cxd-Form-feedback')).toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();
  expect(onSubmit).not.toHaveBeenCalled();

  expect(notify).toHaveBeenCalledWith('error', '依赖的部分字段没有通过验证');

  const input = container.querySelector('input[name=a]');
  expect(input).toBeTruthy();
  fireEvent.change(input!, {
    target: {
      value: '123'
    }
  });

  await waitFor(() => {
    expect(
      container.querySelector('input[name=a][value="123"]')
    ).toBeInTheDocument();
  });

  fireEvent.click(getByText('Submit'));
  expect(container).toMatchSnapshot();

  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalled();
    expect(onSubmit.mock.calls[0][0]).toMatchSnapshot();
  });
});

test('Renderer:Form:remoteValidate', async () => {
  const notify = jest.fn();
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 422,
        msg: '服务端验证失败',
        errors: {
          a: '这个字段服务端验证失败'
        }
      }
    })
  );
  const {container, getByText} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/xxx',
        controls: [
          {
            type: 'text',
            name: 'a',
            label: 'Label'
          }
        ],
        title: 'The form',
        actions: [
          {
            type: 'submit',
            label: 'Submit'
          }
        ]
      },
      {},
      makeEnv({
        notify,
        fetcher
      })
    )
  );

  fireEvent.click(getByText('Submit'));
  await waitFor(() => {
    expect(container.querySelector('.cxd-Form-feedback')).toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();
});

test('Renderer:Form:onValidate', async () => {
  const notify = jest.fn();
  const onSubmit = jest.fn();
  const onValidate = jest
    .fn()
    .mockImplementationOnce(() => ({
      a: 'a is wrong',
      b: ['b is wrong', 'b is wrong 2']
    }))
    .mockImplementationOnce(() => ({
      a: '',
      b: ''
    }));
  const {container, getByText} = render(
    amisRender(
      {
        type: 'form',
        controls: [
          {
            type: 'text',
            name: 'a',
            label: 'A',
            value: 1
          },
          {
            type: 'text',
            name: 'b',
            label: 'B',
            value: 2
          }
        ],
        title: 'The form',
        actions: [
          {
            type: 'submit',
            label: 'Submit'
          }
        ]
      },
      {
        onSubmit,
        onValidate
      },
      makeEnv({
        notify
      })
    )
  );

  await waitFor(() => {
    expect(getByText('Submit')).toBeInTheDocument();
  });
  fireEvent.click(getByText('Submit'));

  await waitFor(() => {
    expect(container.querySelector('.cxd-Form-feedback')).toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();
  expect(onSubmit).not.toHaveBeenCalled();
  expect(onValidate).toHaveBeenCalled();
  expect(onValidate.mock.calls[0][0]).toMatchSnapshot();

  expect(notify).toHaveBeenCalledWith('error', '依赖的部分字段没有通过验证');

  fireEvent.click(getByText('Submit'));

  await waitFor(() => {
    expect(
      container.querySelector('.cxd-Form-feedback')
    ).not.toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();
  expect(onSubmit).toHaveBeenCalled();
  expect(onSubmit.mock.calls[0][0]).toMatchSnapshot();
});

test('Renderer:Form initApi', async () => {
  const notify = jest.fn();
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        data: {
          a: 1,
          b: 2
        }
      }
    })
  );
  const {container, getByText} = render(
    amisRender(
      {
        type: 'form',
        initApi: '/api/xxx',
        controls: [
          {
            type: 'text',
            name: 'a',
            label: 'A'
          },
          {
            type: 'text',
            name: 'b',
            label: 'B'
          }
        ],
        title: 'The form'
      },
      {},
      makeEnv({
        notify,
        fetcher
      })
    )
  );

  await waitFor(() => {
    expect(
      container.querySelector('[name="a"][value="1"]')
    ).toBeInTheDocument();
  });

  // fetch 调用了，所有 initApi 接口调用了
  expect(fetcher).toHaveBeenCalled();

  // 通过 snapshot 可断定 initApi 返回值已经作用到了表单项上。
  expect(container).toMatchSnapshot();
});

test('Renderer:Form initFetch:false', async () => {
  const notify = jest.fn();
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        data: {
          a: 1,
          b: 2
        }
      }
    })
  );
  const {container, getByText} = render(
    amisRender(
      {
        type: 'form',
        initApi: '/api/xxx',
        initFetch: false,
        controls: [
          {
            type: 'text',
            name: 'a',
            label: 'A'
          },
          {
            type: 'text',
            name: 'b',
            label: 'B'
          }
        ],
        title: 'The form'
      },
      {},
      makeEnv({
        notify,
        fetcher
      })
    )
  );

  expect(fetcher).not.toHaveBeenCalled();
});

test('Renderer:Form initFetchOn:false', async () => {
  const notify = jest.fn();
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        data: {
          a: 1,
          b: 2
        }
      }
    })
  );
  const {container, getByText} = render(
    amisRender(
      {
        type: 'form',
        initApi: '/api/xxx',
        initFetchOn: 'this.goFetch',
        controls: [
          {
            type: 'text',
            name: 'a',
            label: 'A'
          },
          {
            type: 'text',
            name: 'b',
            label: 'B'
          }
        ],
        title: 'The form'
      },
      {
        data: {
          goFetch: false
        }
      },
      makeEnv({
        notify,
        fetcher
      })
    )
  );

  expect(fetcher).not.toHaveBeenCalled();
});

test('Renderer:Form sendOn:false', async () => {
  const notify = jest.fn();
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        data: {
          a: 1,
          b: 2
        }
      }
    })
  );
  const {container, getByText} = render(
    amisRender(
      {
        type: 'form',
        initApi: {
          method: 'get',
          url: '/api/xxx',
          sendOn: 'this.goFetch'
        },
        controls: [
          {
            type: 'text',
            name: 'a',
            label: 'A'
          },
          {
            type: 'text',
            name: 'b',
            label: 'B'
          }
        ],
        title: 'The form'
      },
      {
        data: {
          goFetch: false
        }
      },
      makeEnv({
        notify,
        fetcher
      })
    )
  );

  expect(fetcher).not.toHaveBeenCalled();
});

test('Renderer:Form sendOn:true', async () => {
  const notify = jest.fn();
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        data: {
          a: 1,
          b: 2
        }
      }
    })
  );
  const {container, getByText} = render(
    amisRender(
      {
        type: 'form',
        initApi: {
          method: 'get',
          url: '/api/xxx',
          sendOn: 'this.goFetch'
        },
        controls: [
          {
            type: 'text',
            name: 'a',
            label: 'A'
          },
          {
            type: 'text',
            name: 'b',
            label: 'B'
          }
        ],
        title: 'The form'
      },
      {
        data: {
          goFetch: true
        }
      },
      makeEnv({
        notify,
        fetcher
      })
    )
  );

  await waitFor(() => {
    expect(
      container.querySelector('[name="a"][value="1"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="spinner"]')
    ).not.toBeInTheDocument();
  });
  expect(fetcher).toHaveBeenCalled();
  expect(container).toMatchSnapshot();
});
