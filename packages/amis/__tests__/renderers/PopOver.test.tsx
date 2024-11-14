/**
 * 组件名称：PopOver 弹出提示
 * 单测内容：
 * 1. 在 table 中使用
 * 2. 触发方式 & 是否显示icon & 标题 & 位置 & 触发条件
 * 3. offset 偏移量
 * 4. 展示模式和尺寸
 */

import React from 'react';
import {
  render,
  fireEvent,
  cleanup,
  waitFor,
  getByText
} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {wait, makeEnv} from '../helper';
import {clearStoresCache} from '../../src';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

function formatStyleObject(style: string | null, px2number = true) {
  if (!style) {
    return {};
  }

  // 去除注释 /* xx */
  style = style.replace(/\/\*[^(\*\/)]*\*\//g, '');

  const res: any = {};
  style.split(';').forEach((item: string) => {
    if (!item || !String(item).includes(':')) return;

    const [key, value] = item.split(':');

    res[String(key).trim()] =
      px2number && value.endsWith('px')
        ? Number(String(value).replace(/px$/, ''))
        : String(value).trim();
  });

  return res;
}

test('Renderer:PopOver in table', async () => {
  const {container, rerender, getByText} = render(
    amisRender({
      type: 'page',
      data: {
        rows: [
          {
            engine: '内容一',
            hidden: '隐藏内容一'
          },
          {
            engine: '内容二',
            hidden: '隐藏内容二'
          }
        ]
      },
      body: {
        type: 'table',
        title: '表格1',
        source: '$rows',
        columns: [
          {
            name: 'engine',
            label: 'Engine',
            popOver: '弹出内容：${hidden}'
          }
        ]
      }
    })
  );

  const popOverBtn = container.querySelector(
    '.cxd-Field--popOverAble .cxd-Field-popOverBtn'
  )!;
  expect(popOverBtn).toBeInTheDocument();

  fireEvent.click(popOverBtn);
  await wait(200);
  expect(getByText('弹出内容：隐藏内容一')).toBeInTheDocument();
  // expect(container).toMatchSnapshot();
});

test('Renderer:PopOver with trigger & showIcon & title & position & popOverEnableOn', async () => {
  const {container, rerender, getByText} = render(
    amisRender({
      type: 'page',
      data: {
        rows: [
          {
            engine: '内容一',
            version: '1.1',
            hidden: '隐藏内容一'
          },
          {
            engine: '内容二',
            version: '2.1',
            hidden: '隐藏内容二'
          }
        ]
      },
      body: {
        type: 'table',
        title: '表格2',
        source: '$rows',
        columns: [
          {
            name: 'engine',
            label: 'Engine',
            width: 100,
            popOver: {
              position: 'left-top',
              body: {
                type: 'tpl',
                tpl: '弹出内容：${hidden}'
              }
            },
            popOverEnableOn: "this.version == '1.1'"
          },
          {
            name: 'version',
            label: 'Version',
            width: 100,
            popOver: {
              trigger: 'hover',
              position: 'right-top',
              showIcon: false,
              title: '标题',
              body: {
                type: 'tpl',
                tpl: '${version}'
              }
            }
          }
        ]
      }
    })
  );

  const btns = container.querySelectorAll(
    '.cxd-Field--popOverAble .cxd-Field-popOverBtn'
  )!;

  expect(btns.length).toBe(1);
  fireEvent.click(btns[0]!);

  const popOverNode = container.querySelector(
    '.cxd-PopOver.cxd-PopOverAble-popover'
  )!;

  expect(popOverNode).toBeInTheDocument();
  expect(formatStyleObject(popOverNode!.getAttribute('style'))!.left).toEqual(
    0
  );

  fireEvent.mouseEnter(getByText('1.1'));

  await wait(200);

  const popOverNode2 = container.querySelector(
    '.cxd-PopOver.cxd-PopOverAble-popover'
  )!;
  expect(popOverNode2).toBeInTheDocument();

  // expect(
  //   formatStyleObject(popOverNode2!.getAttribute('style'))!.left
  // ).not.toEqual(0);
  expect(getByText('标题')).toBeInTheDocument();
  // expect(container).toMatchSnapshot();
});

test('Renderer:PopOver with offset', async () => {
  const schema = {
    name: 'static',
    type: 'static',
    label: '静态展示',
    value: 'static',
    popOver: {
      body: '我是提示内容'
    }
  };
  const {container, rerender} = render(amisRender(schema));

  expect(container).toMatchSnapshot('default');

  fireEvent.click(container.querySelector('.cxd-Field-popOverBtn')!);
  await wait(200);

  expect(container.querySelector('.cxd-PopOver')).toBeInTheDocument();
  const noOffsetStyle = formatStyleObject(
    container.querySelector('.cxd-PopOver')!.getAttribute('style')
  );

  expect(container).toMatchSnapshot('show popover no offset');

  rerender(
    amisRender({
      ...schema,
      popOver: {
        ...schema.popOver,
        offset: {
          left: 101,
          top: 102
        }
      }
    })
  );
  await wait(300);
  expect(container).toMatchSnapshot('show popover with offset');

  const offsetStyle = formatStyleObject(
    container.querySelector('.cxd-PopOver')!.getAttribute('style')
  );

  expect(offsetStyle.left - noOffsetStyle.left).toEqual(101);
  expect(offsetStyle.top - noOffsetStyle.top).toEqual(102);
});

test('Renderer:PopOver with mode & size', async () => {
  const {container, rerender, baseElement} = render(
    amisRender({
      name: 'static',
      type: 'static',
      label: '静态展示',
      value: 'static',
      popOver: {
        mode: 'dialog',
        size: 'xl',
        body: {
          type: 'tpl',
          tpl: '弹框内容'
        }
      }
    })
  );

  fireEvent.click(container.querySelector('.cxd-Field-popOverBtn')!);
  await wait(200);
  expect(
    baseElement.querySelector('.cxd-Modal.cxd-Modal--xl')
  ).toBeInTheDocument();

  fireEvent.click(baseElement.querySelector('.cxd-Modal-close')!);
  await wait(300);

  rerender(
    amisRender({
      name: 'static',
      type: 'static',
      label: '静态展示',
      value: 'static',
      popOver: {
        mode: 'drawer',
        size: 'sm',
        body: {
          type: 'tpl',
          tpl: '弹框内容'
        }
      }
    })
  );

  fireEvent.click(container.querySelector('.cxd-Field-popOverBtn')!);
  await wait(200);
  expect(
    baseElement.querySelector('.cxd-Drawer.cxd-Drawer--sm')
  ).toBeInTheDocument();
});
