import {render as amisRender} from '../../src';
import {wait, makeEnv} from '../helper';
import {render, fireEvent, cleanup, waitFor} from '@testing-library/react';
import {buildApi, isApiOutdated, isValidApi} from 'amis-core';

test('api:buildApi', () => {
  expect(buildApi('/api/xxx')).toMatchObject({
    method: 'get',
    url: '/api/xxx'
  });

  expect(buildApi('get:/api/xxx')).toMatchObject({
    method: 'get',
    url: '/api/xxx'
  });

  expect(buildApi('delete:/api/xxx')).toMatchObject({
    method: 'delete',
    url: '/api/xxx'
  });

  expect(
    buildApi('/api/xxx?a=${a}&b=${b}', {
      a: 1,
      b: 2
    })
  ).toMatchObject({
    method: 'get',
    url: '/api/xxx?a=1&b=2'
  });

  expect(
    buildApi(
      {
        method: 'get',
        url: '/api/xxx?a=${a}&b=${b}'
      },
      {
        a: 1,
        b: 2
      }
    )
  ).toMatchObject({
    method: 'get',
    url: '/api/xxx?a=1&b=2'
  });

  expect(
    buildApi('/api/xxx?a=${a}', {
      a: '&'
    })
  ).toMatchObject({
    method: 'get',
    url: '/api/xxx?a=' + encodeURIComponent('&')
  });

  expect(
    buildApi('/api/xxx?a=${a}', {
      a: [1, 2, 3]
    })
  ).toMatchObject({
    method: 'get',
    url: '/api/xxx?a[0]=1&a[1]=2&a[2]=3'
  });

  expect(
    buildApi('/api/xxx/${x === "a" ? "A" : "B"}?a=${a}', {
      x: 'a',
      a: [1, 2, 3]
    })
  ).toMatchObject({
    method: 'get',
    url: '/api/xxx/A?a[0]=1&a[1]=2&a[2]=3'
  });

  expect(
    buildApi('/api/xxx/${x === "a" ? "A" : "B"}?a=${a}', {
      x: 'b',
      a: [1, 2, 3]
    })
  ).toMatchObject({
    method: 'get',
    url: '/api/xxx/B?a[0]=1&a[1]=2&a[2]=3'
  });

  expect(
    buildApi('/api/xxx/${x === "a" ? "A" : "B"}?a=${a}#a=1&b=2', {
      x: 'b',
      a: [1, 2, 3]
    })
  ).toMatchObject({
    method: 'get',
    url: '/api/xxx/B?a[0]=1&a[1]=2&a[2]=3#a=1&b=2'
  });

  expect(
    buildApi(
      '/api/xxx/${x === "a" ? "A" : "B"}?a=${a}&b=${x == "a" ? "A" : "B"}',
      {
        x: 'b',
        a: [1, 2, 3]
      }
    )
  ).toMatchObject({
    method: 'get',
    url: '/api/xxx/B?a[0]=1&a[1]=2&a[2]=3&b=B'
  });

  expect(
    buildApi('/api/xxx/${x === "a" ? "A" : "B"}', {
      x: 'b',
      a: [1, 2, 3]
    })
  ).toMatchObject({
    method: 'get',
    url: '/api/xxx/B'
  });
});

test('api:buildApi2', () => {
  expect(
    buildApi('http://domain.com/#/subpath?a=1&b=2', {
      a: 1
    }).url
  ).toBe('http://domain.com/#/subpath?a=1&b=2');

  expect(
    buildApi('http://domain.com/subpath?a=1&b=2#233', {
      a: 1
    }).url
  ).toBe('http://domain.com/subpath?a=1&b=2#233');

  expect(
    buildApi('http://domain.com/subpath?a=1&b=${a}#233', {
      a: 1
    }).url
  ).toBe('http://domain.com/subpath?a=1&b=1#233');
});

test('api:buildApi:dataMapping', () => {
  expect(
    buildApi(
      {
        method: 'post',
        url: '/api/xxx',
        data: {
          a: 1,
          b: '${b}'
        }
      },
      {
        b: 2
      }
    )
  ).toMatchObject({
    method: 'post',
    url: '/api/xxx',
    data: {
      a: 1,
      b: 2
    }
  });

  expect(
    buildApi(
      {
        method: 'post',
        url: '/api/xxx',
        headers: {
          a: 1,
          b: '${b}'
        }
      },
      {
        b: 2
      }
    )
  ).toMatchObject({
    method: 'post',
    url: '/api/xxx',
    headers: {
      a: 1,
      b: 2
    }
  });

  expect(
    buildApi(
      {
        method: 'get',
        url: '/api/xxx?b=${b}&c=3&d=${d}'
      },
      {
        b: 2,
        d: 'abc${123}'
      }
    )
  ).toMatchObject({
    method: 'get',
    url: '/api/xxx?b=2&c=3&d=abc%24%7B123%7D',
    query: {
      b: 2,
      c: '3',
      d: 'abc${123}'
    }
  });

  expect(
    buildApi(
      {
        method: 'get',
        url: '/api/xxx?c=3&d=${d}',
        query: {
          a: 1,
          b: '${b}'
        }
      },
      {
        b: 2,
        d: 'abc${123}'
      }
    )
  ).toMatchObject({
    method: 'get',
    url: '/api/xxx?c=3&d=abc%24%7B123%7D&a=1&b=2',
    query: {
      a: 1,
      b: 2,
      d: 'abc${123}'
    }
  });
});

