import React = require('react');
import {render} from '@testing-library/react';
import '../../../src/themes/default';
import {render as amisRender} from '../../../src/index';
import {makeEnv} from '../../helper';

test('Renderer:condition-builder', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          body: [
            {
              type: 'condition-builder',
              label: '条件组件',
              name: 'conditions',
              description:
                '适合让用户自己拼查询条件，然后后端根据数据生成 query where',
              fields: [
                {
                  label: '文本',
                  type: 'text',
                  name: 'text'
                },
                {
                  label: '数字',
                  type: 'number',
                  name: 'number'
                },
                {
                  label: '布尔',
                  type: 'boolean',
                  name: 'boolean'
                },
                {
                  label: '选项',
                  type: 'select',
                  name: 'select',
                  options: [
                    {
                      label: 'A',
                      value: 'a'
                    },
                    {
                      label: 'B',
                      value: 'b'
                    },
                    {
                      label: 'C',
                      value: 'c'
                    },
                    {
                      label: 'D',
                      value: 'd'
                    },
                    {
                      label: 'E',
                      value: 'e'
                    }
                  ]
                },
                {
                  label: '动态选项',
                  type: 'select',
                  name: 'select2',
                  source: '/api/mock2/form/getOptions?waitSeconds=1'
                },
                {
                  label: '日期',
                  children: [
                    {
                      label: '日期',
                      type: 'date',
                      name: 'date'
                    },
                    {
                      label: '时间',
                      type: 'time',
                      name: 'time'
                    },
                    {
                      label: '日期时间',
                      type: 'datetime',
                      name: 'datetime'
                    }
                  ]
                }
              ]
            }
          ]
        }
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});
