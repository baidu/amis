/**
 * 组件名称：Search Box 搜索框
 * 单测内容：
 * 1. 基础使用
 * 2. 加强样式 enhance
 * 3. 可清除 clearable
 * 4. mini 模式
 * 5. 立即搜索 searchImediately、样式 className
 * 6. Composition触发
 */

import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv, wait} from '../helper';

test('Renderer:Searchbox', async () => {
  const fetcher = jest.fn();
  const {container} = render(
    amisRender(
      {
        type: 'page',
        initApi: '/api/xxx?keywords=${keywords}',
        body: [
          {
            type: 'search-box',
            name: 'keywords'
          }
        ]
      },
      {},
      makeEnv({
        fetcher,
        session: 'in-search-box-1'
      })
    )
  );

  await wait(1000);

  expect(fetcher).toHaveBeenCalledTimes(1);
  expect(fetcher.mock.calls[0][0].query).toEqual({
    keywords: ''
  });

  fireEvent.change(container.querySelector('.cxd-SearchBox input')!, {
    target: {value: 'searchkey'}
  });

  await wait(200);

  fireEvent.click(container.querySelector('.cxd-SearchBox-searchBtn')!);
  await wait(200);

  // TODO: 这里点击搜索会调用两次接口，一次是 onQuery 事件，一次是数据变化组件 update
  expect(fetcher).toHaveBeenCalledTimes(3);
  expect(fetcher.mock.calls[1][0].query).toEqual({
    keywords: 'searchkey'
  });

  expect(container).toMatchSnapshot();
});

test('Renderer:Searchbox with enhance', async () => {
  const {container} = render(
    amisRender({
      type: 'page',
      initApi: '/api/xxx?keywords=${keywords}',
      body: [
        {
          type: 'search-box',
          name: 'keywords',
          enhance: true
        }
      ]
    })
  );

  expect(container.querySelector('.cxd-SearchBox')).toHaveClass(
    'cxd-SearchBox--enhance'
  );
  expect(container).toMatchSnapshot();
});

test('Renderer:Searchbox with clearable', async () => {
  const onQuery = jest.fn();
  const {container} = render(
    amisRender({
      type: 'search-box',
      name: 'keywords',
      clearable: true,
      value: 'tmpvalue',
      onQuery
    })
  );

  expect(
    container.querySelector('.cxd-SearchBox .cxd-SearchBox-clearable')
  ).toBeInTheDocument();
  expect(
    (container.querySelector('.cxd-SearchBox input') as HTMLInputElement)!.value
  ).toBe('tmpvalue');
  expect(container).toMatchSnapshot();

  fireEvent.click(
    container.querySelector('.cxd-SearchBox .cxd-SearchBox-clearable')!
  );
  expect(
    (container.querySelector('.cxd-SearchBox input') as HTMLInputElement)!.value
  ).toBe('');

  fireEvent.click(container.querySelector('.cxd-SearchBox-searchBtn')!);
  await wait(200);

  expect(onQuery).toHaveBeenCalled();
  expect(onQuery.mock.calls[0][0]).toEqual({
    keywords: ''
  });
});

test('Renderer:Searchbox with mini', async () => {
  const onQuery = jest.fn();
  const {container} = render(
    amisRender({
      type: 'search-box',
      name: 'keywords',
      mini: true,
      onQuery
    })
  );

  const searchBox = container.querySelector('.cxd-SearchBox');
  expect(searchBox).toBeInTheDocument();
  expect(container).toMatchSnapshot();

  fireEvent.click(container.querySelector('.cxd-SearchBox-activeBtn')!);

  await wait(200);

  expect(searchBox).toHaveClass('is-active');
  expect(
    container.querySelector('.cxd-SearchBox-activeBtn')
  ).not.toBeInTheDocument();
  const input = container.querySelector('.cxd-SearchBox input')!;

  expect(input).toBeInTheDocument();

  fireEvent.change(input, {
    target: {value: 'what?'}
  });

  fireEvent.keyDown(input, {
    key: 'Enter',
    code: 13
  });
  await wait(200);

  expect(onQuery).toHaveBeenCalled();
  expect(onQuery.mock.calls[0][0]).toEqual({
    keywords: 'what?'
  });

  expect(container).toMatchSnapshot();

  fireEvent.click(container.querySelector('.cxd-SearchBox-cancelBtn')!);
  await wait(200);

  expect(onQuery).toHaveBeenCalledTimes(2);
  expect(onQuery.mock.calls[1][0]).toEqual({
    keywords: ''
  });

  expect(searchBox).not.toHaveClass('is-active');
  expect(
    container.querySelector('.cxd-SearchBox-activeBtn')
  ).toBeInTheDocument();
});

test('Renderer:Searchbox with searchImediately & className', async () => {
  const onQuery = jest.fn();
  const {container} = render(
    amisRender({
      type: 'search-box',
      name: 'keywords',
      mini: true,
      searchImediately: true,
      className: 'testClass',
      onQuery
    })
  );

  expect(container.querySelector('.cxd-SearchBox')).toHaveClass('testClass');

  const input = container.querySelector('.cxd-SearchBox input')!;
  fireEvent.change(input, {
    target: {value: 'aa'}
  });

  await wait(400);
  expect(onQuery).toBeCalledTimes(1);
  expect(onQuery.mock.calls[0][0]).toEqual({
    keywords: 'aa'
  });

  fireEvent.change(input, {
    target: {value: 'aabb'}
  });

  await wait(400);
  expect(onQuery).toBeCalledTimes(2);
  expect(onQuery.mock.calls[1][0]).toEqual({
    keywords: 'aabb'
  });
});

test('6. Renderer: Searchbox is not supposed to be triggered with composition input', async () => {
  const onQuery = jest.fn();
  const {container} = render(
    amisRender(
      {
        type: 'search-box',
        name: 'keywords'
      },
      {
        onQuery
      }
    )
  );

  const inputEl = container.querySelector('.cxd-SearchBox input')!;
  expect(inputEl).toBeInTheDocument();

  /** 第一次输入 Enter 后，文本填入 */

  fireEvent.compositionStart(inputEl);
  fireEvent.keyDown(inputEl, {key: 'Enter', keyCode: 13});
  await wait(200);
  expect(onQuery).not.toHaveBeenCalled();

  /** 退出输入法，触发搜索 */
  fireEvent.compositionEnd(inputEl);
  fireEvent.change(inputEl, {target: {value: 'test'}});
  fireEvent.keyDown(inputEl, {key: 'Enter', keyCode: 13});
  await wait(200);

  expect(onQuery).toHaveBeenCalledTimes(1);
  expect(onQuery.mock.calls[0][0]).toEqual({
    keywords: 'test'
  });
});
