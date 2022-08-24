/**
 * 组件名称：Checkboxes 复选框
 * 单测内容：
 * 1. 基础点击勾选
 * 2. 分组显示
 * 3. 列数 columnsCount
 * 4. 全选\全不选 checkAll
 * 5. 自定义选项渲染 menuTpl
 * 6. 分隔符 delimiter
 * 7. 提取值 extractValue 与 拼接值 joinValues
 * 8. 数据源 source、选项标签字段 labelField 与 选项值字段 valueField
 * 9. 默认全部选中 defaultCheckAll 与 是否显示为一行 inline
 * 10. 是否可新增 creatable、自定义新增按钮名称 createBtnLabel、自定义新增表单 addControls 与 新增选项接口 addApi
 * 11. 是否可编辑 editable、自定义编辑表单 editControls 与 编辑接口 editApi
 * 12. 是否可删除 removable、删除接口 deleteApi
 * 13. 按钮模式 optionType、选项 label 自定义类名 labelClassName 与 选项自定义类名 itemClassName
 */

import React from 'react';
import {
  render,
  cleanup,
  screen,
  fireEvent,
  waitFor
} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';
import {clearStoresCache} from '../../../src';
import {now} from 'lodash';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

const setup = async (
  items: any[] = [],
  rest?: {
    formOptions?: any;
    props?: any;
    env?: any;
  }
) => {
  const {props, formOptions, env} = rest || {};
  const utils = render(
    amisRender(
      {
        type: 'form',
        api: '/api/mock2/form/saveForm',
        body: items,
        ...(formOptions || {})
      },
      props || {},
      makeEnv(env || {})
    )
  );

  const submitBtn = utils.container.querySelector(
    'button[type="submit"]'
  ) as HTMLElement;

  return {
    submitBtn,
    ...utils
  };
};

const normalOptions = [
  {
    label: 'OptionA',
    value: 'a',
    klass: 'success'
  },
  {
    label: 'OptionB',
    value: 'b',
    klass: 'danger'
  },
  {
    label: 'OptionC',
    value: 'c',
    klass: 'warning'
  },
  {
    label: 'OptionD',
    value: 'd',
    klass: 'info'
  }
];

test('Renderer:checkboxes', async () => {
  const {getByText, container} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        controls: [
          {
            name: 'checkboxes',
            type: 'checkboxes',
            label: 'Checkboxes',
            columnsCount: 1,
            options: normalOptions
          },
          {
            type: 'static',
            name: 'checkboxes',
            label: '当前值'
          }
        ],
        submitText: null,
        actions: []
      },
      {},
      makeEnv()
    )
  );
  expect(container).toMatchSnapshot();
  await wait(500);
  fireEvent.click(getByText(/OptionA/));
  await wait(500);
  fireEvent.click(getByText(/OptionB/));
  await wait(500);
  expect(container).toMatchSnapshot();
});

test('Renderer:checkboxes with group', async () => {
  const {getByText, container} = await setup([
    {
      type: 'checkboxes',
      name: 'checkboxes',
      label: '城市选择',
      inline: false,
      options: [
        {
          label: 'A类型',
          children: [
            {
              value: '选项 A-1',
              label: 'a-1'
            },
            {
              value: '选项 A-2',
              label: 'a-2'
            }
          ]
        },
        {
          label: 'B类型',
          children: [
            {
              value: '选项 B-1',
              label: 'b-1'
            },
            {
              value: '选项 B-2',
              label: 'b-2'
            },
            {
              value: '选项 B-3',
              label: 'b-3'
            },
            {
              value: '选项 B-4',
              label: 'b-4'
            }
          ]
        },
        {
          value: '选项 C-1',
          label: 'c-1'
        }
      ]
    }
  ]);
  expect(container).toMatchSnapshot();

  const groups = container.querySelectorAll('.cxd-CheckboxesControl-group');
  expect(groups.length).toBe(2);

  expect(
    groups[0].querySelector('.cxd-CheckboxesControl-groupLabel')!.innerHTML
  ).toBe('A类型');
  expect(groups[1].querySelectorAll('.cxd-Checkbox').length).toBe(4);
});

