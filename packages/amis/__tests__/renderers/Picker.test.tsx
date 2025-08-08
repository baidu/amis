/**
 * 组件名称：Picker 列表选择器
 * 单测内容：
 * 1. 在 table 中使用
 * 2. 触发方式 & 是否显示icon & 标题 & 位置 & 触发条件
 * 3. offset 偏移量
 * 4. 展示模式和尺寸
 * 5. Renderer:Picker with overflowConfig
 */

import React from 'react';
import {render, fireEvent, cleanup, screen} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {wait, makeEnv} from '../helper';
import {clearStoresCache} from '../../src';

afterEach(() => {
  cleanup();
  clearStoresCache();
});

test('1. Renderer:Picker base', async () => {
  const {container, rerender, getByText, getByPlaceholderText, baseElement} =
    render(
      amisRender({
        type: 'picker',
        name: 'picker',
        label: 'picker',
        placeholder: 'picker-placeholder',
        options: [
          {
            label: 'A',
            value: 'a'
          },
          {
            label: 'B',
            value: 'b'
          },
          {
            label: 'C',
            value: 'c'
          }
        ]
      })
    );

  fireEvent.click(getByText('picker-placeholder')!);

  expect(
    baseElement.querySelector('.cxd-Modal .cxd-Crud')!
  ).toBeInTheDocument();

  const items = baseElement.querySelectorAll('.cxd-Crud .cxd-ListItem');
  expect(items!.length).toBe(3);

  fireEvent.click(items[1]);
  expect(
    baseElement.querySelector('.cxd-Crud .cxd-ListItem.is-checked')
  ).toHaveTextContent('B');
  expect(baseElement).toMatchSnapshot();

  fireEvent.click(getByText('确认'));

  await wait(500);

  expect(container.querySelector('.cxd-Picker-value')).toHaveTextContent('B');
  expect(container).toMatchSnapshot();
});

test('2. Renderer:Picker with pickerSchema & valueField & labelField & multiple & value & modalSize', async () => {
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: [
          {
            id: 'a',
            engine: 'engine a',
            browser: 'browser a'
          },
          {
            id: 'b',
            engine: 'engine b',
            browser: 'browser b'
          },
          {
            id: 'c',
            engine: 'engine c',
            browser: 'browser c'
          },
          {
            id: 'd',
            engine: 'engine d',
            browser: 'browser d'
          }
        ]
      }
    })
  );
  const {container, rerender, getByText, getByPlaceholderText, baseElement} =
    render(
      amisRender(
        {
          type: 'picker',
          name: 'type4',
          joinValues: true,
          valueField: 'id',
          labelField: 'engine',
          label: '多选',
          source: '/api/mock2/sample',
          modalSize: 'lg',
          value: 'a,b',
          multiple: true,
          pickerSchema: {
            columns: [
              {
                name: 'engine',
                label: 'Rendering engine'
              },
              {
                name: 'browser',
                label: 'Browser'
              }
            ]
          }
        },
        {},
        makeEnv({
          session: 'picker-fetcher-1',
          fetcher
        })
      )
    );

  await wait(500);
  expect(fetcher).toHaveBeenCalled;
  expect(fetcher.mock.calls[0][0].query).toEqual({
    op: 'loadOptions',
    id: 'a,b',
    value: 'a,b'
  });

  const values = container.querySelectorAll('.cxd-Picker .cxd-Picker-value');
  expect(values.length).toBe(2);

  expect(values[0]).toHaveTextContent('engine a');

  fireEvent.click(container.querySelector('.cxd-Picker-valueWrap')!);

  await wait(1000);

  expect(
    baseElement.querySelector('.cxd-Modal .cxd-Crud')!
  ).toBeInTheDocument();
  expect(baseElement.querySelector('.cxd-Modal')).toHaveClass('cxd-Modal--lg');

  expect(fetcher).toBeCalledTimes(2);
  expect(fetcher.mock.calls[1][0].query).toEqual({
    page: 1,
    perPage: 10
  });
});

