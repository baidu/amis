import React = require('react');
import * as renderer from 'react-test-renderer';
import {fireEvent, render, waitFor} from '@testing-library/react';
import '../../../../src';
import {render as amisRender} from '../../../../src';
import {makeEnv, wait} from '../../../helper';

test('doAction:form validate', async () => {
  const notify = jest.fn();
  const {container, getByText} = render(
    amisRender(
      {
        type: 'page',
        body: [
          {
            type: 'button',
            label: '校验表单',
            className: 'mb-2',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'validate',
                    componentId: 'form_validate',
                    outputVar: 'form_validate_result'
                  },
                  {
                    actionType: 'setValue',
                    componentId: 'validate_info',
                    args: {
                      value: '${event.data.form_validate_result|json}'
                    }
                  }
                ]
              }
            }
          },
          {
            type: 'input-text',
            name: 'validate_info',
            id: 'validate_info',
            label: '验证信息：'
          },
          {
            type: 'form',
            id: 'form_validate',
            api: '/api/mock2/form/saveForm',
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
            ]
          }
        ]
      },
      {},
      makeEnv({
        notify
      })
    )
  );

  await waitFor(() => {
    expect(getByText('校验表单')).toBeInTheDocument();
  });

  fireEvent.click(getByText(/校验表单/));

  await wait(300);

  await waitFor(() => {
    expect(
      (container.querySelector('[name="validate_info"]') as any)?.value
    ).toEqual(
      `{  "error": "依赖的部分字段没有通过验证",  "errors": {    "name": [      "这是必填项"    ],    "email": [      "这是必填项"    ]  },  "payload": {}}`
    );
  });

  expect(container).toMatchSnapshot();

  fireEvent.change(container.querySelector('[name="name"]')!, {
    target: {value: 'amis'}
  });

  fireEvent.change(container.querySelector('[name="email"]')!, {
    target: {value: 'amis@baidu.com'}
  });

  await waitFor(() => {
    expect(container.querySelector('[value="amis"]')).toBeInTheDocument();
    expect(
      container.querySelector('[value="amis@baidu.com"]')
    ).toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();

  fireEvent.change(container.querySelector('[name="validate_info"]')!, {
    target: {value: ''}
  });

  await waitFor(() => {
    expect(
      (container.querySelector('[name="validate_info"]') as any)?.value
    ).toEqual('');
  });

  fireEvent.click(getByText(/校验表单/));

  await waitFor(() => {
    expect(
      container.querySelector('.is-error .is-required .has-error--isRequired')
    ).not.toBeInTheDocument();
  });

  await wait(300);

  await waitFor(() => {
    expect(
      (container.querySelector('[name="validate_info"]') as any)?.value
    ).toEqual(
      `{  "error": "",  "payload": {    "name": "amis",    "email": "amis@baidu.com"  }}`
    );
  });

  expect(container).toMatchSnapshot();
});

test('doAction:form submit', async () => {
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
            type: 'button',
            label: '提交表单',
            className: 'mb-2',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'submit',
                    componentId: 'form_submit',
                    outputVar: 'form_submit_result'
                  },
                  {
                    actionType: 'setValue',
                    componentId: 'submit_info',
                    args: {
                      value: '${event.data.form_submit_result|json}'
                    }
                  }
                ]
              }
            }
          },
          {
            type: 'input-text',
            name: 'submit_info',
            id: 'submit_info',
            label: '提交信息：'
          },
          {
            type: 'form',
            id: 'form_submit',
            api: '/api/mock2/form/saveForm',
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

  await waitFor(() => {
    expect(
      (container.querySelector('[name="submit_info"]') as any)?.value
    ).toEqual(
      `{  "error": "依赖的部分字段没有通过验证",  "errors": {    "name": [      "这是必填项"    ],    "email": [      "这是必填项"    ]  },  "payload": {}}`
    );
  });

  expect(container).toMatchSnapshot();

  fireEvent.change(container.querySelector('[name="name"]')!, {
    target: {value: 'amis'}
  });

  fireEvent.change(container.querySelector('[name="email"]')!, {
    target: {value: 'amis@baidu.com'}
  });

  await waitFor(() => {
    expect(container.querySelector('[value="amis"]')).toBeInTheDocument();
    expect(
      container.querySelector('[value="amis@baidu.com"]')
    ).toBeInTheDocument();
  });

  fireEvent.change(container.querySelector('[name="submit_info"]')!, {
    target: {value: ''}
  });

  await waitFor(() => {
    expect(
      (container.querySelector('[name="submit_info"]') as any)?.value
    ).toEqual('');
  });

  expect(container).toMatchSnapshot();

  fireEvent.click(getByText(/提交表单/));

  await waitFor(() => {
    expect(
      container.querySelector('.is-error .is-required .has-error--isRequired')
    ).not.toBeInTheDocument();
  });

  await wait(300);

  await waitFor(() => {
    expect(
      (container.querySelector('[name="submit_info"]') as any)?.value
    ).toEqual(
      `{  "error": "",  "payload": {    "name": "amis",    "email": "amis@baidu.com"  },  "responseData": {    "id": 1  }}`
    );
  });

  expect(container).toMatchSnapshot();
});

