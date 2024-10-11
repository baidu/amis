/**
 * 组件名称：Checkboxes 复选框
 * 单测内容：
 * 1. 基础使用
 * 2. 添加条件
 * 3. 拖拽排序
 * 4. 数字类型
 * 5. select 类型、select 配置 select 与 searchable
 * 6. 自定义字段
 * 7. 远程拉取字段 source
 * 8. selectMode
 * 9. builderMode & showANDOR & showNot
 * 10. 非内嵌模式
 */

import React from 'react';
import {
  fireEvent,
  render,
  screen,
  cleanup,
  waitFor
} from '@testing-library/react';
import '../../../src';
import {render as amisRender, clearStoresCache} from '../../../src';
import {makeEnv, replaceReactAriaIds, wait} from '../../helper';

afterEach(() => {
  cleanup();
  clearStoresCache();
  jest.useRealTimers();
});

const testSchema = {
  type: 'page',
  body: {
    type: 'form',
    submitText: 'Submit',
    body: [
      {
        type: 'condition-builder',
        label: '条件组件',
        changeImmediately: true,
        name: 'conditions',
        description:
          '适合让用户自己拼查询条件，然后后端根据数据生成 query where',
        fields: [
          {
            label: '文本',
            type: 'text',
            name: 'text'
          },
          {
            label: '数字',
            type: 'number',
            name: 'number'
          },
          {
            label: '布尔',
            type: 'boolean',
            name: 'boolean'
          },
          {
            label: '选项',
            type: 'select',
            name: 'select',
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
              },
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
            label: '动态选项',
            type: 'select',
            name: 'select2',
            searchable: true,
            placeholder: '这个是下拉框',
            source: '/api/mock2/form/getOptions?waitSeconds=1'
          },
          {
            label: '日期',
            children: [
              {
                // 方便获取
                label: '日期测试',
                type: 'date',
                name: 'date'
              },
              {
                label: '时间',
                type: 'time',
                name: 'time'
              },
              {
                label: '日期时间',
                type: 'datetime',
                name: 'datetime',
                format: 'YYYY-MM-DD hh:mm:ss'
              }
            ]
          }
        ]
      }
    ]
  }
};

test('Renderer:condition-builder', () => {
  const {container} = render(amisRender(testSchema, {}, makeEnv({})));

  replaceReactAriaIds(container);
  expect(container).toMatchSnapshot();
});

test('Renderer:condition-builder add', async () => {
  const onSubmit = jest.fn();
  const {container, findByText, findByPlaceholderText} = render(
    amisRender(testSchema, {onSubmit}, makeEnv({}))
  );

  const andCondition = await findByText('且');

  fireEvent.mouseOver(andCondition);

  const addCondition = await findByText('添加条件');

  fireEvent.click(addCondition);

  const inputText = await findByText('请选择字段');

  fireEvent.click(inputText);

  const textType = await findByText('文本');

  fireEvent.click(textType);

  const textRightInput = await findByPlaceholderText('请输入文本');

  fireEvent.change(textRightInput, {target: {value: 'amis'}});

  fireEvent.click(await findByText('Submit'));
  await wait(200);

  /** Form的debug区域升级成json组件了，无法直接通过innerHtml获取form data */
  const formData = onSubmit.mock.calls[0][0];
  expect(onSubmit).toHaveBeenCalled();
  expect(formData).toMatchObject({
    conditions: {
      conjunction: 'and',
      children: [
        {
          left: {
            type: 'field',
            field: 'text'
          },
          op: 'equal',
          right: 'amis'
        }
      ]
    }
  });
});

