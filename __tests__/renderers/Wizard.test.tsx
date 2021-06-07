import React = require('react');
import * as renderer from 'react-test-renderer';
import {render, fireEvent, cleanup} from '@testing-library/react';
import '../../src/themes/default';
import {render as amisRender} from '../../src/index';
import {wait, makeEnv} from '../helper';
import {clearStoresCache} from '../../src/factory';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

test('Renderer:Wizard', () => {
  const component = renderer.create(
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
      makeEnv()
    )
  );
  let tree = component.toJSON();

  expect(tree).toMatchSnapshot();
});

test('Renderer:Wizard readOnly', () => {
  const component = renderer.create(
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
  let tree = component.toJSON();

  expect(tree).toMatchSnapshot();
});

test('Renderer:Wizard initApi', async () => {
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

  const component = renderer.create(
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

  await wait(500);
  expect(component.toJSON()).toMatchSnapshot();
  expect(fetcher).toHaveBeenCalled();
});

test('Renderer:Wizard initApi show loading', async () => {
  let done: Function;
  let wating = new Promise(resolve => {
    done = resolve;
  });

  const fetcher = jest.fn().mockImplementationOnce(() => {
    return new Promise(async resolve => {
      await wait(100, () => expect(component.toJSON()).toMatchSnapshot());
      await wait(100, () =>
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
      await wait(100, done);
    });
  });
  const component = renderer.create(
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

  await wating;
  let tree = component.toJSON();

  expect(tree).toMatchSnapshot();
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

  renderer.create(
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

  await wait(500);
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

  renderer.create(
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

  await wait(500);
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

  renderer.create(
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

  await wait(500);
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

  renderer.create(
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

  await wait(500);
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

  await wait(1000);
  fireEvent.click(getByText(/NextStep/));
  await wait(1000);
  fireEvent.click(getByText(/Submit/));
  await wait(1000);
  expect(container).toMatchSnapshot();
  expect(fetcher).toHaveBeenCalled();

  fireEvent.click(getByText(/PrevStep/));
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

  await wait(1000);
  fireEvent.click(getByText(/saveAndNext/));
  await wait(1000);
  expect(fetcher).toHaveBeenCalled();
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

  await wait(1000);
  fireEvent.click(getByText(/下一步/));
  await wait(1000);
  fireEvent.click(getByText(/完成/));
  await wait(1000);
  expect(fetcher).toHaveBeenCalled();
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

  expect(fetcher).not.toHaveBeenCalled();
  fireEvent.click(getByText(/下一步/));
  await wait(1000);
  expect(fetcher).toHaveBeenCalled();
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

  expect(fetcher).not.toHaveBeenCalled();
  fireEvent.click(getByText(/下一步/));
  await wait(1000);
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

  expect(fetcher).not.toHaveBeenCalled();
  fireEvent.click(getByText(/下一步/));
  await wait(1000);
  expect(fetcher).not.toHaveBeenCalled();
});

test('Renderer:Wizard step initFetch:true', async () => {
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

  expect(fetcher).not.toHaveBeenCalled();
  fireEvent.click(getByText(/下一步/));
  await wait(1000);
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

  expect(fetcher).not.toHaveBeenCalled();
  fireEvent.click(getByText(/下一步/));
  await wait(1000);
  expect(fetcher).not.toHaveBeenCalled();
});

test('Renderer:Wizard step initFetchOn:true', async () => {
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

  expect(fetcher).not.toHaveBeenCalled();
  fireEvent.click(getByText(/下一步/));
  await wait(1000);
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

  fireEvent.click(getByText(/下一步/));
  await wait(1000);
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

  await wait(500);
  expect(container).toMatchSnapshot();
  fireEvent.click(getByText(/下一步/));
  await wait(500);
  expect(container).toMatchSnapshot();
  fireEvent.click(getByText(/完成/));
  await wait(1000);
  expect(fetcher).toHaveBeenCalledTimes(3);
  expect(container).toMatchSnapshot();
});

test('Renderer:Wizard steps not array', () => {
  const component = renderer.create(
    amisRender({
      type: 'wizard',
      api: '/api/mock2/form/saveForm?waitSeconds=2',
      steps: ''
    })
  );
  let tree = component.toJSON();

  expect(tree).toMatchSnapshot();
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

  await wait(1000);
  fireEvent.click(getByText(/下一步/));
  await wait(1000);
  fireEvent.click(getByText(/完成/));
  await wait(1000);
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

  fireEvent.click(getByText(/OpenDialog/));
  expect(container).toMatchSnapshot();

  fireEvent.click(getByText(/取消/));
  await wait(1000);
  expect(container).toMatchSnapshot();
});