test('api:buildApi:autoAppend', () => {
  expect(
    buildApi(
      {
        method: 'get',
        url: '/api/xxx'
      },
      {
        a: 1,
        b: 2
      },
      {
        autoAppend: true
      }
    )
  ).toMatchObject({
    method: 'get',
    url: '/api/xxx?a=1&b=2'
  });
});

test('api:isApiOutdated', () => {
  expect(
    isApiOutdated(
      '/api/xxx?a=${a}',
      '/api/xxx?a=${a}',
      {
        a: 1,
        b: 0
      },
      {
        a: 1,
        b: 2
      }
    )
  ).toBeFalsy();

  expect(
    isApiOutdated(
      '/api/xxx?a=${a}',
      '/api/xxx?a=${a}',
      {
        a: 1,
        b: 0
      },
      {
        a: 2,
        b: 2
      }
    )
  ).toBeTruthy();

  expect(
    isApiOutdated(
      '/api/xxx',
      '/api/xxx',
      {
        a: 1,
        b: 0
      },
      {
        a: 2,
        b: 2
      }
    )
  ).toBeFalsy();

  expect(
    isApiOutdated(
      {
        method: 'get',
        url: '/api/xxx?a=${a}'
      },
      {
        method: 'get',
        url: '/api/xxx?a=${a}',
        sendOn: 'this.b === 0'
      },
      {
        a: 1,
        b: 0
      },
      {
        a: 2,
        b: 2
      }
    )
  ).toBeFalsy();
});

