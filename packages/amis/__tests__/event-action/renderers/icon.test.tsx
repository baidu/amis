import {fireEvent, render, waitFor} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv} from '../../helper';

test('EventAction:icon', async () => {
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
            type: 'icon',
            icon: 'cloud',
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

  const icon = container.querySelector('.cloud');
  fireEvent.click(icon);
  await waitFor(() => {
    expect(notify).toHaveBeenCalledWith('info', '派发点击事件', {
      msg: '派发点击事件',
      msgType: 'info'
    });
  });
  fireEvent.mouseEnter(icon);
  await waitFor(() => {
    expect(notify).toHaveBeenCalledWith('info', '派发鼠标移入事件', {
      msg: '派发鼠标移入事件',
      msgType: 'info'
    });
  });
  fireEvent.mouseLeave(icon);
  await waitFor(() => {
    expect(notify).toHaveBeenCalledWith('info', '派发鼠标移出事件', {
      msg: '派发鼠标移出事件',
      msgType: 'info'
    });
  });
});
