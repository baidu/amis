/**
 * 组件名称：Each 循环渲染器
 * 单测内容：
 * 1. 基础使用
 * 2. 对象数组的值；获取其index
 * 3. 使用数据映射
 * 4. Form 中静态展示
 */

import React from 'react';
import {render} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv} from '../helper';

test('Renderer:Each basic use', async () => {
  const {container} = render(
    amisRender({
      type: 'page',
      data: {
        arr: ['A', 'B', 'C']
      },
      body: {
        type: 'each',
        name: 'arr',
        items: {
          type: 'tpl',
          tpl: "<span class='label label-default m-l-sm'><%= data.item %></span> "
        }
      }
    })
  );

  const items = container.querySelectorAll('.cxd-Each .cxd-TplField');

  expect(items!.length).toBe(3);
  expect(items[0]).toHaveTextContent('A');
  expect(container).toMatchSnapshot();
});

test('Renderer:Each with array of objects value', async () => {
  const {container} = render(
    amisRender({
      type: 'each',
      items: {
        type: 'tpl',
        tpl: "<span class='label label-default m-l-sm'><%= data.name %>:<%= data.index %></span> "
      },
      value: [{name: 'jack'}, {name: 'martin'}],
      className: 'show'
    })
  );
  const items = container.querySelectorAll('.cxd-Each .cxd-TplField');

  expect(items!.length).toBe(2);
  expect(items[1]).toHaveTextContent('martin:1');
  expect(container).toMatchSnapshot();
});

test('Renderer:Each with source', async () => {
  const {container} = render(
    amisRender({
      type: 'page',
      data: {
        arr: [
          {
            name: 'jerry',
            age: 21
          },
          {
            name: 'tom',
            age: 29
          }
        ]
      },
      body: {
        type: 'each',
        source: '${arr}',
        items: {
          type: 'wrapper',
          body: [
            {
              type: 'tpl',
              tpl: "<span class='label label-default m-l-sm'>name: <%= data.name %></span> "
            },
            {
              type: 'tag',
              label: 'age: ${age}'
            }
          ]
        }
      }
    })
  );
  const items = container.querySelectorAll('.cxd-Each .cxd-Wrapper');

  expect(items!.length).toBe(2);
  expect(items[1]).toHaveTextContent('age: 29');
  expect(container).toMatchSnapshot();
});

test('Renderer:Each in form', async () => {
  const {container} = render(
    amisRender({
      type: 'form',
      data: {
        each: ['A', 'B', 'C']
      },
      body: [
        {
          type: 'each',
          label: '静态展示each',
          name: 'each',
          items: {
            type: 'tpl',
            tpl: "<span class='label label-info m-l-sm'><%= this.item %></span>"
          }
        }
      ]
    })
  );

  expect(container.querySelector('.cxd-Form .cxd-Each'));
  expect(container).toMatchSnapshot();
});
