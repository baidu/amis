import React = require('react');
import {
  render,
  cleanup,
  fireEvent,
  waitFor,
  screen
} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv, wait} from '../helper';
import {clearStoresCache} from '../../src';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

test('Renderer:tabs change active tab', async () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'tabs',
        tabClassName: 'bg-info',
        className: 'tabs-wrapper',
        closable: true,
        tabs: [
          {
            title: '基本配置',
            body: '<p>tab1 内容</p>'
          },
          {
            title: '其他配置',
            controls: [
              {
                name: 'c',
                type: 'text',
                label: '文本3'
              },
              {
                name: 'd',
                type: 'text',
                label: '文本4'
              }
            ]
          }
        ]
      },
      {},
      makeEnv()
    )
  );
  expect(container).toMatchSnapshot();

  fireEvent.click(getByText('其他配置'));
  await waitFor(() => getByText('文本3'));
  expect(container).toMatchSnapshot();
});

test('Renderer:tabs tabsMode', async () => {
  const baseSchema = {
    type: 'tabs',
    tabsMode: 'line',
    tabs: [
      {
        title: '基本配置',
        body: '<p>tab1 内容</p>'
      },
      {
        title: '其他配置',
        body: '<p>tab2 内容</p>'
      }
    ]
  };
  const {container, getByText, rerender} = render(
    amisRender(baseSchema, {}, makeEnv())
  );

  rerender(amisRender({...baseSchema, tabsMode: 'card'}, {}, makeEnv()));
  expect(container).toMatchSnapshot();

  rerender(amisRender({...baseSchema, tabsMode: 'radio'}, {}, makeEnv()));
  expect(container).toMatchSnapshot();

  rerender(amisRender({...baseSchema, tabsMode: 'vertical'}, {}, makeEnv()));
  expect(container).toMatchSnapshot();

  rerender(amisRender({...baseSchema, tabsMode: 'chrome'}, {}, makeEnv()));
  expect(container).toMatchSnapshot();

  rerender(amisRender({...baseSchema, tabsMode: 'simple'}, {}, makeEnv()));
  expect(container).toMatchSnapshot();

  rerender(amisRender({...baseSchema, tabsMode: 'strong'}, {}, makeEnv()));
  expect(container).toMatchSnapshot();

  rerender(amisRender({...baseSchema, tabsMode: 'tiled'}, {}, makeEnv()));
  expect(container).toMatchSnapshot();

  rerender(
    amisRender(
      {...baseSchema, sidePosition: 'right', tabsMode: 'sidebar'},
      {},
      makeEnv()
    )
  );
  expect(container).toMatchSnapshot();
});

test('Renderer:tabs source', async () => {
  const {getByText} = render(
    amisRender(
      {
        type: 'page',
        data: {
          arr: [
            {
              a: '收入',
              b: 199
            },

            {
              a: '支出',
              b: 299
            }
          ]
        },
        body: [
          {
            type: 'tabs',
            source: '${arr}',
            tabs: [
              {
                title: '${a}',
                body: {
                  type: 'tpl',
                  tpl: '金额：${b|number}元'
                }
              }
            ]
          }
        ]
      },
      {},
      makeEnv()
    )
  );
  expect(!getByText('收入')).toBeFalsy();
  expect(!getByText('支出')).toBeFalsy();
});

test('Renderer:tabs toolbar', async () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'tabs',
        toolbarClassName: 'toolbarClassName',
        toolbar: [
          {
            type: 'button',
            label: '按钮',
            size: 'sm',
            actionType: 'dialog',
            dialog: {
              title: '弹窗标题',
              body: '你点击了'
            }
          }
        ],
        tabs: [
          {
            title: '基本配置',
            body: '<p>tab1 内容</p>'
          },
          {
            title: '其他配置',
            controls: [
              {
                name: 'c',
                type: 'text',
                label: '文本3'
              },
              {
                name: 'd',
                type: 'text',
                label: '文本4'
              }
            ]
          }
        ]
      },
      {},
      makeEnv()
    )
  );
  fireEvent.click(getByText('按钮'));
  await waitFor(() => getByText('弹窗标题'));
  expect(container).toMatchSnapshot();
});

