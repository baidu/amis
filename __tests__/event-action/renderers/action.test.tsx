import {fireEvent, render, waitFor} from '@testing-library/react';
import '../../../src/themes/default';
import {render as amisRender} from '../../../src/index';
import {makeEnv} from '../../helper';

test('EventAction:action', async () => {
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
            type: 'button',
            label: 'action',
            level: 'primary',
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

  fireEvent.click(getByText('action'));
  await waitFor(() => {
    expect(notify).toHaveBeenCalledWith('info', '派发点击事件', {
      msg: '派发点击事件',
      msgType: 'info'
    });
  });
  fireEvent.mouseEnter(getByText('action'));
  await waitFor(() => {
    expect(notify).toHaveBeenCalledWith('info', '派发鼠标移入事件', {
      msg: '派发鼠标移入事件',
      msgType: 'info'
    });
  });
  fireEvent.mouseLeave(getByText('action'));
  await waitFor(() => {
    expect(notify).toHaveBeenCalledWith('info', '派发鼠标移出事件', {
      msg: '派发鼠标移出事件',
      msgType: 'info'
    });
  });
});