test('3. Renderer:Picker with embed', async () => {
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        msg: 'ok',
        data: [
          {
            id: 'a',
            engine: 'engine a',
            browser: 'browser a'
          },
          {
            id: 'b',
            engine: 'engine b',
            browser: 'browser b'
          },
          {
            id: 'c',
            engine: 'engine c',
            browser: 'browser c'
          },
          {
            id: 'd',
            engine: 'engine d',
            browser: 'browser d'
          }
        ]
      }
    })
  );
  const {container, rerender, getByText, getByPlaceholderText, baseElement} =
    render(
      amisRender(
        {
          type: 'picker',
          name: 'type4',
          joinValues: true,
          valueField: 'id',
          labelField: 'engine',
          label: '多选',
          source: '/api/mock2/sample',
          modalSize: 'lg',
          value: 'a,b',
          multiple: true,
          embed: true,
          pickerSchema: {
            columns: [
              {
                name: 'engine',
                label: 'Rendering engine'
              },
              {
                name: 'browser',
                label: 'Browser'
              }
            ]
          }
        },
        {},
        makeEnv({
          session: 'picker-fetcher-1',
          fetcher
        })
      )
    );

  await wait(500);
  expect(
    container.querySelector('.cxd-Picker .cxd-Crud .cxd-Table')
  ).toBeInTheDocument();
});

test('4. Renderer:Picker with drawer modalMode', async () => {
  const {container, rerender, getByText, getByPlaceholderText, baseElement} =
    render(
      amisRender({
        type: 'picker',
        name: 'picker',
        label: 'picker',
        modalMode: 'drawer',
        placeholder: 'picker-placeholder',
        options: [
          {
            label: 'A',
            value: 'a'
          },
          {
            label: 'B',
            value: 'b'
          },
          {
            label: 'C',
            value: 'c'
          }
        ]
      })
    );

  fireEvent.click(getByText('picker-placeholder')!);
  await wait(500);

  expect(
    baseElement.querySelector('.cxd-Drawer .cxd-Crud')!
  ).toBeInTheDocument();
});

// describe('5. Renderer:Picker with overflowConfig', () => {
//   test('5-1. Renderer:Picker select', async () => {
//     const {container, rerender, getByText, getByPlaceholderText, baseElement} =
//       render(
//         amisRender({
//           type: 'picker',
//           name: 'picker',
//           label: 'picker',
//           modalMode: 'dialog',
//           placeholder: 'picker-placeholder',
//           multiple: true,
//           overflowConfig: {
//             maxTagCount: 2
//           },
//           value: 'a,b,c',
//           options: [
//             {label: 'A', value: 'a'},
//             {label: 'B', value: 'b'},
//             {label: 'C', value: 'c'},
//             {label: 'D', value: 'd'}
//           ]
//         })
//       );

//     await wait(500);

//     const tags = container.querySelector('.cxd-Picker-valueWrap');

//     expect(tags).toBeInTheDocument();
//     /** tag 元素数量正确 */
//     expect(tags?.childElementCount).toEqual(4); // 还有个 input
//     /** 收纳标签文案正确 */
//     expect(tags?.lastElementChild?.previousSibling).toHaveTextContent(
//       '+ 1 ...'
//     );
//   });

//   test('5-2. Renderer:Picker embeded', async () => {
//     const {container, rerender, getByText, getByPlaceholderText, baseElement} =
//       render(
//         amisRender({
//           type: 'picker',
//           name: 'picker',
//           label: 'picker',
//           modalMode: 'dialog',
//           placeholder: 'picker-placeholder',
//           embed: true,
//           multiple: true,
//           overflowConfig: {
//             maxTagCount: 2
//           },
//           value: 'a,b,c',
//           options: [
//             {label: 'A', value: 'a'},
//             {label: 'B', value: 'b'},
//             {label: 'C', value: 'c'},
//             {label: 'D', value: 'd'}
//           ]
//         })
//       );

//     await wait(500);

//     const tags = container.querySelectorAll(
//       '.cxd-Crud-selection .cxd-Crud-value'
//     );
//     /** tag 元素数量正确 */
//     expect(tags?.length).toEqual(3);
//     /** 收纳标签文案正确 */
//     expect(tags[tags?.length - 1]).toHaveTextContent('+ 1 ...');
//   });
// });

