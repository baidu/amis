/**
 * 组件名称：Alert 提示
 *
 * 单测内容：
 * 1. 基础使用
 * 2. 获取上下文变量
 * 3. 级别 level
 * 4. title & showIcon & icon & iconClassName
 * 5. showCloseButton & closeButtonClassName
 */

import React from 'react';
import {fireEvent, render} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv} from '../helper';

test('Renderer:alert', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'alert',
          level: 'success',
          body: [
            {
              type: 'tpl',
              tpl: '提示内容'
            }
          ]
        }
      },
      {},
      makeEnv({})
    )
  );

  expect(container.querySelector('.cxd-Alert')).toHaveTextContent('提示内容');
  expect(container).toMatchSnapshot();
});

test('Renderer:alert var', () => {
  const {container} = render(
    amisRender({
      type: 'page',
      data: {
        level: 'success',
        icon: 'copy',
        showIcon: true,
        bodyTpl: '百度一下，你就知道'
      },
      body: {
        type: 'alert',
        level: '${level}',
        icon: '${icon}',
        showIcon: '${showIcon}',
        body: '${bodyTpl}'
      }
    })
  );
  expect(container).toMatchSnapshot();

  expect(container.querySelector('.cxd-Alert')).toHaveClass(
    'cxd-Alert--success'
  );
  expect(container.querySelector('.cxd-Alert-icon icon-mock')).toHaveAttribute(
    'classname',
    'icon icon-copy'
  );
  expect(container.querySelector('.cxd-Alert-content')).toHaveTextContent(
    '百度一下，你就知道'
  );
});

test('Renderer:alert with level', () => {
  const {container} = render(
    amisRender({
      type: 'page',
      body: [
        {
          type: 'alert',
          body: '提示类文案',
          level: 'info'
        },
        {
          type: 'alert',
          body: '成功类文案',
          level: 'success'
        },
        {
          type: 'alert',
          body: '警告类文案',
          level: 'warning'
        },
        {
          type: 'alert',
          body: '危险类文案',
          level: 'danger'
        }
      ]
    })
  );
  expect(container).toMatchSnapshot();

  const alerts = container.querySelectorAll('.cxd-Alert');

  expect(alerts!.length).toBe(4);
  expect(alerts[0]).toHaveClass('cxd-Alert--info');
  expect(alerts[1]).toHaveClass('cxd-Alert--success');
  expect(alerts[2]).toHaveClass('cxd-Alert--warning');
  expect(alerts[3]).toHaveClass('cxd-Alert--danger');
});

test('Renderer:alert with title & showIcon & icon & iconClassName', () => {
  const renderAmis = (options: any = {}) =>
    amisRender({
      type: 'page',
      body: {
        type: 'alert',
        body: '提示类文案',
        level: 'info',
        ...options
      }
    });

  const {container, rerender} = render(renderAmis());

  expect(container.querySelector('.cxd-Alert-title')!).not.toBeInTheDocument();

  rerender(
    renderAmis({
      title: '提示类文案'
    })
  );

  expect(container.querySelector('.cxd-Alert-title')!).toBeInTheDocument();
  expect(container.querySelector('.cxd-Alert-title')!).toHaveTextContent(
    '提示类文案'
  );
  expect(container.querySelector('.cxd-Alert-icon')).not.toBeInTheDocument();

  rerender(
    renderAmis({
      title: '提示类文案',
      showIcon: true
    })
  );

  expect(container.querySelector('.cxd-Alert-icon')).toBeInTheDocument();
  expect(container.querySelector('.cxd-Alert-icon icon-mock')).toHaveAttribute(
    'classname',
    'icon icon-alert-info'
  );

  rerender(
    renderAmis({
      title: '提示类文案',
      showIcon: true,
      icon: 'star',
      iconClassName: 'starClass'
    })
  );

  expect(container.querySelector('.cxd-Alert-icon icon-mock')).toHaveAttribute(
    'classname',
    'icon icon-star'
  );
  expect(container.querySelector('.cxd-Alert-icon')).toHaveClass('starClass');

  expect(container).toMatchSnapshot();
});

test('Renderer:alert with showCloseButton & closeButtonClassName', () => {
  const {container, rerender} = render(
    amisRender({
      type: 'page',
      body: {
        type: 'alert',
        body: '提示信息',
        level: 'info'
      }
    })
  );

  expect(
    container.querySelector('.cxd-Alert .cxd-Alert-close')
  ).not.toBeInTheDocument();

  rerender(
    amisRender({
      type: 'page',
      body: {
        type: 'alert',
        body: '提示信息',
        level: 'info',
        showCloseButton: true,
        closeButtonClassName: 'classNameForClose'
      }
    })
  );

  const closeBth = container.querySelector('.cxd-Alert .cxd-Alert-close')!;

  expect(closeBth).toBeInTheDocument();

  expect(closeBth).toHaveClass('classNameForClose');

  expect(container).toMatchSnapshot();

  fireEvent.click(closeBth);

  expect(container.querySelector('.cxd-Alert')).not.toBeInTheDocument();
});

test('Renderer:alert with actions', () => {

  const {container} = render(amisRender({
    "type": "alert",
    "level": "success",
    "className": "mb-3",
    "showIcon": true,
    "showCloseButton": true,
    "title": "标题",
    "body": "创建成功",
    "actions": [
      {
        "type": "button",
        "label": "查看详情",
        "size": "xs",
        "level": "link"
      }
    ]
  }, {}, makeEnv({})));

  const alert = container.querySelector('.cxd-Alert');
  expect(alert).toBeInTheDocument();

  const actions = container.querySelector('.cxd-Alert-actions')!;
  expect(actions).toBeInTheDocument();
  expect(actions.childNodes.length).toEqual(1);
});
