/**
 * 组件名称：Collapse 折叠器
 *
 * 单测内容：
 * 1. 基本用法
 * 2. accordion 手风琴模式
 * 3. 自定义图标
 * 4. disabled 禁用 和 面板嵌套
 */
import {render, fireEvent, waitFor} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv, wait} from '../helper';

// 1. 基本用法
test('Renderer:Collapse', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'collapse-group',
        activeKey: ['1', '2'],
        body: [
          {
            type: 'collapse',
            key: '1',
            header: '标题1',
            body: '这里是内容1'
          },
          {
            type: 'collapse',
            key: '2',
            header: '标题2',
            body: '这里是内容2'
          },
          {
            type: 'collapse',
            key: '3',
            header: '标题3',
            body: '这里是内容3'
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  const items = container.querySelectorAll(
    '.cxd-CollapseGroup > .cxd-Collapse'
  );
  expect(items.length).toBe(3);
  expect(items[0]).toHaveClass('is-active');
  expect(items[1]).toHaveClass('is-active');
  expect(items[2]).not.toHaveClass('is-active');

  fireEvent.click(items[2].firstElementChild!);
  await wait(200);
  expect(items[2]).toHaveClass('is-active');

  expect(container).toMatchSnapshot();
});

// 2. accordion 手风琴模式
test('Renderer:Collapse with accordion', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'collapse-group',
        activeKey: ['1'],
        accordion: true,
        body: [
          {
            type: 'collapse',
            key: '1',
            header: '标题1',
            body: '这里是内容1'
          },
          {
            type: 'collapse',
            key: '2',
            header: '标题2',
            body: '这里是内容2'
          },
          {
            type: 'collapse',
            key: '3',
            header: '标题3',
            body: '这里是内容3'
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  const items = container.querySelectorAll(
    '.cxd-CollapseGroup > .cxd-Collapse'
  );
  expect(items.length).toBe(3);
  expect(items[0]).toHaveClass('is-active');
  expect(items[1]).not.toHaveClass('is-active');
  expect(items[2]).not.toHaveClass('is-active');

  fireEvent.click(items[2].firstElementChild!);
  await wait(200);
  expect(items[0]).not.toHaveClass('is-active');
  expect(items[1]).not.toHaveClass('is-active');
  expect(items[2]).toHaveClass('is-active');
});

// 3. 自定义图标
test('Renderer:Collapse with expandIcon & expandIconPosition & showArrow', async () => {
  const schema = {
    type: 'collapse-group',
    activeKey: ['1'],
    expandIcon: {
      type: 'icon',
      icon: 'caret-right'
    },
    body: [
      {
        type: 'collapse',
        key: '1',
        header: '标题1',
        body: '这里是内容1'
      },
      {
        type: 'collapse',
        key: '2',
        header: '标题2',
        body: '这里是内容2'
      },
      {
        type: 'collapse',
        key: '3',
        header: '标题3',
        body: '这里是内容3',
        showArrow: false
      }
    ]
  };
  const {container, rerender} = render(amisRender(schema, {}, makeEnv({})));

  const item = container.querySelector(
    '.cxd-Collapse.is-active .cxd-Collapse-icon-tranform'
  )!;
  expect(item).toHaveClass('fa-caret-right');

  expect(
    container.querySelector('.cxd-Collapse:last-of-type')!.firstElementChild!
  ).not.toHaveClass('cxd-Collapse-icon-tranform');

  rerender(
    amisRender({...schema, expandIconPosition: 'right'}, {}, makeEnv({}))
  );

  await wait(200);
  expect(container.querySelector('.cxd-CollapseGroup')!).toHaveClass(
    'icon-position-right'
  );
  expect(container).toMatchSnapshot();
});

// 4. disabled 禁用 和 面板嵌套
test('Renderer:Collapse with disabled & panel nesting', async () => {
  const schema = {
    type: 'collapse-group',
    activeKey: ['1'],
    body: [
      {
        type: 'collapse',
        key: '1',
        header: '标题1',
        body: {
          type: 'collapse-group',
          activeKey: ['1'],
          body: [
            {
              type: 'collapse',
              key: '1',
              header: '嵌套面板标题',
              body: '嵌套面板内容'
            }
          ]
        }
      },
      {
        type: 'collapse',
        key: '3',
        header: '标题3',
        body: '这里是内容3',
        className: 'lastOne',
        disabled: true
      }
    ]
  };
  const {container, rerender} = render(amisRender(schema, {}, makeEnv({})));

  expect(container).toMatchSnapshot();
  expect(
    container.querySelector('.cxd-Collapse-content')!.firstElementChild!
  ).toHaveClass('cxd-CollapseGroup');
  expect(container.querySelector('.lastOne')!).toHaveClass(
    'cxd-Collapse--disabled'
  );
});
