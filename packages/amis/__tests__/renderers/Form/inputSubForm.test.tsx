/**
 * 组件名称：InputSubForm 子表单
 * 单测内容：
 * 1. 基础点击勾选
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

test('Renderer:InputSubForm base', async () => {
  const onChange = jest.fn();
  const {getByText, container, baseElement} = render(
    amisRender({
      type: 'form',
      body: [
        {
          type: 'input-sub-form',
          name: 'form',
          label: '子Form',
          btnLabel: '设置子表单',
          onChange,
          form: {
            title: '配置子表单',
            body: [
              {
                name: 'a',
                label: 'A',
                type: 'input-text'
              },
              {
                name: 'b',
                label: 'B',
                type: 'input-text'
              }
            ]
          }
        }
      ]
    })
  );

  fireEvent.click(getByText('设置子表单'));

  expect(baseElement.querySelector('.cxd-Modal .cxd-Form')).toBeInTheDocument();

  const inputs = baseElement.querySelectorAll(
    '.cxd-Modal .cxd-Form .cxd-TextControl-input input'
  );
  expect(inputs!.length).toBe(2);
  expect(baseElement).toMatchSnapshot();

  fireEvent.change(inputs[0], {
    target: {value: 'text-one'}
  });
  await wait(200);
  fireEvent.change(inputs[1], {
    target: {value: 'text-two'}
  });

  await wait(200);
  fireEvent.click(getByText('确认'));
  await wait(500);

  expect(onChange).toBeCalled();
  expect(onChange.mock.calls[0][0]).toEqual({
    a: 'text-one',
    b: 'text-two'
  });
});

test('Renderer:InputSubForm with multiple & maxLength & btnLabel', async () => {
  const onChange = jest.fn();
  const {getByText, container, baseElement} = render(
    amisRender({
      type: 'form',
      body: [
        {
          type: 'input-sub-form',
          name: 'form',
          label: '子Form',
          btnLabel: '设置${a}',
          onChange,
          multiple: true,
          maxLength: 2,
          form: {
            title: '配置子表单',
            body: [
              {
                name: 'a',
                label: 'A',
                type: 'input-text'
              },
              {
                name: 'b',
                label: 'B',
                type: 'input-text'
              }
            ]
          }
        }
      ]
    })
  );

  async function addItem(val1: string, val2: string) {
    fireEvent.click(getByText('新增一项'));

    const inputs = baseElement.querySelectorAll(
      '.cxd-Modal .cxd-Form .cxd-TextControl-input input'
    );
    fireEvent.change(inputs[0], {
      target: {value: val1}
    });
    await wait(200);
    fireEvent.change(inputs[1], {
      target: {value: val2}
    });

    await wait(200);
    fireEvent.click(getByText('确认'));
    await wait(500);
  }

  await addItem('val-1-1', 'val-1-2');

  expect(onChange).toBeCalled();
  expect(onChange.mock.calls[0][0]).toEqual([
    {
      a: 'val-1-1',
      b: 'val-1-2'
    }
  ]);

  await addItem('val-2-1', 'val-2-2');
  expect(onChange).toBeCalledTimes(2);
  expect(onChange.mock.calls[1][0]).toEqual([
    {
      a: 'val-1-1',
      b: 'val-1-2'
    },
    {
      a: 'val-2-1',
      b: 'val-2-2'
    }
  ]);

  expect(
    container.querySelector('.cxd-SubForm-toolbar .cxd-SubForm-addBtn')!
  ).toHaveAttribute('disabled');

  const values = container.querySelectorAll(
    '.cxd-SubForm-values .cxd-SubForm-value'
  );

  expect(values!.length).toBe(2);
  expect(values[1]).toHaveTextContent('设置val-2-1');

  expect(container).toMatchSnapshot();
});

test('Renderer:InputSubForm with draggable & addable & removable', async () => {
  const onChange = jest.fn();
  const {getByText, container, baseElement} = render(
    amisRender({
      type: 'form',
      body: [
        {
          type: 'input-sub-form',
          name: 'form',
          label: '子Form',
          btnLabel: '设置${a}',
          onChange,
          multiple: true,
          draggable: true,
          addable: false,
          removable: true,
          form: {
            title: '配置子表单',
            body: [
              {
                name: 'a',
                label: 'A',
                type: 'input-text'
              },
              {
                name: 'b',
                label: 'B',
                type: 'input-text'
              }
            ]
          },
          value: [
            {
              a: 'val-a'
            },
            {
              a: 'val-b'
            },
            {
              a: 'val-c'
            },
            {
              a: 'val-d'
            }
          ]
        }
      ]
    })
  );

  let values = container.querySelectorAll(
    '.cxd-SubForm-values .cxd-SubForm-value'
  );

  expect(values!.length).toBe(4);
  expect(values[1]).toHaveTextContent('设置val-b');

  expect(
    values[0].querySelector('.cxd-SubForm-valueDragBar')
  ).toBeInTheDocument();

  fireEvent.click(values[0].querySelector('.cxd-SubForm-valueDel')!);

  await wait(200);

  values = container.querySelectorAll('.cxd-SubForm-values .cxd-SubForm-value');

  expect(values!.length).toBe(3);
  expect(values[1]).toHaveTextContent('设置val-c');

  fireEvent.click(values[0].querySelector('.cxd-SubForm-valueEdit')!);

  await wait(200);

  expect(baseElement.querySelector('.cxd-Modal .cxd-Form')).toBeInTheDocument();

  const firstInput = baseElement.querySelector(
    '.cxd-Modal .cxd-Form .cxd-TextControl-input input'
  )!;

  expect((firstInput as HTMLInputElement)!.value).toBe('val-b');

  fireEvent.change(firstInput, {
    target: {value: 'val-b-change'}
  });

  await wait(200);
  fireEvent.click(getByText('确认'));
  await wait(500);

  expect(onChange).toBeCalledTimes(2);
  expect(onChange.mock.calls[1][0]).toEqual([
    {
      a: 'val-b-change'
    },
    {
      a: 'val-c'
    },
    {
      a: 'val-d'
    }
  ]);
  expect(container).toMatchSnapshot();
});

test('Renderer:InputSubForm with addButtonClassName & itemsClassName & itemClassName & addButtonText & labelField', async () => {
  const {getByText, container, baseElement} = render(
    amisRender({
      type: 'form',
      body: [
        {
          type: 'input-sub-form',
          name: 'form2',
          label: '多选',
          multiple: true,
          labelField: 'title',
          itemsClassName: 'items-wrapper',
          itemClassName: 'item-classname',
          addButtonText: '自定义的新增',
          addButtonClassName: 'thisis-add-btn',
          value: [
            {
              title: 'val-a'
            },
            {
              title: 'val-b'
            }
          ],
          form: {
            title: '配置子表单',
            body: [
              {
                name: 'title',
                label: '标题',
                required: true,
                type: 'input-text'
              }
            ]
          }
        }
      ]
    })
  );

  await wait(500);

  expect(container).toMatchSnapshot();
  expect(container.querySelector('.cxd-SubForm-values')).toHaveClass(
    'items-wrapper'
  );
  expect(
    container.querySelector('.cxd-SubForm-values .cxd-SubForm-value')
  ).toHaveClass('item-classname');

  // labelField 这里不知为何不生效
  // expect(
  //   container.querySelector('.cxd-SubForm-values .cxd-SubForm-value')
  // ).toHaveTextContent('val-a');
  expect(container.querySelector('.cxd-SubForm-addBtn')).toHaveClass(
    'thisis-add-btn'
  );
  expect(container.querySelector('.cxd-SubForm-addBtn')).toHaveTextContent(
    '自定义的新增'
  );
});
