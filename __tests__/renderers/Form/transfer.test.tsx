import React = require('react');
import {render} from '@testing-library/react';
import '../../../src/themes/default';
import {render as amisRender} from '../../../src/index';
import {makeEnv} from '../../helper';

test('Renderer:transfer', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          api: '/api/mock2/form/saveForm',
          body: [
            {
              label: '默认',
              type: 'transfer',
              name: 'transfer',
              options: [
                {
                  label: '诸葛亮',
                  value: 'zhugeliang'
                },
                {
                  label: '曹操',
                  value: 'caocao'
                },
                {
                  label: '钟无艳',
                  value: 'zhongwuyan'
                },
                {
                  label: '李白',
                  value: 'libai'
                },
                {
                  label: '韩信',
                  value: 'hanxin'
                },
                {
                  label: '云中君',
                  value: 'yunzhongjun'
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

test('Renderer:transfer tree', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          api: '/api/mock2/form/saveForm',
          body: [
            {
              label: '树型展示',
              type: 'transfer',
              name: 'transfer4',
              selectMode: 'tree',
              options: [
                {
                  label: '法师',
                  children: [
                    {
                      label: '诸葛亮',
                      value: 'zhugeliang'
                    }
                  ]
                },
                {
                  label: '战士',
                  children: [
                    {
                      label: '曹操',
                      value: 'caocao'
                    },
                    {
                      label: '钟无艳',
                      value: 'zhongwuyan'
                    }
                  ]
                },
                {
                  label: '打野',
                  children: [
                    {
                      label: '李白',
                      value: 'libai'
                    },
                    {
                      label: '韩信',
                      value: 'hanxin'
                    },
                    {
                      label: '云中君',
                      value: 'yunzhongjun'
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
