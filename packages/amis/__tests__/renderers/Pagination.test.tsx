/**
 * 组件名称：Pagination 分页组件
 *
 * 单测内容：
 1. pagination-wrapper
 2. 基础使用
 3. 简易模式
 4. layout
 5. maxButtons
 6. total & perPage & activePage
 7. showPerPage & perPageAvailable & showPageInput
 8. disabled
 9. 组件尺寸 size
 10. 多页跳转参数 ellipsisPageGap
 */

import {fireEvent, render, waitFor, within} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv, replaceReactAriaIds, wait} from '../helper';
import rows from '../mockData/rows';

// 1. pagination-wrapper
test('Renderer:Pagination', () => {
  const {container} = render(
    amisRender(
      {
        type: 'service',
        data: {
          rows
        },
        body: [
          {
            type: 'pagination-wrapper',
            inputName: 'rows',
            outputName: 'rows',
            perPage: 2,
            body: [
              {
                type: 'table',
                title: '分页表格',
                source: '${rows}',
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
              }
            ]
          }
        ]
      },
      {},
      makeEnv({})
    )
  );
  replaceReactAriaIds(container);
  expect(container).toMatchSnapshot();
});

// 2. 基础使用
test('Renderer:Pagination', () => {
  const schema = {
    type: 'service',
    data: {
      rows
    },
    body: [
      {
        type: 'pagination',
        layout: 'total,perPage,pager,go',
        mode: 'normal',
        activePage: 2,
        lastPage: 99999,
        total: 999,
        perPage: 10,
        maxButtons: 4,
        showPerPage: true,
        perPageAvailable: [10, 20, 50, 100],
        showPageInput: true,
        disabled: false
      }
    ]
  };
  const {container} = render(amisRender(schema, {}, makeEnv({})));
  replaceReactAriaIds(container);
  expect(container).toMatchSnapshot();
});