test('Renderer:checkboxes with columnsCount', async () => {
  const {container} = await setup([
    {
      name: 'checkboxes2',
      type: 'checkboxes',
      label: '显示两列的复选框',
      columnsCount: 2,
      inline: false,
      options: normalOptions
    }
  ]);
  expect(container).toMatchSnapshot();
  expect(container.querySelector('.cxd-Grid')!.children.length).toBe(2);

  const {container: containerTwo} = await setup([
    {
      name: 'checkboxes2',
      type: 'checkboxes',
      label: '数组形式显示的复选框',
      columnsCount: [1, 2, 3],
      inline: false,
      options: normalOptions
    }
  ]);
  expect(containerTwo).toMatchSnapshot();
  const grids = containerTwo.querySelectorAll('.cxd-Grid');
  expect(grids.length).toBe(3);
  expect(grids[0].children.length).toBe(1);
  expect(grids[1].children.length).toBe(2);

  const {container: containerWithGroup} = await setup([
    {
      type: 'checkboxes',
      name: 'checkboxes',
      label: '有分组的情况下显示分列的复选框',
      inline: false,
      columnsCount: 3,
      options: [
        {
          label: 'A类型',
          children: [
            {
              value: '选项 A-1',
              label: 'a-1'
            },
            {
              value: '选项 A-2',
              label: 'a-2'
            }
          ]
        },
        {
          label: 'B类型',
          children: [
            {
              value: '选项 B-1',
              label: 'b-1'
            },
            {
              value: '选项 B-2',
              label: 'b-2'
            },
            {
              value: '选项 B-3',
              label: 'b-3'
            },
            {
              value: '选项 B-4',
              label: 'b-4'
            }
          ]
        }
      ]
    }
  ]);

  expect(containerWithGroup).toMatchSnapshot();
});

test('Renderer:checkboxes with checkall', async () => {
  const {getByText, container} = await setup([
    {
      name: 'checkboxes',
      type: 'checkboxes',
      label: '复选框',
      checkAll: true,
      value: 'c,e',
      options: [
        {
          label: 'GroupA',
          children: normalOptions
        },
        {
          label: 'GroupB',
          children: [
            {
              label: 'OptionE',
              value: 'e'
            }
          ]
        }
      ]
    },
    {
      type: 'input-text',
      name: 'checkboxes'
    }
  ]);

  const tpl = container.querySelector(
    '.cxd-TextControl-input input'
  )! as HTMLInputElement;
  const checkAll = await screen.findByLabelText('全选/不选');

  expect(tpl.value).toBe('c,e');
  expect(checkAll).toBeVisible();
  expect(container).toMatchSnapshot('default value');

  fireEvent.click(checkAll);
  await waitFor(() => {
    expect(tpl.value).toBe('a,b,c,d,e');
    expect(container).toMatchSnapshot('all selected');
  });

  fireEvent.click(checkAll);
  await waitFor(() => {
    expect(tpl.value).toBe('');
    expect(container).toMatchSnapshot('no selected');
  });
});

test('Renderer:checkboxes with menuTpl', async () => {
  const {getByText, container} = await setup([
    {
      name: 'checkboxes',
      type: 'checkboxes',
      label: '复选框',
      menuTpl: "<span class='label label-${klass}'>${label}</span>",
      options: normalOptions
    }
  ]);

  const optionA = screen.getByText('OptionA');
  expect(optionA).toBeVisible();
  expect(optionA).toHaveClass('label label-success');

  const optionC = screen.getByText('OptionA');
  expect(optionC).toBeVisible();
  expect(optionC).toHaveClass('label label-success');

  expect(container).toMatchSnapshot();
});

test('Renderer:checkboxes with delimiter', async () => {
  const {container, getByText} = await setup([
    {
      type: 'checkboxes',
      name: 'checkboxes',
      label: '选项分隔符组件',
      delimiter: '#delimiter#',
      options: normalOptions
    },
    {
      type: 'static',
      name: 'checkboxes'
    }
  ]);

  const tpl = container.querySelector('.cxd-PlainField')! as HTMLInputElement;

  fireEvent.click(getByText(/OptionD/));
  await waitFor(() => {
    expect(tpl.innerHTML).toBe('d');
  });

  fireEvent.click(getByText(/OptionC/));
  await waitFor(() => {
    expect(tpl.innerHTML).toBe('d#delimiter#c');
  });
});

