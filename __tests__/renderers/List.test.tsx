import React = require('react');
import {render} from '@testing-library/react';
import '../../src/themes/default';
import {render as amisRender} from '../../src/index';
import {makeEnv} from '../helper';
import rows from '../mockData/rows';

test('Renderer:list', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'service',
          data: {
            rows
          },
          body: [
            {
              type: 'panel',
              title: '简单 List 示例',
              body: {
                type: 'list',
                source: '$rows',
                itemAction: {
                  type: 'button',
                  actionType: 'dialog',
                  dialog: {
                    title: '详情',
                    body: '当前行的数据 browser: ${browser}, version: ${version}'
                  }
                },
                listItem: {
                  body: [
                    {
                      type: 'hbox',
                      columns: [
                        {
                          label: 'Engine',
                          name: 'engine'
                        },
                        {
                          name: 'version',
                          label: 'Version'
                        }
                      ]
                    }
                  ],
                  actions: [
                    {
                      type: 'button',
                      level: 'link',
                      label: '查看详情',
                      actionType: 'dialog',
                      dialog: {
                        title: '查看详情',
                        body: {
                          type: 'form',
                          body: [
                            {
                              label: 'Engine',
                              name: 'engine',
                              type: 'static'
                            },
                            {
                              name: 'version',
                              label: 'Version',
                              type: 'static'
                            }
                          ]
                        }
                      }
                    }
                  ]
                }
              }
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