// 对应 issue https://github.com/baidu/amis/issues/9435
test('6. picker with toolbar form', async () => {
  const {container, rerender, getByText, getByPlaceholderText, baseElement} =
    render(
      amisRender({
        type: 'picker',
        name: 'type4',
        joinValues: true,
        valueField: 'id',
        labelField: 'engine',
        label: 'Picker',
        embed: true,
        source: {
          method: 'get',
          url: '/api/mock2/crud/tree?waitSeconds=1',
          mockResponse: {
            status: 200,
            data: {
              count: 6,
              rows: [
                {
                  engine: 'Trident - afurms',
                  browser: 'Internet Explorer 4.0',
                  platform: 'Win 95+',
                  version: '4',
                  grade: 'X',
                  id: 1,
                  children: [
                    {
                      engine: 'Trident - f7006',
                      browser: 'Internet Explorer 5.0',
                      platform: 'Win 95+',
                      version: '5',
                      grade: 'C',
                      id: 2
                    },
                    {
                      engine: 'Trident - t6r3s4',
                      browser: 'Internet Explorer 5.5',
                      platform: 'Win 95+',
                      version: '5.5',
                      grade: 'A',
                      id: 3
                    },
                    {
                      engine: 'Trident - 3a99nb',
                      browser: 'Internet Explorer 6',
                      platform: 'Win 98+',
                      version: '6',
                      grade: 'A',
                      id: 4
                    }
                  ]
                },
                {
                  engine: 'Trident - plb6cd',
                  browser: 'Internet Explorer 7',
                  platform: 'Win XP SP2+',
                  version: '7',
                  grade: 'A',
                  id: 5,
                  children: [
                    {
                      engine: 'Trident - dpgbw',
                      browser: 'AOL browser (AOL desktop)',
                      platform: 'Win XP',
                      version: '6',
                      grade: 'A',
                      id: 6
                    }
                  ]
                },
                {
                  engine: 'Gecko - syo6k7',
                  browser: 'Firefox 1.0',
                  platform: 'Win 98+ / OSX.2+',
                  version: '1.7',
                  grade: 'A',
                  id: 7
                },
                {
                  engine: 'Gecko - xha3vk',
                  browser: 'Firefox 1.5',
                  platform: 'Win 98+ / OSX.2+',
                  version: '1.8',
                  grade: 'A',
                  id: 8
                },
                {
                  engine: 'Gecko - wc71bb',
                  browser: 'Firefox 2.0',
                  platform: 'Win 98+ / OSX.2+',
                  version: '1.8',
                  grade: 'A',
                  id: 9
                },
                {
                  engine: 'Gecko - xfqpti',
                  browser: 'Firefox 3.0',
                  platform: 'Win 2k+ / OSX.3+',
                  version: '1.9',
                  grade: 'A',
                  id: 10
                }
              ]
            }
          }
        },
        modalSize: 'lg',
        value: '4,5',
        multiple: true,
        pickerSchema: {
          mode: 'table',
          name: 'thelist',
          draggable: true,
          headerToolbar: {
            type: 'form',
            wrapWithPanel: false,
            target: 'thelist',
            body: [
              {
                type: 'input-group',
                label: false,
                className: 'select-searchbox',
                body: [
                  {
                    type: 'select',
                    name: 'keywordType',
                    options: [
                      {
                        label: 'id',
                        value: 'id'
                      },
                      {
                        label: '名称',
                        value: 'name'
                      }
                    ],
                    selectFirst: true
                  },
                  {
                    type: 'input-text',
                    name: 'keyword',
                    size: 'md'
                  },
                  {
                    type: 'submit',
                    icon: 'fa fa-search'
                  }
                ]
              }
            ]
          },
          columns: [
            {
              name: 'engine',
              label: 'Rendering engine',
              sortable: true,
              searchable: true,
              type: 'text',
              toggled: true
            }
          ]
        }
      })
    );

  await wait(200);
  expect(container.querySelector('.cxd-Select-value')).toBeInTheDocument();
  expect(container.querySelector('.cxd-Select-value')).toHaveTextContent('id');
});
