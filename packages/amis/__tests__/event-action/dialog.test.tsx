import {fireEvent, render, waitFor} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv, wait} from '../helper';

test('1. EventAction:dialog args', async () => {
  const notify = jest.fn();
  const {getByText, container}: any = render(
    amisRender(
      {
        type: 'page',
        body: [
          {
            type: 'button',
            label: '打开弹窗',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'dialog',
                    args: {
                      dialog: {
                        type: 'dialog',
                        id: 'dialog_001',
                        title: '模态弹窗',
                        body: [
                          {
                            type: 'button',
                            label: '打开子弹窗',
                            onEvent: {
                              click: {
                                actions: [
                                  {
                                    actionType: 'dialog',
                                    args: {
                                      dialog: {
                                        type: 'dialog',
                                        title: '模态子弹窗',
                                        body: [
                                          {
                                            type: 'button',
                                            label: '关闭父弹窗',
                                            onEvent: {
                                              click: {
                                                actions: [
                                                  {
                                                    actionType: 'closeDialog',
                                                    componentId: 'dialog_001'
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
                            label: '关闭当前弹窗',
                            className: 'ml-2',
                            onEvent: {
                              click: {
                                actions: [
                                  {
                                    actionType: 'closeDialog'
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
                                    componentId: 'dialog_001'
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
                                    componentId: 'dialog_001'
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
  fireEvent.click(getByText('打开弹窗'));
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

  fireEvent.click(getByText('打开弹窗'));
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
  fireEvent.click(getByText('打开弹窗'));
  await waitFor(() => {
    expect(getByText('关闭当前弹窗')).toBeInTheDocument();
  });
  fireEvent.click(getByText('关闭当前弹窗'));
  await waitFor(() => {
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();

  fireEvent.click(getByText('打开弹窗'));
  await waitFor(() => {
    expect(getByText('打开子弹窗')).toBeInTheDocument();
  });
  fireEvent.click(getByText('打开子弹窗'));
  await waitFor(() => {
    expect(getByText('关闭父弹窗')).toBeInTheDocument();
  });
  fireEvent.click(getByText('关闭父弹窗'));
  await waitFor(() => {
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();

  fireEvent.click(getByText('打开弹窗'));
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

  fireEvent.click(getByText('打开弹窗'));
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

test('2. EventAction:dialog', async () => {
  const notify = jest.fn();
  const {getByText, container}: any = render(
    amisRender(
      {
        type: 'page',
        body: [
          {
            type: 'button',
            label: '打开弹窗',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'dialog',
                    dialog: {
                      type: 'dialog',
                      id: 'dialog_001',
                      title: '模态弹窗',
                      body: [
                        {
                          type: 'button',
                          label: '打开子弹窗',
                          onEvent: {
                            click: {
                              actions: [
                                {
                                  actionType: 'dialog',
                                  dialog: {
                                    type: 'dialog',
                                    title: '模态子弹窗',
                                    body: [
                                      {
                                        type: 'button',
                                        label: '关闭父弹窗',
                                        onEvent: {
                                          click: {
                                            actions: [
                                              {
                                                actionType: 'closeDialog',
                                                componentId: 'dialog_001'
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
                          label: '关闭当前弹窗',
                          className: 'ml-2',
                          onEvent: {
                            click: {
                              actions: [
                                {
                                  actionType: 'closeDialog'
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
                                  componentId: 'dialog_001'
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
                                  componentId: 'dialog_001'
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
  fireEvent.click(getByText('打开弹窗'));
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

  fireEvent.click(getByText('打开弹窗'));
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
  fireEvent.click(getByText('打开弹窗'));
  await waitFor(() => {
    expect(getByText('关闭当前弹窗')).toBeInTheDocument();
  });
  fireEvent.click(getByText('关闭当前弹窗'));
  await waitFor(() => {
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();

  fireEvent.click(getByText('打开弹窗'));
  await waitFor(() => {
    expect(getByText('打开子弹窗')).toBeInTheDocument();
  });
  fireEvent.click(getByText('打开子弹窗'));
  await waitFor(() => {
    expect(getByText('关闭父弹窗')).toBeInTheDocument();
  });
  fireEvent.click(getByText('关闭父弹窗'));
  await waitFor(() => {
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });
  expect(container).toMatchSnapshot();

  fireEvent.click(getByText('打开弹窗'));
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

  fireEvent.click(getByText('打开弹窗'));
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

test('3. EventAction:dialog data', async () => {
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
            label: '打开弹窗',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'dialog',
                    args: {
                      dialog: {
                        type: 'dialog',
                        id: 'dialog_001',
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
  fireEvent.click(getByText('打开弹窗'));
  await waitFor(() => {
    expect(container.querySelector('[role="dialog"]')).toBeInTheDocument();
    expect(getByText('模态弹窗')).toBeInTheDocument();
    expect(getByText('你好，我是、amis、amis')).toBeInTheDocument(); // 因为事件动作给args提前做了映射
  });
}, 7000);

test('4. EventAction:dialog data2', async () => {
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
            label: '打开弹窗',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'dialog',
                    dialog: {
                      type: 'dialog',
                      id: 'dialog_001',
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
  fireEvent.click(getByText('打开弹窗'));
  await waitFor(() => {
    expect(container.querySelector('[role="dialog"]')).toBeInTheDocument();
    expect(getByText('模态弹窗')).toBeInTheDocument();
    expect(getByText('你好，我是、amis、amis')).toBeInTheDocument();
  });
}, 7000);

// // test('EventAction:alert', async () => {
// //   const alert = jest.fn();
// //   const {getByText, container}: any = render(
// //     amisRender(
// //       {
// //         type: 'page',
// //         data: {
// //           msg: '去吃饭了'
// //         },
// //         body: [
// //           {
// //             type: 'button',
// //             label: '提示对话框',
// //             level: 'primary',
// //             onEvent: {
// //               click: {
// //                 actions: [
// //                   {
// //                     actionType: 'alert',
// //                     args: {
// //                       msg: '<a href="http://www.baidu.com" target="_blank">${msg}~</a>'
// //                     }
// //                   }
// //                 ]
// //               }
// //             }
// //           }
// //         ]
// //       },
// //       {},
// //       makeEnv({
// //         getModalContainer: () => container,
// //         alert
// //       })
// //     )
// //   );

// //   fireEvent.click(getByText('提示对话框'));
// //   await waitFor(() => {
// //     expect(alert).toHaveBeenCalled();
// //   });
// //   expect(alert.mock.calls[0][0]).toEqual(
// //     '<a href="http://www.baidu.com" target="_blank">去吃饭了~</a>'
// //   );
// // });

// // test('EventAction:confirm', async () => {
// //   const confirm = jest.fn();
// //   const {getByText, container}: any = render(
// //     amisRender(
// //       {
// //         type: 'page',
// //         data: {
// //           title: '操作确认',
// //           msg: '要删除它吗？'
// //         },
// //         body: [
// //           {
// //             type: 'button',
// //             label: '确认对话框',
// //             level: 'primary',
// //             onEvent: {
// //               click: {
// //                 actions: [
// //                   {
// //                     actionType: 'confirmDialog',
// //                     args: {
// //                       title: '${title}',
// //                       msg: '<span style="color:red">${msg}</span>'
// //                     }
// //                   }
// //                 ]
// //               }
// //             }
// //           }
// //         ]
// //       },
// //       {},
// //       makeEnv({
// //         getModalContainer: () => container,
// //         confirm
// //       })
// //     )
// //   );

// //   fireEvent.click(getByText('确认对话框'));
// //   await waitFor(() => {
// //     expect(confirm).toHaveBeenCalled();
// //   });
// //   expect(confirm.mock.calls[0][0]).toEqual(
// //     '<span style="color:red">要删除它吗？</span>'
// //   );
// //   expect(confirm.mock.calls[0][1]).toEqual('操作确认');
// // });

test('5. EventAction:dialog formitem without form', async () => {
  const onAction = jest.fn();
  const {getByText, container}: any = render(
    amisRender(
      {
        type: 'page',
        body: [
          {
            type: 'button',
            label: 'Dialog',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'dialog',
                    dialog: {
                      title: '表单页面',
                      body: [
                        {
                          label: 'A',
                          type: 'input-text',
                          name: 'a'
                        },
                        {
                          label: 'B',
                          type: 'input-text',
                          name: 'b'
                        }
                      ],
                      onEvent: {
                        confirm: {
                          actions: [
                            {
                              actionType: 'custom',
                              script: onAction
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
        getModalContainer: () => container
      })
    )
  );

  const button = getByText('Dialog');
  fireEvent.click(button);
  await wait(200);

  fireEvent.change(container.querySelector('[name="a"]')!, {
    target: {value: '1'}
  });

  await wait(200);
  fireEvent.change(container.querySelector('[name="b"]')!, {
    target: {value: '2'}
  });

  await wait(200);
  fireEvent.click(getByText('确认'));
  await wait(300);
  expect(onAction).toHaveBeenCalled();
  expect(onAction.mock.calls[0][2].data).toMatchObject({a: '1', b: '2'});
});
