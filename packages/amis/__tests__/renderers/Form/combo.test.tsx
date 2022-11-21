/**
 * 组件名称：Combo 组合
 * 单测内容：
 1. 配置 items & multiLine
 2. multiLine
 3. minLength & maxLength
 4. flat 打平
 5. unique 唯一验证
 6. draggable 拖拽排序
 7. conditions 条件分支
 8. 父级数据
 9. tabsMode
 10. 自定义新增按钮
 11. 自定义删除按钮
 */

import {
  render,
  fireEvent,
  findByText,
  waitFor,
  screen,
  within,
  getByText
} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';

const setup = async (items: any[] = [], env: any = {}) => {
  const onSubmit = jest.fn();
  const utils = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          submitText: 'FormSubmit',
          api: '/api/mock/saveForm?waitSeconds=1',
          mode: 'horizontal',
          body: items
        }
      },
      {onSubmit},
      makeEnv(env)
    )
  );

  await wait(200);

  const submitBtn = utils.getByText('FormSubmit')!;

  function rerender(items: any[]) {
    utils.rerender(
      amisRender(
        {
          type: 'page',
          body: {
            type: 'form',
            submitText: 'FormSubmit',
            api: '/api/mock/saveForm?waitSeconds=1',
            mode: 'horizontal',
            body: items
          }
        },
        {onSubmit},
        makeEnv()
      )
    );
  }

  return {
    onSubmit,
    submitBtn,
    ...utils,
    rerender
  };
};