test('Renderer:condition-builder drag order', async () => {
  const {container, findByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          body: [
            {
              type: 'condition-builder',
              label: '条件组件',
              name: 'conditions',
              description:
                '适合让用户自己拼查询条件，然后后端根据数据生成 query where',
              fields: [
                {
                  label: 'AText',
                  type: 'text',
                  name: 'a'
                },
                {
                  label: 'BText',
                  type: 'text',
                  name: 'b'
                }
              ],
              value: {
                id: 'ab8c8eaea7e4',
                conjunction: 'and',
                children: [
                  {
                    id: '87cbc666c5ce',
                    left: {
                      type: 'field',
                      field: 'a'
                    }
                  },
                  {
                    id: '395df0331a46',
                    left: {
                      type: 'field',
                      field: 'b'
                    }
                  }
                ]
              }
            }
          ]
        }
      },
      {},
      makeEnv({})
    )
  );

  await findByText('BText');

  const dragbar = container.querySelectorAll('.cxd-CBGroupOrItem-dragbar');

  // TODO: jsdom 目前还不支持 drag，用不了
  // fireEvent.dragStart(dragbar[1]);
  // fireEvent.dragEnter(dragbar[0]);
  // fireEvent.drop(dragbar[0]);
  // fireEvent.dragLeave(dragbar[0]);
  // fireEvent.dragEnd(dragbar[1]);
});

test('Renderer:condition-builder with number type', async () => {
  const onSubmit = jest.fn();
  const {container, findByText, findByPlaceholderText} = render(
    amisRender(testSchema, {onSubmit}, makeEnv({}))
  );

  fireEvent.click(await findByText('添加条件'));
  fireEvent.click(await findByText('请选择字段'));
  fireEvent.click(await findByText('数字'));

  fireEvent.change(await findByPlaceholderText('请输入数字'), {
    target: {value: 81192}
  });

  const SubmitAndCheck = async (calledTime: number, result: any) => {
    fireEvent.click(await findByText('Submit'));
    await wait(200);

    expect(onSubmit).toBeCalledTimes(calledTime);
    expect(onSubmit.mock.calls[calledTime - 1][0]!.conditions).toMatchObject(
      result
    );
  };
  await SubmitAndCheck(1, {
    conjunction: 'and',
    children: [
      {
        left: {
          type: 'field',
          field: 'number'
        },
        op: 'equal',
        right: 81192
      }
    ]
  });

  fireEvent.click(await findByText('等于'));
  fireEvent.click(await findByText('小于'));
  fireEvent.change(await findByPlaceholderText('请输入数字'), {
    target: {value: 1233}
  });

  await SubmitAndCheck(2, {
    conjunction: 'and',
    children: [
      {
        left: {
          type: 'field',
          field: 'number'
        },
        op: 'less',
        right: 1233
      }
    ]
  });

  fireEvent.click(await findByText('小于'));
  fireEvent.click(await findByText('大于或等于'));
  fireEvent.change(await findByPlaceholderText('请输入数字'), {
    target: {value: 1688}
  });

  await SubmitAndCheck(3, {
    conjunction: 'and',
    children: [
      {
        left: {
          type: 'field',
          field: 'number'
        },
        op: 'greater_or_equal',
        right: 1688
      }
    ]
  });

  fireEvent.click(await findByText('大于或等于'));
  fireEvent.click(await findByText('属于范围'));
  const inputs = container.querySelectorAll('.cxd-Number input')!;
  fireEvent.change(inputs[0], {
    target: {value: 11}
  });
  fireEvent.change(inputs[1], {
    target: {value: 22}
  });

  await SubmitAndCheck(4, {
    conjunction: 'and',
    children: [
      {
        left: {
          type: 'field',
          field: 'number'
        },
        op: 'between',
        right: [11, 22]
      }
    ]
  });

  fireEvent.click(await findByText('属于范围'));
  fireEvent.click(await findByText('不为空'));

  await SubmitAndCheck(5, {
    conjunction: 'and',
    children: [
      {
        left: {
          type: 'field',
          field: 'number'
        },
        op: 'is_not_empty',
        right: [11, 22]
      }
    ]
  });
});

test('Renderer:condition-builder with select type & source & searchable', async () => {
  const onSubmit = jest.fn();
  const fetcher = jest.fn().mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          options: [
            {label: 'Option A', value: 'a'},
            {label: 'Option B', value: 'b'},
            {label: 'Option C', value: 'c'},
            {label: 'Option D', value: 'd'},
            {label: 'Option E', value: 'e'}
          ]
        }
      }
    })
  );
  const {container, findByText, findByPlaceholderText, findByTitle} = render(
    amisRender(
      testSchema,
      {onSubmit},
      makeEnv({
        fetcher,
        session: 'in-condition-builder-1'
      })
    )
  );

  fireEvent.click(await findByText('添加条件'));
  fireEvent.click(await findByText('请选择字段'));
  fireEvent.click(await findByText('动态选项'));

  await wait(200);
  expect(fetcher).toHaveBeenCalled();

  fireEvent.click(await findByText('这个是下拉框'));

  expect(
    container.querySelectorAll('.cxd-CBValue .cxd-Select-option')!.length
  ).toBe(5);
  expect(await findByText('Option A')).toBeInTheDocument();

  fireEvent.change(await findByPlaceholderText('搜索'), {
    target: {value: 'C'}
  });

  expect(
    container.querySelectorAll('.cxd-CBValue .cxd-Select-option')!.length
  ).toBe(1);
  // expect(container).toMatchSnapshot();
  expect(await findByTitle('Option C')).toBeInTheDocument();
});

