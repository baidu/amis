import React = require('react');
import {fireEvent, render, waitFor, screen} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv, wait} from '../helper';
import rows from '../mockData/rows';

test('Renderer:table', () => {
  const {container} = render(
    amisRender(
      {
        type: 'table',
        title: '表格1',
        data: {
          items: rows
        },
        columns: [
          {
            name: 'engine',
            label: 'Engine'
          },
          {
            name: 'version',
            label: 'Version'
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});

test('Renderer:table align', () => {
  const {container} = render(
    amisRender(
      {
        type: 'table',
        title: '表格1',
        data: {
          items: rows
        },
        columns: [
          {
            name: 'engine',
            label: 'Engine'
          },
          {
            name: 'version',
            type: 'tpl',
            tpl: '${version | number}',
            align: 'right'
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});

test('Renderer:table classNameExpr', () => {
  const {container} = render(
    amisRender(
      {
        type: 'table',
        title: '表格1',
        data: {
          items: rows
        },
        columns: [
          {
            name: 'engine',
            label: 'Engine'
          },
          {
            name: 'version',
            label: 'Version',
            classNameExpr: "<%= data.version > 5 ? 'text-danger' : '' %>"
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});

test('Renderer:table isHead fixed', () => {
  const {container} = render(
    amisRender(
      {
        type: 'table',
        title: '表格1',
        data: {
          items: rows
        },
        columnsTogglable: false,
        columns: [
          {
            name: 'engine',
            label: 'Engine',
            isHead: true
          },
          {
            name: 'platform',
            label: 'Platform',
            fixed: 'right'
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});

test('Renderer:table children', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'service',
          data: {
            rows: [
              {
                engine: 'Trident',
                browser: 'Internet Explorer 4.0',
                platform: 'Win 95+',
                version: '4',
                grade: 'X',
                __id: 1,
                children: [
                  {
                    engine: 'Trident',
                    browser: 'Internet Explorer 4.0',
                    platform: 'Win 95+',
                    version: '4',
                    grade: 'X',
                    __id: 1001
                  },
                  {
                    engine: 'Trident',
                    browser: 'Internet Explorer 5.0',
                    platform: 'Win 95+',
                    version: '5',
                    grade: 'C',
                    __id: 1002
                  }
                ]
              },
              {
                engine: 'Trident',
                browser: 'Internet Explorer 5.0',
                platform: 'Win 95+',
                version: '5',
                grade: 'C',
                __id: 2,
                children: [
                  {
                    engine: 'Trident',
                    browser: 'Internet Explorer 4.0',
                    platform: 'Win 95+',
                    version: '4',
                    grade: 'X',
                    __id: 2001
                  },
                  {
                    engine: 'Trident',
                    browser: 'Internet Explorer 5.0',
                    platform: 'Win 95+',
                    version: '5',
                    grade: 'C',
                    __id: 2002
                  }
                ]
              },
              {
                engine: 'Trident',
                browser: 'Internet Explorer 5.5',
                platform: 'Win 95+',
                version: '5.5',
                grade: 'A',
                __id: 3,
                children: [
                  {
                    engine: 'Trident',
                    browser: 'Internet Explorer 4.0',
                    platform: 'Win 95+',
                    version: '4',
                    grade: 'X',
                    __id: 3001
                  },
                  {
                    engine: 'Trident',
                    browser: 'Internet Explorer 5.0',
                    platform: 'Win 95+',
                    version: '5',
                    grade: 'C',
                    __id: 3002
                  }
                ]
              },
              {
                engine: 'Trident',
                browser: 'Internet Explorer 6',
                platform: 'Win 98+',
                version: '6',
                grade: 'A',
                __id: 4,
                children: [
                  {
                    engine: 'Trident',
                    browser: 'Internet Explorer 4.0',
                    platform: 'Win 95+',
                    version: '4',
                    grade: 'X',
                    __id: 4001
                  },
                  {
                    engine: 'Trident',
                    browser: 'Internet Explorer 5.0',
                    platform: 'Win 95+',
                    version: '5',
                    grade: 'C',
                    __id: 4002
                  }
                ]
              },
              {
                engine: 'Trident',
                browser: 'Internet Explorer 7',
                platform: 'Win XP SP2+',
                version: '7',
                grade: 'A',
                __id: 5,
                children: [
                  {
                    engine: 'Trident',
                    browser: 'Internet Explorer 4.0',
                    platform: 'Win 95+',
                    version: '4',
                    grade: 'X',
                    __id: 5001
                  },
                  {
                    engine: 'Trident',
                    browser: 'Internet Explorer 5.0',
                    platform: 'Win 95+',
                    version: '5',
                    grade: 'C',
                    __id: 5002
                  }
                ]
              }
            ]
          },
          body: [
            {
              type: 'table',
              source: '$rows',
              className: 'm-b-none',
              columnsTogglable: false,
              columns: [
                {
                  name: 'engine',
                  label: 'Engine'
                },
                {
                  name: 'grade',
                  label: 'Grade'
                },
                {
                  name: 'version',
                  label: 'Version'
                },
                {
                  name: 'browser',
                  label: 'Browser'
                },
                {
                  name: '__id',
                  label: 'ID'
                },
                {
                  name: 'platform',
                  label: 'Platform'
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

describe('Renderer:table combine', () => {
  const generateCombineSchema = (tableConfig: Record<string, any> = {}) => ({
    type: 'page',
    body: {
      type: 'service',
      data: {
        rows
      },
      body: {
        type: 'table',
        source: '$rows',
        combineNum: 3,
        columnsTogglable: false,
        columns: [
          {
            name: 'engine',
            label: 'Rendering engine'
          },
          {
            name: 'browser',
            label: 'Browser'
          },
          {
            name: 'platform',
            label: 'Platform(s)'
          },
          {
            name: 'version',
            label: 'Engine version'
          },
          {
            name: 'grade',
            label: 'CSS grade'
          }
        ],
        ...tableConfig
      }
    }
  });
  // 合并单元格
  test('Renderer:table combineNum only', () => {
    const {container} = render(
      amisRender(generateCombineSchema(), {}, makeEnv({}))
    );

    expect(container).toMatchSnapshot();
  });

  // 合并单元格
  test('Renderer:table combineNum with fromIndex', () => {
    const {container} = render(
      amisRender(
        generateCombineSchema({combineNum: 2, combineFromIndex: 1}),
        {},
        makeEnv({})
      )
    );

    expect(container).toMatchSnapshot();
  });
});

// 超级表头
test('Renderer:table groupName-default', () => {
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
              type: 'table',
              source: '$rows',
              className: 'm-b-none',
              columns: [
                {
                  name: 'engine',
                  label: 'Engine',
                  groupName: '分组1'
                },
                {
                  name: 'grade',
                  label: 'Grade',
                  groupName: '分组1'
                },
                {
                  name: 'version',
                  label: 'Version',
                  groupName: '分组2'
                },
                {
                  name: 'browser',
                  label: 'Browser',
                  groupName: '分组2'
                },
                {
                  name: 'id',
                  label: 'ID',
                  toggled: false,
                  groupName: '分组2'
                },
                {
                  name: 'platform',
                  label: 'Platform',
                  groupName: '分组2'
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

// 超级表头，但是 tpl
test('Renderer:table groupName-withTpl', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        data: {
          groups: [
            {
              group: '分组1'
            },
            {
              group: '分组1'
            }
          ]
        },
        body: {
          type: 'service',
          data: {
            rows
          },
          body: [
            {
              type: 'table',
              source: '$rows',
              className: 'm-b-none',
              columns: [
                {
                  name: 'engine',
                  label: 'Engine',
                  groupName: '${groups[0].group}'
                },
                {
                  name: 'grade',
                  label: 'Grade',
                  groupName: '${groups[1].group}'
                },
                {
                  name: 'version',
                  label: 'Version',
                  groupName: '分组2'
                },
                {
                  name: 'browser',
                  label: 'Browser',
                  groupName: '分组2'
                },
                {
                  name: 'id',
                  label: 'ID',
                  toggled: false,
                  groupName: '分组2'
                },
                {
                  name: 'platform',
                  label: 'Platform',
                  groupName: '分组2'
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

// 超级表头，但是 中间列未配置表头
test('Renderer:table groupName-middleNoGroupName', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        data: {
          groups: [
            {
              group: '分组1'
            },
            {
              group: '分组1'
            }
          ]
        },
        body: {
          type: 'service',
          data: {
            rows
          },
          body: [
            {
              type: 'table',
              source: '$rows',
              className: 'm-b-none',
              columns: [
                {
                  name: 'engine',
                  label: 'Engine',
                  groupName: '分组1'
                },
                {
                  name: 'grade',
                  label: 'Grade'
                  // groupName: '分组1' // 这里没配置groupName
                },
                {
                  name: 'version',
                  label: 'Version'
                  // groupName: '分组2' // 这里没配置groupName
                },
                {
                  name: 'browser',
                  label: 'Browser',
                  groupName: '分组2'
                },
                {
                  name: 'id',
                  label: 'ID',
                  toggled: false,
                  groupName: '分组2'
                },
                {
                  name: 'platform',
                  label: 'Platform',
                  groupName: '分组2'
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

// 超级表头，但是 开头列未配置表头
test('Renderer:table groupName-startNoGroupName', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        data: {
          groups: [
            {
              group: '分组1'
            },
            {
              group: '分组1'
            }
          ]
        },
        body: {
          type: 'service',
          data: {
            rows
          },
          body: [
            {
              type: 'table',
              source: '$rows',
              className: 'm-b-none',
              columns: [
                {
                  name: 'engine',
                  label: 'Engine'
                  // groupName: '分组1' // 这里没配置groupName
                },
                {
                  name: 'grade',
                  label: 'Grade'
                  // groupName: '分组1' // 这里没配置groupName
                },
                {
                  name: 'version',
                  label: 'Version'
                  // groupName: '分组2' // 这里没配置groupName
                },
                {
                  name: 'browser',
                  label: 'Browser',
                  groupName: '分组2'
                },
                {
                  name: 'id',
                  label: 'ID',
                  toggled: false,
                  groupName: '分组2'
                },
                {
                  name: 'platform',
                  label: 'Platform',
                  groupName: '分组2'
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

test('Renderer:table column head style className', () => {
  const {container} = render(
    amisRender(
      {
        type: 'table',
        title: '表格1',
        data: {
          items: rows
        },
        columnsTogglable: false,
        className: 'className',
        tableClassName: 'tableClassName',
        headerClassName: 'headerClassName',
        footerClassName: 'footerClassName',
        toolbarClassName: 'toolbarClassName',
        columns: [
          {
            name: 'engine',
            label: 'Engine',
            isHead: true
          },
          {
            name: 'platform',
            label: 'Platform',
            fixed: 'right'
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});

test('Renderer:table list', () => {
  const {container} = render(
    amisRender(
      {
        type: 'table',
        data: {
          items: [
            {
              __id: '91264',
              text: '衡 阎',
              progress: 22,
              type: 4,
              boolean: true,
              list: [
                {
                  title: 'Forward Functionality Technician',
                  description: 'nisi ex eum'
                },
                {
                  title: 'District Applications Specialist',
                  description: 'ipsam ratione voluptas'
                },
                {
                  title: 'Future Operations Manager',
                  description: 'ducimus fugit debitis'
                },
                {
                  title: 'Dynamic Solutions Associate',
                  description: 'saepe consequatur aut'
                }
              ],
              audio:
                'https://news-bos.cdn.bcebos.com/mvideo/%E7%9A%87%E5%90%8E%E5%A4%A7%E9%81%93%E4%B8%9C.aac',
              carousel: [
                {
                  image:
                    'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg'
                },
                {
                  html: '<div style="width: 100%; height: 200px; background: #e3e3e3; text-align: center; line-height: 200px;">carousel data in crud</div>'
                },
                {
                  image: 'https://video-react.js.org/assets/poster.png'
                }
              ],
              date: 1591270438,
              image:
                'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg',
              json: {
                __id: 1,
                text: 'text'
              }
            },
            {
              __id: '34202',
              text: '吉 卢汉市',
              progress: 85,
              type: 1,
              boolean: true,
              list: [
                {
                  title: 'Dynamic Assurance Orchestrator',
                  description: 'ea ullam voluptates'
                },
                {
                  title: 'Internal Division Assistant',
                  description: 'illum deleniti qui'
                },
                {
                  title: 'International Usability Administrator',
                  description: 'sit voluptatem quia'
                },
                {
                  title: 'Lead Optimization Orchestrator',
                  description: 'autem et blanditiis'
                },
                {
                  title: 'Future Division Assistant',
                  description: 'dolor cupiditate sint'
                },
                {
                  title: 'Forward Program Orchestrator',
                  description: 'quia distinctio voluptas'
                },
                {
                  title: 'Human Implementation Technician',
                  description: 'consequatur quaerat ullam'
                },
                {
                  title: 'National Identity Administrator',
                  description: 'ipsa et reiciendis'
                },
                {
                  title: 'Regional Factors Planner',
                  description: 'sed deserunt natus'
                },
                {
                  title: 'Human Data Administrator',
                  description: 'rerum consequatur odit'
                }
              ],
              audio:
                'https://news-bos.cdn.bcebos.com/mvideo/%E7%9A%87%E5%90%8E%E5%A4%A7%E9%81%93%E4%B8%9C.aac',
              carousel: [
                {
                  image:
                    'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg'
                },
                {
                  html: '<div style="width: 100%; height: 200px; background: #e3e3e3; text-align: center; line-height: 200px;">carousel data in crud</div>'
                },
                {
                  image: 'https://video-react.js.org/assets/poster.png'
                }
              ],
              date: 1591270438,
              image:
                'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg',
              json: {
                __id: 1,
                text: 'text'
              }
            },
            {
              __id: '37701',
              text: '立辉安市',
              progress: 72,
              type: 2,
              boolean: false,
              list: [
                {
                  title: 'Corporate Metrics Liason',
                  description: 'aspernatur natus qui'
                },
                {
                  title: 'Central Paradigm Analyst',
                  description: 'sequi numquam ad'
                },
                {
                  title: 'International Data Administrator',
                  description: 'sed libero eum'
                },
                {
                  title: 'Forward Optimization Assistant',
                  description: 'officiis accusantium dolorem'
                },
                {
                  title: 'Senior Metrics Executive',
                  description: 'commodi sint quod'
                },
                {
                  title: 'Corporate Quality Facilitator',
                  description: 'aut aperiam est'
                },
                {
                  title: 'Forward Operations Producer',
                  description: 'sed corporis eaque'
                },
                {
                  title: 'National Integration Analyst',
                  description: 'quasi ab cumque'
                }
              ],
              audio:
                'https://news-bos.cdn.bcebos.com/mvideo/%E7%9A%87%E5%90%8E%E5%A4%A7%E9%81%93%E4%B8%9C.aac',
              carousel: [
                {
                  image:
                    'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg'
                },
                {
                  html: '<div style="width: 100%; height: 200px; background: #e3e3e3; text-align: center; line-height: 200px;">carousel data in crud</div>'
                },
                {
                  image: 'https://video-react.js.org/assets/poster.png'
                }
              ],
              date: 1591270438,
              image:
                'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg',
              json: {
                __id: 1,
                text: 'text'
              }
            }
          ]
        },
        affixHeader: false,
        syncLocation: false,
        columns: [
          {
            name: '__id',
            label: 'ID',
            type: 'text'
          },
          {
            name: 'text',
            label: '文本',
            type: 'text'
          },
          {
            type: 'image',
            label: '图片',
            name: 'image'
          },
          {
            name: 'date',
            type: 'date',
            label: '日期'
          },
          {
            name: 'progress',
            label: '进度',
            type: 'progress'
          },
          {
            name: 'boolean',
            label: '状态',
            type: 'status'
          },
          {
            name: 'boolean',
            label: '开关',
            type: 'switch'
          },
          {
            name: 'type',
            label: '映射',
            type: 'mapping',
            map: {
              '1': "<span class='label label-info'>漂亮</span>",
              '2': "<span class='label label-success'>开心</span>",
              '3': "<span class='label label-danger'>惊吓</span>",
              '4': "<span class='label label-warning'>紧张</span>",
              '*': '其他：${type}'
            }
          },
          {
            name: 'list',
            type: 'list',
            label: 'List',
            placeholder: '-',
            listItem: {
              title: '${title}',
              subTitle: '${description}'
            }
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});

describe('Renderer:table selectable & itemCheckableOn', () => {
  const schema: any = {
    type: 'table',
    title: '表格1',
    selectable: true,
    itemCheckableOn: '${__id != 1}',
    data: {
      items: rows
    },
    columns: [
      {
        name: 'engine',
        label: 'Engine'
      },
      {
        name: 'version',
        label: 'Version'
      }
    ]
  };

  test('checkbox style', async () => {
    const {container} = render(amisRender(schema, {}, makeEnv({})));
    await waitFor(() => {
      expect(container.querySelector('[type=checkbox]')).toBeInTheDocument();
    });

    expect(
      container.querySelector('[data-id="1"] [type=checkbox][disabled=""]')!
    ).toBeInTheDocument();
  });

  test('radio style', async () => {
    schema.multiple = false;
    const {container} = render(amisRender(schema, {}, makeEnv({})));
    await waitFor(() => {
      expect(container.querySelector('[type=radio]')).toBeInTheDocument();
    });

    expect(
      container.querySelector('[data-id="1"] [type=radio][disabled=""]')!
    ).toBeInTheDocument();
  });
});

describe('dbClick', () => {
  test('should call the function when double clicking a row of the table rows', async () => {
    const fn = jest.fn();
    const schema: any = {
      type: 'table',
      data: {
        items: rows
      },
      columns: [
        {
          name: 'engine',
          label: 'Engine'
        }
      ],
      onEvent: {
        rowDbClick: {
          actions: [
            {
              actionType: 'custom',
              script: fn
            }
          ]
        }
      }
    };

    render(amisRender(schema, {}, makeEnv({})));

    await waitFor(() => {
      const ele = screen.getAllByText('Trident');
      fireEvent.dblClick(ele[0]);
      expect(fn).toBeCalledTimes(1);
    });
  });
});

test('Renderer:table-accessSuperData1', () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'table',
        data: {
          abc: 'super-abc',
          items: [{id: 'id-1', efg: 'efg-2'}]
        },
        columns: [
          {name: 'id', label: 'Id'},
          {name: 'abc', label: 'Abc'}
        ]
      },
      {},
      makeEnv({})
    )
  );

  const td1 = container.querySelector('tr:first-child>td:nth-child(1)');
  const td2 = container.querySelector('tr:first-child>td:nth-child(2)');

  expect(td1?.textContent).toBe('id-1');
  expect(td2?.textContent).toBe('-');
});

test('Renderer:table-accessSuperData2', () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'table',
        canAccessSuperData: true,
        data: {
          abc: 'super-abc',
          items: [{id: 'id-1', efg: 'efg-2'}]
        },
        columns: [
          {name: 'id', label: 'Id'},
          {name: 'abc', label: 'Abc'}
        ]
      },
      {},
      makeEnv({})
    )
  );

  const td1 = container.querySelector('tr:first-child>td:nth-child(1)');
  const td2 = container.querySelector('tr:first-child>td:nth-child(2)');

  expect(td1?.textContent).toBe('id-1');
  expect(td2?.textContent).toBe('super-abc');
});

test('Renderer:table-accessSuperData3', () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'table',

        data: {
          abc: 'super-abc',
          items: [{id: 'id-1', efg: 'efg-2'}]
        },
        columns: [
          {name: 'id', label: 'Id'},
          {name: 'abc', label: 'Abc', canAccessSuperData: true}
        ]
      },
      {},
      makeEnv({})
    )
  );

  const td1 = container.querySelector('tr:first-child>td:nth-child(1)');
  const td2 = container.querySelector('tr:first-child>td:nth-child(2)');

  expect(td1?.textContent).toBe('id-1');
  expect(td2?.textContent).toBe('super-abc');
});

test('Renderer:table-accessSuperData4', () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'table',
        canAccessSuperData: true,
        data: {
          abc: 'super-abc',
          items: [{id: 'id-1', efg: 'efg-2'}]
        },
        columns: [
          {name: 'id', label: 'Id'},
          {name: 'abc', label: 'Abc', canAccessSuperData: false}
        ]
      },
      {},
      makeEnv({})
    )
  );

  const td1 = container.querySelector('tr:first-child>td:nth-child(1)');
  const td2 = container.querySelector('tr:first-child>td:nth-child(2)');

  expect(td1?.textContent).toBe('id-1');
  expect(td2?.textContent).toBe('-');
});

// https://github.com/baidu/amis/issues/9556
test('Renderer:table-accessSuperData5', async () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'page',
        data: {
          engine: 'xxx',
          items: [
            {
              id: 1
            },
            {
              id: 2,
              engine: 'Trident'
            }
          ]
        },
        body: {
          type: 'table',
          name: 'crud',
          source: '${items}',
          columns: [
            {
              name: 'id',
              label: 'ID'
            },
            {
              type: 'static-text',
              name: 'engine',
              label: 'Rendering engine'
            },
            {
              type: 'text',
              name: 'engine',
              label: 'Rendering engine'
            }
          ]
        }
      },
      {},
      makeEnv({})
    )
  );

  await wait(200);
  const tds = [].slice
    .call(container.querySelectorAll('td'))
    .map((td: any) => td.textContent);
  expect(tds).toEqual(['1', '-', '-', '2', 'Trident', 'Trident']);
});
test('Renderer:table-accessSuperData6', async () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'page',
        data: {
          engine: 'xxx',
          items: [
            {
              id: 1
            },
            {
              id: 2,
              engine: 'Trident'
            }
          ]
        },
        body: {
          type: 'table',
          name: 'crud',
          source: '${items}',
          columns: [
            {
              name: 'id',
              label: 'ID'
            },
            {
              type: 'static-text',
              name: 'engine',
              label: 'Rendering engine',
              canAccessSuperData: true
            },
            {
              type: 'text',
              name: 'engine',
              label: 'Rendering engine'
            }
          ]
        }
      },
      {},
      makeEnv({})
    )
  );

  await wait(200);
  const tds = [].slice
    .call(container.querySelectorAll('td'))
    .map((td: any) => td.textContent);
  expect(tds).toEqual(['1', 'xxx', '-', '2', 'Trident', 'Trident']);
});

test('Renderer:table-each', () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'table',

        data: {
          items: [{id: 'id-1', eachData: 'a,b,c'}]
        },
        columns: [
          {name: 'id', label: 'Id'},
          {
            source: '${eachData|split}',
            label: '循环',
            type: 'each',
            placeholder: '暂无内容',
            items: {
              type: 'tpl',
              tpl: "<span class='label label-info m-l-sm'><%= this.item %></span>"
            }
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  const td2 = container.querySelector('tr:first-child>td:nth-child(2)');

  expect(td2?.innerHTML).toBe(
    '<div class="cxd-Each"><span class="cxd-TplField fr-view"><span><span class="label label-info m-l-sm">a</span></span></span><span class="cxd-TplField fr-view"><span><span class="label label-info m-l-sm">b</span></span></span><span class="cxd-TplField fr-view"><span><span class="label label-info m-l-sm">c</span></span></span></div>'
  );
});

test('Renderer:table-column-quickEdit-inline', async () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'table',
        title: '表格',
        data: {
          items: [
            {
              engine: 'Trident - wixp4',
              browser: 'Internet Explorer 4.0',
              platform: 'Win 95+',
              version: '4',
              grade: 'X',
              badgeText: '默认',
              id: 1
            }
          ]
        },
        columns: [
          {
            name: 'engine',
            label: 'Engine',
            id: 'u:2e5658776790'
          },
          {
            name: 'version',
            label: 'Version',
            id: 'u:5c41ffc2ecb0'
          },
          {
            label: '选项',
            name: 'optionValue',
            id: 'checkbox_${index}',
            type: 'switch',
            quickEdit: {
              type: 'switch',
              mode: 'inline'
            }
          },
          {
            label: '操作',
            type: 'operation',
            buttons: [
              {
                label: '赋值',
                type: 'button',
                onEvent: {
                  click: {
                    actions: [
                      {
                        actionType: 'setValue',
                        componentId: 'checkbox_${index}',
                        args: {
                          value: true
                        }
                      }
                    ]
                  }
                }
              }
            ]
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  await waitFor(() => {
    expect(getByText('赋值')).toBeInTheDocument();
    expect(container.querySelector('.cxd-Switch')).toBeInTheDocument();
    expect(container.querySelector('.is-checked')).not.toBeInTheDocument();
  });

  fireEvent.click(getByText(/赋值/));

  await waitFor(() => {
    expect(container.querySelector('.is-checked')).toBeInTheDocument();
  });
});

test('Renderer:table-column-quickEdit-saveImmediately', async () => {
  const fetcher = jest
    .fn()
    .mockImplementation(() =>
      Promise.resolve({status: 200, data: {status: 0, msg: 'ok'}})
    );
  const {container, getByText} = render(
    amisRender(
      {
        type: 'table',
        title: '表格',
        data: {
          items: [
            {
              engine: 'Trident - wixp4',
              browser: 'Internet Explorer 4.0',
              platform: 'Win 95+',
              version: '4',
              grade: 'X',
              badgeText: '默认',
              id: 1
            }
          ]
        },
        columns: [
          {
            name: 'engine',
            label: 'Engine',
            id: 'u:2e5658776790'
          },
          {
            name: 'version',
            label: 'Version',
            id: 'u:5c41ffc2ecb0',
            quickEdit: {
              type: 'input-text',
              saveImmediately: {
                api: '/api/mock2/saveImmediately/${id}'
              }
            }
          }
        ]
      },
      {},
      makeEnv({
        fetcher: fetcher
      })
    )
  );

  await wait(200);
  const btn = container.querySelector('.cxd-Field-quickEditBtn');
  expect(btn).toBeInTheDocument();
  fireEvent.click(btn!);
  await wait(200);
  const input = container.querySelector('input[name=version]');
  expect(input).toBeInTheDocument();
  fireEvent.change(input!, {target: {value: '5'}});

  await wait(200);
  expect(getByText('确认')).toBeInTheDocument();
  fireEvent.click(getByText('确认'));
  await wait(500);
  expect(fetcher).toBeCalledTimes(1);
  expect(fetcher.mock.calls[0][0].data).toMatchObject({
    engine: 'Trident - wixp4',
    browser: 'Internet Explorer 4.0',
    platform: 'Win 95+',
    version: '5',
    grade: 'X',
    badgeText: '默认',
    id: 1
  });
});
