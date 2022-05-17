import React = require('react');
import {render} from '@testing-library/react';
import '../../src/themes/default';
import {render as amisRender} from '../../src/index';
import {makeEnv} from '../helper';
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

// 合并单元格
test('Renderer:table combineNum', () => {
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

test('Renderer:table column head style', () => {
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
