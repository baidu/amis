import React = require('react');
import {render} from '@testing-library/react';
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
          header: {
            title: '标题',
            subTitle: '副标题',
            description: '这是一段描述',
            avatarClassName: 'pull-left thumb-md avatar b-3x m-r',
            avatar:
              "data:image/svg+xml,%3C%3Fxml version='1.0' standalone='no'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg t='1631083237695' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2420' xmlns:xlink='http://www.w3.org/1999/xlink' width='1024' height='1024'%3E%3Cdefs%3E%3Cstyle type='text/css'%3E%3C/style%3E%3C/defs%3E%3Cpath d='M959.872 128c0.032 0.032 0.096 0.064 0.128 0.128v767.776c-0.032 0.032-0.064 0.096-0.128 0.128H64.096c-0.032-0.032-0.096-0.064-0.128-0.128V128.128c0.032-0.032 0.064-0.096 0.128-0.128h895.776zM960 64H64C28.8 64 0 92.8 0 128v768c0 35.2 28.8 64 64 64h896c35.2 0 64-28.8 64-64V128c0-35.2-28.8-64-64-64z' p-id='2421' fill='%23bfbfbf'%3E%3C/path%3E%3Cpath d='M832 288c0 53.024-42.976 96-96 96s-96-42.976-96-96 42.976-96 96-96 96 42.976 96 96zM896 832H128V704l224-384 256 320h64l224-192z' p-id='2422' fill='%23bfbfbf'%3E%3C/path%3E%3C/svg%3E"
          },
          body: '这里是内容',
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
