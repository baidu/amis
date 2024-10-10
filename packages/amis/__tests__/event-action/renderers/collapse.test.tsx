import {fireEvent, render, waitFor} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv} from '../../helper';

test('EventAction:collapse', async () => {
  const notify = jest.fn();
  const {getByText, container}: any = render(
    amisRender(
      {
        type: 'page',
        data: {},
        body: [
          {
            type: 'collapse',
            header: '折叠器',
            body: [
              {
                type: 'tpl',
                tpl: '内容',
                wrapperComponent: '',
                inline: false
              }
            ],
            onEvent: {
              expand: {
                weight: 0,
                actions: [
                  {
                    actionType: 'toast',
                    args: {
                      msgType: 'info',
                      msg: '派发展开事件'
                    }
                  }
                ]
              },
              collapse: {
                weight: 0,
                actions: [
                  {
                    actionType: 'toast',
                    args: {
                      msgType: 'info',
                      msg: '派发收起事件'
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

  fireEvent.click(getByText('折叠器'));
  await waitFor(() => {
    expect(notify).toHaveBeenCalledWith('info', '派发收起事件', {
      msg: '派发收起事件',
      msgType: 'info'
    });
  });
  fireEvent.click(getByText('折叠器'));
  await waitFor(() => {
    expect(notify).toHaveBeenCalledWith('info', '派发展开事件', {
      msg: '派发展开事件',
      msgType: 'info'
    });
  });
});