// 1. 配置 items & multiLine
test('Renderer:combo with items & multiLine', () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        mode: 'horizontal',
        api: '/api/mock2/form/saveForm',
        body: [
          {
            type: 'combo',
            name: 'combo1',
            label: 'Combo 单行展示',
            items: [
              {
                name: 'text',
                label: '文本',
                type: 'input-text'
              },
              {
                name: 'select',
                label: '选项',
                type: 'select',
                options: ['a', 'b', 'c']
              }
            ]
          },
          {
            type: 'divider'
          },
          {
            type: 'combo',
            name: 'combo2',
            label: 'Combo 多行展示',
            multiLine: true,
            items: [
              {
                name: 'text',
                label: '文本',
                type: 'input-text'
              },
              {
                name: 'select',
                label: '选项',
                type: 'select',
                options: ['a', 'b', 'c']
              }
            ]
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});

// 2. multiple
test('Renderer:combo with multiple', async () => {
  const onSubmit = jest.fn();
  const submitBtnText = 'Submit';
  const {container, getByText} = render(
    amisRender(
      {
        type: 'form',
        mode: 'horizontal',
        submitText: submitBtnText,
        api: '/api/mock2/form/saveForm',
        body: [
          {
            type: 'combo',
            name: 'combo',
            label: 'Combo 多选展示',
            multiple: true,
            items: [
              {
                name: 'text',
                label: '文本',
                type: 'input-text'
              },
              {
                name: 'select',
                label: '选项',
                type: 'select',
                options: ['aOptions', 'b', 'c']
              }
            ]
          }
        ]
      },
      {onSubmit},
      makeEnv({})
    )
  );

  await waitFor(() => {
    expect(getByText('新增')).toBeInTheDocument();
  });
  const add = await findByText(container, '新增');
  // 点击新增
  add.click();

  await waitFor(() => {
    expect(container.querySelector('input[name="text"]')).toBeInTheDocument();
  });

  // 输入
  const input = container.querySelector(
    'input[name="text"]'
  ) as HTMLInputElement;

  fireEvent.change(input, {target: {value: 'amis'}});
  await wait(300);

  // 下拉框点击
  fireEvent.click(container.querySelector('.cxd-Select')!);

  await waitFor(() => {
    expect(getByText('aOptions')).toBeInTheDocument();
  });

  fireEvent.click(getByText('aOptions'));

  await wait(500);

  const submitBtn = screen.getByRole('button', {name: submitBtnText});
  await waitFor(() => {
    expect(submitBtn).toBeInTheDocument();
  });
  fireEvent.click(submitBtn);

  await wait(500);

  const formData = onSubmit.mock.calls[0][0];
  expect(onSubmit).toHaveBeenCalled();
  expect(formData).toEqual({
    combo: [
      {
        select: 'aOptions',
        text: 'amis'
      }
    ]
  });

  // expect(container).toMatchSnapshot();
});

// 3. minLength & maxLength
test('Renderer:combo with minLength & maxLength', async () => {
  const {container, submitBtn, onSubmit} = await setup([
    {
      type: 'combo',
      name: 'combo1',
      label: '最少添加1条且最多3条',
      multiple: true,
      minLength: 1,
      maxLength: 3,
      items: [
        {
          name: 'text',
          label: '文本',
          type: 'input-text'
        },
        {
          name: 'select',
          label: '选项',
          type: 'select',
          options: ['a', 'b', 'c']
        }
      ]
    }
  ]);

  expect(submitBtn).toBeInTheDocument();
  fireEvent.click(submitBtn);

  await wait(100);
  expect(onSubmit).not.toBeCalled();
  expect(
    container.querySelector('form.cxd-Form > .cxd-Form-item')!
  ).toHaveClass('is-error');
  expect(container).toMatchSnapshot('minLength error');

  const addBtn = container.querySelector('button.cxd-Combo-addBtn')!;
  expect(addBtn).toBeInTheDocument();

  fireEvent.click(addBtn);
  await wait(10);
  fireEvent.click(addBtn);
  await wait(10);
  fireEvent.click(addBtn);

  await wait(100);
  expect(
    container.querySelector('button.cxd-Combo-addBtn')!
  ).not.toBeInTheDocument();
});

// 4. flat 打平
test('Renderer:combo with flat', async () => {
  const {container, submitBtn, onSubmit} = await setup([
    {
      type: 'combo',
      name: 'combo1',
      label: 'Combo',
      multiple: true,
      items: [
        {
          name: 'text',
          label: '文本',
          type: 'input-text'
        }
      ]
    },
    {
      type: 'combo',
      name: 'combo2',
      label: 'Combo',
      multiple: true,
      flat: true,
      items: [
        {
          name: 'text',
          label: '文本2',
          type: 'input-text'
        }
      ]
    }
  ]);

  const addBtns = container.querySelectorAll('button.cxd-Combo-addBtn')!;
  expect(addBtns.length).toBe(2);

  fireEvent.click(addBtns[0]);
  await wait(10);
  fireEvent.click(addBtns[1]);
  await wait(10);

  const inputTexts = container.querySelectorAll(
    '.cxd-TextControl-input input'
  )!;
  expect(inputTexts.length).toBe(2);

  fireEvent.change(inputTexts[0], {
    target: {value: 'text-one'}
  });

  fireEvent.change(inputTexts[1], {
    target: {value: 'text-two'}
  });

  await wait(10);
  fireEvent.click(submitBtn);
  await wait(10);
  expect(onSubmit).toBeCalled();
  expect(onSubmit.mock.calls[0][0]).toMatchObject({
    combo1: [
      {
        text: 'text-one'
      }
    ],
    combo2: ['text-two']
  });
});

// 5. unique 唯一验证
test('Renderer:combo with unique', async () => {
  const {container, submitBtn, onSubmit} = await setup([
    {
      type: 'combo',
      name: 'combo',
      label: '唯一',
      multiple: true,
      items: [
        {
          name: 'text',
          type: 'input-text',
          placeholder: '文本',
          unique: true
        }
      ]
    }
  ]);

  const addBtn = container.querySelector('button.cxd-Combo-addBtn')!;
  fireEvent.click(addBtn);
  await wait(10);
  fireEvent.click(addBtn);
  await wait(10);

  const inputTexts = container.querySelectorAll(
    '.cxd-TextControl-input input'
  )!;
  expect(inputTexts.length).toBe(2);
  fireEvent.change(inputTexts[0], {
    target: {value: 'text-one'}
  });
  await wait(10);
  fireEvent.change(inputTexts[1], {
    target: {value: 'text-one'}
  });

  await wait(10);
  fireEvent.click(submitBtn);
  await wait(10);
  expect(onSubmit).not.toBeCalled();
  expect(
    container.querySelector('form.cxd-Form > .cxd-Form-item')!
  ).toHaveClass('is-error');
  expect(container).toMatchSnapshot('unique error');

  fireEvent.change(inputTexts[1], {
    target: {value: 'text-two'}
  });

  await wait(10);
  fireEvent.click(submitBtn);
  await wait(10);
  expect(onSubmit).toBeCalled();
});

// 6. draggable 拖拽排序
test('Renderer:combo with draggable', async () => {
  const {container, submitBtn, onSubmit} = await setup([
    {
      type: 'combo',
      name: 'combo',
      label: '拖拽排序',
      multiple: true,
      value: [
        {
          text: '1',
          select: 'a'
        },
        {
          text: '2',
          select: 'b'
        }
      ],
      draggable: true,
      items: [
        {
          name: 'text',
          type: 'input-text'
        },
        {
          name: 'select',
          type: 'select',
          options: ['a', 'b', 'c']
        }
      ]
    }
  ]);

  expect(container.querySelectorAll('.cxd-Combo-itemDrager')!.length).toBe(2);
  expect(container).toMatchSnapshot();
});

// 7. conditions 条件分支
test('Renderer:combo with conditions', async () => {
  const {container, submitBtn, onSubmit} = await setup([
    {
      type: 'combo',
      name: 'combo-conditions',
      label: '多选',
      value: [
        {
          type: 'text'
        }
      ],
      multiLine: true,
      multiple: true,
      typeSwitchable: true,
      conditions: [
        {
          label: '文本',
          test: 'this.type === "text"',
          scaffold: {
            type: 'text',
            name: 'text33'
          },
          items: [
            {
              label: '字段名',
              name: 'name',
              type: 'input-text'
            }
          ]
        },
        {
          label: '数字',
          test: 'this.type === "number"',
          scaffold: {
            type: 'number',
            number: 0
          },
          items: [
            {
              label: '最小值',
              name: 'number',
              type: 'input-number'
            }
          ]
        }
      ]
    }
  ]);

  function getComboItem(nth: number = 1, path: string = ''): Element {
    return container.querySelector(
      `.cxd-Combo .cxd-Combo-item:nth-child(${nth}) .cxd-Combo-itemInner .cxd-Form-control${
        path ? ' ' + path : ''
      }`
    ) as Element;
  }

  expect(getComboItem(1)!.firstElementChild).toHaveClass(
    'cxd-TextControl-input'
  );

  const typeSwitcher = container.querySelector(
    '.cxd-Combo .cxd-Combo-itemTag .cxd-Select'
  )!;
  expect(typeSwitcher).toBeInTheDocument();
  fireEvent.click(typeSwitcher);
  await wait(10);

  const types = typeSwitcher.querySelectorAll(
    '.cxd-Select-menu .cxd-Select-option-content'
  )!;

  expect(types.length).toBe(2);
  expect(types[0].innerHTML).toBe('文本');
  expect(types[1].innerHTML).toBe('数字');
  fireEvent.click(types[1]);

  expect(getComboItem(1)!.firstElementChild).toHaveClass('cxd-Number');
  fireEvent.change(getComboItem(1, '.cxd-Number-input')!, {
    target: {value: 1239}
  });

  const addBtn = container.querySelector('.cxd-Combo-toolbar .cxd-Button')!;
  expect(addBtn).toBeInTheDocument();
  fireEvent.click(addBtn);
  await wait(10);

  expect(container).toMatchSnapshot('add button open');
  fireEvent.click(
    await within(document.querySelector('.cxd-Combo-toolbar')!).findByText(
      '文本'
    )
  );
  await wait(10);

  expect(getComboItem(2)!.firstElementChild).toHaveClass(
    'cxd-TextControl-input'
  );

  fireEvent.click(submitBtn);
  await wait(10);
  expect(onSubmit).toHaveBeenCalled();
  expect(onSubmit.mock.calls[0][0]).toMatchObject({
    'combo-conditions': [
      {
        type: 'number',
        number: 1239
      },
      {
        type: 'text',
        name: 'text33'
      }
    ]
  });
});

// 8. 父级数据
test('Renderer:combo with canAccessSuperData & strictMode & syncFields', async () => {
  const {container, submitBtn, onSubmit} = await setup([
    {
      type: 'input-text',
      label: '父级文本框',
      className: 'parentInput',
      name: 'super_text',
      value: '123'
    },
    {
      type: 'combo',
      name: 'combo1',
      label: '不可获取父级数据',
      multiple: true,
      items: [
        {
          name: 'super_text',
          type: 'input-text'
        }
      ]
    },
    {
      type: 'combo',
      name: 'combo2',
      label: '可获取父级数据不可更新',
      multiple: true,
      canAccessSuperData: true,
      items: [
        {
          name: 'super_text',
          type: 'input-text'
        }
      ]
    },
    {
      type: 'combo',
      name: 'combo3',
      label: '可获取父级数据亦可更新',
      multiple: true,
      canAccessSuperData: true,
      strictMode: false,
      syncFields: ['super_text'],
      items: [
        {
          name: 'super_text',
          type: 'input-text'
        }
      ]
    }
  ]);

  expect(container).toMatchSnapshot();

  const parentInput = container.querySelector('.parentInput input')!;

  const addBtns = container.querySelectorAll(
    '.cxd-Combo .cxd-Combo-toolbar button'
  )!;

  expect(addBtns.length).toBe(3);

  fireEvent.click(addBtns[0]);
  fireEvent.click(addBtns[1]);
  fireEvent.click(addBtns[2]);

  await wait(200);
  const comboInputs = container.querySelectorAll(
    '.cxd-Combo .cxd-TextControl-input input'
  )! as NodeListOf<HTMLInputElement>;
  expect(comboInputs.length).toBe(3);

  expect(comboInputs[0]!.value).toBe('');
  expect(comboInputs[1]!.value).toBe('123');
  expect(comboInputs[2]!.value).toBe('123');

  fireEvent.change(parentInput!, {
    target: {
      value: '123456'
    }
  });
  await wait(300);

  expect(comboInputs[0]!.value).toBe('');
  expect(comboInputs[1]!.value).toBe('123');
  expect(comboInputs[2]!.value).toBe('123456');
});

// 9. tabsMode
test('Renderer:combo with tabsMode', async () => {
  const {container, submitBtn, onSubmit} = await setup([
    {
      type: 'combo',
      name: 'combo',
      label: '组合多条多行',
      value: [{a: '111'}, {a: '222'}],
      multiple: true,
      tabsLabelTpl: '这是第${index|plus:3}个',
      tabsMode: true,
      items: [
        {
          name: 'a',
          label: '文本',
          type: 'input-text',
          value: ''
        }
      ]
    }
  ]);

  expect(
    container.querySelector('.cxd-ComboControl .cxd-Tabs.cxd-ComboTabs')
  ).toBeInTheDocument();
  expect(container).toMatchSnapshot();
});

// 10. 自定义新增按钮
test('Renderer:combo with addable & addattop & addBtn & addButtonText & addButtonClassName', async () => {
  const {container, getByText, onSubmit} = await setup([
    {
      type: 'combo',
      name: 'combo1',
      label: '自定义1',
      multiple: true,
      addButtonText: '自定义的新增',
      addButtonClassName: 'classOfAdd',
      items: [
        {
          name: 'text',
          type: 'input-text'
        }
      ],
      value: [
        {
          text: ''
        }
      ]
    },
    {
      type: 'combo',
      name: 'combo',
      label: '更复杂的',
      multiple: true,
      addattop: true,
      className: 'addAtTopClass',
      addBtn: {
        type: 'button',
        label: '更复杂的增加',
        level: 'default',
        block: true
      },
      items: [
        {
          name: 'text',
          type: 'input-text'
        }
      ],
      value: [
        {
          text: '1'
        }
      ]
    },
    {
      type: 'combo',
      name: 'combo',
      className: 'addableClass',
      label: '不存在的',
      multiple: true,
      addable: false,
      items: [
        {
          name: 'text',
          type: 'input-text'
        }
      ],
      value: [
        {
          text: '1'
        }
      ]
    }
  ]);

  expect(container.querySelector('.classOfAdd')!).toBeInTheDocument();
  expect(
    await within(document.querySelector('.classOfAdd')!).findByText(
      '自定义的新增'
    )
  ).toBeInTheDocument();

  expect(getByText('更复杂的增加')).toBeInTheDocument();

  expect(
    (container.querySelector(
      '.addAtTopClass .cxd-Combo-item .cxd-TextControl-input input'
    ) as HTMLInputElement)!.value
  ).toBe('1');
  fireEvent.click(
    container.querySelector('.addAtTopClass .cxd-Combo-toolbar button')!
  );
  await wait(10);
  expect(
    (container.querySelector(
      '.addAtTopClass .cxd-Combo-item .cxd-TextControl-input input'
    ) as HTMLInputElement)!.value
  ).toBe('');

  expect(
    container.querySelector('.addableClass .cxd-Combo-toolbar button')!
  ).not.toBeInTheDocument();

  expect(container).toMatchSnapshot();
});

// 9. 自定义删除按钮
test('Renderer:combo with removable & deleteBtn & deleteApi & deleteConfirmText', async () => {
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: ''
      }
    })
  );

  const {container, getByText, onSubmit, baseElement} = await setup(
    [
      {
        type: 'combo',
        name: 'combo',
        label: 'combo',
        className: 'removableFalse',
        removable: false,
        multiple: true,
        items: [
          {
            name: 'text',
            type: 'input-text'
          }
        ],
        value: [
          {
            text: '1'
          }
        ]
      },
      {
        type: 'combo',
        name: 'combo',
        label: 'combo',
        multiple: true,
        className: 'deleteBtn',
        deleteBtn: '更复杂的删除按钮',
        deleteApi: '/api/qqq',
        deleteConfirmText: 'Are you sure?',
        items: [
          {
            name: 'text',
            type: 'input-text'
          }
        ],
        value: [
          {
            text: 'deletedText'
          }
        ]
      },
      {
        type: 'combo',
        name: 'combo',
        label: 'combo',
        multiple: true,
        className: 'superDeleteBtn',
        deleteBtn: {
          type: 'button',
          label: 'delete',
          level: 'danger'
        },
        items: [
          {
            name: 'text',
            type: 'input-text'
          }
        ],
        value: [
          {
            text: '1'
          }
        ]
      }
    ],
    {
      fetcher,
      // 不加这个，就会报错 fetcher is required
      session: 'test-case-2'
    }
  );

  expect(
    container.querySelector('.removableFalse .cxd-Combo-delController')!
  ).not.toBeInTheDocument();
  expect(
    await within(document.querySelector('.deleteBtn')!).findByText(
      '更复杂的删除按钮'
    )
  ).toBeInTheDocument();
  expect(
    container.querySelector('.superDeleteBtn .cxd-Combo-delController')!
  ).toBeInTheDocument();

  expect(container).toMatchSnapshot();

  fireEvent.click(
    await within(document.querySelector('.deleteBtn')!).findByText(
      '更复杂的删除按钮'
    )
  );
  await wait(200);

  expect(baseElement.querySelector('.cxd-Modal-body')).toBeInTheDocument();
  expect(
    baseElement.querySelector('.cxd-Modal-body .cxd-Html')!.innerHTML
  ).toBe('Are you sure?');

  fireEvent.click(
    await within(baseElement.querySelector('.cxd-Modal-footer')!).findByText(
      '确认'
    )
  );

  await wait(300);
  expect(fetcher).toHaveBeenCalled();
});
