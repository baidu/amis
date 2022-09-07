import React from 'react';
import {render, cleanup, fireEvent, waitFor} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';
import {clearStoresCache} from '../../../src';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

test('options:linkage', async () => {
  const onSubmit = jest.fn();
  const {container, getByText} = render(
    amisRender(
      {
        type: 'form',
        wrapWithPanel: false,
        controls: [
          {
            label: '选项x',
            type: 'list',
            multiple: false,
            labelClassName: 'text-muted',
            name: 'a',
            inline: true,
            options: [
              {
                label: '选项1',
                value: 1
              },
              {
                label: '选项2',
                value: 2
              },
              {
                label: '选项3',
                value: 3
              }
            ]
          },
          {
            label: '选项y',
            type: 'radios',
            labelClassName: 'text-muted',
            name: 'b',
            inline: true,
            options: [
              {
                label: '选项a',
                value: 1,
                disabledOn: 'data.a == 1'
              },
              {
                label: '选项b',
                value: 2,
                hiddenOn: 'data.a == 2'
              },
              {
                label: '选项c',
                value: 3,
                visibleOn: 'data.a == 3'
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
  fireEvent.click(getByText('选项1'));
  await wait(600);

  expect(container).toMatchSnapshot();

  fireEvent.click(getByText('选项2'));
  await wait(600);

  expect(container).toMatchSnapshot();

  fireEvent.click(getByText('选项3'));
  await wait(600);

  expect(container).toMatchSnapshot();
});

test('options:autoFill', async () => {
  const onSubmit = jest.fn();
  const {container, getByText} = render(
    amisRender(
      {
        type: 'form',
        wrapWithPanel: false,
        data: {},
        controls: [
          {
            label: '选项x',
            type: 'list',
            name: 'select',
            multiple: false,
            autoFill: {
              a: '${label}',
              b: '${value}'
            },
            options: [
              {
                label: '选项1',
                value: 1
              },
              {
                label: '选项2',
                value: 2
              },
              {
                label: '选项3',
                value: 3
              }
            ]
          },

          {
            type: 'submit',
            label: 'Submit'
          }
        ]
      },
      {
        onSubmit
      },
      makeEnv({})
    )
  );

  fireEvent.click(getByText('选项1'));
  await wait(300);
  fireEvent.click(getByText('Submit'));
  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalled();
  });

  // 做了数据填充，预期将对应的值设置上
  expect(onSubmit.mock.calls[0][0]).toMatchObject({
    a: '选项1',
    b: 1,
    select: 1
  });

  fireEvent.click(getByText('选项2'));
  await wait(300);
  fireEvent.click(getByText('Submit'));

  await waitFor(() => {
    expect(onSubmit).toBeCalledTimes(2);
  });

  // 做了切换，预期将对应的值设置上
  expect(onSubmit.mock.calls[1][0]).toMatchObject({
    a: '选项2',
    b: 2,
    select: 2
  });
});

test('options:autoFill-multiple', async () => {
  const onSubmit = jest.fn();
  const {container, getByText} = render(
    amisRender(
      {
        type: 'form',
        wrapWithPanel: false,
        data: {},
        controls: [
          {
            label: '选项x',
            type: 'list',
            name: 'select',
            multiple: true,
            autoFill: {
              a: '${items|pick:label,value}'
            },
            options: [
              {
                label: '选项1',
                value: 1
              },
              {
                label: '选项2',
                value: 2
              },
              {
                label: '选项3',
                value: 3
              }
            ]
          },

          {
            type: 'submit',
            label: 'Submit'
          }
        ]
      },
      {
        onSubmit
      },
      makeEnv({})
    )
  );

  fireEvent.click(getByText('选项1'));
  await wait(300);
  fireEvent.click(getByText('选项2'));
  await wait(300);
  fireEvent.click(getByText('Submit'));
  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalled();
  });

  // 多选模式使用 items 变量的，看看是否设置对了
  expect(onSubmit.mock.calls[0][0]).toMatchObject({
    a: [
      {label: '选项1', value: 1},
      {label: '选项2', value: 2}
    ],
    select: '1,2'
  });
});

test('options:autoFill-merge', async () => {
  const onSubmit = jest.fn();
  const {container, getByText} = render(
    amisRender(
      {
        type: 'form',
        wrapWithPanel: false,
        data: {
          a: {
            b: {
              c: 1
            },
            d: 2
          }
        },
        controls: [
          {
            label: '选项x',
            type: 'list',
            name: 'select',
            multiple: false,
            autoFill: {
              'a.b': '${{d: value}}',
              'd': '${label}'
            },
            options: [
              {
                label: '选项1',
                value: 1
              },
              {
                label: '选项2',
                value: 2
              },
              {
                label: '选项3',
                value: 3
              }
            ]
          },

          {
            type: 'submit',
            label: 'Submit'
          }
        ]
      },
      {
        onSubmit
      },
      makeEnv({})
    )
  );

  fireEvent.click(getByText('选项1'));
  await wait(300);
  fireEvent.click(getByText('Submit'));
  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalled();
  });

  // 特殊用法，左侧 key 是个路径
  // 这个 case，只修改对应的属性，不应该导致这个路径所属的对象，其他属性清空了
  // 右侧始终是 replace 模式，不能出现 merge 情况
  expect(onSubmit.mock.calls[0][0]).toEqual({
    a: {
      b: {
        // 注意，这里没有 c: 1
        d: 1
      },
      d: 2 // 因为只autoFill 了 b 属性，a.d 属性必须保留
    },
    d: '选项1',
    select: 1
  });
});

describe('Renderer: Options with clearable', () => {
  async function setup(config: any = {}) {
    const onSubmit = jest.fn();
    const {container, getByText, ...reset} = render(
      amisRender(
        {
          type: 'form',
          submitText: 'Submit',
          body: [
            {
              label: '选项',
              type: 'select',
              name: 'select',
              clearable: true,
              options: [
                {
                  label: 'Option A',
                  value: 'a'
                },
                {
                  label: 'Option B',
                  value: 'b'
                },
                {
                  label: 'Option C',
                  value: 'c'
                }
              ],
              ...config
            }
          ]
        },
        {onSubmit},
        makeEnv({})
      )
    );

    const submit = async () => {
      fireEvent.click(getByText('Submit'));
      await wait(200);
      return onSubmit.mock.calls;
    };

    const select = async (label: string | RegExp, toOpen: boolean = true) => {
      if (toOpen) {
        fireEvent.click(container.querySelector('.cxd-Select')!);
        await wait(200);
      }
      fireEvent.click(getByText(label));
      await wait(200);
    };

    const clear = async () => {
      fireEvent.click(container.querySelector('.cxd-Select-clear')!);
      await wait(200);
    };

    return {
      ...reset,
      container,
      getByText,
      submit,
      select,
      clear
    };
  }

  test('joinValues: true', async () => {
    const {submit, select, clear} = await setup({
      joinValues: true
    });

    await select(/Option A/);
    expect((await submit())[0][0].select).toBe('a');
    await clear();
    expect((await submit())[1][0].select).toBe('');
  });

  test('joinValues: false', async () => {
    const {submit, select, clear} = await setup({
      joinValues: false
    });

    await select(/Option B/);
    expect((await submit())[0][0].select).toEqual({
      label: 'Option B',
      value: 'b'
    });
    await clear();
    expect((await submit())[1][0].select).toBe('');
  });

  test('joinValues: false, extractValue: true', async () => {
    const {submit, select, clear} = await setup({
      joinValues: false,
      extractValue: true
    });

    await select(/Option C/);
    expect((await submit())[0][0].select).toEqual('c');
    await clear();
    expect((await submit())[1][0].select).toBe('');
  });

  // multiple: true

  test('joinValues: true, multiple: true', async () => {
    const {submit, select, clear} = await setup({
      joinValues: true,
      multiple: true
    });

    await select(/Option A/);
    await select(/Option B/, false);
    expect((await submit())[0][0].select).toBe('a,b');
    await clear();
    expect((await submit())[1][0].select).toBe('');
  });

  test('joinValues: false, multiple: true', async () => {
    const {submit, select, clear} = await setup({
      joinValues: false,
      multiple: true
    });

    await select(/Option A/);
    await select(/Option C/, false);
    expect((await submit())[0][0].select).toEqual([
      {
        label: 'Option A',
        value: 'a'
      },
      {
        label: 'Option C',
        value: 'c'
      }
    ]);
    await clear();
    expect((await submit())[1][0].select).toEqual([]);
  });

  test('joinValues: false, extractValue: true, multiple: true', async () => {
    const {submit, select, clear} = await setup({
      joinValues: false,
      extractValue: true,
      multiple: true
    });

    await select(/Option B/);
    await select(/Option C/, false);
    expect((await submit())[0][0].select).toEqual(['b', 'c']);
    await clear();
    expect((await submit())[1][0].select).toEqual([]);
  });
});
