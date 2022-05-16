import {fireEvent, render, waitFor} from '@testing-library/react';
import '../../src/themes/default';
import {render as amisRender} from '../../src/index';
import {makeEnv, wait} from '../helper';

test('EventAction:dialog', async () => {
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
});

// test('EventAction:alert', async () => {
//   const alert = jest.fn();
//   const {getByText, container}: any = render(
//     amisRender(
//       {
//         type: 'page',
//         data: {
//           msg: '去吃饭了'
//         },
//         body: [
//           {
//             type: 'button',
//             label: '提示对话框',
//             level: 'primary',
//             onEvent: {
//               click: {
//                 actions: [
//                   {
//                     actionType: 'alert',
//                     args: {
//                       msg: '<a href="http://www.baidu.com" target="_blank">${msg}~</a>'
//                     }
//                   }
//                 ]
//               }
//             }
//           }
//         ]
//       },
//       {},
//       makeEnv({
//         getModalContainer: () => container,
//         alert
//       })
//     )
//   );

//   fireEvent.click(getByText('提示对话框'));
//   await waitFor(() => {
//     expect(alert).toHaveBeenCalled();
//   });
//   expect(alert.mock.calls[0][0]).toEqual(
//     '<a href="http://www.baidu.com" target="_blank">去吃饭了~</a>'
//   );
// });

// test('EventAction:confirm', async () => {
//   const confirm = jest.fn();
//   const {getByText, container}: any = render(
//     amisRender(
//       {
//         type: 'page',
//         data: {
//           title: '操作确认',
//           msg: '要删除它吗？'
//         },
//         body: [
//           {
//             type: 'button',
//             label: '确认对话框',
//             level: 'primary',
//             onEvent: {
//               click: {
//                 actions: [
//                   {
//                     actionType: 'confirmDialog',
//                     args: {
//                       title: '${title}',
//                       msg: '<span style="color:red">${msg}</span>'
//                     }
//                   }
//                 ]
//               }
//             }
//           }
//         ]
//       },
//       {},
//       makeEnv({
//         getModalContainer: () => container,
//         confirm
//       })
//     )
//   );

//   fireEvent.click(getByText('确认对话框'));
//   await waitFor(() => {
//     expect(confirm).toHaveBeenCalled();
//   });
//   expect(confirm.mock.calls[0][0]).toEqual(
//     '<span style="color:red">要删除它吗？</span>'
//   );
//   expect(confirm.mock.calls[0][1]).toEqual('操作确认');
// });