test('doAction:form setValue', async () => {
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
            type: 'button',
            label: '修改表单数据',
            className: 'mb-2',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'setValue',
                    componentId: 'form_setvalue',
                    args: {
                      value: {
                        name: 'amis',
                        email: 'amis@baidu.com'
                      }
                    }
                  }
                ]
              }
            }
          },
          {
            type: 'form',
            id: 'form_setvalue',
            body: [
              {
                type: 'input-text',
                name: 'name',
                label: '姓名：'
              },
              {
                name: 'email',
                type: 'input-text',
                label: '邮箱：'
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
    expect(getByText('修改表单数据')).toBeInTheDocument();
  });

  fireEvent.click(getByText(/修改表单数据/));

  await waitFor(() => {
    expect(container.querySelector('[value="amis"]')).toBeInTheDocument();
    expect(
      container.querySelector('[value="amis@baidu.com"]')
    ).toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();
});

test('doAction:form reload default', async () => {
  const notify = jest.fn();
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          name: 'Amis Renderer',
          author: 'fex',
          date: 1688714086
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
            type: 'button',
            label: '刷新表单',
            className: 'mb-2',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'reload',
                    componentId: 'form_reload'
                  }
                ]
              }
            }
          },
          {
            type: 'form',
            id: 'form_reload',
            debug: true,
            initApi: '/api/mock2/form/initData',
            body: [
              {
                type: 'input-text',
                name: 'name',
                label: '姓名：'
              },
              {
                name: 'author',
                type: 'input-text',
                label: '作者：'
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

  await wait(500); // 等待 initApi 加载完
  expect(
    (container.querySelector('[name="author"]') as HTMLInputElement).value
  ).toEqual('fex');

  const author: HTMLInputElement = container.querySelector('[name="author"]')!;
  fireEvent.change(author, {
    target: {value: 'amis'}
  });

  expect(
    (container.querySelector('[name="author"]') as HTMLInputElement).value
  ).toEqual('amis');

  // expect(container).toMatchSnapshot();

  await wait(200);
  expect(getByText('刷新表单')).toBeInTheDocument();
  fireEvent.click(getByText('刷新表单'));

  await wait(200);

  expect(
    (container.querySelector('[name="author"]') as HTMLInputElement).value
  ).toEqual('fex');

  // expect(container).toMatchSnapshot();
});

test('doAction:form reload with data', async () => {
  const notify = jest.fn();
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          name: 'Amis Renderer',
          author: 'fex',
          date: 1688714086
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
            type: 'button',
            label: '刷新表单',
            className: 'mb-2',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'reload',
                    componentId: 'form_reload',
                    data: {
                      age: 18
                    }
                  }
                ]
              }
            }
          },
          {
            type: 'form',
            id: 'form_reload',
            debug: true,
            initApi: '/api/mock2/form/initData',
            body: [
              {
                type: 'input-text',
                name: 'name',
                label: '姓名：'
              },
              {
                name: 'author',
                type: 'input-text',
                label: '作者：'
              },
              {
                name: 'age',
                type: 'input-text',
                label: '年龄：'
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

  await wait(500);
  const author: HTMLInputElement = container.querySelector('[name="author"]')!;
  expect(author).toBeInTheDocument();
  fireEvent.change(author, {
    target: {value: 'amis'}
  });

  await wait(200);
  expect(author.value).toEqual('amis');

  expect(getByText('刷新表单')).toBeInTheDocument();

  fireEvent.click(getByText('刷新表单'));
  await wait(200);

  expect(author.value).toEqual('fex');
  expect((container.querySelector('[name="age"]') as any)?.value).toEqual('18');
});

test('doAction:form reset', async () => {
  const notify = jest.fn();
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          name: 'Amis Renderer',
          author: 'fex',
          date: 1688714086
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
            type: 'button',
            label: '重置表单',
            className: 'mb-2',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'reset',
                    componentId: 'form_reset'
                  }
                ]
              }
            }
          },
          {
            type: 'form',
            id: 'form_reset',
            initApi: '/api/mock2/form/initData',
            body: [
              {
                type: 'input-text',
                name: 'name',
                label: '姓名：'
              },
              {
                name: 'author',
                type: 'input-text',
                label: '作者：'
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

  fireEvent.change(container.querySelector('[name="author"]')!, {
    target: {value: 'amis'}
  });

  await waitFor(() => {
    expect((container.querySelector('[name="author"]') as any)?.value).toEqual(
      'amis'
    );
  });

  expect(container).toMatchSnapshot();

  await waitFor(() => {
    expect(getByText('重置表单')).toBeInTheDocument();
  });

  fireEvent.click(getByText(/重置表单/));

  await waitFor(() => {
    expect((container.querySelector('[name="author"]') as any)?.value).toEqual(
      'fex'
    );
  });

  expect(container).toMatchSnapshot();
});

test('doAction:form clear', async () => {
  const notify = jest.fn();
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          name: 'Amis Renderer',
          author: 'fex',
          date: 1688714086
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
            type: 'button',
            label: '清空表单',
            className: 'mb-2',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'clear',
                    componentId: 'form_clear'
                  }
                ]
              }
            }
          },
          {
            type: 'form',
            id: 'form_clear',
            debug: true,
            initApi: '/api/mock2/form/initData',
            body: [
              {
                type: 'input-text',
                name: 'name',
                label: '姓名：'
              },
              {
                name: 'author',
                type: 'hidden',
                label: '作者：'
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

  await wait(500);
  await waitFor(() => {
    expect(getByText('清空表单')).toBeInTheDocument();
  });

  fireEvent.click(getByText(/清空表单/));

  await waitFor(() => {
    expect(
      container.querySelector('[value="Amis Renderer"]')
    ).not.toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();
});

test('doAction:form static&nonstatic', async () => {
  const notify = jest.fn();
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          name: 'Amis Renderer',
          author: 'fex',
          date: 1688714086
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
            type: 'button',
            label: '静态模式',
            className: 'mr-2 mb-2',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'static',
                    componentId: 'form_static'
                  }
                ]
              }
            }
          },
          {
            type: 'button',
            label: '编辑模式',
            className: 'mr-2 mb-2',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'nonstatic',
                    componentId: 'form_static'
                  }
                ]
              }
            }
          },
          {
            type: 'form',
            id: 'form_static',
            title: '表单',
            body: [
              {
                type: 'input-text',
                name: 'text',
                label: '输入框',
                mode: 'horizontal',
                value: 'text'
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
    expect(getByText('静态模式')).toBeInTheDocument();
  });

  fireEvent.click(getByText(/静态模式/));

  await waitFor(() => {
    expect(container.querySelector('.cxd-Form-static')).toBeInTheDocument();
    expect(
      container.querySelector('.cxd-TextControl-input')
    ).not.toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();

  await waitFor(() => {
    expect(getByText('编辑模式')).toBeInTheDocument();
  });

  fireEvent.click(getByText(/编辑模式/));

  await waitFor(() => {
    expect(
      container.querySelector('.cxd-TextControl-input')
    ).toBeInTheDocument();
    expect(container.querySelector('.cxd-Form-static')).not.toBeInTheDocument();
  });

  expect(container).toMatchSnapshot();
});
