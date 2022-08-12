/**
 * 组件名称：InputArray 数组输入框
 * 单测内容：
 * 1. 修改组件内容 value
 * 2. 是否可删除 removable、是否可新增 addable 与 新增按钮文字 addButtonText
 * 3. 输入最小长度 minLength 与 最大长度 maxLength
 * 4. 是否可拖拽排序 draggable 与 可拖拽的提示文字 draggableTip
 */

import React from 'react';
import {render, fireEvent, waitFor, screen} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';

const setup = (items: any[] = []) => {
  const onSubmit = jest.fn();
  const utils = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          submitText: 'Submit',
          api: '/api/mock/saveForm?waitSeconds=1',
          mode: 'horizontal',
          body: items
        }
      },
      {onSubmit},
      makeEnv()
    )
  );

  const submitBtn = utils.container.querySelector(
    'button[type="submit"]'
  ) as HTMLElement;

  return {
    onSubmit,
    submitBtn,
    ...utils
  };
};

test('Renderer:inputArray', async () => {
  const onSubmit = jest.fn();
  const submitBtnText = 'Submit';
  const {container, findByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          submitText: submitBtnText,
          api: '/api/mock/saveForm?waitSeconds=1',
          mode: 'horizontal',
          body: [
            {
              name: 'array',
              label: '颜色集合',
              type: 'input-array',
              inline: true,
              items: {
                type: 'input-text',
                clearable: false
              }
            }
          ]
        }
      },
      {onSubmit},
      makeEnv({})
    )
  );

  const addButton = await findByText('新增');
  fireEvent.click(addButton);

  await wait(500);
  const input = container.querySelector('.cxd-TextControl-input input')!;
  fireEvent.change(input, {target: {value: 'amis'}});

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
    array: ['amis']
  });

  expect(container).toMatchSnapshot();
});

test('Renderer:inputArray with removable & addable & addButtonText', async () => {
  const {container: containerOne} = setup([
    {
      name: 'array',
      label: '颜色集合',
      type: 'input-array',
      inline: true,
      removable: false,
      addable: false,
      items: {
        type: 'input-text'
      },
      value: ['red', 'blue']
    }
  ]);

  await wait(500);

  expect(
    containerOne.querySelector('.cxd-Combo-delBtn')
  ).not.toBeInTheDocument();
  expect(
    containerOne.querySelector('.cxd-Combo-addBtn')
  ).not.toBeInTheDocument();
  expect(containerOne).toMatchSnapshot('false');

  const {container, onSubmit, submitBtn} = setup([
    {
      name: 'array',
      label: '颜色集合',
      type: 'input-array',
      inline: true,
      removable: true,
      addable: true,
      items: {
        type: 'input-text'
      },
      value: ['red', 'blue'],
      addButtonText: '我是增加按钮'
    }
  ]);
  await wait(500);
  const delButton = container.querySelector('a.cxd-Combo-delBtn');
  expect(container.querySelectorAll('a.cxd-Combo-delBtn').length).toBe(2);
  const addButton = container.querySelector('.cxd-Combo-addBtn')!;

  expect(delButton).toBeInTheDocument();
  expect(addButton).toBeInTheDocument();
  expect((addButton.querySelector('span') as Element).innerHTML).toBe(
    '我是增加按钮'
  );

  fireEvent.click(delButton!);

  await wait(500);

  fireEvent.click(submitBtn);

  await wait(500);
  const formData = onSubmit.mock.calls[0][0];
  expect(onSubmit).toHaveBeenCalled();
  expect(formData).toEqual({
    array: ['blue']
  });

  expect(container).toMatchSnapshot('false');
});

test('Renderer:inputArray with minLength & maxLength', async () => {
  const {container} = setup([
    {
      name: 'array',
      label: '颜色集合',
      type: 'input-array',
      inline: true,
      removable: true,
      addable: true,
      minLength: 2,
      maxLength: 4,
      items: {
        type: 'input-text'
      },
      value: ['red', 'blue', 'green']
    }
  ]);
  await wait(500);

  // 范围内的，增删都在
  expect(container.querySelector('a.cxd-Combo-delBtn')).toBeInTheDocument();
  expect(container.querySelector('.cxd-Combo-addBtn')).toBeInTheDocument();
  // 最大值
  fireEvent.click(container.querySelector('.cxd-Combo-addBtn')!);
  await wait(500);
  expect(container.querySelector('a.cxd-Combo-delBtn')).toBeInTheDocument();
  expect(container.querySelector('.cxd-Combo-addBtn')).not.toBeInTheDocument();
  // 最小值
  fireEvent.click(container.querySelector('a.cxd-Combo-delBtn')!);
  await wait(500);
  fireEvent.click(container.querySelector('a.cxd-Combo-delBtn')!);
  await wait(500);
  expect(container.querySelector('a.cxd-Combo-delBtn')).not.toBeInTheDocument();
  expect(container.querySelector('.cxd-Combo-addBtn')).toBeInTheDocument();

  expect(container).toMatchSnapshot();
});

test('Renderer:inputArray with draggable & draggableTip', async () => {
  const {container, onSubmit, submitBtn} = setup([
    {
      name: 'array',
      label: '颜色集合',
      type: 'input-array',
      inline: true,
      draggable: true,
      draggableTip: '我是拖拽提示',
      items: {
        type: 'input-text'
      },
      value: ['red', 'blue', 'green']
    }
  ]);
  await wait(500);

  const drager = container.querySelector('.cxd-Combo-itemDrager')!;
  expect(drager).toBeInTheDocument();
  expect(container.querySelectorAll('.cxd-Combo-itemDrager').length).toBe(3);

  expect(container.querySelector('.cxd-Combo-dragableTip')).toBeInTheDocument();
  expect(
    (container.querySelector('.cxd-Combo-dragableTip') as Element).innerHTML
  ).toBe('我是拖拽提示');

  expect(container).toMatchSnapshot();
});