// 3. 简易模式
test('Renderer:Pagination with simple mode', async () => {
  const pageChange = jest.fn();
  const {container, rerender} = render(
    amisRender(
      {
        type: 'service',
        body: [
          {
            type: 'pagination',
            mode: 'simple',
            activePage: 2,
            hasNext: true,
            onPageChange: pageChange
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  const next = container.querySelector('.cxd-Pagination-next')!;
  expect(next).toBeInTheDocument();
  expect(next).not.toHaveClass('is-disabled');

  fireEvent.click(next);

  await wait(500);
  expect(pageChange).toBeCalled();

  await wait(200);
  expect(pageChange.mock.calls[0]).toEqual([3, 10, 'forward']);

  // keyboard up & down
  // 简洁模式下不支持键盘上下键切换页码
  // const simplego = container.querySelector('.cxd-Pagination-simplego-input')! as HTMLInputElement;
  // fireEvent.focus(simplego);
  // await wait(500);

  // fireEvent.keyUp(simplego, {key: "ArrowUp", code: 38});
  // expect(simplego.value).toBe('2');
  // expect(pageChange).toBeCalled();

  // fireEvent.keyUp(simplego, {key: "ArrowDown", code: 40});
  // expect(simplego.value).toBe('1');
  // await wait(500);

  rerender(
    amisRender(
      {
        type: 'service',
        body: [
          {
            type: 'pagination',
            mode: 'simple',
            hasNext: false,
            onPageChange: pageChange
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  await wait(100);

  expect(next).toHaveClass('is-disabled');
  replaceReactAriaIds(container);
  expect(container).toMatchSnapshot();
});

// 4. layout
test('Renderer:Pagination with layout', () => {
  const schema = {
    type: 'service',
    body: [
      {
        type: 'pagination',
        layout: 'total,go,perPage,pager',
        mode: 'normal',
        activePage: 2,
        lastPage: 100,
        total: 999
      }
    ]
  };
  const {container} = render(amisRender(schema, {}, makeEnv({})));

  const pageWrapper = container.querySelector('.cxd-Pagination-wrap')!;
  expect(pageWrapper).toBeInTheDocument();

  const children = pageWrapper.children;

  expect(children.length).toBe(4);
  expect(children[0]).toHaveClass('cxd-Pagination-total');
  expect(children[1]).toHaveClass('cxd-Pagination-inputGroup');
  expect(children[2]).toHaveClass('cxd-Pagination-perpage');
  expect(children[3]).toHaveClass('cxd-Pagination');

  replaceReactAriaIds(container);
  expect(container).toMatchSnapshot();
});

// 5. maxButtons
test('Renderer:Pagination with maxButtons', () => {
  const schema = {
    type: 'service',
    body: [
      {
        type: 'pagination',
        mode: 'normal',
        activePage: 20,
        total: 999,
        maxButtons: 10
      }
    ]
  };
  const {container} = render(amisRender(schema, {}, makeEnv({})));

  const pager = container.querySelectorAll(
    '.cxd-Pagination > .cxd-Pagination-pager-item'
  );
  expect(pager.length).toBe(10);

  replaceReactAriaIds(container);
  expect(container).toMatchSnapshot();
});

// 6. total & perPage & activePage
test('Renderer:Pagination with total & perPage & activePage', async () => {
  const {container, rerender} = render(
    amisRender(
      {
        type: 'service',
        body: {
          type: 'pagination',
          mode: 'normal',
          activePage: 20,
          total: 999,
          perPage: 2
        }
      },
      {},
      makeEnv({})
    )
  );

  const pager = container.querySelectorAll(
    '.cxd-Pagination > .cxd-Pagination-pager-item'
  );

  expect(pager[pager.length - 1]).toHaveTextContent('500');
  expect(
    container.querySelector('.cxd-Pagination-pager-item.is-active')!
  ).toHaveTextContent('20');

  await wait(200);
  rerender(
    amisRender(
      {
        type: 'service',
        body: {
          type: 'pagination',
          mode: 'normal',
          activePage: 5,
          total: 99,
          perPage: 11
        }
      },
      {},
      makeEnv({})
    )
  );

  await wait(200);

  const pager2 = container.querySelectorAll(
    '.cxd-Pagination > .cxd-Pagination-pager-item'
  );
  expect(pager2[pager2.length - 1]).toHaveTextContent('9');
  expect(
    container.querySelector('.cxd-Pagination-pager-item.is-active')!
  ).toHaveTextContent('5');
});

// 7. showPerPage & perPageAvailable & showPageInput
test('Renderer:Pagination with showPerPage & perPageAvailable & showPageInput', async () => {
  const pageChange = jest.fn();
  const {container, rerender} = render(
    amisRender(
      {
        type: 'service',
        body: {
          type: 'pagination',
          mode: 'normal',
          total: 999,
          showPerPage: true,
          perPageAvailable: [2, 11, 37, 101, 555],
          showPageInput: true,
          onPageChange: pageChange
        }
      },
      {},
      makeEnv({})
    )
  );
  replaceReactAriaIds(container);

  function getLastPagerItem() {
    const pager = container.querySelectorAll(
      '.cxd-Pagination > .cxd-Pagination-pager-item'
    );
    return pager[pager.length - 1];
  }

  const perPage = container.querySelector('.cxd-Pagination-perpage')!;
  const go = container.querySelector('.cxd-Pagination-inputGroup')!;

  expect(getLastPagerItem()).toHaveTextContent('100');
  expect(perPage).toBeInTheDocument();
  expect(go).toBeInTheDocument();

  fireEvent.click(perPage);
  await waitFor(() => {
    expect(perPage.querySelectorAll('.cxd-Select-option')!.length).toBe(5);
    expect(perPage).toMatchSnapshot();
  });

  fireEvent.click(await within(perPage as HTMLElement).getByText('101条/页'));

  await wait(200);

  expect(pageChange).toBeCalledTimes(1);
  expect(pageChange.mock.calls[0]).toEqual([1, 101]);

  expect(getLastPagerItem()).toHaveTextContent('10');

  fireEvent.change(go.querySelector('.cxd-Pagination-inputGroup-input')!, {
    target: {value: 9}
  });
  await wait(500);
  fireEvent.click(go.querySelector('.cxd-Pagination-inputGroup-right')!);

  await wait(200);

  expect(pageChange).toBeCalledTimes(2);
  expect(pageChange.mock.calls[1]).toEqual([9, 101]);
});

// 8. disabled
test('Renderer:Pagination with disabled', async () => {
  const pageChange = jest.fn();
  const {container, rerender} = render(
    amisRender(
      {
        type: 'service',
        body: [
          {
            type: 'pagination',
            mode: 'normal',
            total: 999,
            activePage: 1,
            disabled: true,
            onPageChange: pageChange
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  expect(container.querySelector('.cxd-Pagination-wrap')!).toHaveClass(
    'disabled'
  );

  fireEvent.click(
    await within(container.querySelector('.cxd-Pagination')!).getByText('2')!
  );

  await wait(200);
  expect(pageChange).not.toBeCalled();

  replaceReactAriaIds(container);
  expect(container).toMatchSnapshot();
});

// 9.组件尺寸
test('pagination: Pagination with size', async () => {
  const {container} = render(
    amisRender(
      {
        type: 'service',
        body: [
          {
            type: 'pagination',
            size: 'sm'
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  const paginationEl = container.querySelector('.cxd-Pagination-wrap');
  expect(paginationEl).toHaveClass('cxd-Pagination-wrap-size--sm');
});

// 10.多页跳转页数
test('pagination: Pagination with ellipsisPageGap', async () => {
  const pageChange = jest.fn();
  const {container} = render(
    amisRender(
      {
        type: 'service',
        id: 'service_01',
        data: {
          page: 1
        },
        api: '/api/mock2/crud/table',
        body: [
          {
            type: 'pagination',
            layout: 'pager',
            mode: 'normal',
            activePage: '${page}',
            lastPage: 10,
            total: 10,
            perPage: 1,
            maxButtons: 7,
            ellipsisPageGap: 7,
            onPageChange: pageChange,
            onEvent: {
              change: {
                actions: [
                  {
                    actionType: 'setValue',
                    componentId: 'service_01',
                    args: {
                      value: {
                        page: '${event.data.page}'
                      }
                    }
                  }
                ]
              }
            }
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  const ellipsisEL = container.querySelector('.cxd-Pagination-ellipsis');
  fireEvent.click(ellipsisEL!);
  await wait(200);
  expect(pageChange).toBeCalled();
  const active = container.querySelector('.is-active a');
  expect(active).toHaveTextContent('8');
});