test('Renderer:checkboxes with extractValue & joinValues', async () => {
  const onSubmit = jest.fn();
  const {container, getByText} = await setup(
    [
      {
        type: 'checkboxes',
        name: 'checkboxes',
        label: '提取值',
        joinValues: false,
        extractValue: false,
        options: normalOptions
      },
      {
        type: 'checkboxes',
        name: 'checkboxes-two',
        label: '提取值',
        joinValues: false,
        extractValue: true,
        options: [
          {
            label: 'OptionE',
            value: 'e'
          },
          {
            label: 'OptionF',
            value: 'f'
          },
          {
            label: 'OptionG',
            value: 'g'
          },
          {
            label: 'OptionH',
            value: 'h'
          }
        ]
      }
    ],
    {
      props: {onSubmit},
      formOptions: {
        submitText: 'Submit'
      }
    }
  );

  fireEvent.click(getByText('OptionA'));
  await wait(300);
  fireEvent.click(getByText('Submit'));

  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalled();
  });
  expect(onSubmit.mock.calls[0][0].checkboxes).toMatchObject([
    {
      label: 'OptionA',
      value: 'a',
      klass: 'success'
    }
  ]);

  fireEvent.click(getByText('OptionB'));
  await wait(300);
  fireEvent.click(getByText('Submit'));

  await waitFor(() => {
    expect(onSubmit).toBeCalledTimes(2);
  });

  expect(onSubmit.mock.calls[1][0].checkboxes).toMatchObject([
    {
      label: 'OptionA',
      value: 'a',
      klass: 'success'
    },
    {
      label: 'OptionB',
      value: 'b',
      klass: 'danger'
    }
  ]);

  fireEvent.click(getByText('OptionE'));
  await wait(300);
  fireEvent.click(getByText('Submit'));

  await waitFor(() => {
    expect(onSubmit).toBeCalledTimes(3);
  });
  expect(onSubmit.mock.calls[2][0]['checkboxes-two']).toMatchObject(['e']);

  fireEvent.click(getByText('OptionH'));
  await wait(300);
  fireEvent.click(getByText('Submit'));

  await waitFor(() => {
    expect(onSubmit).toBeCalledTimes(4);
  });
  expect(onSubmit.mock.calls[3][0]['checkboxes-two']).toMatchObject(['e', 'h']);
});

test('Renderer:checkboxes with source & labelField & valueField', async () => {
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          options: [
            {
              iamlabel: 'Label A',
              iamvalue: 'val-a'
            },
            {
              iamlabel: 'Label B',
              iamvalue: 'val-b'
            }
          ],
          value: 'val-a'
        }
      }
    })
  );
  const onSubmit = jest.fn();

  const {container, getByText} = await setup(
    [
      {
        type: 'checkboxes',
        name: 'checkboxes',
        label: '复选框',
        source: '/api/xxx',
        labelField: 'iamlabel',
        valueField: 'iamvalue'
      }
    ],
    {
      props: {
        onSubmit
      },
      formOptions: {
        submitText: 'Submit'
      },
      env: {
        fetcher
      }
    }
  );

  await waitFor(async () => {
    expect(fetcher).toHaveBeenCalled();
    expect(getByText('Label B')).toBeInTheDocument();
    expect(container.querySelectorAll('.cxd-Checkbox').length).toBe(2);

    await wait(200);
  });

  fireEvent.click(getByText('Submit'));
  await waitFor(() => {
    expect(onSubmit).toBeCalled();
    expect(onSubmit.mock.calls[0][0].checkboxes).toEqual('val-a');
  });
});

test('Renderer:checkboxes with defaultCheckAll & inline', async () => {
  const onSubmit = jest.fn();
  const {container, getByText} = await setup(
    [
      {
        type: 'checkboxes',
        name: 'checkboxes',
        label: '复选框',
        value: 'a',
        options: normalOptions
      },
      {
        type: 'checkboxes',
        name: 'checkboxes-two',
        label: '复选框',
        inline: false,
        defaultCheckAll: true,
        options: normalOptions
      }
    ],
    {
      props: {onSubmit},
      formOptions: {
        submitText: 'Submit'
      }
    }
  );

  const Ins = container.querySelectorAll('.cxd-CheckboxesControl');
  expect(Ins[0]!).toHaveClass('is-inline');
  expect(Ins[1]!).not.toHaveClass('is-inline');

  fireEvent.click(getByText('Submit'));
  await waitFor(() => {
    expect(onSubmit).toBeCalled();
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      'checkboxes': 'a',
      'checkboxes-two': 'a,b,c,d'
    });
  });

  expect(container).toMatchSnapshot();
});

