/**
 * 组件名称：Link 链接
 * 单测内容：
 * 1. 基础使用
 * 2. href & blank & htmlTarget
 * 3. disabled
 * 4. title & icon & rightIcon
 */

import React from 'react';
import {render} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv} from '../helper';

test('Renderer:link', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'link',
        href: 'https://www.baidu.com',
        placeholder: 'link address',
        className: 'show',
        blank: true
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});

test('Renderer:link with href & blank & htmlTarget', async () => {
  const schema = {
    type: 'link',
    href: 'https://www.baidu.com',
    body: '百度一下',
    blank: true
  };
  const {container, rerender} = render(amisRender(schema));

  const link = container.querySelector('.cxd-Link');
  expect(link).toHaveAttribute('href', 'https://www.baidu.com');
  expect(link).toHaveAttribute('target', '_blank');

  rerender(
    amisRender({
      ...schema,
      htmlTarget: '_self'
    })
  );

  expect(link).toHaveAttribute('target', '_self');

  expect(container).toMatchSnapshot();
});

test('Renderer:link with disabled', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'link',
        href: 'https://www.baidu.com',
        body: '百度一下',
        disabled: true
      },
      {},
      makeEnv({})
    )
  );

  const link = container.querySelector('.cxd-Link');
  expect(link).toHaveClass('is-disabled');
  expect(link).toHaveTextContent('百度一下');

  expect(container).toMatchSnapshot();
});

test('Renderer:link with title & icon & rightIcon', async () => {
  const {container} = render(
    amisRender({
      type: 'link',
      href: 'https://www.baidu.com',
      body: '百度一下',
      title: 'linkTitleForTest',
      icon: 'fa fa-search',
      rightIcon: 'fa fa-cloud'
    })
  );

  const link = container.querySelector('.cxd-Link');
  expect(link).toHaveAttribute('title', 'linkTitleForTest');

  const icons = container.querySelectorAll('.cxd-Link-icon');

  expect(icons!.length).toBe(2);
  expect(icons[0]).toHaveClass('fa-search');
  expect(icons[1]).toHaveClass('fa-cloud');

  expect(container).toMatchSnapshot();
});
