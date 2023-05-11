/**
 * 组件名称：Progress 进度条
 * 单测内容：
 * 1. 基础使用
 * 2. 颜色映射 map
 * 3. 阈值（刻度）threshold & showThresholdText
 * 4. 作为表单项
 * 5. 背景间隔 & 动画 stripe & animate
 * 6. 环形模式和仪表盘样式
 * 7. 线条宽度 strokeWidth
 * 8. 自定义 value 显示 valueTpl
 */

import React from 'react';
import {render} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv, wait} from '../helper';

test('Renderer:Progress', () => {
  const {container} = render(
    amisRender(
      {
        type: 'progress',
        value: 60
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
  expect(container).toHaveTextContent('60%');
  expect(container.querySelector('.cxd-Progress-line-bar')).toHaveStyle({
    width: '60%'
  });
});

test('Renderer:Progress with map', async () => {
  const {container, rerender} = render(
    amisRender({
      type: 'progress',
      value: 20
    })
  );

  const bar = () => container.querySelector('.cxd-Progress-line-bar')!;
  expect(bar()).toHaveClass('bg-danger');

  rerender(
    amisRender({
      type: 'progress',
      value: 40
    })
  );
  expect(bar()).toHaveClass('bg-warning');

  rerender(
    amisRender({
      type: 'progress',
      value: 60
    })
  );
  expect(bar()).toHaveClass('bg-info');

  rerender(
    amisRender({
      type: 'progress',
      value: 80
    })
  );
  expect(bar()).toHaveClass('bg-success');

  rerender(
    amisRender({
      type: 'progress',
      value: 60,
      map: '#F96D3E'
    })
  );

  await wait(200);
  expect(container).toMatchSnapshot();
  expect(container.querySelector('.cxd-Progress-line-bar')!).toHaveStyle({
    'background-color': 'rgb(249, 109, 62)'
  });

  rerender(
    amisRender({
      type: 'progress',
      value: 29,
      map: [
        {
          value: 30,
          color: '#007bff'
        },
        {
          value: 60,
          color: '#F96D3E'
        }
      ]
    })
  );

  expect(container.querySelector('.cxd-Progress-line-bar')!).toHaveStyle({
    'background-color': 'rgb(0, 123, 255)'
  });
});

test('Renderer:Progress with threshold & showThresholdText', async () => {
  const {container} = render(
    amisRender({
      type: 'progress',
      value: 60,
      threshold: [
        {
          value: '30%',
          color: 'red'
        },
        {
          value: '90%',
          color: 'blue'
        }
      ],
      showThresholdText: true
    })
  );

  const thresholds = container.querySelectorAll('.cxd-Progress-line-threshold');
  expect(thresholds.length).toBe(2);

  expect(thresholds[0]).toHaveStyle({
    'left': '30%',
    'border-color': 'red'
  });
  expect(thresholds[1]).toHaveStyle({
    'left': '90%',
    'border-color': 'blue'
  });

  expect(container).toHaveTextContent('30%');
  expect(container).toHaveTextContent('90%');
  expect(container).toMatchSnapshot();
});

test('Renderer:Progress as form item', async () => {
  const {container} = render(
    amisRender({
      type: 'form',
      data: {
        progress: 61
      },
      body: [
        {
          type: 'static-progress',
          name: 'progress',
          label: '进度'
        }
      ]
    })
  );

  expect(container.querySelector('.cxd-Progress-line-bar')).toHaveStyle({
    width: '61%'
  });
  expect(container).toMatchSnapshot();
});

test('Renderer:Progress with stripe & animate', async () => {
  const {container} = render(
    amisRender({
      type: 'progress',
      animate: true,
      value: 62,
      stripe: true
    })
  );

  expect(container.querySelector('.cxd-Progress-line-bar')).toHaveClass(
    'cxd-Progress-line-bar--stripe cxd-Progress-line-bar--stripe-animate'
  );
  expect(container).toMatchSnapshot();
});

test('Renderer:Progress with mode', async () => {
  const {container, rerender} = render(
    amisRender({
      type: 'progress',
      value: 63,
      mode: 'circle'
    })
  );

  expect(container.querySelector('.cxd-Progress-circle')).toBeInTheDocument();
  expect(container).toMatchSnapshot();

  rerender(
    amisRender({
      type: 'progress',
      value: 64,
      mode: 'dashboard',
      gapDegree: 100,
      gapPosition: 'left'
    })
  );

  await wait(200);
  // gapDegree 与 gapPosition 无法验证，因为是 svg
  expect(container).toMatchSnapshot();
});

test('Renderer:Progress with strokeWidth', async () => {
  const {container, rerender} = render(
    amisRender({
      type: 'progress',
      value: 65,
      strokeWidth: 12
    })
  );

  expect(container.querySelector('.cxd-Progress-line-bar')).toHaveStyle({
    height: '12px'
  });

  rerender(
    amisRender({
      type: 'progress',
      value: 66,
      mode: 'circle',
      strokeWidth: 8
    })
  );

  expect(
    container.querySelector('.cxd-Progress-circle svg circle')
  ).toHaveAttribute('stroke-width', '8');
});

test('Renderer:Progress with valueTpl', async () => {
  const {container, rerender} = render(
    amisRender({
      type: 'progress',
      mode: 'circle',
      value: 67,
      valueTpl: '${value}个'
    })
  );

  expect(container).toHaveTextContent('67个');
  expect(container).toMatchSnapshot();
});
