import {fireEvent, render, waitFor} from '@testing-library/react';
import '../../src';
import {render as amisRender} from '../../src';
import {makeEnv} from '../helper';

test('EventAction:toast', async () => {
  const notify = jest.fn();
  const {getByText, container}: any = render(
    amisRender(
      {
        type: 'page',
        data: {
          msg: '我是全局警告消息，可以配置不同类型和弹出位置'
        },
        body: [
          {
            type: 'button',
            label: 'toast',
            level: 'warning',
            className: 'mr-2 mb-2',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'toast',
                    args: {
                      msgType: 'warning',
                      msg: '${msg}~',
                      position: 'top-right',
                      closeButton: true,
                      showIcon: true,
                      timeout: 5000
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
        notify
      })
    )
  );

  fireEvent.click(getByText('toast'));
  await waitFor(() => {
    expect(notify).toHaveBeenCalled();
  });
  expect(notify.mock.calls[0][0]).toEqual('warning');
  expect(notify.mock.calls[0][1]).toEqual(
    '我是全局警告消息，可以配置不同类型和弹出位置~'
  );
  expect(notify.mock.calls[0][2]).toEqual({
    msgType: 'warning',
    msg: '我是全局警告消息，可以配置不同类型和弹出位置~',
    position: 'top-right',
    closeButton: true,
    showIcon: true,
    timeout: 5000
  });
});