test('api:cache', async () => {
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
  const {container, getByText} = render(
    amisRender(
      {
        type: 'page',
        name: 'thepage',
        initApi: {
          method: 'get',
          url: '/api/xxx?id=${id}',
          cache: 2000
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

  await wait(300);
  expect(container).toMatchSnapshot();

  fireEvent.click(getByText(/Reload/));

  await wait(300);
  expect(fetcher).toHaveBeenCalledTimes(1); // 只请求一次，第二次请求从缓存中取
  expect(container).toMatchSnapshot();
});

test('api:isvalidapi', () => {
  expect(isValidApi('api/xxx')).toBeTruthy();
  expect(isValidApi('api/xxx?a=1')).toBeTruthy();
  expect(isValidApi('/x')).toBeTruthy();
  expect(isValidApi('/api/xxx?a=1&b=2&c=3')).toBeTruthy();
  expect(isValidApi('http://xxxdomain')).toBeTruthy();
  expect(isValidApi('http://xxxdomain/')).toBeTruthy();
  expect(isValidApi('http://xxxdomain/api')).toBeTruthy();
  expect(isValidApi('app://')).toBeFalsy();
  expect(isValidApi('app://x')).toBeTruthy();
  expect(isValidApi('app://x?a=1')).toBeTruthy();
  expect(isValidApi('app://x?a=1&b=2')).toBeTruthy();
  expect(isValidApi('app://x b?a=1&b=2')).toBeFalsy();
  expect(isValidApi('app://x%20b?a=1&b=2')).toBeTruthy();
  expect(isValidApi('ftp://127.0.0.1/xxx')).toBeTruthy();
  expect(isValidApi('wss://127.0.0.1/xxx')).toBeTruthy();
  expect(isValidApi('taf://127.0.0.1/xxx')).toBeTruthy();
  expect(
    isValidApi(
      'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/sample/${id}'
    )
  ).toBeTruthy();

  expect(
    isValidApi(
      'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/sample/${id ? "a" : "b"}'
    )
  ).toBeTruthy();

  expect(
    isValidApi(
      'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/${id ? "a" : "b"}/abc'
    )
  ).toBeTruthy();
});

test('api:requestAdaptor1', async () => {
  const notify = jest.fn();
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          id: 1
        }
      }
    })
  );
  const requestAdaptor = jest.fn().mockImplementation(api => {
    return Promise.resolve({
      ...api,
      data: {
        ...api.data,
        email: 'appended@test.com'
      }
    });
  });

  const {container, getByText} = render(
    amisRender(
      {
        type: 'page',
        body: [
          {
            type: 'form',
            id: 'form_submit',
            submitText: '提交表单',
            api: {
              method: 'post',
              url: '/api/mock2/form/saveForm',
              requestAdaptor: requestAdaptor
            },
            body: [
              {
                type: 'input-text',
                name: 'name',
                label: '姓名：',
                value: 'fex'
              }
            ]
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

  await waitFor(() => {
    expect(getByText('提交表单')).toBeInTheDocument();
  });

  fireEvent.click(getByText(/提交表单/));
  await wait(300);

  expect(requestAdaptor).toHaveBeenCalled();
  expect(fetcher).toHaveBeenCalled();
  expect(fetcher.mock.calls[0][0].data).toMatchObject({
    name: 'fex',
    email: 'appended@test.com'
  });
});

test('api:requestAdaptor2', async () => {
  const notify = jest.fn();
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          id: 1
        }
      }
    })
  );
  const requestAdaptor = jest.fn().mockImplementation(api => {
    return Promise.resolve({
      ...api,
      mockResponse: {
        status: 200,
        data: {
          status: 0,
          msg: 'ok',
          data: {
            id: 2
          }
        }
      }
    });
  });

  const {container, getByText} = render(
    amisRender(
      {
        type: 'page',
        body: [
          {
            type: 'form',
            id: 'form_submit',
            submitText: '提交表单',
            api: {
              method: 'post',
              url: '/api/mock2/form/saveForm',
              requestAdaptor: requestAdaptor
            },
            body: [
              {
                type: 'input-text',
                name: 'id',
                label: 'Id'
              },
              {
                type: 'input-text',
                name: 'name',
                label: '姓名：',
                value: 'fex'
              }
            ]
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

  await waitFor(() => {
    expect(getByText('提交表单')).toBeInTheDocument();
  });

  fireEvent.click(getByText(/提交表单/));
  await wait(300);

  expect(requestAdaptor).toHaveBeenCalled();
  expect(fetcher).toHaveBeenCalledTimes(0);
  expect(container.querySelector('input[name="id"]')).toBeInTheDocument();
  expect((container.querySelector('input[name="id"]') as any).value).toBe('2');
});

test('api:responseData1', async () => {
  const notify = jest.fn();
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          id: 1
        }
      }
    })
  );
  const {container, getByText} = render(
    amisRender(
      {
        type: 'page',
        body: [
          {
            type: 'form',
            id: 'form_submit',
            submitText: '提交表单',
            api: {
              method: 'post',
              url: '/api/mock2/form/saveForm',
              responseData: {
                id: '${id}',
                id2: '${id + 1}'
              }
            },
            body: [
              {
                type: 'input-text',
                name: 'id',
                label: 'Id'
              },
              {
                type: 'input-text',
                name: 'id2',
                label: 'Id2'
              }
            ]
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

  await waitFor(() => {
    expect(getByText('提交表单')).toBeInTheDocument();
  });

  fireEvent.click(getByText(/提交表单/));
  await wait(300);

  expect(fetcher).toHaveBeenCalledTimes(1);
  expect(container.querySelector('input[name="id"]')).toBeInTheDocument();
  expect((container.querySelector('input[name="id"]') as any).value).toBe('1');

  expect(container.querySelector('input[name="id2"]')).toBeInTheDocument();
  expect((container.querySelector('input[name="id2"]') as any).value).toBe('2');
});

test('api:responseData2', async () => {
  const notify = jest.fn();
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 500,
        msg: 'ok',
        data: {
          id: 1
        }
      }
    })
  );
  const {container, getByText} = render(
    amisRender(
      {
        type: 'page',
        body: [
          {
            type: 'form',
            id: 'form_submit',
            submitText: '提交表单',
            api: {
              method: 'post',
              url: '/api/mock2/form/saveForm',
              responseData: {
                id: '${id}',
                id2: '${id + 1}'
              }
            },
            body: [
              {
                type: 'input-text',
                name: 'id',
                label: 'Id'
              },
              {
                type: 'input-text',
                name: 'id2',
                label: 'Id2'
              }
            ]
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

  await waitFor(() => {
    expect(getByText('提交表单')).toBeInTheDocument();
  });

  fireEvent.click(getByText(/提交表单/));
  await wait(300);

  expect(fetcher).toHaveBeenCalledTimes(1);
  expect(container.querySelector('input[name="id"]')).toBeInTheDocument();
  expect((container.querySelector('input[name="id"]') as any).value).toBe('1');
  await wait(500);

  expect(container.querySelector('input[name="id2"]')).toBeInTheDocument();
  expect((container.querySelector('input[name="id2"]') as any).value).toBe('2');
});
