import {
  act,
  cleanup,
  fireEvent,
  render,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import {clearStoresCache, render as amisRender} from '../../src';
import {makeEnv, wait} from '../helper';

afterEach(() => {
  cleanup();
  clearStoresCache();
  jest.useRealTimers();
});

test('Tree: basic & disabled children & default check children', () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          api: '/api/mock2/form/saveForm',
          body: [
            {
              type: 'input-tree',
              name: 'tree',
              label: 'Tree',
              options: [
                {
                  label: 'Folder A',
                  value: 1,
                  children: [
                    {
                      label: 'file A',
                      value: 2
                    },
                    {
                      label: 'Folder B',
                      value: 3,
                      children: [
                        {
                          label: 'file b1',
                          value: 3.1
                        },
                        {
                          label: 'file b2',
                          value: 3.2
                        }
                      ]
                    }
                  ]
                },
                {
                  label: 'file C',
                  value: 4
                },
                {
                  label: 'file D',
                  value: 5
                }
              ]
            }
          ]
        }
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});

test('Tree: showOutline', () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          api: '/api/mock2/form/saveForm',
          body: [
            {
              type: 'input-tree',
              name: 'tree',
              label: 'Tree',
              showOutline: true,
              options: [
                {
                  label: 'Folder A',
                  value: 1,
                  children: [
                    {
                      label: 'file A',
                      value: 2
                    },
                    {
                      label: 'Folder B',
                      value: 3,
                      children: [
                        {
                          label: 'file b1',
                          value: 3.1
                        },
                        {
                          label: 'file b2',
                          value: 3.2
                        }
                      ]
                    }
                  ]
                },
                {
                  label: 'file C',
                  value: 4
                },
                {
                  label: 'file D',
                  value: 5
                }
              ]
            }
          ]
        }
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});

test('Tree: autoCheckChildren = false', async () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          api: '/api/mock2/form/saveForm',
          body: [
            {
              type: 'input-tree',
              name: 'tree',
              label: 'Tree',
              autoCheckChildren: false,
              multiple: true,
              options: [
                {
                  label: 'Folder A',
                  value: 1,
                  children: [
                    {
                      label: 'file A',
                      value: 2
                    },
                    {
                      label: 'Folder B',
                      value: 3,
                      children: [
                        {
                          label: 'file b1',
                          value: 3.1
                        },
                        {
                          label: 'file b2',
                          value: 3.2
                        }
                      ]
                    }
                  ]
                },
                {
                  label: 'file C',
                  value: 4
                },
                {
                  label: 'file D',
                  value: 5
                }
              ]
            }
          ]
        }
      },
      {},
      makeEnv({})
    )
  );

  fireEvent.click(getByText('Folder B'));

  await waitFor(() => container.querySelector('.is-checked'));

  expect(container.querySelectorAll('.is-checked').length).toBe(1);
});

test('Tree: cascade = true', () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'input-tree',
        name: 'tree2',
        label: '子节点可以反选，值包含父子节点值',
        multiple: true,
        cascade: true,
        options: [
          {
            label: 'A',
            value: 'a'
          },
          {
            label: 'B',
            value: 'b',
            children: [
              {
                label: 'B-1',
                value: 'b-1'
              },
              {
                label: 'B-2',
                value: 'b-2'
              },
              {
                label: 'B-3',
                value: 'b-3'
              }
            ]
          },
          {
            label: 'C',
            value: 'c'
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  fireEvent.click(getByText('B'));

  expect(container.querySelectorAll('.is-checked').length).toBe(4);
});

test('Tree source', async () => {
  const fetcher = jest.fn().mockImplementation(() => {
    return Promise.resolve({
      status: 0,
      msg: 'ok',
      data: {
        options: [
          {label: 'Option A', value: 'a'},
          {label: 'Option B', value: 'b'},
          {label: 'Option C', value: 'c'},
          {label: 'Option D', value: 'd'},
          {label: 'Option E', value: 'e'},
          {label: 'Option F', value: 'f'},
          {label: 'Option G', value: 'g'},
          {label: 'Option H', value: 'h'},
          {label: 'Option I', value: 'i'},
          {label: 'Option J', value: 'j'},
          {label: 'Option K', value: 'k'},
          {label: 'Option L', value: 'l'},
          {label: 'Option M', value: 'm'},
          {label: 'Option N', value: 'n'},
          {label: 'Option O', value: 'o'},
          {label: 'Option P', value: 'p'},
          {label: 'Option Q', value: 'q'}
        ]
      }
    });
  });

  const {getByText} = render(
    amisRender(
      {
        type: 'input-tree',
        name: 'tree',
        label: 'Tree',
        source: '/api'
      },
      {},
      makeEnv({fetcher})
    )
  );

  await waitFor(() => getByText('Option A'));
});

test('Tree defer load data', async () => {
  const fetcher = jest.fn().mockImplementation(option => {
    return Promise.resolve({
      status: 0,
      msg: 'ok',
      data: {
        options: [
          {label: 'Option A', value: 'a'},
          {label: 'Option B', value: 'b'},
          {label: 'Option C', value: 'c'}
        ]
      }
    });
  });

  const {container, getByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          api: '/api/mock2/form/saveForm',
          body: [
            {
              type: 'input-tree',
              name: 'tree',
              label: 'Tree',
              deferApi: '/api/mock2/form/deferOptions?label=${label}',
              options: [
                {
                  label: 'lazy1',
                  value: 4,
                  defer: true
                },
                {
                  label: 'lazy2',
                  value: 5,
                  defer: true
                }
              ]
            }
          ]
        }
      },
      {},
      makeEnv({fetcher})
    )
  );

  // 展开第一个节点
  fireEvent.click(container.querySelectorAll('.cxd-Tree-itemArrow')[0]);
  await waitFor(() =>
    expect(
      container
        .querySelectorAll('.cxd-Tree-itemArrow')[0]
        .classList.contains('is-folded')
    ).toBeFalsy()
  );
  // 收起第一个节点
  fireEvent.click(container.querySelectorAll('.cxd-Tree-itemArrow')[0]);
  await waitFor(() =>
    expect(
      container
        .querySelectorAll('.cxd-Tree-itemArrow')[0]
        .classList.contains('is-folded')
    ).toBeTruthy()
  );

  // 展开第二个节点
  fireEvent.click(container.querySelectorAll('.cxd-Tree-itemArrow')[1]);
  await waitFor(() =>
    expect(
      container
        .querySelectorAll('.cxd-Tree-itemArrow')[1]
        .classList.contains('is-folded')
    ).toBeFalsy()
  );

  // 检查节点 1 是收起的
  expect(container.querySelectorAll('.cxd-Tree-itemArrow')[0]).toHaveClass(
    'is-folded'
  );
});