test('Renderer:condition-builder with custom field', async () => {
  const onSubmit = jest.fn();
  const {container, findByText, findByPlaceholderText, findByTitle} = render(
    amisRender(
      {
        type: 'form',
        submitText: 'Submit',
        body: [
          {
            type: 'condition-builder',
            label: '条件组件',
            name: 'conditions',
            description:
              '适合让用户自己拼查询条件，然后后端根据数据生成 query where',
            fields: [
              {
                label: '自定义',
                type: 'custom',
                name: 'a',
                value: {
                  type: 'input-color'
                },
                operators: [
                  'equal',
                  {
                    label: '等于（自定义）',
                    value: 'custom_equal',
                    values: [
                      {
                        type: 'input-color',
                        name: 'color1'
                      },
                      {
                        type: 'tpl',
                        tpl: '~'
                      },
                      {
                        type: 'input-color',
                        name: 'color2'
                      }
                    ]
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

  fireEvent.click(await findByText('添加条件'));
  fireEvent.click(await findByText('请选择字段'));
  fireEvent.click(await findByText('自定义'));
  fireEvent.click(await findByText('请选择操作'));
  fireEvent.click(await findByText('等于（自定义）'));

  await wait(1000);
  const colorInputs = container.querySelectorAll(
    '.cxd-CBValue .cxd-ColorPicker-input'
  )!;
  expect(colorInputs.length).toBe(2);

  fireEvent.change(colorInputs[0], {
    target: {value: '#101'}
  });
  await wait(200);
  fireEvent.change(colorInputs[1], {
    target: {value: '#f0f'}
  });

  await wait(200);
  fireEvent.click(await findByText('Submit'));
  await wait(200);

  expect(onSubmit).toBeCalledTimes(1);
  expect(onSubmit.mock.calls[0][0]!).toMatchObject({
    conditions: {
      conjunction: 'and',
      children: [
        {
          left: {
            type: 'field',
            field: 'a'
          },
          op: 'custom_equal',
          right: {
            color1: '#101',
            color2: '#f0f'
          }
        }
      ]
    }
  });
  // expect(container).toMatchSnapshot();
});

test('Renderer:condition-builder with source fields', async () => {
  const onSubmit = jest.fn();
  const fetcher = jest.fn().mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: {
          fields: [
            {
              label: '布尔',
              name: 'boolean',
              type: 'boolean'
            },
            {
              children: [
                {label: '日期', type: 'date', name: 'date'},
                {label: '时间', type: 'time', name: 'time'}
              ],
              label: '日期'
            }
          ]
        }
      }
    })
  );
  const {container, findByText, findByPlaceholderText, findByTitle} = render(
    amisRender(
      {
        type: 'form',
        submitText: 'Submit',
        body: [
          {
            type: 'condition-builder',
            label: '条件组件',
            name: 'conditions',
            source: '/api/condition-fields/custom'
          }
        ]
      },
      {onSubmit},
      makeEnv({
        fetcher,
        session: 'in-condition-builder-2'
      })
    )
  );

  await wait(200);
  expect(fetcher).toHaveBeenCalled();

  fireEvent.click(await findByText('添加条件'));
  fireEvent.click(await findByText('请选择字段'));
  fireEvent.click(await findByText('布尔'));
  fireEvent.click(container.querySelector('.cxd-Switch')!);

  await wait(200);
  fireEvent.click(await findByText('Submit'));
  await wait(200);

  expect(onSubmit).toBeCalledTimes(1);
  expect(onSubmit.mock.calls[0][0]!).toMatchObject({
    conditions: {
      conjunction: 'and',
      children: [
        {
          left: {
            type: 'field',
            field: 'boolean'
          },
          op: 'equal',
          right: true
        }
      ]
    }
  });
});

test('Renderer:condition-builder with selectMode', async () => {
  const {container, findByText, findByPlaceholderText, findByTitle} = render(
    amisRender(
      {
        type: 'form',
        submitText: 'Submit',
        body: [
          {
            type: 'condition-builder',
            label: '条件组件',
            name: 'conditions',
            selectMode: 'tree',
            fields: [
              {
                label: '文本',
                type: 'text',
                name: 'text'
              },
              {
                label: '数字',
                type: 'number',
                name: 'number'
              },
              {
                label: '布尔',
                type: 'boolean',
                name: 'boolean'
              },
              {
                label: '树形结构',
                type: 'tree',
                name: 'tree',
                children: [
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

  fireEvent.click(await findByText('添加条件'));
  fireEvent.click(await findByText('请选择字段'));

  expect(container.querySelector('.cxd-TreeSelection')).toBeInTheDocument();
  // expect(container).toMatchSnapshot();
});

test('Renderer:condition-builder with builderMode & showANDOR & showNot', async () => {
  const onSubmit = jest.fn();
  const {container, findByText, findByPlaceholderText, findByTitle} = render(
    amisRender(
      {
        type: 'form',
        submitText: 'Submit',
        body: [
          {
            type: 'condition-builder',
            label: '条件组件',
            name: 'conditions',
            builderMode: 'simple',
            showANDOR: true,
            showNot: true,
            fields: testSchema.body.body[0].fields
          }
        ]
      },
      {onSubmit},
      makeEnv({})
    )
  );

  fireEvent.click(await findByText('添加条件'));

  expect(
    container.querySelector('.cxd-CBGroupOrItem-simple')
  ).toBeInTheDocument();

  fireEvent.click(await findByText('请选择字段'));
  fireEvent.click(await findByText('布尔'));
  fireEvent.click(container.querySelector('.cxd-Switch')!);

  await wait(200);
  fireEvent.click(await findByText('Submit'));
  await wait(200);

  expect(onSubmit).toBeCalledTimes(1);
  expect(onSubmit.mock.calls[0][0]!).toMatchObject({
    conditions: {
      conjunction: 'and',
      children: [
        {
          left: {
            type: 'field',
            field: 'boolean'
          },
          op: 'equal',
          right: true
        }
      ]
    }
  });

  fireEvent.click(await findByText('且'));
  fireEvent.click(await findByText('或'));

  await wait(200);
  fireEvent.click(await findByText('Submit'));
  await wait(200);

  expect(onSubmit).toBeCalledTimes(2);
  expect(onSubmit.mock.calls[1][0]!).toMatchObject({
    conditions: {
      conjunction: 'or',
      children: [
        {
          left: {
            type: 'field',
            field: 'boolean'
          },
          op: 'equal',
          right: true
        }
      ]
    }
  });

  fireEvent.click(await findByText('非'));

  await wait(200);
  fireEvent.click(await findByText('Submit'));
  await wait(200);

  expect(onSubmit).toBeCalledTimes(3);
  expect(onSubmit.mock.calls[2][0]!).toMatchObject({
    conditions: {
      conjunction: 'or',
      not: true,
      children: [
        {
          left: {
            type: 'field',
            field: 'boolean'
          },
          op: 'equal',
          right: true
        }
      ]
    }
  });
});

test('Renderer:condition-builder with not embed', async () => {
  const onSubmit = jest.fn();
  const {container, findByText, baseElement, findByTitle} = render(
    amisRender(
      {
        type: 'form',
        submitText: 'Submit',
        body: [
          {
            type: 'condition-builder',
            label: '条件组件',
            embed: false,
            title: '条件组合设置',
            placeholder: '自定义占位',
            name: 'conditions',
            fields: testSchema.body.body[0].fields
          }
        ]
      },
      {onSubmit},
      makeEnv({})
    )
  );

  fireEvent.click(await findByText('自定义占位'));
  await wait(300);

  fireEvent.click(await findByText('添加条件'));
  fireEvent.click(await findByText('请选择字段'));
  fireEvent.click(await findByText('日期测试'));
  fireEvent.click(await findByText('等于'));
  fireEvent.click(await findByText('不属于范围'));

  expect(
    baseElement.querySelector('.cxd-Modal .cxd-CBGroup')
  ).toBeInTheDocument();
});

/**
 * 组合条件使用公式编辑器
 * 1. 7种类型的公式编辑器正常渲染
 * 2. 选项类型（select）字段，切换操作符（包含 -> 等于），字段值清空且正常渲染（等于和包含对应的multiple不一样，所以值格式不一样）
 * 3. 先使用其他类型字段，再切换到select类型，条件选择包含，值正常渲染
 */
describe('Renderer: condition-builder with formula', () => {
  const onSubmit = jest.fn();
  test('condition-builder with different fields', async () => {
    const {container} = render(
      amisRender(
        {
          type: 'form',
          data: {
            conditions: {
              id: '68bddc1495e9',
              conjunction: 'and',
              children: [
                {
                  id: 'b9cc34dae93a',
                  left: {
                    type: 'field',
                    field: 'text'
                  },
                  op: 'equal'
                },
                {
                  id: '4c718986c321',
                  left: {
                    type: 'field',
                    field: 'number'
                  },
                  op: 'equal'
                },
                {
                  id: '7ee79c416422',
                  left: {
                    type: 'field',
                    field: 'boolean'
                  },
                  op: 'equal'
                },
                {
                  id: '9cd76d8a6522',
                  left: {
                    type: 'field',
                    field: 'select'
                  },
                  op: 'select_equals'
                },
                {
                  id: '20a65e9df546',
                  left: {
                    type: 'field',
                    field: 'date'
                  },
                  op: 'equal'
                },
                {
                  id: 'e729b32ea9e8',
                  left: {
                    type: 'field',
                    field: 'time'
                  },
                  op: 'equal'
                },
                {
                  id: 'a5f48e000557',
                  left: {
                    type: 'field',
                    field: 'datetime'
                  },
                  op: 'equal'
                }
              ]
            }
          },
          body: [
            {
              type: 'condition-builder',
              label: '条件组件',
              name: 'conditions',
              searchable: true,
              formula: {
                mode: 'input-group',
                inputSettings: {},
                allowInput: true,
                mixedMode: true,
                variables: []
              },
              fields: [
                {
                  label: '文本',
                  type: 'text',
                  name: 'text'
                },
                {
                  label: '数字',
                  type: 'number',
                  name: 'number'
                },
                {
                  label: '布尔',
                  type: 'boolean',
                  name: 'boolean'
                },
                {
                  label: '选项',
                  type: 'select',
                  name: 'select',
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
                },
                {
                  label: '日期',
                  children: [
                    {
                      label: '日期',
                      type: 'date',
                      name: 'date'
                    },
                    {
                      label: '时间',
                      type: 'time',
                      name: 'time'
                    },
                    {
                      label: '日期时间',
                      type: 'datetime',
                      name: 'datetime'
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

    replaceReactAriaIds(container);
    // 7种类型都存在
    expect(
      container.querySelectorAll('.cxd-FormulaPicker-input')?.length
    ).toEqual(7);
    expect(
      container.querySelector('.cxd-FormulaPicker--text')
    ).toBeInTheDocument();
    expect(
      container.querySelector('.cxd-FormulaPicker-input-number')
    ).toBeInTheDocument();
    expect(
      container.querySelector('.cxd-FormulaPicker-input-boolean')
    ).toBeInTheDocument();
    expect(
      container.querySelector('.cxd-FormulaPicker-input-select')
    ).toBeInTheDocument();
    expect(
      container.querySelector('.cxd-FormulaPicker-input-date')
    ).toBeInTheDocument();
    expect(
      container.querySelector('.cxd-FormulaPicker-input-time')
    ).toBeInTheDocument();
    expect(
      container.querySelector('.cxd-FormulaPicker-input-datetime')
    ).toBeInTheDocument();
  });

  test('condition-builder with select field and change operator', async () => {
    const {container, findByText} = render(
      amisRender(
        {
          type: 'form',
          data: {
            conditions: {
              id: '68bddc1495e9',
              conjunction: 'and',
              children: [
                {
                  id: '9cd76d8a6522',
                  left: {
                    type: 'field',
                    field: 'select'
                  },
                  op: 'select_equals'
                }
              ]
            }
          },
          body: [
            {
              type: 'condition-builder',
              label: '条件组件',
              name: 'conditions',
              searchable: true,
              formula: {
                mode: 'input-group',
                inputSettings: {},
                allowInput: true,
                mixedMode: true,
                variables: []
              },
              fields: [
                {
                  label: '选项',
                  type: 'select',
                  name: 'select',
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
          ]
        },
        {},
        makeEnv({})
      )
    );

    replaceReactAriaIds(container);

    // 选中第一个选项（Form中默认值是等于操作）
    let fieldValueControl = container.querySelector(
      '.cxd-FormulaPicker-input-select'
    )!;
    fireEvent.click(fieldValueControl);
    await wait(100);
    fireEvent.click(await findByText('A'));
    expect(container.querySelector('.cxd-Tag-text')?.innerHTML).toEqual('A');

    // 切换操作符，字段值清空，需要重新选择，且下拉选项变成多选
    const opControl = container.querySelector('.cxd-CBGroup-operatorInput')!;
    fireEvent.click(opControl);
    await wait(100);
    fireEvent.click(await findByText('包含'));
    await wait(100);
    expect(
      container.querySelector('.cxd-Select-placeholder')
    ).toBeInTheDocument();
    fieldValueControl = container.querySelector(
      '.cxd-FormulaPicker-input-select'
    )!;
    fireEvent.click(fieldValueControl);
    await wait(100);
    expect(
      container.querySelectorAll('.cxd-Select-option-checkbox').length
    ).toEqual(3);
  });

  test('condition-builder with field type change', async () => {
    const onSubmit = jest.fn();
    const {container, findByText, findByPlaceholderText} = render(
      amisRender(
        {
          type: 'form',
          data: {
            conditions: {
              id: '68bddc1495e9',
              conjunction: 'and',
              children: [
                {
                  id: 'b9cc34dae93a',
                  left: {
                    type: 'field',
                    field: 'text'
                  },
                  op: 'equal'
                }
              ]
            }
          },
          body: [
            {
              type: 'condition-builder',
              label: '条件组件',
              name: 'conditions',
              searchable: true,
              formula: {
                mode: 'input-group',
                inputSettings: {},
                allowInput: true,
                mixedMode: true,
                variables: []
              },
              fields: [
                {
                  label: '文本',
                  type: 'text',
                  name: 'text'
                },
                {
                  label: '选项',
                  type: 'select',
                  name: 'select',
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
          ]
        },
        {onSubmit},
        makeEnv({})
      )
    );

    replaceReactAriaIds(container);

    // 切换字段类型，对应字段值控件更新
    const fieldControl = container.querySelector(
      '.cxd-DropDownSelection-input'
    )!;
    fireEvent.click(fieldControl);
    await wait(100);
    fireEvent.click(await findByText('选项'));
    await wait(100);
    let selectValueControl = container.querySelector(
      '.cxd-FormulaPicker-input-select'
    )!;
    expect(selectValueControl).toBeInTheDocument();

    // 切换操作符，下拉选项变成多选
    const opControl = container.querySelector('.cxd-CBGroup-operatorInput')!;
    fireEvent.click(opControl);
    await wait(100);
    fireEvent.click(await findByText('包含'));
    await wait(100);
    expect(
      container.querySelector('.cxd-Select-placeholder')
    ).toBeInTheDocument();
    selectValueControl = container.querySelector(
      '.cxd-FormulaPicker-input-select'
    )!;
    fireEvent.click(selectValueControl);
    await wait(100);
    expect(
      container.querySelectorAll('.cxd-Select-option-checkbox').length
    ).toEqual(3);

    // 选择2个选项，绑定值变化
    fireEvent.click(await findByText('A'));
    fireEvent.click(await findByText('C'));
    const selectedValues = [];
    const nodes = container.querySelectorAll('.cxd-Select-valueLabel');
    for (const el of nodes.values()) {
      selectedValues.push(el?.innerHTML);
    }
    expect(selectedValues.length).toEqual(2);
    expect(selectedValues.join(',')).toEqual('A,C');
  });
});
