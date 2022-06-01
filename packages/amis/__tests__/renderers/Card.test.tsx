import React = require('react');
import {render} from '@testing-library/react';
import * as renderer from 'react-test-renderer';
import '../../src/themes/default';
import {render as amisRender} from '../../src/index';
import {makeEnv} from '../helper';

test('Renderer:card', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'card',
          className: 'className',
          header: {
            title: '标题'
          },
          href: 'href',
          body: '这里是内容',
          bodyClassName: 'bodyClassName',
          actions: [
            {
              type: 'button',
              label: '编辑',
              actionType: 'dialog',
              dialog: {
                title: '编辑',
                body: '你正在编辑该卡片'
              }
            },
            {
              type: 'button',
              label: '删除',
              actionType: 'dialog',
              dialog: {
                title: '提示',
                body: '你删掉了该卡片'
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

test('Renderer:cards color', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        data: {
          items: [
            {
              engine: 'Trident',
              browser: 'Internet Explorer 4.0'
            },
            {
              engine: 'Chrome',
              browser: 'Chrome 44'
            },
            {
              engine: 'Gecko',
              browser: 'Firefox 1.0'
            },
            {
              engine: 'Presto',
              browser: 'Opera 10'
            },
            {
              engine: 'Webkie',
              browser: 'Safari 12'
            }
          ]
        },
        body: {
          type: 'cards',
          source: '$items',
          card: {
            header: {
              avatarText: '${engine|substring:0:2|upperCase}',
              avatarTextBackground: [
                '#FFB900',
                '#D83B01',
                '#B50E0E',
                '#E81123',
                '#B4009E',
                '#5C2D91',
                '#0078D7',
                '#00B4FF',
                '#008272'
              ]
            },
            body: [
              {
                label: 'Browser',
                name: 'browser'
              }
            ]
          }
        }
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});

test('Renderer:cards media', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'card',
          header: {
            title: '标题'
          },
          media: {
            type: 'image',
            className: 'w-36 h-24',
            url: 'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80',
            position: 'left',
            isLive: false,
            autoPlay: false,
            poster: false
          },
          body: '这里是内容',
          secondary: '次要说明',
          actions: [
            {
              type: 'button',
              label: '操作',
              actionType: 'dialog',
              className: 'mr-4',
              dialog: {
                title: '操作',
                body: '你正在编辑该卡片'
              }
            },
            {
              type: 'button',
              label: '操作',
              actionType: 'dialog',
              className: 'mr-2.5',
              dialog: {
                title: '操作',
                body: '你正在编辑该卡片'
              }
            },
            {
              type: 'dropdown-button',
              level: 'link',
              icon: 'fa fa-ellipsis-h',
              className: 'pr-1 flex',
              hideCaret: true,
              buttons: [
                {
                  type: 'button',
                  label: '编辑',
                  actionType: 'dialog',
                  dialog: {
                    title: '编辑',
                    body: '你正在编辑该卡片'
                  }
                },
                {
                  type: 'button',
                  label: '删除',
                  actionType: 'dialog',
                  dialog: {
                    title: '提示',
                    body: '你删掉了该卡片'
                  }
                }
              ]
            }
          ],
          toolbar: [
            {
              type: 'tpl',
              tpl: '标签',
              className: 'label label-warning'
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

test('Renderer:cards hightlight', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'card',
          header: {
            title: '标题',
            highlight: true,
            highlightClassName: 'test-highlight-class'
          },
          media: {
            type: 'image',
            className: 'w-36 h-24',
            url: 'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80',
            position: 'left'
          },
          body: '这里是内容',
          secondary: '次要说明',
          actions: [
            {
              type: 'button',
              label: '操作',
              actionType: 'dialog',
              className: 'mr-4',
              dialog: {
                title: '操作',
                body: '你正在编辑该卡片'
              }
            },
            {
              type: 'button',
              label: '操作',
              actionType: 'dialog',
              className: 'mr-2.5',
              dialog: {
                title: '操作',
                body: '你正在编辑该卡片'
              }
            },
            {
              type: 'dropdown-button',
              level: 'link',
              icon: 'fa fa-ellipsis-h',
              className: 'pr-1 flex',
              hideCaret: true,
              buttons: [
                {
                  type: 'button',
                  label: '编辑',
                  actionType: 'dialog',
                  dialog: {
                    title: '编辑',
                    body: '你正在编辑该卡片'
                  }
                },
                {
                  type: 'button',
                  label: '删除',
                  actionType: 'dialog',
                  dialog: {
                    title: '提示',
                    body: '你删掉了该卡片'
                  }
                }
              ]
            }
          ],
          toolbar: [
            {
              type: 'tpl',
              tpl: '标签',
              className: 'label label-warning'
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

test('Renderer:cards hightlight', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'card',
          header: {
            title: '标题',
            highlight: true,
            highlightClassName: 'test-highlight-class'
          },
          media: {
            type: 'image',
            className: 'w-36 h-24',
            url: 'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80',
            position: 'left'
          },
          body: '这里是内容',
          secondary: '次要说明',
          actions: [
            {
              type: 'button',
              label: '操作',
              actionType: 'dialog',
              className: 'mr-4',
              dialog: {
                title: '操作',
                body: '你正在编辑该卡片'
              }
            },
            {
              type: 'button',
              label: '操作',
              actionType: 'dialog',
              className: 'mr-2.5',
              dialog: {
                title: '操作',
                body: '你正在编辑该卡片'
              }
            },
            {
              type: 'dropdown-button',
              level: 'link',
              icon: 'fa fa-ellipsis-h',
              className: 'pr-1 flex',
              hideCaret: true,
              buttons: [
                {
                  type: 'button',
                  label: '编辑',
                  actionType: 'dialog',
                  dialog: {
                    title: '编辑',
                    body: '你正在编辑该卡片'
                  }
                },
                {
                  type: 'button',
                  label: '删除',
                  actionType: 'dialog',
                  dialog: {
                    title: '提示',
                    body: '你删掉了该卡片'
                  }
                }
              ]
            }
          ],
          toolbar: [
            {
              type: 'tpl',
              tpl: '标签',
              className: 'label label-warning'
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