test('Tree: add child & cancel', async () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/mock2/form/saveForm',
        body: [
          {
            type: 'input-tree',
            name: 'tree',
            label: 'Tree',
            creatable: true,
            removable: true,
            editable: true,
            options: [
              {
                label: 'Folder A',
                value: 1,
                children: [
                  {
                    label: 'file A',
                    value: 2
                  },
                  {
                    label: 'file B',
                    value: 3
                  }
                ]
              },
              {
                label: 'file C',
                value: 4
              },
              {
                label: 'file D',
                value: 5
              }
            ]
          }
        ]
      },
      {},
      makeEnv({})
    )
  );
  const targetNode = container.querySelector('.cxd-Tree-addTopBtn')!;

  fireEvent.click(targetNode);
  await waitFor(() => container.querySelector('input'));
  fireEvent.click(container.querySelector('[icon="close"]')!);
  await waitFor(() =>
    expect(!!container.querySelector('[icon="close"]')).toBeFalsy()
  );
});

test('Tree: item disabled', async () => {
  const onSubmit = jest.fn();
  const {container, findByText, findByPlaceholderText} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/mock2/form/saveForm',
        body: [
          {
            label: '树型展示',
            type: 'transfer',
            name: 'transfer',
            selectMode: 'tree',
            searchable: true,
            options: [
              {
                label: '法师',
                children: [
                  {
                    label: '诸葛亮',
                    value: 'zhugeliang'
                  }
                ]
              },
              {
                label: '战士',
                children: [
                  {
                    label: '曹操',
                    value: 'caocao'
                  },
                  {
                    label: '曹操1',
                    value: 'caocao1',
                    children: [
                      {
                        label: '李白1',
                        value: 'libai1'
                      },
                      {
                        label: '韩信1',
                        value: 'hanxin1'
                      },
                      {
                        label: '云中君1',
                        value: 'yunzhongjun1'
                      }
                    ]
                  },
                  {
                    disabled: true,
                    label: '钟无艳',
                    value: 'zhongwuyan'
                  }
                ]
              },
              {
                label: '打野',
                children: [
                  {
                    label: '李白',
                    value: 'libai'
                  },
                  {
                    label: '韩信',
                    value: 'hanxin'
                  },
                  {
                    label: '云中君',
                    value: 'yunzhongjun'
                  }
                ]
              }
            ]
          }
        ]
      },
      {onSubmit},
      makeEnv({})
    )
  );
  const node = await findByText('战士');
  const submitBtn = await findByText('提交');
  fireEvent.click(node);
  fireEvent.click(submitBtn);

  await wait(100);

  expect(onSubmit.mock.calls[0][0]).toEqual({
    transfer: 'caocao,libai1,hanxin1,yunzhongjun1'
  });

  fireEvent.click(node);
  fireEvent.click(submitBtn);
  await wait(100);
  expect(onSubmit.mock.calls[1][0]).toEqual({
    transfer: ''
  });
});

