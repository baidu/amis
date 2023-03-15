/**
 * 组件名称：Steps 步骤条
 * 单测内容：
 1. 基础使用
 2. 自定义状态 status
 3. 标签位置 labelPlacement
 4. 点状步骤条 progressDot
 5. 竖向排列 mode vertical
 6. 上下文数据 name
 */

import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv, wait} from '../helper';

test('Renderer:steps', () => {
  const schema = {
    type: 'steps',
    value: 1,
    steps: [
      {
        title: 'First',
        subTitle: 'this is subTitle',
        description: 'this is description',
        icon: 'close',
        className: 'className',
        value: 1
      },
      {
        title: 'Second'
      },
      {
        title: 'Last'
      }
    ]
  };
  const {container, rerender} = render(amisRender(schema, {}, makeEnv({})));
  expect(container).toMatchSnapshot();

  schema.steps[0].value = undefined;
  schema.steps[1].value = 1;
  rerender(amisRender(schema, {}, makeEnv({})));
  expect(container).toMatchSnapshot();
});

test('Renderer:steps status', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'steps',
        className: 'className',
        status: {
          a: 'finish',
          b: 'error',
          c: 'wait'
        },
        steps: [
          {
            title: 'First',
            value: 'a'
          },
          {
            title: 'Second',
            subTitle: 'this is subTitle',
            description: 'this is description',
            value: 'b'
          },
          {
            title: 'Third',
            value: 'c'
          }
        ]
      },
      {},
      makeEnv()
    )
  );

  const steps = container.querySelectorAll('.cxd-Steps .cxd-StepsItem');
  expect(steps!.length).toBe(3);
  expect(steps[0]).toHaveClass('is-finish');
  expect(steps[1]).toHaveClass('is-error');
  expect(steps[2]).toHaveClass('is-wait');

  expect(container).toMatchSnapshot();
});

test('Renderer:steps labelPlacement', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'steps',
        labelPlacement: 'vertical',
        className: 'className',
        steps: [
          {
            title: 'First',
            value: 'a'
          },
          {
            title: 'Second',
            subTitle: 'this is subTitle',
            description: 'this is description',
            value: 'b'
          },
          {
            title: 'Third',
            value: 'c'
          }
        ]
      },
      {},
      makeEnv()
    )
  );

  expect(container.querySelector('.cxd-Steps')).toHaveClass(
    'cxd-Steps--Placement-vertical'
  );
  expect(container).toMatchSnapshot();
});

test('Renderer:steps progressDot', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'steps',
        className: 'className',
        progressDot: true,
        steps: [
          {
            title: 'First',
            value: 'a'
          },
          {
            title: 'Second',
            subTitle: 'this is subTitle',
            description: 'this is description',
            value: 'b'
          },
          {
            title: 'Third',
            value: 'c'
          }
        ]
      },
      {},
      makeEnv()
    )
  );
  expect(container.querySelector('.cxd-Steps')).toHaveClass(
    'cxd-Steps--ProgressDot'
  );
  expect(container).toMatchSnapshot();
});

test('Renderer:steps with vertical mode', async () => {
  const {container} = render(
    amisRender({
      type: 'steps',
      className: 'className',
      progressDot: true,
      mode: 'vertical',
      steps: [
        {
          title: 'First',
          value: 'a'
        },
        {
          title: 'Second',
          subTitle: 'this is subTitle',
          description: 'this is description',
          value: 'b'
        },
        {
          title: 'Third',
          value: 'c'
        }
      ]
    })
  );

  expect(container.querySelector('.cxd-Steps')).toHaveClass(
    'cxd-Steps--vertical'
  );
  expect(container).toMatchSnapshot();
});

test('Renderer:steps with name', async () => {
  const {container} = render(
    amisRender({
      type: 'page',
      data: {
        step: 0,
        status: 'error',
        secondTitle: 'Second Test',
        desc: 'very good idea',
        what: 'what is this'
      },
      body: [
        {
          type: 'input-number',
          name: 'step'
        },
        {
          type: 'steps',
          name: 'step',
          status: '${status}',
          steps: [
            {
              title: 'First',
              subTitle: 'this is subTitle',
              description: '${desc}'
            },
            {
              title: '${secondTitle}'
            },
            {
              title: 'Last',
              subTitle: '${what}'
            }
          ]
        }
      ]
    })
  );

  const input = container.querySelector('.cxd-Number input');
  const setNum = async (num: number = 0) => {
    fireEvent.change(input!, {
      target: {value: num}
    });
    await wait(300);
  };

  const steps = container.querySelectorAll('.cxd-Steps .cxd-StepsItem');
  expect(steps!.length).toBe(3);

  expect(steps[0]).toHaveClass('is-error');
  expect(
    steps[0].querySelector('.cxd-StepsItem-description')
  ).toHaveTextContent('very good idea');

  await setNum(1);
  expect(steps[0]).toHaveClass('is-finish');
  expect(steps[1]).toHaveClass('is-error');
  expect(steps[2]).toHaveClass('is-wait');

  expect(steps[1].querySelector('.cxd-StepsItem-title')).toHaveTextContent(
    'Second Test'
  );

  await setNum(2);
  expect(steps[0]).toHaveClass('is-finish');
  expect(steps[1]).toHaveClass('is-finish');
  expect(steps[2]).toHaveClass('is-error');

  expect(steps[2].querySelector('.cxd-StepsItem-subTitle')).toHaveTextContent(
    'what is this'
  );

  await setNum(3);

  expect(steps[0]).toHaveClass('is-finish');
  expect(steps[1]).toHaveClass('is-finish');
  expect(steps[2]).toHaveClass('is-finish');
});
