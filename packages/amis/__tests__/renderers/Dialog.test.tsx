import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  screen
} from '@testing-library/react';
import '../../src';
import {clearStoresCache, render as amisRender} from '../../src';
import {makeEnv as makeEnvRaw, replaceReactAriaIds, wait} from '../helper';
import rows from '../mockData/rows';
import type {RenderOptions} from '../../src';

afterEach(() => {
  cleanup();
  clearStoresCache();
  jest.useRealTimers();
});

/** 避免updateLocation里的console.error */
const makeEnv = (env?: Partial<RenderOptions>) =>
  makeEnvRaw({updateLocation: () => {}, ...env});

/**
 * https://github.com/baidu/amis/issues/1405
 *
 * 验证弹窗的 CRUD 中再次弹出一个 crud，里面的 crud 确认关闭，不会关闭外面的 crud
 */
test('1. Renderer:dialog inner crud close outter crud component', async () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'button',
          label: '第一层弹框',
          actionType: 'dialog',
          dialog: {
            title: '第一层弹框标题',
            body: [
              {
                type: 'button',
                label: '第二次弹框',
                actionType: 'dialog',
                dialog: {
                  title: '第二层弹框标题',
                  body: [
                    {
                      type: 'tpl',
                      tpl: '对你点击了',
                      inline: false
                    },
                    {
                      type: 'crud',
                      api: '',
                      columns: [
                        {
                          name: 'id',
                          label: 'ID',
                          type: 'text'
                        },
                        {
                          name: 'engine',
                          label: '渲染引擎',
                          type: 'text'
                        }
                      ]
                    },
                    {
                      type: 'button',
                      label: '按钮',
                      actionType: 'dialog',
                      dialog: {
                        title: '系统提示',
                        body: '对你点击了'
                      }
                    }
                  ],
                  actions: [
                    {
                      type: 'button',
                      label: '第二层确认',
                      actionType: 'submit'
                    }
                  ],
                  type: 'dialog'
                },
                size: 'md',
                level: 'primary'
              },
              {
                type: 'crud',
                api: '',
                columns: [
                  {
                    name: 'id',
                    label: 'ID',
                    type: 'text'
                  },
                  {
                    name: 'engine',
                    label: '渲染引擎',
                    type: 'text'
                  }
                ]
              }
            ],
            type: 'dialog'
          },
          size: 'md',
          level: 'primary'
        }
      },
      {},
      makeEnv({})
    )
  );

  // events
  fireEvent.click(getByText('第一层弹框'));
  await wait(200);

  expect(getByText('第二次弹框')).toBeInTheDocument();
  fireEvent.click(getByText('第二次弹框'));

  await wait(200);
  expect(getByText('第二层弹框标题')).toBeInTheDocument();

  expect(getByText('第二层确认')).toBeInTheDocument();
  fireEvent.click(getByText('第二层确认'));
  await wait(400);

  expect(getByText('第一层弹框标题')).toBeInTheDocument();
  // 还有第二次弹窗的按钮，说明第一层弹窗没有关闭
  expect(getByText('第二次弹框')).toBeInTheDocument();
});

/**
 * https://github.com/baidu/amis/issues/9149
 *
 * 验证弹窗内部的 动作是通用动作时是否能正确响应。
 *
 * 比如弹窗里面有个按钮是页面跳转，看是否执行了页面跳转
 */
test('2. Renderer:dialog inner component with common action', async () => {
  const jumpTo = jest.fn();
  const {container, getByText} = render(
    amisRender(
      {
        type: 'page',
        title: '表单页面',
        body: [
          {
            label: 'OpenADialog',
            type: 'button',
            actionType: 'dialog',
            level: 'primary',
            dialog: {
              body: {
                type: 'form',
                api: 'post:/api/smart_lvct_boards/excel',
                body: [
                  {
                    label: '下载Excel模板',
                    type: 'action',
                    level: 'success',
                    actionType: 'url',
                    url: '/api/filedown/zhuban'
                  }
                ]
              }
            }
          }
        ]
      },
      {},
      makeEnv({
        jumpTo
      })
    )
  );

  // events
  fireEvent.click(getByText('OpenADialog'));
  await wait(200);

  expect(getByText('下载Excel模板')).toBeInTheDocument();
  fireEvent.click(getByText('下载Excel模板'));
  await wait(400);

  expect(jumpTo).toBeCalledTimes(1);
  expect(jumpTo.mock.calls[0][0]).toBe('/api/filedown/zhuban');
});
