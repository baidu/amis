import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react';
import {ConditionBuilder} from 'amis-ui';

const fields = [
  {label: 'AText', type: 'text' as const, name: 'a'},
  {label: 'BText', type: 'text' as const, name: 'b'}
];

const initialValue = {
  id: 'root',
  conjunction: 'and' as const,
  children: fields.map(field => ({
    id: field.name,
    left: {type: 'field' as const, field: field.name},
    op: 'equal' as const,
    right: field.name
  }))
};

function dragFirstAfterSecond(container: HTMLElement) {
  const handles = container.querySelectorAll('.cxd-CBGroupOrItem-dragbar');
  expect(handles).toHaveLength(2);
  const start = new MouseEvent('dragstart', {bubbles: true, clientY: 0});
  Object.defineProperty(start, 'dataTransfer', {
    value: {setDragImage: jest.fn()}
  });
  fireEvent(handles[0], start);
  fireEvent(
    handles[1],
    new MouseEvent('dragover', {bubbles: true, clientY: 100})
  );
  fireEvent(handles[1], new MouseEvent('drop', {bubbles: true}));
  fireEvent(handles[0], new MouseEvent('dragend', {bubbles: true}));
}

test('condition-builder sorts new picker conditions before confirmation', async () => {
  const onChange = jest.fn();
  const {baseElement, findByText} = render(
    <ConditionBuilder
      embed={false}
      fields={fields}
      placeholder="Configure conditions"
      onChange={onChange}
    />
  );

  fireEvent.click(await findByText('Configure conditions'));
  for (const field of fields) {
    fireEvent.click(await findByText('添加条件'));
    fireEvent.click(await findByText('请选择字段'));
    fireEvent.click(await findByText(field.label));
  }

  dragFirstAfterSecond(baseElement);
  expect(onChange).not.toHaveBeenCalled();
  fireEvent.click(await findByText('确认'));
  await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
  expect(
    onChange.mock.calls[0][0].children.map((item: any) => item.left.field)
  ).toEqual(['b', 'a']);
});

test('condition-builder cancellation discards picker sorting', async () => {
  const onChange = jest.fn();
  const {baseElement, findByText} = render(
    <ConditionBuilder
      embed={false}
      fields={fields}
      value={initialValue}
      onChange={onChange}
    />
  );

  fireEvent.click(baseElement.querySelector('.cxd-ResultBox')!);
  await findByText('AText');
  dragFirstAfterSecond(baseElement);
  expect(onChange).not.toHaveBeenCalled();
  const order = () =>
    Array.from(
      baseElement.querySelectorAll('.cxd-Modal .cxd-CBGroupOrItem')
    ).map(item => item.getAttribute('data-id'));
  expect(order()).toEqual(['b', 'a']);
  fireEvent.click(await findByText('取消'));
  expect(onChange).not.toHaveBeenCalled();
  expect(initialValue.children.map(item => item.left.field)).toEqual([
    'a',
    'b'
  ]);
  await waitFor(() => expect(order()).toEqual([]));
  fireEvent.click(baseElement.querySelector('.cxd-ResultBox')!);
  await findByText('AText');
  expect(order()).toEqual(['a', 'b']);
});

test('condition-builder embedded sorting updates immediately', async () => {
  const onChange = jest.fn();
  const {baseElement, findByText} = render(
    <ConditionBuilder
      fields={fields}
      value={initialValue}
      onChange={onChange}
    />
  );

  await findByText('AText');
  dragFirstAfterSecond(baseElement);
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(
    onChange.mock.calls[0][0].children.map((item: any) => item.left.field)
  ).toEqual(['b', 'a']);
});
