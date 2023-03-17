/**
 * 功能名称：autoFill 自动填充
 * 单测内容：
 * 01. 字段填充
 * 02. 字段填充 & 提交表单
 * 03. 字段填充的表单项name为对象路径格式
 * 04. 字段填充（多选模式）
 * 05. 字段填充后正常触发表单项校验 & validateOnChange正常触发
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

afterEach(() => {
  cleanup();
  clearStoresCache();
});

const optisons = [
  {label: 'OptionA', value: 'a'},
  {label: 'OptionB', value: 'b'}
];

test('Form:options:autoFill', async () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        body: [
          {
            type: 'radios',
            name: 'a',
            autoFill: {
              aValue: '${value}',
              aLabel: '${label}',
              aId: '${id}'
            },
            options: [
              {
                label: 'OptionA',
                value: 'a',
                id: 233
              },
              {
                label: 'OptionB',
                value: 'b'
              }
            ]
          },
          {
            type: 'input-text',
            name: 'a'
          },
          {
            type: 'input-text',
            name: 'aValue'
          },
          {
            type: 'input-text',
            name: 'aLabel'
          },
          {
            type: 'input-text',
            name: 'aId'
          }
        ],
        submitText: null,
        actions: []
      },
      {},
      makeEnv()
    )
  );

  // expect(container).toMatchSnapshot();
  fireEvent.click(getByText(/OptionA/));
  await wait(500);

  expect(container.querySelector('input[name=a]')?.getAttribute('value')).toBe(
    'a'
  );
  expect(
    container.querySelector('input[name=aValue]')?.getAttribute('value')
  ).toBe('a');
  expect(
    container.querySelector('input[name=aLabel]')?.getAttribute('value')
  ).toBe('OptionA');
  expect(
    container.querySelector('input[name=aId]')?.getAttribute('value')
  ).toBe('233');

  fireEvent.click(getByText(/OptionB/));
  await wait(1000);

  expect(container.querySelector('input[name=a]')?.getAttribute('value')).toBe(
    'b'
  );
  expect(
    container.querySelector('input[name=aValue]')?.getAttribute('value')
  ).toBe('b');
  expect(
    container.querySelector('input[name=aLabel]')?.getAttribute('value')
  ).toBe('OptionB');
  expect(
    container.querySelector('input[name=aId]')?.getAttribute('value')
  ).toBe('');
});

test('Form:options:autoFill:data', async () => {
  const onSubmit = jest.fn();
  const {debug, container, getByText, findByText} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        controls: [
          {
            type: 'radios',
            name: 'a',
            autoFill: {
              aValue: '${value}',
              aLabel: '${label}',
              aId: '${id}'
            },
            options: [
              {
                label: 'OptionA',
                value: 'a',
                id: 233
              },
              {
                label: 'OptionB',
                value: 'b'
              }
            ]
          }
        ],
        submitText: 'Submit'
      },
      {
        onSubmit: onSubmit
      },
      makeEnv()
    )
  );

  fireEvent.click(await findByText(/OptionA/));
  await wait(500);
  fireEvent.click(getByText(/Submit/));
  await wait(200);

  expect(onSubmit).toBeCalled();
  expect(onSubmit.mock.calls[0][0]).toMatchSnapshot();

  fireEvent.click(getByText(/OptionB/));
  await wait(500);
  fireEvent.click(getByText(/Submit/));
  await wait(200);

  expect(onSubmit).toBeCalledTimes(2);
  expect(onSubmit.mock.calls[1][0]).toMatchSnapshot();
});

test('Form:options:autoFill:keyWithPath', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        body: [
          {
            type: 'radios',
            label: 'trigger',
            name: 'trigger',
            autoFill: {
              'receiver.target1': '${value}',
              'receiver.target2': '${value}'
            },
            options: [
              {label: 'OptionA', value: 'a'},
              {label: 'OptionB', value: 'b'}
            ]
          },
          {
            type: 'input-text',
            name: 'receiver.target1',
            label: 'receiver.target1'
          },
          {
            type: 'input-text',
            name: 'receiver.target2',
            label: 'receiver.target2'
          },
          {
            type: 'input-text',
            name: 'standalone',
            label: 'standalone',
            value: 'abc'
          }
        ]
      },
      {},
      makeEnv()
    )
  );

  const triggerA = await screen.findByText(/OptionA/);
  const triggerB = await screen.findByText(/OptionB/);
  const target1 = container.querySelector(
    'input[name=receiver\\.target1]'
  ) as HTMLInputElement;
  const target2 = container.querySelector(
    'input[name=receiver\\.target2]'
  ) as HTMLInputElement;
  const standalone = container.querySelector(
    'input[name=standalone]'
  ) as HTMLInputElement;

  fireEvent.click(triggerA);
  await wait(1000);
  expect(target1.getAttribute('value')).toEqual('a');
  expect(target2.getAttribute('value')).toEqual('a');
  expect(standalone.getAttribute('value')).toEqual('abc');

  fireEvent.click(triggerB);
  await wait(1000);

  expect(target1.getAttribute('value')).toEqual('b');
  expect(target2.getAttribute('value')).toEqual('b');
  expect(standalone.getAttribute('value')).toEqual('abc');
});

test('Form:options:autoFill:multiple:data', async () => {
  const onSubmit = jest.fn();
  const {container, getByText, findByText} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        controls: [
          {
            type: 'radios',
            name: 'a',
            multiple: true,
            autoFill: {
              aValues: '${items|pick:value}',
              aLabels: '${items|pick:label}',
              aIds: '${items|pick:id}'
            },
            options: [
              {
                label: 'OptionA',
                value: 'a',
                id: 233
              },
              {
                label: 'OptionB',
                value: 'b'
              }
            ]
          }
        ],
        submitText: 'Submit'
      },
      {
        onSubmit: onSubmit
      },
      makeEnv()
    )
  );

  fireEvent.click(await findByText(/OptionA/));
  await wait(500);
  fireEvent.click(getByText(/Submit/));
  await wait(200);

  expect(onSubmit).toBeCalled();
  expect(onSubmit.mock.calls[0][0]).toMatchSnapshot();

  fireEvent.click(getByText(/OptionB/));
  await wait(500);
  fireEvent.click(getByText(/Submit/));
  await wait(200);

  expect(onSubmit).toBeCalledTimes(2);
  expect(onSubmit.mock.calls[1][0]).toMatchSnapshot();
});

test('Form:options:autoFill:validation', async () => {
  const onSubmitFn = jest.fn();
  const submitText = 'Submit';
  const validationMsg1 = '选项1校验失败，数据必须为Option B';
  const validationMsg2 = '选项2校验失败，数据必须为Option B';
  const {container} = render(
    amisRender(
      {
        type: 'form',
        submitText,
        body: [
          {
            type: 'select',
            label: '选项',
            name: 'select',
            placeholder: 'SelectCompt',
            autoFill: {
              instantValidate: '${label}',
              submitValidate: '${label}'
            },
            clearable: true,
            options: [
              {label: 'OptionA', value: 'a'},
              {label: 'OptionB', value: 'b'}
            ]
          },
          {
            type: 'input-text',
            name: 'instantValidate',
            label: '选项1',
            placeholder: '选项1',
            description: '填充后立即校验',
            required: true,
            validateOnChange: true,
            validations: {
              equals: 'OptionB'
            },
            validationErrors: {
              equals: validationMsg1
            }
          },
          {
            type: 'input-text',
            name: 'submitValidate',
            label: '选项2',
            placeholder: '选项2',
            description: '填充后提交表单时才校验',
            required: true,
            validations: {
              equals: 'OptionB'
            },
            validationErrors: {
              equals: validationMsg2
            }
          }
        ]
      },
      {onSubmit: onSubmitFn},
      makeEnv({})
    )
  );

  const select = container.querySelector(
    'span[class*=Select-arrow]'
  ) as HTMLDivElement;
  const option1 = container.querySelector(
    'input[name=instantValidate]'
  ) as HTMLInputElement;
  const option2 = container.querySelector(
    'input[name=submitValidate]'
  ) as HTMLInputElement;
  const submitBtn = screen.getByRole('button', {name: submitText});

  // 自动填充触发后生成校验信息
  fireEvent.click(select);
  await wait(300);
  fireEvent.click(screen.getByText(/OptionA/));
  await wait(1000);
  expect(option1.getAttribute('value')).toEqual('OptionA');
  expect(option2.getAttribute('value')).toEqual('OptionA');
  expect(screen.queryByText(validationMsg1)).toBeInTheDocument();

  // 提交后校验选项2
  fireEvent.click(submitBtn);
  await wait(500);
  expect(screen.queryByText(validationMsg2)).toBeInTheDocument();

  // 自动填充再次触发后validateOnChange的选项消除校验信息
  fireEvent.click(select);
  await wait(300);
  fireEvent.click(screen.getByText(/OptionB/));
  await wait(1000);
  expect(option1.getAttribute('value')).toEqual('OptionB');
  expect(option1.getAttribute('value')).toEqual('OptionB');
  expect(screen.queryByText(validationMsg1)).not.toBeInTheDocument();
  expect(screen.queryByText(validationMsg2)).toBeInTheDocument();

  // 提交后校验信息全部消除
  fireEvent.click(submitBtn);
  await wait(500);
  expect(screen.queryByText(validationMsg1)).not.toBeInTheDocument();
  expect(screen.queryByText(validationMsg2)).not.toBeInTheDocument();
});
