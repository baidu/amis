import {fireEvent, render, waitFor} from '@testing-library/react';
import '../../../../src';
import {render as amisRender} from '../../../../src';
import {makeEnv, wait} from '../../../helper';

test('EventAction:combo', async () => {
  const notify = jest.fn();
  const {getByText, container}: any = render(
    amisRender(
      {
        type: 'page',
        title: 'combo',
        body: [
          {
            type: 'form',
            id: 'u:71e9bb1ed157',
            title: '表单',
            data: {
              combo: [
                {
                  name: 'Tom',
                  age: 18
                },
                {
                  name: 'Jerry',
                  age: 22
                }
              ]
            },
            body: [
              {
                type: 'button',
                label: '更新数据',
                onEvent: {
                  click: {
                    actions: [
                      {
                        actionType: 'setValue',
                        componentId: 'u:54031932ab8c',
                        args: {
                          value: [
                            {
                              name: 'Jack',
                              age: 22
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              },
              {
                type: 'button',
                label: 'clear',
                onEvent: {
                  click: {
                    actions: [
                      {
                        actionType: 'clear',
                        componentId: 'u:54031932ab8c'
                      }
                    ]
                  }
                }
              },
              {
                type: 'button',
                label: 'reset',
                onEvent: {
                  click: {
                    actions: [
                      {
                        actionType: 'reset',
                        componentId: 'u:54031932ab8c'
                      }
                    ]
                  }
                }
              },
              {
                type: 'combo',
                label: '组合输入',
                name: 'combo',
                id: 'u:54031932ab8c',
                multiple: true,
                tabsMode: true,
                resetValue: [
                  {
                    name: 'Tom',
                    age: 18
                  }
                ],
                items: [
                  {
                    type: 'input-text',
                    name: 'name'
                  },
                  {
                    type: 'input-text',
                    name: 'age'
                  },
                  {
                    type: 'button',
                    label: '自增第${index}项的年龄',
                    onEvent: {
                      click: {
                        actions: [
                          {
                            actionType: 'setValue',
                            componentId: 'u:54031932ab8c',
                            args: {
                              value: {
                                age: '${age+1}'
                              },
                              index: '${index}'
                            }
                          }
                        ]
                      }
                    }
                  }
                ],
                onEvent: {
                  add: {
                    actions: [
                      {
                        actionType: 'toast',
                        args: {
                          msgType: 'info',
                          msg: '派发新增事件'
                        }
                      }
                    ]
                  },
                  delete: {
                    actions: [
                      {
                        actionType: 'toast',
                        args: {
                          msgType: 'info',
                          msg: '派发删除事件'
                        }
                      }
                    ]
                  },
                  tabsChange: {
                    actions: [
                      {
                        actionType: 'toast',
                        args: {
                          msgType: 'info',
                          msg: '派发选项卡切换事件'
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
      makeEnv({
        notify
      })
    )
  );

  await waitFor(() => {
    expect(getByText('新增')).toBeInTheDocument();
  });
  fireEvent.click(getByText('新增'));
  await waitFor(() => {
    expect(notify).toHaveBeenCalledWith('info', '派发新增事件', {
      msg: '派发新增事件',
      msgType: 'info'
    });
  });

  fireEvent.click(
    container.querySelectorAll(
      'div[data-tooltip="删除"]'
    )[1] as HTMLInputElement
  );
  await waitFor(() => {
    expect(notify).toHaveBeenCalledWith('info', '派发删除事件', {
      msg: '派发删除事件',
      msgType: 'info'
    });
    expect(notify).toHaveBeenCalledWith('info', '派发选项卡切换事件', {
      msg: '派发选项卡切换事件',
      msgType: 'info'
    });
  });

  await waitFor(() => {
    expect(getByText('自增第0项的年龄')).toBeInTheDocument();
  });
  fireEvent.click(getByText('自增第0项的年龄'));
  await waitFor(() => {
    expect(
      container.querySelector('input[name=age]')?.getAttribute('value')
    ).toBe('19');
  });

  await waitFor(() => {
    expect(getByText('更新数据')).toBeInTheDocument();
  });
  fireEvent.click(getByText('更新数据'));
  await waitFor(() => {
    expect(
      container.querySelector('input[name=name]')?.getAttribute('value')
    ).toBe('Jack');
  });

  fireEvent.click(getByText('reset'));
  await waitFor(() => {
    expect(
      container.querySelector('input[name=name]')?.getAttribute('value')
    ).toBe('Tom');
  });

  fireEvent.click(getByText('clear'));
  await waitFor(() => {
    expect(
      container.querySelector('div[class="cxd-Tabs-content"]')
    ).toBeEmptyDOMElement();
  });
});
