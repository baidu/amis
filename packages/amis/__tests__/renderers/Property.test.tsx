import React = require('react');
import {render} from '@testing-library/react';
import '../../src/themes/default';
import {render as amisRender} from '../../src/index';
import {makeEnv} from '../helper';

test('Renderer:property', () => {
  const {container} = render(
    amisRender(
      {
        type: 'property',
        title: '机器配置',
        items: [
          {
            label: 'cpu',
            content: '1 core'
          },
          {
            label: 'memory',
            content: '4G'
          },
          {
            label: 'disk',
            content: '80G'
          },
          {
            label: 'network',
            content: '4M',
            span: 2
          },
          {
            label: 'IDC',
            content: 'beijing'
          },
          {
            label: 'Note',
            content: '其它说明',
            span: 3
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});

test('Renderer:property simple', () => {
  const {container} = render(
    amisRender(
      {
        type: 'property',
        title: '机器配置',
        mode: 'simple',
        separator: '：',
        items: [
          {
            label: 'cpu',
            content: '1 core'
          },
          {
            label: 'memory',
            content: '4G'
          },
          {
            label: 'disk',
            content: '80G'
          },
          {
            label: 'network',
            content: '4M',
            span: 2
          },
          {
            label: 'IDC',
            content: 'beijing'
          },
          {
            label: 'Note',
            content: '其它说明',
            span: 3
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});
