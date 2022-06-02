import React = require('react');
import {render} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv} from '../../helper';

test('Renderer:tabs-transfer', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          api: '/api/mock2/form/saveForm',
          body: [
            {
              label: '组合穿梭器',
              type: 'tabs-transfer',
              name: 'a',
              sortable: true,
              selectMode: 'tree',
              options: [
                {
                  label: '成员',
                  selectMode: 'tree',
                  searchable: true,
                  children: [
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
                },
                {
                  label: '用户',
                  selectMode: 'chained',
                  children: [
                    {
                      label: '法师',
                      children: [
                        {
                          label: '诸葛亮',
                          value: 'zhugeliang2'
                        }
                      ]
                    },
                    {
                      label: '战士',
                      children: [
                        {
                          label: '曹操',
                          value: 'caocao2'
                        },
                        {
                          label: '钟无艳',
                          value: 'zhongwuyan2'
                        }
                      ]
                    },
                    {
                      label: '打野',
                      children: [
                        {
                          label: '李白',
                          value: 'libai2'
                        },
                        {
                          label: '韩信',
                          value: 'hanxin2'
                        },
                        {
                          label: '云中君',
                          value: 'yunzhongjun2'
                        }
                      ]
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
