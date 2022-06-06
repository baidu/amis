import React = require('react');
import {render} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
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

test('Renderer:transfer group options', async () => {
  const {container, findByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          api: '/api/mock2/form/saveForm',
          body: [
            {
              label: '分组',
              type: 'transfer',
              name: 'transfer',
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

  await findByText('诸葛亮');

  // TODO: 莫名其妙 github 上运行就会报错
  // expect(container).toMatchSnapshot();
});

test('Renderer:transfer table', async () => {
  const {container, findByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          api: '/api/mock2/form/saveForm',
          body: [
            {
              label: '表格形式',
              type: 'transfer',
              name: 'transfer',
              selectMode: 'table',
              columns: [
                {
                  name: 'label',
                  label: '英雄'
                },
                {
                  name: 'position',
                  label: '位置'
                }
              ],
              options: [
                {
                  label: '诸葛亮',
                  value: 'zhugeliang',
                  position: '中单'
                },
                {
                  label: '曹操',
                  value: 'caocao',
                  position: '上单'
                },
                {
                  label: '钟无艳',
                  value: 'zhongwuyan',
                  position: '上单'
                },
                {
                  label: '李白',
                  value: 'libai',
                  position: '打野'
                },
                {
                  label: '韩信',
                  value: 'hanxin',
                  position: '打野'
                },
                {
                  label: '云中君',
                  value: 'yunzhongjun',
                  position: '打野'
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

  await findByText('诸葛亮');

  expect(container).toMatchSnapshot();
});

test('Renderer:transfer chained', async () => {
  const {container, findByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          api: '/api/mock2/form/saveForm',
          body: [
            {
              label: '级联选择',
              type: 'transfer',
              name: 'transfer5',
              selectMode: 'chained',
              searchable: true,
              sortable: true,
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

  await findByText('法师');

  expect(container).toMatchSnapshot();
});

test('Renderer:transfer left tree', async () => {
  const {container, findByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'form',
          api: '/api/mock2/form/saveForm',
          body: [
            {
              label: '关联选择模式',
              type: 'transfer',
              name: 'b',
              sortable: true,
              searchable: true,
              deferApi: '/api/mock2/form/deferOptions?label=${label}',
              selectMode: 'associated',
              leftMode: 'tree',
              leftOptions: [
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
              ],
              options: [
                {
                  ref: 'zhugeliang',
                  children: [
                    {
                      label: 'A',
                      value: 'a'
                    }
                  ]
                },
                {
                  ref: 'caocao',
                  children: [
                    {
                      label: 'B',
                      value: 'b'
                    },
                    {
                      label: 'C',
                      value: 'c'
                    }
                  ]
                },
                {
                  ref: 'zhongwuyan',
                  children: [
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
                  ref: 'libai',
                  defer: true
                },
                {
                  ref: 'hanxin',
                  defer: true
                },
                {
                  ref: 'yunzhongjun',
                  defer: true
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

  await findByText('诸葛亮');

  expect(container).toMatchSnapshot();
});
