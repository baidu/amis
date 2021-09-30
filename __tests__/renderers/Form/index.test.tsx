import React = require('react');
import PageRenderer from '../../../src/renderers/Form';
import * as renderer from 'react-test-renderer';
import {render, fireEvent, cleanup, getByText} from '@testing-library/react';
import '../../../src/themes/default';
import {render as amisRender} from '../../../src/index';
import {wait, makeEnv} from '../../helper';
import {clearStoresCache} from '../../../src/factory';
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
  const resultPromise = Promise.resolve({
    data: {
      status: 0,
      msg: 'ok'
    }
  });
  const fetcher = jest.fn().mockImplementation(() => resultPromise);
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
  await resultPromise;
  await wait(100);

  expect(fetcher).toHaveBeenCalled();
  expect(fetcher.mock.calls[0][0]).toMatchSnapshot();
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
  await wait(100);

  expect(container).toMatchSnapshot();
  expect(onSubmit).not.toHaveBeenCalled();

  await wait(100);
  expect(notify).toHaveBeenCalledWith(
    'error',
    '依赖的部分字段没有通过验证\n这是必填项'
  );

  const input = container.querySelector('input[name=a]');
  expect(input).toBeTruthy();
  fireEvent.change(input!, {
    target: {
      value: '123'
    }
  });
  await wait(300); // 有 250 秒左右的节流
  fireEvent.click(getByText('Submit'));
  expect(container).toMatchSnapshot();

  await wait(100);
  expect(onSubmit).toHaveBeenCalled();
  expect(onSubmit.mock.calls[0][0]).toMatchSnapshot();
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
  await wait(100);
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

  fireEvent.click(getByText('Submit'));
  await wait(100);

  expect(container).toMatchSnapshot();
  expect(onSubmit).not.toHaveBeenCalled();
  expect(onValidate).toHaveBeenCalled();
  expect(onValidate.mock.calls[0][0]).toMatchSnapshot();

  await wait(100);
  expect(notify).toHaveBeenCalledWith(
    'error',
    '依赖的部分字段没有通过验证\na is wrong\nb is wrong\nb is wrong 2'
  );

  fireEvent.click(getByText('Submit'));
  await wait(100);

  expect(container).toMatchSnapshot();
  expect(onSubmit).toHaveBeenCalled();
  expect(onSubmit.mock.calls[0][0]).toMatchSnapshot();
});

test('Renderer:Form initApi', async () => {
  const notify = jest.fn();
  let p0;
  const fetcher = jest.fn().mockImplementation(
    () =>
      (p0 = Promise.resolve({
        data: {
          status: 0,
          data: {
            a: 1,
            b: 2
          }
        }
      }))
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

  // fetch 调用了，所有 initApi 接口调用了
  expect(fetcher).toHaveBeenCalled();
  await p0;
  await wait(10);

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
  let p0;
  const fetcher = jest.fn().mockImplementation(
    () =>
      (p0 = Promise.resolve({
        data: {
          status: 0,
          data: {
            a: 1,
            b: 2
          }
        }
      }))
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

  expect(fetcher).toHaveBeenCalled();
  await p0;
  await wait(10);
  expect(container).toMatchSnapshot();
});
