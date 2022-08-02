import React = require('react');
import {render, waitFor} from '@testing-library/react';
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
        value: 'b',
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

  expect(container).toMatchSnapshot();
});

test('Renderer:steps labelPlacement', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'steps',
        value: 'b',
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

  expect(container).toMatchSnapshot();
});

test('Renderer:steps progressDot', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'steps',
        value: 'b',
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

  expect(container).toMatchSnapshot();
});
