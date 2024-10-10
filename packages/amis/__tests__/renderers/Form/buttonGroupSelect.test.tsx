/**
 * 组件名称：Button-Group-Select 按钮点选
 * 单测内容：
 1. 基本用法
 2. clearable
 3. vertical
 4. tiled
 5. btnActiveLevel
 */

import {render, cleanup, fireEvent, waitFor} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';
import {clearStoresCache} from '../../../src';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

// 1. 基本用法
test('Renderer:button-group-select', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        controls: [
          {
            type: 'button-group',
            name: 'select',
            label: '单选',
            options: [
              {
                label: 'Option A',
                value: 'a'
              },
              {
                label: 'Option B',
                value: 'b'
              }
            ]
          },
          {
            type: 'static',
            name: 'select',
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
});

// 2. clearable
test('Renderer:button-group:multiple clearable', async () => {
  const {getByText, container, findByText} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        controls: [
          {
            type: 'button-group',
            name: 'select',
            label: '多选',
            multiple: true,
            clearable: true,
            options: [
              {
                label: 'Option A',
                value: 'a'
              },
              {
                label: 'Option B',
                value: 'b'
              }
            ]
          },
          {
            type: 'static',
            name: 'select',
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
  // 这个是为了用于监视值是否变更完成
  const refDom = container.querySelector('.cxd-PlainField') as Element;

  fireEvent.click(await findByText(/Option A/));
  await waitFor(() => expect(refDom.innerHTML).toBe('a'));
  expect(container).toMatchSnapshot();

  fireEvent.click(await findByText(/Option B/));
  await waitFor(() => expect(refDom.innerHTML).toBe('a,b'));
  expect(container).toMatchSnapshot();

  fireEvent.click(await findByText(/Option B/));
  await waitFor(() => expect(refDom.innerHTML).toBe('a'));
  expect(container).toMatchSnapshot();
});

// 3. vertical
test('Renderer:button-group with vertical', async () => {
  const {getByText, container, findByText} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        controls: [
          {
            type: 'button-group',
            name: 'select',
            label: '多选',
            vertical: true,
            options: [
              {
                label: 'Option A',
                value: 'a'
              },
              {
                label: 'Option B',
                value: 'b'
              }
            ]
          }
        ],
        submitText: null,
        actions: []
      },
      {},
      makeEnv()
    )
  );

  expect(
    container.querySelector('.cxd-ButtonGroup.cxd-ButtonGroup--vertical')!
  ).toBeInTheDocument();

  expect(container).toMatchSnapshot();
});

// 4. tiled
test('Renderer:button-group with tiled', async () => {
  const {getByText, container, findByText} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        controls: [
          {
            type: 'button-group',
            name: 'select',
            label: '多选',
            tiled: true,
            options: [
              {
                label: 'Option A',
                value: 'a'
              },
              {
                label: 'Option B',
                value: 'b'
              }
            ]
          }
        ],
        submitText: null,
        actions: []
      },
      {},
      makeEnv()
    )
  );

  expect(
    container.querySelector('.cxd-ButtonGroup.cxd-ButtonGroup--tiled')!
  ).toBeInTheDocument();

  expect(container).toMatchSnapshot();
});

// 5. btnActiveLevel
test('Renderer:button-group with btnActiveLevel', async () => {
  const {getByText, container, findByText} = render(
    amisRender(
      {
        type: 'form',
        title: 'The form',
        controls: [
          {
            type: 'button-group-select',
            label: '选项',
            name: 'type',
            btnLevel: 'light',
            btnActiveLevel: 'warning',
            value: 'a',
            options: [
              {
                label: 'Option A',
                value: 'a',
                level: 'primary'
              },
              {
                label: 'Option B',
                value: 'b',
                level: 'primary'
              },
              {
                label: 'Option C',
                value: 'c'
              }
            ]
          }
        ],
        submitText: null,
        actions: []
      },
      {},
      makeEnv()
    )
  );

  const buttons = container.querySelectorAll('.cxd-ButtonGroup .cxd-Button')!;
  expect(buttons.length).toBe(3);

  expect(container).toMatchSnapshot();
  expect(buttons[0]).toHaveClass('cxd-Button--warning');
  expect(buttons[1]).toHaveClass('cxd-Button--primary');
  expect(buttons[2]).toHaveClass('cxd-Button--light');
});
