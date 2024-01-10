import {fireEvent, render, waitFor} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv} from '../../helper';

test('EventAction:avatar', async () => {
  const notify = jest.fn();
  const {getByText, container}: any = render(
    amisRender(
      {
        type: 'page',
        data: {
          btnDisabled: true,
          btnNotDisabled: false
        },
        body: [
          {
            type: 'avatar',
            text: 'AM',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'toast',
                    args: {
                      msgType: 'info',
                      msg: '派发点击事件'
                    }
                  }
                ]
              },
              mouseenter: {
                actions: [
                  {
                    actionType: 'toast',
                    args: {
                      msgType: 'info',
                      msg: '派发鼠标移入事件'
                    }
                  }
                ]
              },
              mouseleave: {
                actions: [
                  {
                    actionType: 'toast',
                    args: {
                      msgType: 'info',
                      msg: '派发鼠标移出事件'
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

  const avatar = container.querySelector('.cxd-Avatar');
  fireEvent.click(avatar);
  await waitFor(() => {
    expect(notify).toHaveBeenCalledWith('info', '派发点击事件', {
      msg: '派发点击事件',
      msgType: 'info'
    });
  });
  fireEvent.mouseEnter(avatar);
  await waitFor(() => {
    expect(notify).toHaveBeenCalledWith('info', '派发鼠标移入事件', {
      msg: '派发鼠标移入事件',
      msgType: 'info'
    });
  });
  fireEvent.mouseLeave(avatar);
  await waitFor(() => {
    expect(notify).toHaveBeenCalledWith('info', '派发鼠标移出事件', {
      msg: '派发鼠标移出事件',
      msgType: 'info'
    });
  });
});
