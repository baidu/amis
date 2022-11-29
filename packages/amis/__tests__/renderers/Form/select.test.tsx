/**
 * 组件名称：Select 选择器
 * 单测内容：
 * 1. menutpl 选项自定义
 * 2. 分组模式
 * 3. 表格模式
 * 4. 表格模式下自定义 labelField 与 valueField
 * 5. 树形模式
 * 6. 级联模式
 * 7. 级联模式下搜索 searchable
 * 8. 关联模式
 * 9. 基础模式下虚拟列表
 * 10. 分组模式下虚拟列表
 * 11. 表格模式下虚拟列表
 * 12. 级联模式下虚拟列表
 * 13. 关联模式下虚拟列表
 */

import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';

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

  const select = utils.container.querySelector(
    '.cxd-SelectControl .cxd-TransferDropDown'
  );

  expect(select).toBeInTheDocument();

  return {
    ...utils,
    select
  };
};

test('Renderer:select menutpl', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          body: [
            {
              label: '选项',
              type: 'select',
              name: 'select',
              menuTpl:
                '<div>${label} 值：${value}, 当前是否选中: ${checked}</div>',
              options: [
                {
                  label: 'A',
                  value: 'a'
                },
                {
                  label: 'B',
                  value: 'b'
                },
                {
                  label: 'C',
                  value: 'c'
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

test('Renderer:select group', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          api: '/api/mock2/form/saveForm',
          body: [
            {
              label: '分组',
              type: 'select',
              name: 'a',
              selectMode: 'group',
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

test('Renderer:select table', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          api: '/api/mock2/form/saveForm',
          body: [
            {
              label: '表格形式',
              type: 'select',
              name: 'a',
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

  expect(container).toMatchSnapshot();
});

test('Renderer:select table with labelField & valueField', async () => {
  const onSubmit = jest.fn();
  const {debug, container, findByText, getByText} = render(
    amisRender(
      {
        type: 'form',
        submitText: 'Submit',
        body: [
          {
            label: '表格形式',
            type: 'select',
            name: 'a',
            selectMode: 'table',
            multiple: true,
            labelField: 'text',
            valueField: 'val',
            columns: [
              {
                name: 'text',
                label: '英雄'
              },
              {
                name: 'position',
                label: '位置'
              }
            ],
            options: [
              {
                text: '诸葛亮',
                val: 'zhugeliang',
                position: '中单'
              },
              {
                text: '曹操',
                val: 'caocao',
                position: '上单'
              },
              {
                text: '钟无艳',
                val: 'zhongwuyan',
                position: '上单'
              },
              {
                text: '李白',
                val: 'libai',
                position: '打野'
              },
              {
                text: '韩信',
                val: 'hanxin',
                position: '打野'
              },
              {
                text: '云中君',
                val: 'yunzhongjun',
                position: '打野'
              }
            ]
          }
        ]
      },
      {
        onSubmit
      },
      makeEnv({})
    )
  );

  fireEvent.click(await findByText('请选择'));

  await waitFor(() => {
    expect(
      container.querySelector('.cxd-TransferDropDown-popover')
    ).toBeInTheDocument();
  });

  fireEvent.click(await findByText('诸葛亮'));
  await wait(500);
  fireEvent.click(await findByText('李白'));
  await wait(500);
  expect(container).toMatchSnapshot();

  fireEvent.click(await findByText('Submit'));
  await wait(200);
  expect(onSubmit).toBeCalled();
  expect(onSubmit.mock.calls[0][0]).toMatchSnapshot();
});

test('Renderer:select tree', () => {
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
              type: 'select',
              name: 'a',
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

test('Renderer:select chained', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          api: '/api/mock2/form/saveForm',
          body: [
            {
              label: '级联选择',
              type: 'select',
              name: 'a',
              selectMode: 'chained',
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

test('Renderer: chained select', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          api: '/api/mock2/form/saveForm',
          body: [
            {
              label: '带搜索',
              type: 'select',
              name: 'a',
              selectMode: 'chained',
              searchable: true,
              sortable: true,
              multiple: true,
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

test('Renderer:select associated', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          api: '/api/mock2/form/saveForm',
          body: [
            {
              label: '关联选择模式',
              type: 'select',
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

  expect(container).toMatchSnapshot();
});

test('Renderer:select virtual', async () => {
  const options = [...Array(200)].map((_, i) => {
    return 'option' + i;
  });

  const {container, queryByText, findByText} = render(
    amisRender(
      {
        type: 'form',
        body: [
          {
            label: '选项',
            type: 'select',
            name: 'select',
            options: options
          }
        ]
      },
      {},
      makeEnv({})
    )
  );
  const inputDate = await findByText('请选择');

  fireEvent.click(inputDate);

  const option12 = queryByText('option12');
  expect(option12).toBeNull();

  expect(container).toMatchSnapshot();
});

test('Renderer:select group mode with virtual', async () => {
  const options = [...Array(20)].map((_, i) => ({
    label: `group-${i + 1}`,
    children: [...Array(10)].map((_, j) => ({
      label: `option-${i * 10 + j + 1}`,
      value: `value-${i * 10 + j + 1}`
    }))
  }));

  const {container, select, getByText, queryByText} = await setup([
    {
      label: '分组',
      type: 'select',
      name: 'select',
      selectMode: 'group',
      options: options
    }
  ]);

  fireEvent.click(select!);

  await wait(300);

  expect(getByText('option-1')).toBeInTheDocument();
  expect(await queryByText('option-200')).toBeNull();
  expect(container).toMatchSnapshot();
});

test('Renderer:select table mode with virtual', async () => {
  const options = [...Array(200)].map((_, i) => ({
    label: `label-${i + 1}`,
    value: i + 1
  }));

  const {container, getByText, queryByText, select} = await setup([
    {
      label: '表格',
      type: 'select',
      name: 'select',
      options: options,
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

  fireEvent.click(select!);

  await wait(300);

  expect(getByText('label-1')).toBeInTheDocument();
  expect(await queryByText('label-200')).toBeNull();
  expect(container).toMatchSnapshot('');
});

test('Renderer:select chained mode with virtual', async () => {
  const options = [...Array(101)].map((_, i) => ({
    label: `group-${i + 1}`,
    children: [...Array(101)].map((_, j) => ({
      label: `group-${i + 1}-option-${j + 1}`,
      value: `${i + 1}-${j + 1}`
    }))
  }));

  const {container, getByText, queryByText, select} = await setup([
    {
      label: '级联',
      type: 'select',
      name: 'select',
      options: options,
      selectMode: 'chained'
    }
  ]);

  fireEvent.click(select!);
  await wait(300);
  fireEvent.click(getByText('group-1'));

  await wait(300);
  expect(getByText('group-1')).toBeInTheDocument();
  expect(await queryByText('group-100')).toBeNull();

  expect(getByText('group-1-option-1')).toBeInTheDocument();
  expect(await queryByText('group-1-option-100')).toBeNull();

  expect(container).toMatchSnapshot('');
});

test('Renderer:select associated mode with virtual', async () => {
  const leftOptions = [...Array(10)].map((_, i) => ({
    label: `group-${i + 1}`,
    children: [...Array(101)].map((_, j) => ({
      label: `group-${i + 1}-option-${j + 1}`,
      value: `${i + 1}-${j + 1}`
    }))
  }));

  const options = [...Array(101)].map((_, i) => ({
    label: `label-${i + 1}`,
    value: `value-${i + 1}`
  }));

  const {container, getByText, queryByText, select} = await setup([
    {
      label: '级联',
      type: 'select',
      name: 'select',
      selectMode: 'associated',
      leftMode: 'list',
      rightMode: 'table',
      columns: [
        {
          name: 'label',
          label: '名称'
        },
        {
          name: 'value',
          label: '值得'
        }
      ],
      leftOptions: leftOptions,
      options: [
        {
          ref: '1-1',
          children: options
        }
      ]
    }
  ]);

  fireEvent.click(select!);
  await wait(300);
  fireEvent.click(getByText('group-1-option-1'));
  await wait(300);

  expect(getByText('group-1-option-1')).toBeInTheDocument();
  expect(await queryByText('group-10-option-1')).toBeNull();

  expect(getByText('label-1')).toBeInTheDocument();
  expect(await queryByText('label-100')).toBeNull();

  expect(container).toMatchSnapshot('');
});