test('Renderer:checkboxes with creatable & createBtnLabel & addControls & addApi', async () => {
  const onSubmit = jest.fn();
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: ''
      }
    })
  );
  const {container, getByText, baseElement} = await setup(
    [
      {
        type: 'checkboxes',
        name: 'checkboxes',
        label: '复选框',
        creatable: true,
        createBtnLabel: '我是新增按钮',
        addControls: [
          {
            type: 'input-text',
            name: 'label',
            label: '名'
          },
          {
            type: 'input-number',
            name: 'value',
            label: '值'
          }
        ],
        addApi: '/api/xxx',
        options: normalOptions
      }
    ],
    {
      props: {
        onSubmit
      },
      formOptions: {
        submitText: 'Submit'
      },
      env: {fetcher}
    }
  );

  expect(getByText('我是新增按钮')).toBeInTheDocument();

  // 点击新增按钮，打卡弹框
  fireEvent.click(getByText('我是新增按钮'));
  await waitFor(() => {
    expect(baseElement.querySelector('.cxd-Modal-body')).toBeVisible();
    expect(baseElement).toMatchSnapshot('dialog open');
  });

  // 新增表单输入
  fireEvent.change(baseElement.querySelector('.cxd-TextControl-input input')!, {
    target: {value: '我是label啊'}
  });
  fireEvent.change(baseElement.querySelector('.cxd-NumberControl input')!, {
    target: {value: 555}
  });
  await wait(300);

  // 表单提交
  fireEvent.click(
    baseElement.querySelector('.cxd-Modal-footer .cxd-Button--primary')!
  );
  await waitFor(async () => {
    expect(fetcher).toHaveBeenCalled();
    expect(fetcher.mock.calls[0][0].data.label).toEqual('我是label啊');
    expect(fetcher.mock.calls[0][0].data.value).toEqual(555);

    await wait(200);
  });

  const lastOption = container.querySelector(
    '.cxd-CheckboxesControl .cxd-Checkbox:last-of-type'
  )!;

  expect(lastOption).toHaveTextContent('我是label啊');
  expect(container).toMatchSnapshot('create success');

  // 验证 value
  fireEvent.click(lastOption.querySelector('input')!);
  await wait(200);
  fireEvent.click(getByText(/OptionA/));

  await wait(200);
  fireEvent.click(getByText('Submit'));

  await waitFor(() => {
    expect(onSubmit).toBeCalled();
    expect(onSubmit.mock.calls[0][0].checkboxes).toEqual('555,a');
  });
});

