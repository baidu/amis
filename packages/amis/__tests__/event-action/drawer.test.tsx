import {fireEvent, render, waitFor} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv, wait} from '../helper';

test('EventAction:drawer args', async () => {
  const notify = jest.fn();
  const {getByText, container}: any = render(
    amisRender(
      {
        type: 'page',
        body: [
          {
            type: 'button',
            label: '打开抽屉',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'drawer',
                    args: {
                      drawer: {
                        type: 'drawer',
                        id: 'drawer_001',
                        title: '模态抽屉',
                        body: [
                          {
                            type: 'button',
                            label: '打开子抽屉',
                            onEvent: {
                              click: {
                                actions: [
                                  {
                                    actionType: 'drawer',
                                    args: {
                                      drawer: {
                                        type: 'drawer',
                                        title: '模态子抽屉',
                                        body: [
                                          {
                                            type: 'button',
                                            label: '关闭父抽屉',
                                            onEvent: {
                                              click: {
                                                actions: [
                                                  {
                                                    actionType: 'closeDrawer',
                                                    componentId: 'drawer_001'
                                                  }
                                                ]
                                              }
                                            }
                                          }
                                        ]
                                      }
                                    }
                                  }
                                ]
                              }
                            }
                          },
                          {
                            type: 'button',
                            label: '关闭当前抽屉',
                            className: 'ml-2',
                            onEvent: {
                              click: {
                                actions: [
                                  {
                                    actionType: 'closeDrawer'
                                  }
                                ]
                              }
                            }
                          },
                          {
                            type: 'button',
                            label: '触发确认',
                            className: 'ml-2',
                            onEvent: {
                              click: {
                                actions: [
                                  {
                                    actionType: 'confirm',
                                    componentId: 'drawer_001'
                                  }
                                ]
                              }
                            }
                          },
                          {
                            type: 'button',
                            label: '触发取消',
                            className: 'ml-2',
                            onEvent: {
                              click: {
                                actions: [
                                  {
                                    actionType: 'cancel',
                                    componentId: 'drawer_001'
                                  }
                                ]
                              }
                            }
                          }
                        ],
                        onEvent: {
                          confirm: {
                            actions: [
                              {
                                actionType: 'toast',
                                args: {
                                  msg: 'confirm'
                                }
                              }
                            ]
                          },
                          cancel: {
                            actions: [
                              {
                                actionType: 'toast',
                                args: {
                                  msg: 'cancel'
                                }
                              }
                            ]
                          }
                        }
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
      makeEnv({
        getModalContainer: () => container,
        notify
      })
    )
  );

  // events
  fireEvent.click(getByText('打开抽屉'));
  expect(container).toMatchSnapshot();

  await waitFor(() => {
    expect(getByText('确认')).toBeInTheDocument();
  });
  fireEvent.click(getByText('确认'));
  await wait(300);
  expect(notify).toHaveBeenCalled();
  await waitFor(() => {
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();

  fireEvent.click(getByText('打开抽屉'));
  await waitFor(() => {
    expect(getByText('取消')).toBeInTheDocument();
  });
  fireEvent.click(getByText('取消'));
  await wait(300);
  expect(notify).toHaveBeenCalled();
  await waitFor(() => {
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();

  // actions
  fireEvent.click(getByText('打开抽屉'));
  await waitFor(() => {
    expect(getByText('关闭当前抽屉')).toBeInTheDocument();
  });
  fireEvent.click(getByText('关闭当前抽屉'));
  await waitFor(() => {
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();

  fireEvent.click(getByText('打开抽屉'));
  await waitFor(() => {
    expect(getByText('打开子抽屉')).toBeInTheDocument();
  });
  fireEvent.click(getByText('打开子抽屉'));
  await waitFor(() => {
    expect(getByText('关闭父抽屉')).toBeInTheDocument();
  });
  fireEvent.click(getByText('关闭父抽屉'));
  await waitFor(() => {
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();

  fireEvent.click(getByText('打开抽屉'));
  await waitFor(() => {
    expect(getByText('触发确认')).toBeInTheDocument();
  });
  fireEvent.click(getByText('触发确认'));
  await wait(300);
  expect(notify).toHaveBeenCalled();
  await waitFor(() => {
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();

  fireEvent.click(getByText('打开抽屉'));
  await waitFor(() => {
    expect(getByText('触发取消')).toBeInTheDocument();
  });
  fireEvent.click(getByText('触发取消'));
  await wait(300);
  expect(notify).toHaveBeenCalled();
  await waitFor(() => {
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();
}, 7000);

test('EventAction:drawer', async () => {
  const notify = jest.fn();
  const {getByText, container}: any = render(
    amisRender(
      {
        type: 'page',
        body: [
          {
            type: 'button',
            label: '打开抽屉',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'drawer',
                    drawer: {
                      type: 'drawer',
                      id: 'drawer_001',
                      title: '模态抽屉',
                      body: [
                        {
                          type: 'button',
                          label: '打开子抽屉',
                          onEvent: {
                            click: {
                              actions: [
                                {
                                  actionType: 'drawer',
                                  drawer: {
                                    type: 'drawer',
                                    title: '模态子抽屉',
                                    body: [
                                      {
                                        type: 'button',
                                        label: '关闭父抽屉',
                                        onEvent: {
                                          click: {
                                            actions: [
                                              {
                                                actionType: 'closeDrawer',
                                                componentId: 'drawer_001'
                                              }
                                            ]
                                          }
                                        }
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
                          label: '关闭当前抽屉',
                          className: 'ml-2',
                          onEvent: {
                            click: {
                              actions: [
                                {
                                  actionType: 'closeDrawer'
                                }
                              ]
                            }
                          }
                        },
                        {
                          type: 'button',
                          label: '触发确认',
                          className: 'ml-2',
                          onEvent: {
                            click: {
                              actions: [
                                {
                                  actionType: 'confirm',
                                  componentId: 'drawer_001'
                                }
                              ]
                            }
                          }
                        },
                        {
                          type: 'button',
                          label: '触发取消',
                          className: 'ml-2',
                          onEvent: {
                            click: {
                              actions: [
                                {
                                  actionType: 'cancel',
                                  componentId: 'drawer_001'
                                }
                              ]
                            }
                          }
                        }
                      ],
                      onEvent: {
                        confirm: {
                          actions: [
                            {
                              actionType: 'toast',
                              args: {
                                msg: 'confirm'
                              }
                            }
                          ]
                        },
                        cancel: {
                          actions: [
                            {
                              actionType: 'toast',
                              args: {
                                msg: 'cancel'
                              }
                            }
                          ]
                        }
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
      makeEnv({
        getModalContainer: () => container,
        notify
      })
    )
  );

  // events
  fireEvent.click(getByText('打开抽屉'));
  expect(container).toMatchSnapshot();

  await waitFor(() => {
    expect(getByText('确认')).toBeInTheDocument();
  });
  fireEvent.click(getByText('确认'));
  await wait(300);
  expect(notify).toHaveBeenCalled();
  await waitFor(() => {
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();

  fireEvent.click(getByText('打开抽屉'));
  await waitFor(() => {
    expect(getByText('取消')).toBeInTheDocument();
  });
  fireEvent.click(getByText('取消'));
  await wait(300);
  expect(notify).toHaveBeenCalled();
  await waitFor(() => {
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();

  // actions
  fireEvent.click(getByText('打开抽屉'));
  await waitFor(() => {
    expect(getByText('关闭当前抽屉')).toBeInTheDocument();
  });
  fireEvent.click(getByText('关闭当前抽屉'));
  await waitFor(() => {
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();

  fireEvent.click(getByText('打开抽屉'));
  await waitFor(() => {
    expect(getByText('打开子抽屉')).toBeInTheDocument();
  });
  fireEvent.click(getByText('打开子抽屉'));
  await waitFor(() => {
    expect(getByText('关闭父抽屉')).toBeInTheDocument();
  });
  fireEvent.click(getByText('关闭父抽屉'));
  await waitFor(() => {
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();

  fireEvent.click(getByText('打开抽屉'));
  await waitFor(() => {
    expect(getByText('触发确认')).toBeInTheDocument();
  });
  fireEvent.click(getByText('触发确认'));
  await wait(300);
  expect(notify).toHaveBeenCalled();
  await waitFor(() => {
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();

  fireEvent.click(getByText('打开抽屉'));
  await waitFor(() => {
    expect(getByText('触发取消')).toBeInTheDocument();
  });
  fireEvent.click(getByText('触发取消'));
  await wait(300);
  expect(notify).toHaveBeenCalled();
  await waitFor(() => {
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();
}, 7000);

test('EventAction:drawer data', async () => {
  const {getByText, container}: any = render(
    amisRender(
      {
        type: 'page',
        data: {
          name: 'amis'
        },
        body: [
          {
            type: 'button',
            label: '打开抽屉',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'drawer',
                    args: {
                      drawer: {
                        type: 'drawer',
                        id: 'drawer_001',
                        title: '模态弹窗${event.data.name}',
                        body: [
                          {
                            type: 'tpl',
                            tpl: '你好，我是${name}、${name1}、${name2}'
                          }
                        ],
                        data: {
                          name1: '${name}',
                          name2: '${event.data.name}'
                        }
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
      makeEnv({
        getModalContainer: () => container
      })
    )
  );

  // events
  fireEvent.click(getByText('打开抽屉'));
  await waitFor(() => {
    expect(container.querySelector('[role="dialog"]')).toBeInTheDocument();
    expect(getByText('模态弹窗')).toBeInTheDocument();
    expect(getByText('你好，我是、amis、amis')).toBeInTheDocument(); // 因为事件动作给args提前做了映射
  });
}, 7000);

test('EventAction:drawer data2', async () => {
  const {getByText, container}: any = render(
    amisRender(
      {
        type: 'page',
        data: {
          name: 'amis'
        },
        body: [
          {
            type: 'button',
            label: '打开抽屉',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'drawer',
                    drawer: {
                      type: 'drawer',
                      id: 'drawer_001',
                      title: '模态弹窗${event.data.name}',
                      body: [
                        {
                          type: 'tpl',
                          tpl: '你好，我是${name}、${name1}、${name2}'
                        }
                      ],
                      data: {
                        name1: '${name}',
                        name2: '${event.data.name}'
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
      makeEnv({
        getModalContainer: () => container
      })
    )
  );

  // events
  fireEvent.click(getByText('打开抽屉'));
  await waitFor(() => {
    expect(container.querySelector('[role="dialog"]')).toBeInTheDocument();
    expect(getByText('模态弹窗')).toBeInTheDocument();
    expect(getByText('你好，我是、amis、amis')).toBeInTheDocument();
  });
}, 7000);
