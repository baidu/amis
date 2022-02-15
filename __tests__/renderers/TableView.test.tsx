import React = require('react');
import {render} from '@testing-library/react';
import '../../src/themes/default';
import {render as amisRender} from '../../src/index';
import {makeEnv} from '../helper';

test('Renderer:tableview', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'service',
          data: {
            beijing: '20',
            tianjing: '19'
          },
          body: [
            {
              type: 'table-view',
              trs: [
                {
                  background: '#F7F7F7',
                  tds: [
                    {
                      body: {
                        type: 'tpl',
                        tpl: '地区'
                      }
                    },
                    {
                      body: {
                        type: 'tpl',
                        tpl: '城市'
                      }
                    },
                    {
                      body: {
                        type: 'tpl',
                        tpl: '销量'
                      }
                    }
                  ]
                },
                {
                  tds: [
                    {
                      rowspan: 2,
                      body: {
                        type: 'tpl',
                        tpl: '华北'
                      }
                    },
                    {
                      body: {
                        type: 'tpl',
                        tpl: '北京'
                      }
                    },
                    {
                      body: {
                        type: 'tpl',
                        tpl: '${beijing}'
                      }
                    }
                  ]
                },
                {
                  tds: [
                    {
                      body: {
                        type: 'tpl',
                        tpl: '天津'
                      }
                    },
                    {
                      body: {
                        type: 'tpl',
                        tpl: '${tianjing}'
                      }
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

test('Renderer:tableview layout', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'table-view',
          border: false,
          trs: [
            {
              background: '#feceea',
              tds: [
                {
                  colspan: 2,
                  align: 'center',
                  body: {
                    type: 'tpl',
                    tpl: '头部'
                  }
                }
              ]
            },
            {
              tds: [
                {
                  rowspan: 2,
                  background: '#fef1d2',
                  width: 200,
                  body: {
                    type: 'tpl',
                    tpl: '侧边'
                  }
                },
                {
                  align: 'center',
                  background: '#a9fdd8',
                  body: {
                    type: 'tpl',
                    tpl: '右上'
                  }
                }
              ]
            },
            {
              height: 200,
              tds: [
                {
                  align: 'center',
                  background: '#d7f8ff',
                  body: {
                    type: 'table-view',
                    border: false,
                    trs: [
                      {
                        tds: [
                          {
                            align: 'center',
                            body: {
                              type: 'tpl',
                              tpl: '栏目 1'
                            }
                          },
                          {
                            align: 'center',
                            body: {
                              type: 'tpl',
                              tpl: '栏目 2'
                            }
                          },
                          {
                            align: 'center',
                            body: {
                              type: 'tpl',
                              tpl: '栏目 3'
                            }
                          }
                        ]
                      }
                    ]
                  }
                }
              ]
            },
            {
              tds: [
                {
                  colspan: 2,
                  align: 'center',
                  background: '#cec5fa',
                  body: {
                    type: 'tpl',
                    tpl: '底部'
                  }
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