test('Tree: single value mode should not render input when searchable enabled and default value settled', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'container',
        body: [
          {
            type: 'tree-select',
            name: 'tree',
            label: 'Tree',
            searchable: true,
            value: 2,
            inputClassName: 'single',
            options: [
              {
                label: 'Folder A',
                value: 1,
                children: [
                  {
                    label: 'file A',
                    value: 2
                  },
                  {
                    label: 'file B',
                    value: 3
                  }
                ]
              }
            ]
          },
          {
            type: 'tree-select',
            name: 'tree2',
            label: 'Tree2',
            searchable: true,
            value: '2,4',
            multiple: true,
            inputClassName: 'multiple',
            options: [
              {
                label: 'Folder A',
                value: 1,
                children: [
                  {
                    label: 'file A',
                    value: 2
                  },
                  {
                    label: 'file B',
                    value: 3
                  }
                ]
              },
              {
                label: 'file C',
                value: 4
              }
            ]
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  const singleModeInput = container.querySelector(
    '.single .cxd-ResultBox-value-input'
  );
  const multipleModeInput = container.querySelector(
    '.multiple .cxd-ResultBox-value-input'
  );

  /** 单选模式且已选值，不应该再有 input */
  expect(singleModeInput).not.toBeInTheDocument();
  /** 多选模式始终都有 input */
  expect(multipleModeInput).toBeInTheDocument();
});

test('Tree: autoCancelParent = true', async () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          api: '/api/mock2/form/saveForm',
          body: [
            {
              type: 'input-tree',
              name: 'tree',
              label: 'Tree',
              cascade: true,
              multiple: true,
              autoCancelParent: true,
              options: [
                {
                  label: 'Folder A',
                  value: 1,
                  children: [
                    {
                      label: 'file A',
                      value: 2
                    },
                    {
                      label: 'Folder B',
                      value: 3,
                      children: [
                        {
                          label: 'file b1',
                          value: 3.1
                        },
                        {
                          label: 'file b2',
                          value: 3.2
                        }
                      ]
                    }
                  ]
                },
                {
                  label: 'file C',
                  value: 4
                },
                {
                  label: 'file D',
                  value: 5
                }
              ]
            }
          ]
        }
      },
      {},
      makeEnv({})
    )
  );

  fireEvent.click(getByText('Folder A'));

  await waitFor(() => container.querySelector('.is-checked'));

  expect(container.querySelectorAll('.is-checked').length).toBe(5);

  fireEvent.click(getByText('file b1'));

  await waitFor(() => container.querySelector('.is-checked'));

  expect(container.querySelectorAll('.is-checked').length).toBe(2);
});

test('Tree: nodeBehavior-check', async () => {
  const {container, getByText} = render(
    amisRender({
      type: 'page',
      body: {
        type: 'form',
        api: '/api/mock2/form/saveForm',
        body: [
          {
            type: 'input-tree',
            name: 'tree',
            label: 'Tree',
            options: [
              {
                label: 'Folder A',
                value: 1,
                children: [
                  {
                    label: 'file A',
                    value: 2
                  }
                ]
              },
              {
                label: 'file C',
                value: 3
              }
            ]
          }
        ]
      }
    })
  );

  fireEvent.click(getByText('Folder A'));

  await waitFor(() => container.querySelector('.is-checked'));

  expect(container.querySelector('.is-checked')!.textContent).toBe('Folder A');
});

test('Tree: nodeBehavior-unfold', async () => {
  const {container, getByText} = render(
    amisRender({
      type: 'page',
      body: {
        type: 'form',
        api: '/api/mock2/form/saveForm',
        body: [
          {
            type: 'input-tree',
            name: 'tree',
            label: 'Tree',
            nodeBehavior: ['unfold'],
            options: [
              {
                label: 'Folder A',
                value: 1,
                collapsed: true,
                children: [
                  {
                    label: 'file A',
                    value: 2
                  }
                ]
              },
              {
                label: 'file C',
                value: 3
              }
            ]
          }
        ]
      }
    })
  );

  fireEvent.click(getByText('Folder A'));

  await waitFor(() => container.querySelector('.is-child'));

  expect(container.querySelector('.is-child')!.textContent).toBe('file A');
});

test('Tree: nodeBehavior-check+unfold', async () => {
  const {container, getByText} = render(
    amisRender({
      type: 'page',
      body: {
        type: 'form',
        api: '/api/mock2/form/saveForm',
        body: [
          {
            type: 'input-tree',
            name: 'tree',
            label: 'Tree',
            nodeBehavior: ['unfold', 'check'],
            options: [
              {
                label: 'Folder A',
                value: 1,
                collapsed: true,
                children: [
                  {
                    label: 'file A',
                    value: 2
                  }
                ]
              },
              {
                label: 'file C',
                value: 3
              }
            ]
          }
        ]
      }
    })
  );

  fireEvent.click(getByText('Folder A'));

  await waitFor(() => container.querySelector('.is-child'));

  expect(container.querySelector('.is-child')!.textContent).toBe('file A');

  await waitFor(() => container.querySelector('.is-checked'));

  expect(container.querySelector('.is-checked')!.textContent).toBe('Folder A');
});
