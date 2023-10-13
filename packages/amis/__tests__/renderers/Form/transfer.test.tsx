/**
 * 组件名称：Transfer 穿梭器
 * 单测内容：
 * 1. 基础模式
 * 2. 树形模式
 * 3. 分组模式
 * 4. 表格模式
 * 5. 级联选择模式
 * 6. 关联选择模式
 * 7. 结果面板跟随模式
 * 8. 结果搜索功能
 * 9. 分组模式虚拟滚动
 * 10. 表格模式虚拟滚动
 * 11. 级联模式虚拟滚动
 * 12. 关联模式虚拟滚动
 */

import {fireEvent, render, waitFor, screen} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, formatStyleObject, wait} from '../../helper';

const setup = async (items: any = {}, formOptions: any = {}) => {
  const utils = render(
    amisRender(
      {
        type: 'form',
        api: '/api/mock2/form/saveForm',
        body: items,
        ...formOptions
      },
      {},
      makeEnv()
    )
  );

  return utils;
};

test('Renderer:transfer', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          api: '/api/mock2/form/saveForm',
          body: [
            {
              label: '默认',
              type: 'transfer',
              name: 'transfer',
              options: [
                {
                  label: '诸葛亮',
                  value: 'zhugeliang'
                },
                {
                  label: '曹操',
                  value: 'caocao'
                },
                {
                  label: '钟无艳',
                  value: 'zhongwuyan'
                },
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
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});

test('Renderer:transfer tree', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          api: '/api/mock2/form/saveForm',
          body: [
            {
              label: '树型展示',
              type: 'transfer',
              name: 'transfer4',
              selectMode: 'tree',
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
        }
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});

test('Renderer:transfer group options', async () => {
  const {container, findByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          api: '/api/mock2/form/saveForm',
          body: [
            {
              label: '分组',
              type: 'transfer',
              name: 'transfer',
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
        }
      },
      {},
      makeEnv({})
    )
  );

  await findByText('诸葛亮');

  // TODO: 莫名其妙 github 上运行就会报错
  // expect(container).toMatchSnapshot();
});

test('Renderer:transfer table', async () => {
  const {container, findByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          api: '/api/mock2/form/saveForm',
          body: [
            {
              label: '表格形式',
              type: 'transfer',
              name: 'transfer',
              selectMode: 'table',
              columns: [
                {
                  name: 'label',
                  label: '英雄'
                },
                {
                  name: 'position',
                  label: '位置'
                }
              ],
              options: [
                {
                  label: '诸葛亮',
                  value: 'zhugeliang',
                  position: '中单'
                },
                {
                  label: '曹操',
                  value: 'caocao',
                  position: '上单'
                },
                {
                  label: '钟无艳',
                  value: 'zhongwuyan',
                  position: '上单'
                },
                {
                  label: '李白',
                  value: 'libai',
                  position: '打野'
                },
                {
                  label: '韩信',
                  value: 'hanxin',
                  position: '打野'
                },
                {
                  label: '云中君',
                  value: 'yunzhongjun',
                  position: '打野'
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

  await findByText('诸葛亮');

  expect(container).toMatchSnapshot();
});

test('Renderer:transfer chained', async () => {
  const {container, findByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          api: '/api/mock2/form/saveForm',
          body: [
            {
              label: '级联选择',
              type: 'transfer',
              name: 'transfer5',
              selectMode: 'chained',
              searchable: true,
              sortable: true,
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
        }
      },
      {},
      makeEnv({})
    )
  );

  await findByText('法师');

  expect(container).toMatchSnapshot();
});

test('Renderer:transfer left tree', async () => {
  const {container, findByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          api: '/api/mock2/form/saveForm',
          body: [
            {
              label: '关联选择模式',
              type: 'transfer',
              name: 'b',
              sortable: true,
              searchable: true,
              deferApi: '/api/mock2/form/deferOptions?label=${label}',
              selectMode: 'associated',
              leftMode: 'tree',
              leftOptions: [
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
              ],
              options: [
                {
                  ref: 'zhugeliang',
                  children: [
                    {
                      label: 'A',
                      value: 'a'
                    }
                  ]
                },
                {
                  ref: 'caocao',
                  children: [
                    {
                      label: 'B',
                      value: 'b'
                    },
                    {
                      label: 'C',
                      value: 'c'
                    }
                  ]
                },
                {
                  ref: 'zhongwuyan',
                  children: [
                    {
                      label: 'D',
                      value: 'd'
                    },
                    {
                      label: 'E',
                      value: 'e'
                    }
                  ]
                },
                {
                  ref: 'libai',
                  defer: true
                },
                {
                  ref: 'hanxin',
                  defer: true
                },
                {
                  ref: 'yunzhongjun',
                  defer: true
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

  await findByText('诸葛亮');

  expect(container).toMatchSnapshot();
});

// 跟随模式
test('Renderer:transfer follow left mode', async () => {
  const {container, findByText} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/mock2/form/saveForm',
        body: [
          {
            label: '树型展示',
            type: 'transfer',
            name: 'transfer4',
            selectMode: 'tree',
            searchable: true,
            resultListModeFollowSelect: true,
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
      {},
      makeEnv({})
    )
  );

  const zhugeliang = await findByText('诸葛亮');
  fireEvent.click(zhugeliang);
  await wait(200);

  expect(container).toMatchSnapshot();
});

// 结果前端搜索
test('Renderer:transfer follow left mode', async () => {
  const {container, findByText} = render(
    amisRender(
      {
        type: 'form',
        api: '/api/mock2/form/saveForm',
        body: [
          {
            label: '树型展示',
            type: 'transfer',
            name: 'transfer4',
            selectMode: 'tree',
            searchable: true,
            resultListModeFollowSelect: true,
            resultSearchable: true,
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
      {},
      makeEnv({})
    )
  );

  const zhugeliang = await findByText('诸葛亮');
  fireEvent.click(zhugeliang);
  await wait(200);

  const caocao = await findByText('曹操');
  fireEvent.click(caocao);
  await wait(200);

  const input = container.querySelectorAll('input[type=text]')[1];

  expect(input).not.toBeNull();

  fireEvent.change(input, {
    target: {value: 'caocao'}
  });
  // 300 毫秒才行
  await wait(300);

  const dom = container.querySelector(
    '.cxd-ResultTreeList .cxd-Tree-item .cxd-Tree-itemText'
  );
  expect(dom).not.toBeNull();
  expect(dom?.getAttribute('title')).toEqual('战士');
  expect(container).toMatchSnapshot();
});

test('should call the custom filterOption if it is provided', async () => {
  const filterOption = jest.fn().mockImplementation(options => options);
  const options = [
    {
      label: '法师',
      children: [
        {
          label: '诸葛亮',
          value: 'zhugeliang',
          weapon: '翡翠仙扇'
        }
      ]
    }
  ];

  render(
    amisRender(
      {
        label: '树型展示',
        type: 'transfer',
        name: 'transfer4',
        selectMode: 'tree',
        searchable: true,
        filterOption: filterOption,
        options
      },
      {},
      makeEnv({})
    )
  );

  const input = screen.getByPlaceholderText('请输入关键字');

  fireEvent.change(input, {
    target: {value: '翡翠仙扇'}
  });

  await wait(300);

  expect(filterOption).toBeCalledTimes(1);
  expect(filterOption).toBeCalledWith(options, '翡翠仙扇', {
    keys: ['label', 'value']
  });
});

test('should call the string style custom filterOption if it is provided', async () => {
  const options = [
    {
      label: '法师',
      children: [
        {
          label: '诸葛亮',
          value: 'zhugeliang',
          weapon: '翡翠仙扇'
        }
      ]
    }
  ];

  render(
    amisRender(
      {
        label: '树型展示',
        type: 'transfer',
        name: 'transfer4',
        selectMode: 'tree',
        searchable: true,
        filterOption: 'return [];',
        options
      },
      {},
      makeEnv({})
    )
  );

  const input = screen.getByPlaceholderText('请输入关键字');

  expect(screen.getByText('诸葛亮')).toBeInTheDocument();
  fireEvent.change(input, {
    target: {value: '翡翠仙扇'}
  });

  await wait(300);

  expect(screen.queryByText('诸葛亮')).not.toBeInTheDocument();
});

test('should call the notify function with error message if the filterOption is not a valid function', async () => {
  const options = [
    {
      label: '法师',
      children: [
        {
          label: '诸葛亮',
          value: 'zhugeliang',
          weapon: '翡翠仙扇'
        }
      ]
    }
  ];

  const mockNotify = jest.fn().mockImplementation(options => options);

  render(
    amisRender(
      {
        label: '树型展示',
        type: 'transfer',
        name: 'transfer4',
        selectMode: 'tree',
        searchable: true,
        filterOption: 10086,
        options
      },
      {},
      {notify: mockNotify}
    )
  );

  const input = screen.getByPlaceholderText('请输入关键字');

  expect(screen.getByText('诸葛亮')).toBeInTheDocument();
  fireEvent.change(input, {
    target: {value: '翡翠仙扇'}
  });

  await wait(300);

  expect(mockNotify).toBeCalledTimes(1);
  expect(mockNotify).toBeCalledWith('error', '自定义检索函数不符合要求');

  mockNotify.mockClear();
});

test('Renderer:transfer group mode with virtual', async () => {
  const options = [...Array(20)].map((_, i) => ({
    label: `group-${i + 1}`,
    children: [...Array(10)].map((_, j) => ({
      label: `option-${i * 10 + j + 1}`,
      value: `value-${i * 10 + j + 1}`
    }))
  }));

  const {container, getByText, queryByText} = await setup([
    {
      label: '分组',
      type: 'transfer',
      name: 'transfer',
      options: options,
      virtualThreshold: 100,
      itemHeight: 40
    }
  ]);

  const optionsOrLabel = container.querySelectorAll(
    '.cxd-GroupedSelection.cxd-Transfer-selection > div > div > div > div.cxd-GroupedSelection-group'
  );

  expect(optionsOrLabel.length > 0).toBeTruthy();

  const firstStyle = formatStyleObject(optionsOrLabel[0].getAttribute('style'));
  expect(firstStyle.top).toBe(0);
  expect(firstStyle.height).toBe(40);
  await waitFor(() => expect(optionsOrLabel.length > 1).toBeTruthy());

  expect(formatStyleObject(optionsOrLabel[1].getAttribute('style')).top).toBe(
    40
  );

  expect(getByText('option-1')).toBeInTheDocument();
  expect(await queryByText('option-100')).toBeNull();

  const scrollContainer = container.querySelector(
    '.cxd-GroupedSelection.cxd-Transfer-selection > div > div'
  )!;

  // 滚动到底部
  fireEvent.scroll(scrollContainer, {
    target: {
      scrollTop: 9999
    }
  });

  await wait(300);

  // 最后一项
  const lastOne = container.querySelector(
    '.cxd-GroupedSelection.cxd-Transfer-selection > div > div > div > div.cxd-GroupedSelection-group:last-of-type'
  );

  expect(formatStyleObject(lastOne!.getAttribute('style')).top).toBe(8760);
  expect(await queryByText('option-1')).toBeNull();

  expect(container).toMatchSnapshot();
});

test('Renderer:transfer table mode with virtual', async () => {
  const options = [...Array(200)].map((_, i) => ({
    label: `label-${i + 1}`,
    value: i + 1
  }));

  const value = [...Array(10)].map((_, i) => i * 2 + 1).join(',');

  const {container, getByText} = await setup([
    {
      label: '分组',
      type: 'transfer',
      name: 'transfer',
      options: options,
      value: value,
      virtualThreshold: 10,
      selectMode: 'table',
      columns: [
        {
          name: 'label',
          label: '名称'
        },
        {
          name: 'value',
          label: '值'
        }
      ]
    }
  ]);

  const virtualTable = container.querySelector(
    '.cxd-Transfer-select .cxd-Table-content.is-virtual .cxd-Table-content-virtual table.cxd-Table-table'
  )!;

  expect(virtualTable).toBeInTheDocument();

  const resultList = container.querySelector(
    '.cxd-Transfer-result .cxd-Selections.cxd-Transfer-value .cxd-Selections-items'
  )!;

  expect(resultList.firstChild).toHaveClass('cxd-Selections-item');
  expect(container).toMatchSnapshot('result not virtual');

  // 点击后，value 变为 11 项，右侧列表变成虚拟列表
  fireEvent.click(getByText('label-2'));

  await wait(300);

  const firstVirtualItem = resultList.querySelector(
    'div > div:first-of-type > div > .cxd-Selections-item'
  );

  expect(firstVirtualItem).toBeInTheDocument();
  expect(formatStyleObject(firstVirtualItem!.getAttribute('style'))!.top).toBe(
    0
  );
  expect(container).toMatchSnapshot('result virtual');
});

test('Renderer:transfer chained mode with virtual', async () => {
  const options = [...Array(10)].map((_, i) => ({
    label: `group-${i + 1}`,
    children: [...Array(200)].map((_, j) => ({
      label: `group-${i + 1}-option-${j + 1}`,
      value: `${i + 1}-${j + 1}`
    }))
  }));

  const {container, getByText, queryByText} = await setup([
    {
      label: '分组',
      type: 'transfer',
      name: 'transfer',
      options: options,
      virtualThreshold: 100,
      selectMode: 'chained'
    }
  ]);

  const cols = container.querySelectorAll('.cxd-ChainedSelection-col');

  expect(cols.length).toBe(2);
  expect(cols[0].children.length).toBe(10);
  expect(cols[1].firstChild).toHaveClass('cxd-ChainedSelection-placeholder');

  fireEvent.click(getByText('group-2'));

  await wait(300);

  expect(cols[1].firstChild).not.toHaveClass(
    'cxd-ChainedSelection-placeholder'
  );

  expect(getByText('group-2-option-1')).toBeInTheDocument();
  expect(await queryByText('group-2-option-200')).toBeNull();

  expect(container).toMatchSnapshot();
});

test('Renderer:transfer associated mode with virtual', async () => {
  const options = [...Array(200)].map((_, i) => ({
    label: `label-${i + 1}`,
    value: i + 1
  }));

  const {container, getByText, queryByText} = await setup([
    {
      label: '关联选择模式',
      type: 'transfer',
      name: 'b',
      sortable: true,
      searchable: true,
      selectMode: 'associated',
      leftMode: 'tree',
      leftOptions: [
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
              label: '钟无艳',
              value: 'zhongwuyan'
            }
          ]
        }
      ],
      options: [
        {
          ref: 'zhugeliang',
          children: [
            {
              label: 'A',
              value: 'a'
            }
          ]
        },
        {
          ref: 'caocao',
          children: [
            {
              label: 'B',
              value: 'b'
            },
            {
              label: 'C',
              value: 'c'
            }
          ]
        },
        {
          ref: 'zhongwuyan',
          children: options
        }
      ]
    }
  ]);

  const rightCol = container.querySelector('.cxd-AssociatedSelection-right');

  expect(rightCol).toBeInTheDocument();

  fireEvent.click(getByText('诸葛亮'));

  await wait(200);

  expect(
    rightCol!.querySelector(
      '.cxd-GroupedSelection .cxd-GroupedSelection-item .cxd-GroupedSelection-itemLabel span'
    )!.innerHTML
  ).toBe('A');

  fireEvent.click(getByText('钟无艳'));
  await wait(200);

  expect(
    rightCol!.querySelectorAll('.cxd-GroupedSelection-item').length < 200
  ).toBeTruthy();

  expect(getByText('label-1')).toBeInTheDocument();
  expect(await queryByText('label-100')).toBeNull();
  expect(container).toMatchSnapshot();
});

test('Renderer:transfer with showInvalidMatch & unmatched do not add', async () => {
  const schema = {
    label: '默认',
    type: 'transfer',
    name: 'transfer',
    value: 'v,w,x,y,z',
    selectMode: 'tree',
    options: [
      {
        label: '诸葛亮',
        value: 'zhugeliang'
      },
      {
        label: '曹操',
        value: 'caocao'
      },
      {
        label: '钟无艳',
        value: 'zhongwuyan'
      }
    ]
  };

  const {container, getByText, queryByText, rerender} = await setup({
    ...schema,
    deferApi: 'xxx'
  });

  function leftItems() {
    return container.querySelectorAll('.cxd-Transfer-select .cxd-Tree-item');
  }

  function rightItems() {
    return container.querySelectorAll(
      '.cxd-Transfer-result .cxd-Selections-item'
    );
  }

  expect(leftItems()!.length).toBe(3);
  expect(rightItems()!.length).toBe(5);

  expect(
    rightItems()[0]!.querySelector('.cxd-Selections-label')!
  ).not.toHaveClass('is-invalid');
  fireEvent.click(rightItems()[0]!.querySelector('.cxd-Selections-delBtn')!);

  await wait(500);

  expect(leftItems()!.length).toBe(3);
  expect(rightItems()!.length).toBe(4);

  rerender(amisRender({...schema, showInvalidMatch: true}));

  await wait(500);
  expect(rightItems()[0]!.querySelector('.cxd-Selections-label')!).toHaveClass(
    'is-invalid'
  );
  fireEvent.click(rightItems()[0]!.querySelector('.cxd-Selections-delBtn')!);

  await wait(500);

  expect(container).toMatchSnapshot();

  expect(leftItems()!.length).toBe(3);
  expect(rightItems()!.length).toBe(4);
});

test('Renderer:transfer with searchApi', async () => {
  const onSubmit = jest.fn();
  const fetcher = jest.fn().mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          options: [
            {
              "label": "法师",
              "children": [
                {
                  "label": "诸葛亮",
                  "value": "zhugeliang"
                }
              ]
            },
            {
              "label": "战士",
              "children": [
                {
                  "label": "钟无艳",
                  "value": "zhongwuyan"
                }
              ]
            }
          ]
        }
      }
    })
  );
  const {getByText, container} = render(
    amisRender(
      {
        "type": "form",
        "api": "/api/mock2/form/saveForm",
        "body": [
          {
            "label": "树型展示",
            "type": "transfer",
            "name": "transfer",
            "selectMode": "tree",
            "searchable": true,
            "searchApi": "/api/transfer/search?name=${term}",
            "options": [
              {
                "label": "法师",
                "children": [
                  {
                    "label": "诸葛亮",
                    "value": "zhugeliang"
                  }
                ]
              },
              {
                "label": "战士",
                "value": "zhanshi",
                "children": [
                  {
                    "label": "曹操",
                    "value": "caocao"
                  },
                  {
                    "label": "钟无艳",
                    "value": "zhongwuyan"
                  }
                ]
              },
              {
                "label": "打野",
                "children": [
                  {
                    "label": "李白",
                    "value": "libai"
                  },
                  {
                    "label": "韩信",
                    "value": "hanxin"
                  },
                  {
                    "label": "云中君",
                    "value": "yunzhongjun"
                  }
                ]
              }
            ]
          }
        ]
      },
      {onSubmit},
      makeEnv({
        fetcher
      })
    )
  );

  const zhangshi = container.querySelector('span[title=战士]');
  expect(zhangshi).not.toBeNull();

  zhangshi && fireEvent.click(zhangshi);

  fireEvent.click(getByText('提交'));

  await wait(100);
  expect(onSubmit).toBeCalledTimes(1);

  expect(onSubmit.mock.calls[0][0]).toEqual({
    transfer: "caocao,zhongwuyan"
  });

  const input = container.querySelector('input[placeholder=请输入关键字]');
  expect(input).not.toBeNull();

  input && fireEvent.change(input, {
    target: {value: 'a'}
  });

  await wait(300);

  const caocao = container.querySelector('span[title=李白]');
  expect(caocao).toBeNull();
});

test('Renderer:transfer tree onlyChildren true', async () => {
  const onSubmit = jest.fn();
  const schema = {
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "debug": true,
    "body": [
      {
        "label": "默认",
        "type": "transfer",
        "name": "transfer",
        "value": "libai",
        "selectMode": "tree",
        "searchable": true,
        "onlyChildren": true,
        "options": [
          {
            "label": "法师",
            "children": [
              {
                "label": "诸葛亮",
                "value": "zhugeliang"
              }
            ]
          },
          {
            "label": "战士",
            "value": "战士",
            "children": [
              {
                "label": "曹操",
                "disabled": true,
                "value": "caocao"
              },
              {
                "label": "钟无艳",
                "value": "zhongwuyan"
              }
            ]
          },
          {
            "label": "打野",
            "children": [
              {
                "label": "李白",
                "value": "libai"
              },
              {
                "label": "韩信",
                "value": "hanxin"
              },
              {
                "label": "云中君",
                "value": "yunzhongjun"
              }
            ]
          }
        ]
      }
    ]
  };

  const {getByText, container} = render(
    amisRender(schema, {onSubmit}, makeEnv({}))
  );

  const checkbox = container.querySelector('.cxd-Checkbox');
  expect(checkbox).not.toBeNull();

  checkbox && fireEvent.click(checkbox);

  fireEvent.click(getByText('提交'));

  await wait(100);
  expect(onSubmit).toBeCalledTimes(1);

  expect(onSubmit.mock.calls[0][0]).toEqual({
    transfer: "zhugeliang,zhongwuyan,libai,hanxin,yunzhongjun"
  });
});

test('Renderer:transfer search highlight', async () => {

  const onSubmit = jest.fn();
  const {container} = render(
    amisRender(
      {
        "type": "form",
        "api": "/api/mock2/form/saveForm",
        "body": [
          {
            "label": "默认",
            "type": "transfer",
            "name": "transfer",
            "selectMode": "tree",
            "searchable": true,
            "options": [
              {
                "label": "法师",
                "children": [
                  {
                    "label": "诸葛亮",
                    "value": "zhugeliang"
                  }
                ]
              },
              {
                "label": "战士",
                "children": [
                  {
                    "label": "曹操",
                    "disabled": true,
                    "value": "caocao"
                  },
                  {
                    "label": "钟无艳",
                    "value": "zhongwuyan"
                  }
                ]
              },
              {
                "label": "打野",
                "children": [
                  {
                    "label": "李白",
                    "value": "libai"
                  },
                  {
                    "label": "韩信",
                    "value": "hanxin"
                  },
                  {
                    "label": "云中君",
                    "value": "yunzhongjun"
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
  )

  const input = container.querySelectorAll('input[type=text]')[0];

  expect(input).not.toBeNull();

  fireEvent.change(input, {
    target: {value: '战士'}
  });

  await wait(500);

  const isMatchDom = container.querySelector('.is-matched');
  expect(isMatchDom).not.toBeNull();
});

test('Renderer:transfer tree search', async () => {

  const onSubmit = jest.fn();
  const {container, findByText, getByText} = render(
    amisRender(
      {
        "type": "form",
        "api": "/api/mock2/form/saveForm",
        "body": [
          {
            "label": "默认",
            "type": "transfer",
            "name": "transfer",
            "selectMode": "tree",
            "searchable": true,
            "options": [
              {
                "label": "法师",
                "children": [
                  {
                    "label": "诸葛亮",
                    "value": "zhugeliang"
                  }
                ]
              },
              {
                "label": "战士",
                "children": [
                  {
                    "label": "曹操",
                    "value": "caocao"
                  },
                  {
                    "label": "钟无艳",
                    "value": "zhongwuyan"
                  }
                ]
              },
              {
                "label": "打野",
                "children": [
                  {
                    "label": "李白",
                    "value": "libai"
                  },
                  {
                    "label": "韩信",
                    "value": "hanxin"
                  },
                  {
                    "label": "云中君",
                    "value": "yunzhongjun"
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
  )

  const input = container.querySelectorAll('input[type=text]')[0];

  expect(input).not.toBeNull();

  fireEvent.change(input, {
    target: {
      value: '战士'
    }
  });

  await(300);

  const caocao = getByText('曹操');
  expect(caocao).not.toBeNull();
  fireEvent.click(caocao);

  fireEvent.change(input, {
    target: {
      value: ''
    }
  });

  await(300);

  fireEvent.change(input, {
    target: {
      value: '打野'
    }
  });

  await(300);
  
  const libai = getByText('李白');
  expect(libai).not.toBeNull();
  fireEvent.click(libai);

  await wait(500);

  fireEvent.click(getByText('提交'));

  await wait(300);
  expect(onSubmit).toBeCalledTimes(1);

  expect(onSubmit.mock.calls[0][0]).toEqual({
    transfer: "caocao,libai"
  });
});