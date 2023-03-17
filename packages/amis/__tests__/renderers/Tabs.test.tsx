/**
 * 组件名称：Tabs 选项卡
 * 
 * 单测内容：
 1. 点击切换
 2. 各种展示模式
 3. 通过 source 获取数据
 4. 配置toolbar实现顶部工具栏
 5. addable 可新增
 6. draggable 可拖拽
 7. showTip 提示信息
 8. editable 可编辑
 9. closable 可关闭标签
 10. disabled 可禁用
 11. tabs 作为表单项
 12. collapseOnExceed 配置超出折叠
 */

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

// 1. 点击切换
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

// 2. 各种展示模式
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

// 3. 通过 source 获取数据
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

// 4. 配置toolbar实现顶部工具栏
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

// 5. addable 可新增
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

// 6. draggable 可拖拽
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

// 7. showTip 提示信息
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

// 8. editable 可编辑
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

// 9. closable 可关闭标签
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

// 10. disabled 可禁用
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

// 11. tabs 作为表单项
test('Renderer:tabs as form item', async () => {
  const onSubmit = jest.fn();
  const {container, getByText} = render(
    amisRender(
      {
        type: 'form',
        submitText: 'submitText',
        body: [
          {
            type: 'tabs',
            name: 'tab',
            tabs: [
              {
                title: 'Tab 1',
                tab: 'Content 1',
                value: 1
              },
              {
                title: 'Tab 2',
                tab: 'Content 2'
              }
            ]
          }
        ]
      },
      {onSubmit},
      makeEnv()
    )
  );

  fireEvent.click(getByText('submitText'));
  await wait(100);
  expect(onSubmit).toBeCalled();
  expect(onSubmit.mock.calls[0][0]).toEqual({
    tab: 1
  });

  fireEvent.click(getByText('Tab 2'));
  await wait(500);
  fireEvent.click(getByText('submitText'));

  await wait(100);
  expect(onSubmit).toBeCalledTimes(2);
  expect(onSubmit.mock.calls[1][0]).toEqual({
    tab: 'Tab 2'
  });

  expect(container).toMatchSnapshot();
});

// 12. collapseOnExceed 配置超出折叠
test('Renderer:tabs with collapseOnExceed', async () => {
  const {container, getByText} = render(
    amisRender(
      {
        type: 'tabs',
        tabsMode: 'tiled',
        tabs: [
          {
            title: 'Tab 1',
            tab: 'Content 1'
          },
          {
            title: 'Tab 2',
            tab: 'Content 2'
          },
          {
            title: 'Tab 3',
            tab: 'Content 3'
          },
          {
            title: 'Tab 4',
            tab: 'Content 4'
          },
          {
            title: 'Tab 5',
            tab: 'Content 5'
          }
        ],
        collapseOnExceed: 3
      },
      {},
      makeEnv()
    )
  );

  expect(container.querySelectorAll('.cxd-Tabs-link')!.length).toBe(3);
  expect(
    container.querySelector('.is-active.cxd-Tabs-pane')!
  ).toHaveTextContent('Content 1');

  const showMore = container.querySelector('.cxd-Tabs-link .cxd-Tabs-togglor')!;
  expect(showMore).toBeInTheDocument();

  fireEvent.click(showMore);
  await wait(100);

  expect(
    container.querySelectorAll('.cxd-Tabs-PopOver .cxd-Tabs-link')!.length
  ).toBe(3);
  expect(container).toMatchSnapshot('popover show');

  fireEvent.click(getByText('Tab 5'));
  await wait(100);
  expect(
    container.querySelector('.is-active.cxd-Tabs-pane')!
  ).toHaveTextContent('Content 5');
});