test('Renderer:tabs addable', async () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'tabs',
        closable: true,
        addable: true,
        addBtnText: '新增Tab',
        tabs: [
          {
            title: 'Tab 1',
            tab: 'Content 1',
            closable: false
          },
          {
            title: 'Tab 2',
            tab: 'Content 2'
          }
        ]
      },
      {},
      makeEnv()
    )
  );

  fireEvent.click(getByText('新增Tab'));
  await waitFor(() => {
    getByText('tab3');
  });
  expect(!getByText('tab3')).toBeFalsy();
});

const fireMouseEvent = function (
  type: string,
  elem: EventTarget,
  centerX: number,
  centerY: number
) {
  const evt = document.createEvent('MouseEvents');
  evt.initMouseEvent(
    type,
    true,
    true,
    window,
    1,
    1,
    1,
    centerX,
    centerY,
    false,
    false,
    false,
    false,
    0,
    elem
  );
  return elem.dispatchEvent(evt);
};

test('Renderer:tabs draggable', async () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'tabs',
        draggable: true,
        tabs: [
          {
            title: '基本配置',
            body: '<p>tab1 内容</p>'
          },
          {
            title: '其他配置',
            body: '<p>tab2 内容</p>'
          }
        ]
      },
      {},
      makeEnv()
    )
  );

  fireEvent.mouseDown(getByText('其他配置'));
  expect(container.querySelectorAll('[draggable=true]').length).toBe(1);
});

test('Renderer:tabs showTip', async () => {
  const {getByText, getAllByText} = render(
    amisRender(
      {
        type: 'tabs',
        showTip: true,
        showTipClassName: 'showTipClassName',
        tabs: [
          {
            title: '基本配置',
            body: '<p>tab1 内容</p>'
          },
          {
            title: '其他配置',
            body: '<p>tab2 内容</p>'
          }
        ]
      },
      {},
      makeEnv()
    )
  );

  fireEvent.mouseOver(getByText('其他配置'));

  await waitFor(() => expect(getAllByText('其他配置').length).toBe(2));

  expect(!document.querySelector('.showTipClassName')).toBeFalsy();
});

test('Renderer:tabs editable', async () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'tabs',
        editable: true,
        tabs: [
          {
            title: '基本配置',
            body: '<p>tab1 内容</p>'
          },
          {
            title: '其他配置',
            body: '<p>tab2 内容</p>'
          }
        ]
      },
      {},
      makeEnv()
    )
  );

  fireEvent.doubleClick(getByText('其他配置'));

  await waitFor(() => {
    expect(!container.querySelector('.cxd-Tabs-link-edit')).toBeFalsy();
  });
});

test('Renderer:tabs closable', async () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'tabs',
        editable: true,
        tabs: [
          {
            title: '基本配置',
            body: '<p>tab1 内容</p>',
            closable: true,
            icon: 'fa fa-gavel',
            iconPosition: 'right'
          },
          {
            title: '其他配置',
            body: '<p>tab2 内容</p>',
            icon: 'fa fa-square',
            iconPosition: 'left'
          }
        ]
      },
      {},
      makeEnv()
    )
  );

  fireEvent.click(container.querySelector('.cxd-Tabs-link-close')!);

  await waitFor(() => {
    expect(container.querySelectorAll('.cxd-Tabs-link').length).toBe(1);
  });
});

test('Renderer:tabs disabled', async () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'tabs',
        tabs: [
          {
            title: '基本配置',
            body: '<p>tab1 内容</p>'
          },
          {
            title: '其他配置',
            body: '<p>tab2 内容</p>',
            disabled: true
          }
        ]
      },
      {},
      makeEnv()
    )
  );

  fireEvent.click(getByText('其他配置')!);

  await wait(10);

  expect(
    container
      .querySelectorAll('.cxd-Tabs-link')[0]
      .classList.contains('is-active')
  ).toBeTruthy();
});