test('Renderer:checkboxes with editable & editControls & editApi', async () => {
  const onSubmit = jest.fn();
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: ''
      }
    })
  );
  const {container, getByText, baseElement} = await setup(
    [
      {
        type: 'checkboxes',
        name: 'checkboxes',
        label: '复选框',
        editable: true,
        editControls: [
          {
            type: 'input-text',
            name: 'label',
            label: '名'
          },
          {
            type: 'input-text',
            name: 'value',
            label: '值'
          }
        ],
        editApi: '/api/xxx',
        options: normalOptions
      }
    ],
    {
      props: {
        onSubmit
      },
      formOptions: {
        submitText: 'Submit'
      },
      env: {fetcher}
    }
  );

  const optionD = container.querySelector(
    '.cxd-CheckboxesControl .cxd-Checkbox:last-of-type'
  )!;
  fireEvent.mouseOver(optionD.querySelector('input')!);
  await waitFor(() => {
    expect(container).toMatchSnapshot('hover edit');
  });
  await wait(200);

  const optionDEdit = container.querySelector(
    '.cxd-CheckboxesControl .cxd-Checkbox:last-of-type a'
  )!;

  expect(optionDEdit).toBeVisible();

  // 点击编辑按钮
  fireEvent.click(optionDEdit.querySelector('icon-mock')!);
  await waitFor(() => {
    expect(baseElement.querySelector('.cxd-Modal-body')).toBeVisible();
    expect(baseElement).toMatchSnapshot('dialog open');
  });

  const inputs = baseElement.querySelectorAll(
    '.cxd-TextControl-input input'
  ) as unknown as HTMLInputElement[];
  expect(inputs.length).toBe(2);
  expect(inputs[0].value).toBe('OptionD');
  expect(inputs[1].value).toBe('d');

  // 新增表单输入
  fireEvent.change(inputs[0], {
    target: {value: 'OptionD 修改'}
  });
  fireEvent.change(inputs[1], {
    target: {value: 'd-edit'}
  });
  await wait(300);

  // 表单提交
  fireEvent.click(
    baseElement.querySelector('.cxd-Modal-footer .cxd-Button--primary')!
  );
  await waitFor(async () => {
    expect(fetcher).toHaveBeenCalled();
    expect(fetcher.mock.calls[0][0].data.label).toEqual('OptionD 修改');
    expect(fetcher.mock.calls[0][0].data.value).toEqual('d-edit');

    await wait(200);
  });
  const lastOption = container.querySelector(
    '.cxd-CheckboxesControl .cxd-Checkbox:last-of-type'
  )!;

  expect(lastOption).toHaveTextContent('OptionD 修改');
  expect(container).toMatchSnapshot('edit success');

  // 验证 value
  fireEvent.click(lastOption.querySelector('input')!);
  await wait(200);
  fireEvent.click(getByText(/OptionA/));

  await wait(200);
  fireEvent.click(getByText('Submit'));

  await waitFor(() => {
    expect(onSubmit).toBeCalled();
    expect(onSubmit.mock.calls[0][0].checkboxes).toEqual('d-edit,a');
  });
});

test('Renderer:checkboxes with removable & deleteApi', async () => {
  const onSubmit = jest.fn();
  const fetcher = jest.fn().mockImplementation((...args) => {
    return Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: ''
      }
    });
  });
  const {container, getByText, baseElement} = await setup(
    [
      {
        type: 'checkboxes',
        name: 'checkboxes',
        label: '复选框',
        removable: true,
        deleteApi: '/api/xxx',
        options: normalOptions
      }
    ],
    {
      props: {
        onSubmit
      },
      formOptions: {
        submitText: 'Submit'
      },
      env: {fetcher}
    }
  );

  const optionA = container.querySelector(
    '.cxd-CheckboxesControl .cxd-Checkbox:first-of-type'
  )!;

  fireEvent.mouseOver(optionA.querySelector('input')!);
  await waitFor(() => {
    expect(container).toMatchSnapshot('hover edit');
  });
  await wait(200);

  const optionAEdit = optionA.querySelector('a')!;

  expect(optionAEdit).toBeVisible();

  // 点击删除按钮
  fireEvent.click(optionAEdit.querySelector('icon-mock')!);
  await waitFor(() => {
    expect(baseElement.querySelector('.cxd-Modal-body')).toBeVisible();
    expect(baseElement).toMatchSnapshot('dialog open');
  });

  // 确定
  fireEvent.click(
    baseElement.querySelector('.cxd-Modal-footer .cxd-Button--danger')!
  );
  await waitFor(async () => {
    expect(fetcher).toHaveBeenCalled();
  });

  // 第一项变成了 OptionB
  expect(
    container.querySelector(
      '.cxd-CheckboxesControl .cxd-Checkbox:first-of-type'
    )!
  ).toHaveTextContent('OptionB');
});

test('Renderer:checkboxes with optionType & labelClassName & itemClassName', async () => {
  const {getByText, container} = await setup([
    {
      name: 'checkboxes',
      type: 'checkboxes',
      label: '复选框',
      optionType: 'button',
      labelClassName: 'iamlabel',
      itemClassName: 'iamitem',
      value: 'c,e',
      options: normalOptions
    }
  ]);

  const OptionA = container.querySelector(
    '.cxd-CheckboxesControl .cxd-Checkbox:first-of-type'
  )!;

  expect(OptionA).toHaveClass('cxd-Checkbox--button');
  expect(OptionA).toHaveClass('iamitem');
  expect(getByText(/OptionA/)).toHaveClass('iamlabel');

  expect(container).toMatchSnapshot();
});
